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
    const res = await fetch(`${baseURL}/api/order/cart`, {
      method: "GET",
      headers: { cookie: cookiesStore.toString() }, // forward request cookies
      cache: "no-store",
    });

    if (res.ok) {
      const data: CartResponse | any = await res.json();
      cart = (data?.cart ?? data ?? null) as CartData | null; // supports {cart: ...} or bare object
    } else if (res.status === 401) {
      cart = null; // not logged in
    } else {
      error = `Failed to load cart (${res.status})`;
    }
  } catch {
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
