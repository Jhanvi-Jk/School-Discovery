export type Curriculum = "cbse" | "icse" | "ib" | "igcse" | "state_board";
export type SchoolType = "private" | "government" | "aided" | "international";
export type SchoolGender = "coed" | "boys" | "girls";
export type AdmissionStatus = "upcoming" | "open" | "closed" | "waitlist";
export type UserRole = "parent" | "student" | "school_admin" | "platform_admin";

export interface SchoolSummary {
  id: string;
  slug: string;
  name: string;
  type: SchoolType;
  gender: SchoolGender;
  verified: boolean;
  area: string | null;
  city: string;
  cover_image_url: string | null;
  logo_url: string | null;
  total_fees_min: number | null;
  total_fees_max: number | null;
  has_transport: boolean | null;
  student_teacher_ratio: number | null;
  school_hours_start: string | null;
  school_hours_end: string | null;
  student_count: number | null;
  avg_rating: number | null;
  review_count: number | null;
  admissions_open: boolean | null;
  mid_year_available: boolean | null;
  curricula?: Curriculum[];
  sports?: string[];
  extracurriculars?: string[];
  languages?: string[];
  grades_from?: string;
  grades_to?: string;
}

export interface SchoolFilters {
  query: string;
  areas: string[];
  curricula: Curriculum[];
  grades: string[];
  gender: SchoolGender[];
  types: SchoolType[];
  fees_min: number;
  fees_max: number;
  has_transport: boolean | null;
  sports: string[];
  extracurriculars: string[];
  languages: string[];
  admissions_open: boolean | null;
  mid_year: boolean | null;
  str_max: number | null;
  subjects: string[];   // IB / IGCSE / ICSE subjects
  streams: string[];    // CBSE / State Board streams (PCM, Commerce, etc.)
}

export const DEFAULT_FILTERS: SchoolFilters = {
  query: "",
  areas: [],
  curricula: [],
  grades: [],
  gender: [],
  types: [],
  fees_min: 0,
  fees_max: 1000000,
  has_transport: null,
  sports: [],
  extracurriculars: [],
  languages: [],
  admissions_open: null,
  mid_year: null,
  str_max: null,
  subjects: [],
  streams: [],
};

// ── Subject / Stream data ─────────────────────────────────────

export const IB_MYP_SUBJECTS = [
  "Language & Literature", "Language Acquisition",
  "Individuals & Societies", "Sciences", "Mathematics",
  "Arts", "Physical & Health Education", "Design",
];

export const IB_DP_SUBJECTS = [
  // Group 1 — Language & Literature
  "English A", "Hindi A",
  // Group 2 — Language Acquisition
  "French B", "Spanish B", "Hindi B", "Kannada B",
  // Group 3 — Individuals & Societies
  "History", "Geography", "Economics", "Business Management", "Psychology",
  // Group 4 — Sciences
  "Biology", "Chemistry", "Physics", "Environmental Systems & Societies", "Computer Science",
  // Group 5 — Mathematics
  "Mathematics AA (Analysis)", "Mathematics AI (Applications)",
  // Group 6 — The Arts
  "Visual Arts", "Music", "Theatre", "Film",
];

export const IGCSE_SUBJECTS = [
  "English Language ✦", "Mathematics ✦",
  "Additional Mathematics", "Physics", "Chemistry", "Biology",
  "Combined Science", "Computer Science",
  "History", "Geography", "Economics",
  "Business Studies", "Accounting",
  "Art & Design", "Music", "Physical Education",
  "Media Studies", "Environmental Management",
  "French", "Hindi", "Kannada", "Tamil", "Telugu",
];

export const ICSE_ELECTIVES_9_10 = [
  "Computer Applications", "Economic Applications",
  "Commercial Applications", "Environmental Science",
  "Art", "Home Science", "Mass Media",
  "Physical Education", "Technical Drawing",
  "Fashion Designing", "Yoga", "Cookery", "Performing Arts",
];

export const ISC_ELECTIVES_11_12 = [
  "Physics", "Chemistry", "Biology", "Mathematics",
  "Computer Science", "Biotechnology",
  "Economics", "Commerce", "Accounts",
  "History", "Political Science", "Sociology", "Psychology", "Geography",
  "English Literature", "Hindi Literature",
  "Art", "Home Science", "Physical Education",
  "Fashion Designing", "Mass Media",
];

export const CBSE_STREAMS = [
  "PCM — Physics, Chemistry, Maths",
  "PCMB — Physics, Chemistry, Maths, Biology",
  "PCMC — Physics, Chemistry, Maths, Computer Sc.",
  "PCME — Physics, Chemistry, Maths, Electronics",
  "PCB — Physics, Chemistry, Biology",
  "Commerce with Maths",
  "Commerce (without Maths)",
  "Humanities / Arts",
  "Humanities with Maths",
  "Vocational",
];

export const STATE_BOARD_STREAMS = [
  "PCMB — Physics, Chemistry, Maths, Biology",
  "PCM — Physics, Chemistry, Maths",
  "PCB — Physics, Chemistry, Biology",
  "PCMC — Physics, Chemistry, Maths, Computer Sc.",
  "Commerce",
  "Humanities / Arts",
  "Vocational",
];

export type SortOption = "relevance" | "fees_asc" | "fees_desc" | "rating" | "newest";

export const CURRICULUM_LABELS: Record<Curriculum, string> = {
  cbse: "CBSE",
  icse: "ICSE",
  ib: "IB",
  igcse: "IGCSE",
  state_board: "State Board",
};

export const SCHOOL_TYPE_LABELS: Record<SchoolType, string> = {
  private: "Private",
  government: "Government",
  aided: "Aided",
  international: "International",
};

export const GENDER_LABELS: Record<SchoolGender, string> = {
  coed: "Co-ed",
  boys: "Boys",
  girls: "Girls",
};

export const BENGALURU_AREAS = [
  "Koramangala",
  "Indiranagar",
  "Whitefield",
  "Jayanagar",
  "JP Nagar",
  "HSR Layout",
  "Banashankari",
  "Electronic City",
  "Marathahalli",
  "Malleshwaram",
  "Rajajinagar",
  "Hebbal",
  "Yelahanka",
  "Sarjapur",
  "Bellandur",
  "BTM Layout",
  "Basavanagudi",
  "Chamrajpet",
  "Domlur",
  "Frazer Town",
  "Sadashivanagar",
  "Benson Town",
  "RT Nagar",
  "Nagarbhavi",
  "Kengeri",
];

export const ALL_SPORTS = [
  "Cricket",
  "Football",
  "Basketball",
  "Tennis",
  "Swimming",
  "Badminton",
  "Table Tennis",
  "Athletics",
  "Volleyball",
  "Hockey",
  "Chess",
  "Gymnastics",
  "Cycling",
  "Kabaddi",
  "Kho-Kho",
];

export const ALL_EXTRACURRICULARS = [
  "Music",
  "Dance",
  "Drama",
  "Painting",
  "Robotics",
  "Coding",
  "Debate",
  "MUN",
  "Photography",
  "Creative Writing",
  "Yoga",
  "Karate",
  "NCC",
  "Scout",
  "Nature Club",
];

export const ALL_LANGUAGES = [
  "English",
  "Kannada",
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Urdu",
  "Sanskrit",
  "French",
  "German",
];

export const GRADE_OPTIONS = [
  "Nursery",
  "LKG",
  "UKG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];
