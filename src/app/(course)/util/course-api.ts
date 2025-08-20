import axios from "axios";
import { Course } from "../types";

export type EnrollResponse = {
  enrollment_id: string;
  status: "pending" | "paid" | "confirmed" | "cancelled";
  whatsapp_link: string;
  badge: string;
};

export async function enrollNow(courseId: string): Promise<EnrollResponse> {
  const { data } = await axios.post<EnrollResponse>("/api/email/enroll-now", {
    course_id: courseId,
  });
  return data;
}

export async function getStudentEnrolledCourses(): Promise<Course[]> {
  const { data } = await axios.get<Course[]>(
    "/api/enrollment/getEnrolledCourses"
  );
  return data;
}
