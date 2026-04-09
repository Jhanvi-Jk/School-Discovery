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
  // Language & Literature
  "English Language & Literature", "Hindi Language & Literature",
  "Kannada Language & Literature", "Tamil Language & Literature",
  "Telugu Language & Literature", "French Language & Literature",
  // Language Acquisition
  "French (Language Acquisition)", "Spanish (Language Acquisition)",
  "Hindi (Language Acquisition)", "Mandarin (Language Acquisition)",
  "German (Language Acquisition)", "Kannada (Language Acquisition)",
  // Individuals & Societies
  "History", "Geography", "Economics", "Sociology",
  "Global Politics", "Philosophy", "Anthropology",
  // Sciences
  "Biology", "Chemistry", "Physics",
  "Integrated Sciences", "Environmental Science",
  // Mathematics
  "Mathematics (Standard)", "Mathematics (Extended)",
  // Arts
  "Visual Arts", "Music", "Drama", "Dance", "Film",
  // Physical & Health Education
  "Physical & Health Education",
  // Design
  "Digital Design", "Product Design",
];

export const IB_DP_SUBJECTS = [
  // Group 1 — Studies in Language & Literature
  "English A: Language & Literature", "English A: Literature",
  "Hindi A: Language & Literature", "Hindi A: Literature",
  "Tamil A", "Kannada A", "Telugu A",
  // Group 2 — Language Acquisition
  "French B", "Spanish B", "Hindi B",
  "Mandarin B", "German B", "Japanese B",
  "French ab initio", "Spanish ab initio",
  // Group 3 — Individuals & Societies
  "History", "Geography", "Economics",
  "Business Management", "Psychology",
  "Global Politics", "Philosophy",
  "Environmental Systems & Societies",
  "Social & Cultural Anthropology", "World Religions",
  // Group 4 — Sciences
  "Biology", "Chemistry", "Physics",
  "Computer Science", "Environmental Systems & Societies",
  "Sports, Exercise & Health Science", "Design Technology",
  // Group 5 — Mathematics
  "Mathematics: Analysis & Approaches (AA) HL",
  "Mathematics: Analysis & Approaches (AA) SL",
  "Mathematics: Applications & Interpretation (AI) HL",
  "Mathematics: Applications & Interpretation (AI) SL",
  // Group 6 — The Arts
  "Visual Arts", "Music", "Theatre", "Film", "Dance",
];

export const IGCSE_SUBJECTS = [
  // Core — compulsory
  "English Language ✦ (Compulsory)", "Mathematics ✦ (Compulsory)",
  // Sciences
  "Physics", "Chemistry", "Biology",
  "Combined Science", "Co-ordinated Sciences",
  "Environmental Management", "Marine Science",
  // Maths / Computing
  "Additional Mathematics", "International Mathematics",
  "Computer Science", "Information & Communication Technology",
  // Humanities & Social Sciences
  "History", "Geography", "Economics",
  "Sociology", "Global Perspectives",
  "Travel & Tourism", "Enterprise",
  // Commerce
  "Business Studies", "Accounting", "Commerce",
  // Languages
  "English Literature", "French", "Spanish", "German",
  "Hindi", "Kannada", "Tamil", "Telugu", "Urdu", "Arabic",
  // Creative & Vocational
  "Art & Design", "Design & Technology",
  "Food & Nutrition", "Music", "Drama",
  "Physical Education", "Media Studies",
  "Fashion & Textiles", "Child Development",
];

export const ICSE_ELECTIVES_9_10 = [
  "Computer Applications",
  "Economic Applications",
  "Commercial Applications",
  "Environmental Science",
  "Agricultural Science",
  "Biotechnology",
  "Art",
  "Home Science",
  "Mass Media & Communication",
  "Physical Education",
  "Technical Drawing",
  "Fashion Designing",
  "Yoga",
  "Cookery",
  "Performing Arts",
  "Carnatic Music", "Hindustani Music",
  "Western Music",
];

export const ISC_ELECTIVES_11_12 = [
  // Sciences
  "Physics", "Chemistry", "Biology",
  "Mathematics", "Computer Science", "Biotechnology",
  "Environmental Science", "Geography",
  // Commerce & Economics
  "Economics", "Commerce", "Accounts",
  "Business Studies",
  // Humanities
  "History", "Political Science",
  "Sociology", "Psychology",
  "Legal Studies",
  // Languages & Literature
  "English Literature", "Hindi Literature",
  "French", "Spanish",
  // Creative & Vocational
  "Art", "Home Science",
  "Physical Education",
  "Fashion Designing", "Mass Media",
  "Carnatic Music", "Hindustani Music",
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
