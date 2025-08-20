export interface Course {
  _id: string;
  name: string;
  description?: string;
  tutor?: string;
  category?: string;
  price?: number;
  duration?: string;
  available: boolean;
  max_students?: number;
  language?: string;
  created_at: string;
}

export type EnrolledCourse = {
  enrollment_id: string;
  enrollment_status: "pending" | "paid" | "confirmed" | "cancelled";
  badge?: string;
  enrolled_at: string; // ISO
  whatsapp_link?: string | null;
  course: Course;
};
