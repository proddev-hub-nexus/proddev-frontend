import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: no access token" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enrollment/get-enrolled-courses`,
      {
        headers: { Authorization: `Bearer ${token}` },
        // include credentials only if your backend needs cookie auth in addition to header
        cache: "no-store",
      }
    );

    // your backend GET should return 200
    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json(
        { error: msg || "Failed to fetch enrolled courses" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch enrolled courses";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
