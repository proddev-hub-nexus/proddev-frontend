import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const upstream = await fetch(
      `${process.env.API_URL}/onboarding/session-begin`,
      { method: "POST" }
    );

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "Upstream error");
      return NextResponse.json({ detail }, { status: upstream.status });
    }

    const { session_id } = await upstream.json();

    const response = NextResponse.json({ success: true }, { status: 201 });

    // Set secure cookie with simplified options
    response.cookies.set("__Host-onboarding_session", session_id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { detail: "Internal server error" + error },
      { status: 500 }
    );
  }
}
