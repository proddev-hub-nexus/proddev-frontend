export const ORDER_STATUSES = [
  "draft",
  "pending_payment",
  "partially_paid",
  "paid",
  "fulfilled",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface CourseSummary {
  id: string;
  name: string | null;
  description: string | null;
  category: string | null;
  tutor: string | null;
  price: number | null; // kobo (integer) from backend, display as ₦ via formatter
  duration: string | null;
  language: string | null;
  available: boolean | null;
}

export interface OrderSummary {
  id: string;
  user_id: string;
  status: OrderStatus;
  currency: string | null; // "NGN"
  subtotal: number; // kobo
  discount_total: number; // kobo
  tax_total: number; // kobo
  total: number; // kobo
  created_at: string; // ISO date
  updated_at: string | null;
}

export interface CartItem {
  item_id: string;
  order_id: string;
  course_id: string;
  course: CourseSummary;
  unit_price_snapshot: number; // kobo
  quantity: number;
  line_total: number; // kobo
  created_at: string;
}

export interface CartData {
  order: OrderSummary;
  items: CartItem[];
}

export interface CartResponse {
  cart: CartData | null;
}
