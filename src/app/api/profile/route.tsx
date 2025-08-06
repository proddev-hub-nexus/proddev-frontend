import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: no access token" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Profile fetch failed: ${res.status}`);
    }

    const profile = await res.json();
    return NextResponse.json(profile);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch profile";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
