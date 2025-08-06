import type { Metadata } from "next";
import { Toaster } from "@/general/components/ui/sonner";
import { QueryProvider } from "@/general/providers/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/general/providers/AuthProvider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dashboard - ProdDev Hub",
  description: "Personal Course Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <QueryProvider>
          <AuthProvider>
            {" "}
            {/* ✅ Wrap protected routes */}
            <main className="container mx-auto px-4 py-8">{children}</main>
          </AuthProvider>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
