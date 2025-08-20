"use client";

import Link from "next/link";

export function DashboardLogo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 hover:opacity-90 transition"
      aria-label="Proddev Hub – Dashboard"
      title="Proddev Hub"
    >
      {/* Brand mark */}
      <div
        className="
          grid size-8 place-items-center rounded-md
          bg-gradient-to-br from-blue-600 to-indigo-600
          text-white font-bold leading-none
          group-data-[collapsible=icon]:size-9
        "
      >
        PH
      </div>

      {/* Wordmark (hidden when collapsed to icon) */}
      <span
        className="
          text-xl font-semibold tracking-tight
          bg-clip-text text-transparent
          bg-gradient-to-r from-foreground to-foreground/70
          group-data-[collapsible=icon]:hidden
        "
      >
        Proddev Hub
      </span>
    </Link>
  );
}
