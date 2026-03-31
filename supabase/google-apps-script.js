// ============================================================
// SchoolFinder Bengaluru — Google Form → Supabase
// Version 3 — Clean rewrite
// Cambridge and IGCSE merged into one entry
// Per-curriculum grade ranges
// Duplicate prevention by school name + area
// ============================================================

const SUPABASE_URL = 'YOUR_SUPABASE_URL';      // e.g. https://abcxyz.supabase.co
const SUPABASE_KEY = 'YOUR_SERVICE_ROLE_KEY';  // Supabase → Settings → API → service_role

// ── Curricula list ────────────────────────────────────────────
// label   = exact prefix used in the Google Form question title
// value   = enum value stored in Supabase
const CURRICULA = [
  { label: 'CBSE',              value: 'cbse'        },
  { label: 'ICSE',              value: 'icse'        },
  { label: 'IB',                value: 'ib'          },
  { label: 'Cambridge / IGCSE', value: 'igcse'       },
  { label: 'State Board',       value: 'state_board' },
];

// ── Entry point — triggered on every form submission ──────────
function onFormSubmit(e) {

  // Build a key-value map of all answers
  const data = {};
  e.response.getItemResponses().forEach(function(r) {
    data[r.getItem().getTitle()] = r.getResponse();
  });

  Logger.log('📋 Form submission received');
  Logger.log(JSON.stringify(data));

  // ── Duplicate check ────────────────────────────────────────
  // If a school with the same name exists in the same area, stop immediately
  const schoolName = data['School Name'];
  const schoolArea = data['Area'] || '';

  const existing = supabaseSelect(
    'schools',
    'name=ilike.' + encodeURIComponent(schoolName) +
    '&area=eq.'   + encodeURIComponent(schoolArea) +
    '&select=id,name,area'
  );

  if (existing.length > 0) {
    Logger.log(
      '⚠️ DUPLICATE BLOCKED — "' + existing[0].name + '"' +
      ' already exists in ' + existing[0].area +
      ' — ID: ' + existing[0].id +
      ' — No data was inserted.'
    );
    return;
  }

  // ── Begin inserting ────────────────────────────────────────
  try {

    const schoolId = generateUUID();
    const slug     = slugify(schoolName);

    // ── 1. schools table ───────────────────────────────────
    supabaseInsert('schools', {
      id:               schoolId,
      slug:             slug,
      name:             schoolName,
      description:      val(data['Description']),
      established_year: num(data['Established Year']),
      type:             mapSchoolType(data['School Type']),
      gender:           mapGender(data['Gender']),
      verified:         false,
      area:             val(data['Area']),
      address_line1:    val(data['Address Line 1']),
      city:             'Bengaluru',
      pincode:          val(data['Pincode']),
      phone:            val(data['Phone']),
      email:            val(data['Email']),
      website:          val(data['Website']),
      cover_image_url:  val(data['Cover Image URL']),
    });

    Logger.log('✓ schools row inserted');

    // ── 2. school_details table ────────────────────────────
    const tutMin = num(data['Annual Tuition Min']);
    const tutMax = num(data['Annual Tuition Max']);
    const devFee = num(data['Development Fees']) || 0;
    const trFee  = num(data['Transport Fees'])   || 0;
    const actFee = num(data['Activity Fees'])    || 0;
    const admFee = num(data['Admission Fees'])   || 0;
    const stuCnt = num(data['Student Count']);
    const tchCnt = num(data['Teacher Count']);

    supabaseInsert('school_details', {
      school_id:               schoolId,
      student_count:           stuCnt,
      teacher_count:           tchCnt,
      student_teacher_ratio:   (stuCnt && tchCnt)
                                 ? parseFloat((stuCnt / tchCnt).toFixed(2))
                                 : null,
      school_hours_start:      val(data['School Hours Start']),
      school_hours_end:        val(data['School Hours End']),
      has_transport:           data['Transport Available'] === 'Yes',
      transport_description:   val(data['Transport Description']),
      annual_tuition_fees_min: tutMin,
      annual_tuition_fees_max: tutMax,
      development_fees:        devFee  || null,
      transport_fees:          trFee   || null,
      activity_fees:           actFee  || null,
      admission_fees:          admFee  || null,
      total_fees_min:          tutMin  ? tutMin + devFee + trFee + actFee : null,
      total_fees_max:          tutMax  ? tutMax + devFee + trFee + actFee : null,
    });

    Logger.log('✓ school_details row inserted');

    // ── 3. school_curricula + school_grades ────────────────
    // A curriculum is only registered if BOTH Grade From and Grade To
    // are filled in the form for that curriculum. If either is blank,
    // that curriculum is skipped entirely — no partial rows inserted.
    CURRICULA.forEach(function(curr) {
      const from = val(data[curr.label + ' Grade From']);
      const to   = val(data[curr.label + ' Grade To']);

      if (from && to) {
        supabaseInsert('school_curricula', {
          school_id:  schoolId,
          curriculum: curr.value,
        });

        supabaseInsert('school_grades', {
          school_id:  schoolId,
          curriculum: curr.value,
          grade_from: from,
          grade_to:   to,
        });

        Logger.log('✓ Curriculum added — ' + curr.label + ': ' + from + ' → ' + to);
      }
    });

    // ── 4. school_languages ────────────────────────────────
    toArray(data['Medium of Instruction (Languages)']).forEach(function(lang) {
      supabaseInsert('school_languages', {
        school_id: schoolId,
        language:  lang,
        type:      'medium_of_instruction',
      });
    });

    toArray(data['Languages Offered as Subject']).forEach(function(lang) {
      supabaseInsert('school_languages', {
        school_id: schoolId,
        language:  lang,
        type:      'offered_as_subject',
      });
    });

    Logger.log('✓ school_languages rows inserted');

    // ── 5. school_sports ───────────────────────────────────
    toArray(data['Sports']).forEach(function(sportName) {
      const sportId = lookupId('sports', sportName);
      if (sportId) {
        supabaseInsert('school_sports', {
          school_id: schoolId,
          sport_id:  sportId,
        });
      } else {
        Logger.log('⚠️ Sport not found in DB — skipped: ' + sportName);
      }
    });

    Logger.log('✓ school_sports rows inserted');

    // ── 6. school_extracurriculars ─────────────────────────
    toArray(data['Extracurriculars']).forEach(function(extraName) {
      const extraId = lookupId('extracurriculars', extraName);
      if (extraId) {
        supabaseInsert('school_extracurriculars', {
          school_id:          schoolId,
          extracurricular_id: extraId,
        });
      } else {
        Logger.log('⚠️ Extracurricular not found in DB — skipped: ' + extraName);
      }
    });

    Logger.log('✓ school_extracurriculars rows inserted');

    // ── Done ───────────────────────────────────────────────
    Logger.log(
      '✅ SUCCESS — ' + schoolName +
      ' | Area: '  + schoolArea +
      ' | Slug: '  + slug +
      ' | ID: '    + schoolId
    );

  } catch (err) {
    Logger.log('❌ ERROR — ' + err.toString());
  }
}

