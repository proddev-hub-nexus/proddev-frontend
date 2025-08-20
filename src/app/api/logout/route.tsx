import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // Even if no token, we still want to clear the cookie and return success
  if (!token) {
    // Clear the cookie anyway
    cookieStore.delete("access_token");
    return NextResponse.json({ message: "Logged out successfully" });
  }

  try {
    // Call the backend logout endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear the cookie regardless of backend response
    cookieStore.delete("access_token");

    if (!res.ok) {
      // Even if backend logout fails, we still cleared the cookie
      console.warn(`Backend logout failed: ${res.status}`);
    }

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);

    // Clear the cookie even if there's an error
    cookieStore.delete("access_token");

    return NextResponse.json({ message: "Logged out successfully" });
  }
}
