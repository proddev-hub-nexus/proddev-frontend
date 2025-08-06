import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/general/components/navbar";
import Footer from "@/general/components/footer";
import Main from "@/general/components/main";
import { QueryProvider } from "@/general/providers/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
  title: "Courses - Proddev",
  description:
    "Courses crafted with the intention to bring you onboard the future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className="min-h-screen bg-home-background text-white">
            <NavBar />
            <div className="pt-16 sm:pt-18 md:pt-20">
              <Main>{children}</Main>
            </div>
            <Footer />
            <ReactQueryDevtools initialIsOpen={false} />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
