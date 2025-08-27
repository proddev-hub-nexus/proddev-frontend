import axios from "axios";

export type AddToCartResponse = {
  owner_id: string;
  order_id: string;
  course_id: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
};

export type InitPaymentResponse = {
  success: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
    amount: number;
  };
  order_id?: string;
};

export async function addItemToCart(
  courseId: string
): Promise<AddToCartResponse> {
  try {
    const { data } = await axios.post<AddToCartResponse>(
      "/api/cart/add-item-to-cart",
      { course_id: courseId },
      { validateStatus: () => true }
    );

    if (!data || (data as any).success === false) {
      throw new Error((data as any)?.message || "Failed to add item to cart");
    }

    return data;
  } catch (err: any) {
    console.error("Add to cart failed:", err);
    throw err;
  }
}

export async function removeItemFromCart(
  itemId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await axios.post<{ success: boolean; message: string }>(
      "/api/cart/remove-item-from-cart",
      { item_id: itemId },
      { validateStatus: () => true }
    );

    if (!data || data.success === false) {
      throw new Error(data?.message || "Failed to remove item from cart");
    }

    return data;
  } catch (err: any) {
    console.error("Remove from cart failed:", err);
    throw err;
  }
}

export async function clearCart(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { data } = await axios.post<{ success: boolean; message: string }>(
      "/api/cart/clear-cart",
      {},
      { validateStatus: () => true }
    );

    if (!data || data.success === false) {
      throw new Error(data?.message || "Failed to clear cart");
    }

    return data;
  } catch (err: any) {
    console.error("Clear cart failed:", err);
    throw err;
  }
}

export async function initialisePayment(): Promise<InitPaymentResponse> {
  try {
    const { data } = await axios.post<InitPaymentResponse>(
      "/api/cart/init-payment",
      {},
      { validateStatus: () => true }
    );

    if (!data || data.success === false) {
      throw new Error(data?.message || "Failed to initialise payment");
    }

    return data;
  } catch (err: any) {
    console.error("Initialise payment failed:", err);
    throw err;
  }
}
