import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json().catch(() => ({}) as any);
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message = data?.detail || data?.message || "Login failed.";
      return NextResponse.json(
        { success: false, message },
        { status: res.status }
      );
    }

    const token = data?.access_token;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No access token in response." },
        { status: 502 }
      );
    }

    // Set HttpOnly cookie
    const cookieStore = await cookies(); // no await
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    // 🔧 Return in the exact shape your client expects: { data: {...} }
    return NextResponse.json({
      data: {
        token_id: data?.token_id ?? null,
        access_token: data?.access_token ?? null, // if you prefer not to expose this, see Option B
        device: data?.device ?? "desktop",
        token_expires_in: data?.token_expires_in ?? null,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
