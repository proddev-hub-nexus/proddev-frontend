import { create } from "zustand";

interface IAuth {
  user_id: string | null;
  email: string;
  full_name: string;
  isVerified: boolean;
  created_at: Date | null;
  isLoading: boolean;
  error: string | null;

  isLoggedIn: () => boolean;

  setUser: (payload: {
    user_id: string;
    email: string;
    full_name: string;
    isVerified: boolean;
    created_at: Date;
  }) => void;
  clearUser: () => void;
  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;
}

export const useAuthStore = create<IAuth>((set, get) => ({
  // State
  user_id: null,
  email: "",
  full_name: "",
  isVerified: false,
  created_at: null,
  isLoading: false,
  error: null,

  // Derived State
  isLoggedIn: () => !!get().user_id && get().isVerified,

  // Actions
  setUser: ({ user_id, email, full_name, isVerified, created_at }) =>
    set({
      user_id,
      email,
      full_name,
      isVerified,
      created_at,
      error: null,
    }),
  clearUser: () =>
    set({
      user_id: null,
      email: "",
      full_name: "",
      isVerified: false,
      created_at: null,
    }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (err) => set({ error: err }),
}));
