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
};

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
