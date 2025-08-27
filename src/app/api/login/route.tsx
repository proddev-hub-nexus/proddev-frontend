import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse body safely
    const { email, password } = await req.json().catch(() => ({}) as any);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Call your backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    // Try to read JSON even on non-2xx
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

    // Set cookie (cookies() is sync in route handlers)
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    // Return what you need (e.g., user info); avoid echoing the token
    return NextResponse.json({
      success: true,
      user: data?.user ?? null,
      message: "Login successful.",
    });
  } catch (err) {
    // Optional: log err for debugging
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
