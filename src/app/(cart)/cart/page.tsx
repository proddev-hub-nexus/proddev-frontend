import CartItems from "../component/cart-items";
import type { CartData, CartResponse } from "../types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function CartPage() {
  let cart: CartData | null = null;

  if (API_URL) {
    try {
      const res = await fetch(`api/cart/get-all-cart-items`);
      if (res.ok) {
        const data: CartResponse = await res.json();
        cart = data?.cart ?? null;
      } else {
        cart = null;
      }
    } catch {
      cart = null;
    }
  }

  return <CartItems cart={cart} />;
}
