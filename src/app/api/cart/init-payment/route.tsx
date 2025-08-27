import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Please log in order to initialise payment" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/cart/payment/initialise`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    // Try to parse backend JSON (even on non-2xx)
    const data = await res.json().catch(() => null);

    // Forward backend response and status
    return NextResponse.json(
      data ?? { success: false, message: "Unexpected empty response" },
      { status: res.status }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to initialise payment" },
      { status: 500 }
    );
  }
}
