import CartItems from "../component/cart-items";
import type { CartData, CartResponse } from "../types/cart";
import { cookies } from "next/headers";

export default async function CartPage() {
  const cookiesStore = await cookies();
  const isAuthenticated = !!cookiesStore.get("access_token")?.value;

  let cart: CartData | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`/api/cart/get-all-cart-items`, {
      method: "GET",
      headers: { cookie: cookies().toString() },
      cache: "no-store",
    });

    if (res.ok) {
      const data: CartResponse = await res.json();
      cart = data?.cart ?? null;
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
