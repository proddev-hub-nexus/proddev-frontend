export type AddToCartResponse = {
  owner_id: string;
  order_id: string;
  course_id: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
};

export async function addItemToCart(
  courseId: string
): Promise<AddToCartResponse> {
  const res = await fetch("/api/cart/add-item-to-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course_id: courseId }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err: any = new Error(data?.message || "Failed to add item to cart.");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as AddToCartResponse;
}
