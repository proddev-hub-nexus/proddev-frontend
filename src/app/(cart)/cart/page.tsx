import CartItems from "../component/cart-items";
import type { CartData, CartResponse } from "../types/cart";
import { headers, cookies } from "next/headers";

export default async function CartPage() {
  let cart: CartData | null = null;
  let error: string | null = null;

  try {
    // Build absolute URL for the current deployment (works locally and on Vercel/Heroku/etc.)
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const baseURL = `${proto}://${host}`;

    const res = await fetch(`${baseURL}/api/cart/get-all-cart-items`, {
      method: "GET",
      // Forward cookies so the API route can read `access_token`
      headers: { cookie: cookies().toString() },
      cache: "no-store", // cart should be fresh; switch to revalidate if you want
    });

    if (res.ok) {
      const data: CartResponse = await res.json();
      cart = data?.cart ?? null;
    } else {
      error = `Failed to load cart (${res.status})`;
    }
  } catch (e) {
    console.error(e);
    error = "Unable to connect to cart service";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading cart: {error}</p>
          <p className="text-sm mt-1">Please try refreshing the page.</p>
        </div>
      ) : cart ? (
        <CartItems cart={cart} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      )}
    </div>
  );
}
