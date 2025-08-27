import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Please log in!" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    // Try to parse backend JSON (even on non-2xx)
    const data = await res.json().catch(() => null);

    // Forward backend response and status
    return NextResponse.json(
      data ?? { success: false, message: "Unexpected empty response" },
      { status: res.status }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
