"use client";

import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import type { CartData } from "../types/cart";
import { useRouter } from "next/navigation";

type TCartItemsProp = {
  cart: CartData | null;
};

const formatNaira = (kobo: number | null | undefined) => {
  if (typeof kobo !== "number") return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(kobo / 100);
};

export default function CartItems({ cart }: TCartItemsProp) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const access_token = getCookie("access_token");
    if (access_token) setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) {
    router.push("/account");
  }

  if (!cart) {
    return <p>Your cart is empty or could not be loaded.</p>;
  }

  const { order, items } = cart;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <section className="rounded-2xl shadow p-4 border">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>ID:</div>
          <div className="font-mono">{order.id}</div>
          <div>Status:</div>
          <div className="capitalize">{order.status.replace("_", " ")}</div>
          <div>Subtotal:</div>
          <div>{formatNaira(order.subtotal)}</div>
          <div>Discount:</div>
          <div>{formatNaira(order.discount_total)}</div>
          <div>Tax:</div>
          <div>{formatNaira(order.tax_total)}</div>
          <div>Total:</div>
          <div className="font-semibold">{formatNaira(order.total)}</div>
        </div>
      </section>

      <section className="rounded-2xl shadow p-4 border">
        <h3 className="text-lg font-semibold mb-3">Items ({items.length})</h3>

        {items.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.item_id} className="border rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {it.course?.name ?? "Untitled course"}
                    </div>
                    <div className="text-sm text-gray-600">
                      Qty: {it.quantity} · Unit:{" "}
                      {formatNaira(it.unit_price_snapshot)}
                    </div>
                  </div>
                  <div className="text-right font-semibold">
                    {formatNaira(it.line_total)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
