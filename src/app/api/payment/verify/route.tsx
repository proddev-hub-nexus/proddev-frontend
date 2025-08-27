import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { success: false, message: "Missing payment reference" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Please log in to verify payment" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/cart/payment/${reference}/verify`,
      {
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
