import type { Metadata } from "next";
import { Toaster } from "@/general/components/ui/sonner";
import { QueryProvider } from "@/general/providers/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dashboard - Create Next App",
  description: "Dashboard for the application",
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">{children}</main>
        <Toaster />
        {/* DevTools must be inside QueryProvider */}
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryProvider>
  );
}
