"use client";

import { toast } from "sonner";

export function confirmLogout(onConfirm: () => Promise<void>) {
  // show confirm toast with an action button
  const id = toast("Sign out of your account?", {
    description: "You can sign in again anytime.",
    action: {
      label: "Confirm",
      onClick: () => {
        toast.dismiss(id);
        toast.promise(onConfirm(), {
          loading: "Signing you out…",
          success: "You’ve been logged out.",
          error: "Failed to log out. Please try again.",
        });
      },
    },
    duration: 8000,
  });
}