// ============================================================
// Supabase REST helpers
// ============================================================

function supabaseInsert(table, payload) {
  const response = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Prefer':        'return=minimal',
    },
    payload:            JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const code = response.getResponseCode();
  if (code >= 300) {
    throw new Error(
      'Insert failed on [' + table + '] ' +
      'HTTP ' + code + ' — ' +
      response.getContentText()
    );
  }
}

function supabaseSelect(table, query) {
  const response = UrlFetchApp.fetch(
    SUPABASE_URL + '/rest/v1/' + table + '?' + query,
    {
      method:  'GET',
      headers: {
        'apikey':        SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
      },
      muteHttpExceptions: true,
    }
  );
  return JSON.parse(response.getContentText());
}

// Looks up the numeric ID of a sport or extracurricular by name
function lookupId(table, name) {
  const rows = supabaseSelect(
    table,
    'name=eq.' + encodeURIComponent(name) + '&select=id'
  );
  return rows.length > 0 ? rows[0].id : null;
}

// ============================================================
// Utility helpers
// ============================================================

// Returns null for blank/empty strings — keeps the DB clean
function val(v) {
  if (v === null || v === undefined) return null;
  const s = v.toString().trim();
  return s.length > 0 ? s : null;
}

// Safe integer parse — returns null if not a valid number
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = parseInt(v.toString().trim(), 10);
  return isNaN(n) ? null : n;
}

// Always returns a clean flat array — handles single strings,
// arrays, nulls, and filters out any empty entries
function toArray(v) {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.filter(function(x) {
    return x && x.toString().trim().length > 0;
  });
}

// Generates a v4 UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Converts a school name into a URL-safe slug
// e.g. "Delhi Public School East" → "delhi-public-school-east"
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapSchoolType(v) {
  const map = {
    'Private':       'private',
    'Government':    'government',
    'Aided':         'aided',
    'International': 'international',
  };
  return map[v] || 'private';
}

function mapGender(v) {
  const map = {
    'Co-ed': 'coed',
    'Boys':  'boys',
    'Girls': 'girls',
  };
  return map[v] || 'coed';
}
