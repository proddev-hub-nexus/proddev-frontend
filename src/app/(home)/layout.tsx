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
    "An AI-assisted and live course platform created witht he passion for improvement and capacity",
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
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
