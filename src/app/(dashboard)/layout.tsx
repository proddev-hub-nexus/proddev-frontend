import type { Metadata } from "next";
import { Toaster } from "@/general/components/ui/sonner";
import { QueryProvider } from "@/general/providers/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/general/providers/AuthProvider";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/general/components/ui/sidebar";
import DashboardSidebar from "./components/dashboard-sidebar";

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
            <SidebarProvider>
              <DashboardSidebar />
              {/* ✅ Wrap protected routes */}
              <main className="container">
                <SidebarTrigger size={"lg"} variant={"outline"} />
                {children}
              </main>
            </SidebarProvider>
          </AuthProvider>
          <Toaster
            position="top-right"
            expand={true}
            richColors={true}
            closeButton={true}
            theme="dark"
            duration={5000}
            visibleToasts={5}
            toastOptions={{
              style: {
                background: "hsl(222.2 84% 4.9%)", // slate-950
                color: "hsl(210 40% 98%)", // slate-50
                border: "1px solid hsl(217.2 32.6% 17.5%)", // slate-800
                fontSize: "14px",
                borderRadius: "8px",
                padding: "12px 16px",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              },
              className: "toast-custom",
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
