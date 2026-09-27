// Editorial copy for the board landing pages (/schools/{city}/{board}). Each board gets its own
// text so the pages aren't near-duplicates of each other. Nothing here is city-specific or a
// statistic — those numbers are computed from the database at render time.

export interface BoardInfo {
  name: string;
  fullName: string;
  about: string;
  strengths: string[];
  considerations: string[];
  suitedFor: string;
  exams: string;
}

export const BOARD_INFO: Record<string, BoardInfo> = {
  cbse: {
    name: "CBSE",
    fullName: "Central Board of Secondary Education",
    about: "CBSE is India's largest school board. Its syllabus is based on NCERT textbooks and is followed by schools across the country, including Kendriya Vidyalayas and most private chains.",
    strengths: [
      "Same books and syllabus in every city, so transfers between schools are easier",
      "Class 11–12 science syllabus lines up with JEE and NEET",
      "The widest choice of schools and price points",
    ],
    considerations: [
      "Teaching can lean towards exam preparation if the school doesn't go beyond the textbook",
      "Quality varies more between schools than between boards — visit before you decide",
    ],
    suitedFor: "families who may relocate within India, or who are aiming for national entrance exams",
    exams: "Board exams in Class 10 and Class 12",
  },
  icse: {
    name: "ICSE",
    fullName: "Indian Certificate of Secondary Education (CISCE)",
    about: "ICSE (Class 10) and ISC (Class 12) are conducted by the Council for the Indian School Certificate Examinations. The syllabus is broad, with a strong emphasis on English and detailed written answers.",
    strengths: [
      "Strong grounding in English language and literature",
      "Broad subject coverage in Classes 9–10, including a wide set of electives",
      "Well regarded for humanities, languages and analytical writing",
    ],
    considerations: [
      "The syllabus can feel heavier at Class 9–10",
      "Fewer schools offer ICSE, so the commute may be longer",
    ],
    suitedFor: "children who enjoy reading and writing, and families who want a broad academic base",
    exams: "ICSE in Class 10 and ISC in Class 12",
  },
  ib: {
    name: "IB",
    fullName: "International Baccalaureate",
    about: "The IB offers a continuum from early years (PYP) through the Middle Years Programme to the Diploma Programme in Classes 11–12. Learning is built around inquiry, projects and interdisciplinary thinking.",
    strengths: [
      "Emphasis on critical thinking, research and independent projects",
      "The Diploma is recognised by universities worldwide",
      "Easy to continue if you move between IB schools in different countries",
    ],
    considerations: [
      "Usually the most expensive option",
      "Few IB schools exist in each city, so daily commute matters",
      "Workload in the Diploma years is demanding",
    ],
    suitedFor: "families considering universities abroad, and children who thrive on discussion and project work",
    exams: "MYP assessments, then the IB Diploma exams in Class 12",
  },
  igcse: {
    name: "IGCSE",
    fullName: "Cambridge International General Certificate of Secondary Education",
    about: "IGCSE is Cambridge's qualification for Classes 9–10. Students choose a mix of subjects and are assessed through exams and coursework, and many IGCSE schools continue to A-levels or the IB Diploma.",
    strengths: [
      "Flexible subject choices at Classes 9–10",
      "An internationally recognised qualification",
      "A natural route into A-levels",
    ],
    considerations: [
      "Fees are typically higher than for national boards",
      "Check what the school offers after Class 10 — some stop at IGCSE",
    ],
    suitedFor: "families who want an international qualification with more subject choice than a national board",
    exams: "IGCSE exams in Class 10, then AS/A-level or IB Diploma",
  },
  cambridge: {
    name: "Cambridge",
    fullName: "Cambridge Assessment International Education",
    about: "Schools listed as Cambridge follow Cambridge Primary and Lower Secondary, IGCSE and often AS/A-levels. The programme runs from early years through Class 12 in a single international framework.",
    strengths: [
      "One continuous programme from primary to A-levels",
      "Subject depth at A-level, useful for specialised university courses",
      "Recognised by universities worldwide",
    ],
    considerations: [
      "Fees are typically at the higher end",
      "Fewer schools than the national boards",
    ],
    suitedFor: "families who want a single international pathway all the way to Class 12",
    exams: "Cambridge Checkpoint, IGCSE, then AS/A-level",
  },
  state_board: {
    name: "State Board",
    fullName: "State board curriculum",
    about: "State board schools follow the syllabus set by the state government and usually teach in the state's language alongside English. They are common among government, aided and lower-fee private schools.",
    strengths: [
      "Usually the most affordable fees",
      "Strong grounding in the regional language",
      "Well suited to state-level admissions and exams",
    ],
    considerations: [
      "The syllabus differs from state to state, which makes moving cities harder",
      "Check how the school supports national entrance exams if that is a goal",
    ],
    suitedFor: "families staying in the same state, and those who want the regional language as a strength",
    exams: "State board exams in Class 10 and Class 12",
  },
};
