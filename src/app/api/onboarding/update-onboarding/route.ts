import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__Host-onboarding_session");

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { detail: "Missing session cookie" },
        { status: 401 }
      );
    }

    const upstream = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/onboarding/update-onboarding-data`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionCookie.value,
        },
        body: JSON.stringify(body),
      }
    );

    if (!upstream.ok) {
      const errorData = await upstream.json().catch(() => ({
        detail: "Upstream service error",
      }));
      return NextResponse.json(errorData, { status: upstream.status });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
