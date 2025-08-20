import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Main from "@/general/components/main";
import NavBar from "@/general/components/navbar";
import Footer from "@/general/components/footer";
import { QueryProvider } from "@/general/providers/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/general/components/ui/sonner";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welcome to Proddev",
  description:
    "An AI-assisted and live course platform created with the passion for improvement and capacity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} grid grid-cols-1 w-dvw antialiased bg-home-background text-white`}
      >
        <QueryProvider>
          <NavBar />
          <div className="pt-16 sm:pt-18 md:pt-20">
            <Main>{children}</Main>
          </div>
          <Footer />
          <ReactQueryDevtools initialIsOpen={false} />

          {/* Fixed Toaster configuration */}
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
        </QueryProvider>
      </body>
    </html>
  );
}
