-- Migration 047 — re-list real schools that 045 §2c hid with the bulk-seeded (migration 013) rows.
-- These three exist and have no other listing on the site; they stay unverified until
-- someone adds an address, phone or website.
UPDATE schools SET
  is_listed = TRUE,
  verified  = FALSE,
  listing_note = concat_ws(E'\n', listing_note, 'Re-listed 2026-11: real school, no duplicate listing. Needs address/phone/website.')
WHERE slug IN (
  'vagdevi-vilas-school-marathahalli',
  'ryan-international-school-kundalahalli',
  'new-horizon-gurukul-marathahalli'
);

NOTIFY pgrst, 'reload schema';
