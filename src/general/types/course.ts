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
