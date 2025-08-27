import CartItems from "../component/cart-items";
import type { CartData, CartResponse } from "../types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function CartPage() {
  let cart: CartData | null = null;
  let error: string | null = null;

  if (API_URL) {
    try {
      // Fix: Use complete URL for fetch
      const res = await fetch(`/api/cart/get-all-cart-items`, {
        // Add cache control for better performance
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data: CartResponse = await res.json();
        cart = data?.cart ?? null;
      } else {
        console.error(`Failed to fetch cart: ${res.status} ${res.statusText}`);
        error = `Failed to load cart (${res.status})`;
      }
    } catch (fetchError) {
      console.error("Error fetching cart:", fetchError);
      error = "Unable to connect to cart service";
    }
  } else {
    console.warn("API_URL not configured");
    error = "Configuration error";
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
