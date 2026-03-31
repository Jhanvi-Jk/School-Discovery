export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: "parent" | "student" | "school_admin" | "platform_admin";
          auth_provider: "email" | "google" | "phone";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      schools: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          established_year: number | null;
          type: "private" | "government" | "aided" | "international";
          gender: "coed" | "boys" | "girls";
          verified: boolean;
          verified_at: string | null;
          last_data_updated_at: string | null;
          address_line1: string | null;
          address_line2: string | null;
          area: string | null;
          city: string;
          pincode: string | null;
          latitude: number | null;
          longitude: number | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          cover_image_url: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["schools"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
      };
      school_details: {
        Row: {
          school_id: string;
          student_count: number | null;
          teacher_count: number | null;
          student_teacher_ratio: number | null;
          school_hours_start: string | null;
          school_hours_end: string | null;
          has_transport: boolean;
          transport_description: string | null;
          annual_tuition_fees_min: number | null;
          annual_tuition_fees_max: number | null;
          development_fees: number | null;
          transport_fees: number | null;
          activity_fees: number | null;
          admission_fees: number | null;
          total_fees_min: number | null;
          total_fees_max: number | null;
        };
        Insert: Database["public"]["Tables"]["school_details"]["Row"];
        Update: Partial<Database["public"]["Tables"]["school_details"]["Row"]>;
      };
      school_curricula: {
        Row: {
          school_id: string;
          curriculum: "cbse" | "icse" | "ib" | "igcse" | "state_board" | "cambridge";
        };
        Insert: Database["public"]["Tables"]["school_curricula"]["Row"];
        Update: Partial<Database["public"]["Tables"]["school_curricula"]["Row"]>;
      };
      school_grades: {
        Row: {
          school_id: string;
          grade_from: string;
          grade_to: string;
        };
        Insert: Database["public"]["Tables"]["school_grades"]["Row"];
        Update: Partial<Database["public"]["Tables"]["school_grades"]["Row"]>;
      };
      school_languages: {
        Row: {
          school_id: string;
          language: string;
          type: "medium_of_instruction" | "offered_as_subject";
        };
        Insert: Database["public"]["Tables"]["school_languages"]["Row"];
        Update: Partial<Database["public"]["Tables"]["school_languages"]["Row"]>;
      };
      sports: {
        Row: { id: number; name: string };
        Insert: Omit<Database["public"]["Tables"]["sports"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["sports"]["Insert"]>;
      };
      school_sports: {
        Row: { school_id: string; sport_id: number };
        Insert: Database["public"]["Tables"]["school_sports"]["Row"];
        Update: Partial<Database["public"]["Tables"]["school_sports"]["Row"]>;
      };
      extracurriculars: {
        Row: { id: number; name: string; category: string | null };
        Insert: Omit<Database["public"]["Tables"]["extracurriculars"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["extracurriculars"]["Insert"]>;
      };
      school_extracurriculars: {
        Row: { school_id: string; extracurricular_id: number };
        Insert: Database["public"]["Tables"]["school_extracurriculars"]["Row"];
        Update: Partial<Database["public"]["Tables"]["school_extracurriculars"]["Row"]>;
      };
      admission_windows: {
        Row: {
          id: string;
          school_id: string;
          academic_year: string;
          grade_from: string | null;
          grade_to: string | null;
          opens_at: string | null;
          closes_at: string | null;
          is_mid_year: boolean;
          status: "upcoming" | "open" | "closed" | "waitlist";
          application_url: string | null;
          notes: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["admission_windows"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["admission_windows"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          school_id: string;
          user_id: string;
          rating_academics: number;
          rating_facilities: number;
          rating_faculty: number;
          rating_value: number;
          rating_overall: number;
          title: string | null;
          body: string | null;
          relation: "current_parent" | "former_parent" | "current_student" | "alumnus";
          is_verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      saved_schools: {
        Row: {
          user_id: string;
          school_id: string;
          saved_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_schools"]["Row"], "saved_at">;
        Update: Partial<Database["public"]["Tables"]["saved_schools"]["Insert"]>;
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          school_id: string;
          grade: string | null;
          academic_year: string | null;
          status: "interested" | "enquired" | "applied" | "shortlisted" | "admitted" | "rejected" | "withdrawn";
          deadline: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["applications"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
      enquiries: {
        Row: {
          id: string;
          school_id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          grade: string | null;
          message: string | null;
          status: "new" | "read" | "responded";
          responded_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["enquiries"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Insert"]>;
      };
    };
    Views: {
      schools_with_details: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          established_year: number | null;
          type: string;
          gender: string;
          verified: boolean;
          area: string | null;
          city: string;
          pincode: string | null;
          latitude: number | null;
          longitude: number | null;
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
        };
      };
    };
    Functions: {};
    Enums: {};
  };
};
