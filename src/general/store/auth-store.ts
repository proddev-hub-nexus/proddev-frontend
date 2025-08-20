import { create } from "zustand";
import { User, ActiveToken } from "../types/auth-types";

interface AuthState {
  user: User | null;
  token_id: string | null;
  access_token: string | null;
  active_tokens: ActiveToken[];
  _hasHydrated: boolean;
  setAuth: (payload: {
    token_id: string;
    access_token: string;
    device: string;
    token_expires_in: Date;
  }) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  setHasHydrated: (value: boolean) => void;
  get isLoggedIn(): boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token_id: null,
  access_token: null,
  active_tokens: [],
  _hasHydrated: false,

  get isLoggedIn() {
    return !!get().access_token;
  },

  setAuth: ({ token_id, access_token, device, token_expires_in }) =>
    set((state) => ({
      token_id,
      access_token,
      active_tokens: [
        ...state.active_tokens,
        {
          token_id,
          access_token,
          expires_in: token_expires_in,
          device,
        },
      ],
    })),

  setUser: (user) => set({ user }),

  clearAuth: () =>
    set({
      user: null,
      token_id: null,
      access_token: null,
      active_tokens: [],
    }),

  setHasHydrated: (value) => set({ _hasHydrated: value }),
}));
