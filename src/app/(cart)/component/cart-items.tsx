"use client";

import { getCookie } from "cookies-next/client";
import type { CartData, OrderStatus } from "../types/cart";

type TCartItemsProp = {
  cart: CartData | null;
  isLoading?: boolean;
};

const formatNaira = (kobo: number | null | undefined) => {
  if (typeof kobo !== "number") return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(kobo / 100);
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800";
      case "partially_paid":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "fulfilled":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "pending_payment":
        return "pending payment";
      case "partially_paid":
        return "partially paid";
      default:
        return status;
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

const LoadingSkeleton = () => (
  <div className="max-w-3xl mx-auto p-4 space-y-6">
    <div className="rounded-2xl shadow p-4 border animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="rounded-2xl shadow p-4 border animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EmptyCart = () => (
  <div className="max-w-3xl mx-auto p-4">
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Your cart is empty
      </h3>
      <p className="text-gray-500">Add some courses to get started!</p>
    </div>
  </div>
);

export default function CartItems({ cart, isLoading = false }: TCartItemsProp) {
  const access_token = getCookie("access_token");

  if (!access_token) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">Please log in to view your cart.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!cart) {
    return <EmptyCart />;
  }

  const { order, items } = cart;
  const hasDiscount = order.discount_total && order.discount_total > 0;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Order Summary */}
      <section className="rounded-2xl shadow-sm p-6 border border-gray-200 bg-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Order Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono text-sm">{order.id}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600">Status:</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatNaira(order.subtotal)}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount:</span>
                <span>-{formatNaira(order.discount_total)}</span>
              </div>
            )}
            {order.tax_total > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax:</span>
                <span>{formatNaira(order.tax_total)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatNaira(order.total)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Items */}
      <section className="rounded-2xl shadow-sm p-6 border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cart Items</h3>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No items in your cart yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.item_id}
                className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {item.course?.name || "Untitled course"}
                    </h4>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex flex-wrap gap-4">
                        <span>Quantity: {item.quantity}</span>
                        <span>
                          Unit Price: {formatNaira(item.unit_price_snapshot)}
                        </span>
                      </div>
                      {item.course?.category && (
                        <div className="text-xs text-gray-400">
                          Category: {item.course.category}
                        </div>
                      )}
                      {item.course?.tutor && (
                        <div className="text-xs text-gray-400">
                          Instructor: {item.course.tutor}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-gray-900">
                      {formatNaira(item.line_total)}
                    </div>
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
