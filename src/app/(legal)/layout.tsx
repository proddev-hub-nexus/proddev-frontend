import type { Metadata } from "next";
import { Toaster } from "@/general/components/ui/sonner";
import { QueryProvider } from "@/general/providers/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "Legal | Proddev Hub", template: "%s | Proddev Hub" },
  description: "Legal information and policies for Proddev Hub.",
};

export default function LegalRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-home-background text-white antialiased">
        <QueryProvider>
          {/* Background */}
          <div className="fixed inset-0 -z-10 bg-hero-background">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-64 sm:w-72 lg:w-96 h-64 sm:h-72 lg:h-96 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-72 sm:w-80 lg:w-[400px] h-72 sm:h-80 lg:h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, rgba(59,130,246,0.35) 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>
          </div>

          {/* Content (scrollable) */}
          <main className="relative z-10 container mx-auto max-w-3xl px-4 py-10">
            {children}
          </main>

          {/* Toasts / Devtools */}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "rgba(51,65,85,0.95)",
                color: "rgb(248,250,252)",
                border: "1px solid rgba(71,85,105,0.5)",
                backdropFilter: "blur(8px)",
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
