import axios from "axios";

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
