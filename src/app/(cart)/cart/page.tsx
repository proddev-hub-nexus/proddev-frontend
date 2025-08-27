import CartItems from "../component/cart-items";
import type { CartData, CartResponse } from "../types/cart";
import { headers, cookies } from "next/headers";

export default async function CartPage() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const baseURL = `${proto}://${host}`;

  const cookiesStore = await cookies();

  const isAuthenticated = !!cookiesStore.get("access_token")?.value;

  let cart: CartData | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${baseURL}/api/cart/get-all-cart-items`, {
      method: "GET",
      headers: { cookie: cookiesStore.toString() },
      cache: "no-store",
    });
    console.log("[v0] API Response status:", res.status);
    console.log(
      "[v0] API Response headers:",
      Object.fromEntries(res.headers.entries())
    );

    if (res.ok) {
      const data: CartResponse | any = await res.json();
      console.log("[v0] Raw API response data:", data);
      console.log("[v0] Data keys:", Object.keys(data));
      cart = (data?.cart ?? data ?? null) as CartData | null;
      console.log("[v0] Processed cart data:", cart);
    } else if (res.status === 401) {
      cart = null; // not logged in
    } else {
      error = `Failed to load cart (${res.status})`;
    }
  } catch (err) {
    console.log("[v0] Fetch error:", err);
    error = "Unable to connect to cart service";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading cart: {error}</p>
        </div>
      ) : (
        <CartItems cart={cart} isAuthenticated={isAuthenticated} />
      )}
    </div>
  );
}
