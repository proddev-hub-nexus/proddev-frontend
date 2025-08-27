import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { course_id } = await req.json().catch(() => ({}) as any);

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Please log in to add item to cart!" },
      { status: 401 }
    );
  }

  if (!course_id || typeof course_id !== "string") {
    return NextResponse.json(
      { success: false, message: "No course selected!" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/add-item-to-cart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id }),
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => null);

    // On success your backend returns:
    // {
    //   owner_id, order_id, course_id, unit_price_snapshot, quantity, line_total
    // }
    return NextResponse.json(
      data ?? { success: false, message: "Empty response from server." },
      { status: res.status }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error while adding item to cart." },
      { status: 500 }
    );
  }
}
