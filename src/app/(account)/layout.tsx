import type { Metadata } from "next";
import { Toaster } from "@/general/components/ui/sonner";
import { QueryProvider } from "@/general/providers/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Account - ProdDev Hub",
  description:
    "Sign in to your account or create a new one to access professional development courses",
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-home-background text-white antialiased overflow-hidden">
        <QueryProvider>
          {/* Background matching your theme */}
          <div className="fixed inset-0 bg-hero-background">
            {/* Subtle background decorative elements matching your Hero */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-64 sm:w-72 lg:w-96 h-64 sm:h-72 lg:h-96 bg-blue-600/8 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-72 sm:w-80 lg:w-[400px] h-72 sm:h-80 lg:h-[400px] bg-indigo-600/6 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[700px] lg:w-[900px] h-[600px] sm:h-[700px] lg:h-[900px] bg-gradient-to-r from-blue-600/4 to-indigo-600/4 rounded-full blur-3xl"></div>

              {/* Subtle grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
                  backgroundSize: "32px 32px",
                }}
              ></div>
            </div>
          </div>

          {/* Main content - no scrolling */}
          <main className="relative z-10 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">{children}</div>
          </main>

          {/* Toast notifications matching dark theme */}
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
