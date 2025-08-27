"use client";

import type { CartData, OrderStatus } from "../types/cart";
import Link from "next/link";

type TCartItemsProp = {
  cart: CartData | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
};

const formatNaira = (amount: number | null | undefined) => {
  if (typeof amount !== "number") return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0, // optional: remove decimals like .00
  }).format(amount);
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const color =
    status === "draft"
      ? "bg-gray-100 text-gray-800"
      : status === "pending_payment"
        ? "bg-yellow-100 text-yellow-800"
        : status === "partially_paid"
          ? "bg-blue-100 text-blue-800"
          : status === "paid"
            ? "bg-green-100 text-green-800"
            : status === "fulfilled"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-red-100 text-red-800";

  const label =
    status === "pending_payment"
      ? "pending payment"
      : status === "partially_paid"
        ? "partially paid"
        : status;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

export default function CartItems({
  cart,
  isAuthenticated,
  isLoading = false,
}: TCartItemsProp) {
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">
            Please log in to view your cart.{" "}
            <Link href="/account" className="underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="max-w-3xl mx-auto p-4">Loading…</div>;
  }

  if (!cart) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center text-gray-500">
        Your cart is empty.
      </div>
    );
  }

  const { order, items } = cart;
  const hasDiscount = order.discount_total > 0;

  console.log(order);
  console.log(items);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Order Summary */}
      <section className="rounded-2xl shadow-sm p-6 border border-gray-200 bg-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Order Summary
        </h2>
        <div className="space-y-3 text-gray-900 ">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-mono text-sm">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatNaira(order.subtotal)}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-{formatNaira(order.discount_total)}</span>
              </div>
            )}
            {order.tax_total > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatNaira(order.tax_total)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold">
                {formatNaira(order.total)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="rounded-2xl shadow-sm p-6 border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cart Items</h3>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No items in your cart yet.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.item_id}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {it.course?.name ?? "Untitled course"}
                    </h4>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex flex-wrap gap-4">
                        <span>Quantity: {it.quantity}</span>
                        <span>
                          Unit Price: {formatNaira(it.unit_price_snapshot)}
                        </span>
                      </div>
                      {it.course?.category && (
                        <div className="text-xs text-gray-400">
                          Category: {it.course.category}
                        </div>
                      )}
                      {it.course?.tutor && (
                        <div className="text-xs text-gray-400">
                          Instructor: {it.course.tutor}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4 font-semibold">
                    {formatNaira(it.line_total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
