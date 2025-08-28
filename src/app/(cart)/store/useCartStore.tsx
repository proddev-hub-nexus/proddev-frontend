import { create } from "zustand";

type CartState = {
  isCartCleared: boolean;
  clearCart: () => void;
  resetCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  isCartCleared: false,
  clearCart: () => set({ isCartCleared: true }),
  resetCart: () => set({ isCartCleared: false }),
}));
