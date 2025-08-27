import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Please log in to clear your cart!" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/clear-cart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => null);

    return NextResponse.json(
      data ?? { success: false, message: "Empty response from server." },
      { status: res.status }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error while clearing cart." },
      { status: 500 }
    );
  }
}
