"use client";
import { Button } from "./ui/button";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeSheet = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 sm:h-18 md:h-20 border-b border-slate-200/20 bg-slate-900/80 backdrop-blur-md z-50 transition-all duration-300">
      <nav className="w-full h-full flex justify-between items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="group">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight relative text-slate-100">
            <span className="relative z-10">Proddev</span>
            <span className="absolute inset-0 bg-slate-700/20 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 blur-sm -z-10"></span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-300 group-hover:w-full"></span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <ul className="flex items-center space-x-6 lg:space-x-8">
            <li>
              <Link
                href="/"
                className="text-slate-300 hover:text-slate-100 font-medium transition-colors duration-200 relative group px-3 py-2 rounded-lg hover:bg-slate-800/50"
              >
                Home
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-slate-200 transition-all duration-200 group-hover:w-[calc(100%-24px)]"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/courses"
                className="text-slate-300 hover:text-slate-100 font-medium transition-colors duration-200 relative group px-3 py-2 rounded-lg hover:bg-slate-800/50"
              >
                Courses
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-slate-200 transition-all duration-200 group-hover:w-[calc(100%-24px)]"></span>
              </Link>
            </li>
          </ul>
          <Button
            className="bg-slate-700 hover:bg-slate-600 text-slate-100 hover:text-white px-4 sm:px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 border border-slate-600 hover:border-slate-500"
            variant="outline"
          >
            Dashboard
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 h-9 w-9 sm:h-10 sm:w-10 rounded-lg transition-all duration-200"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[320px] px-0 bg-slate-900/95 text-slate-100 border-l border-slate-700/50 backdrop-blur-md"
            >
              {/* Close Button */}
              <SheetClose asChild></SheetClose>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="px-6 py-6 border-b border-slate-700/50">
                  <Link href="/" onClick={closeSheet}>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                      Proddev
                    </h2>
                  </Link>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col px-6 mt-6 space-y-2">
                  <Link
                    href="/"
                    onClick={closeSheet}
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 font-medium transition-all duration-200 relative group text-base sm:text-lg py-3 px-3 rounded-lg"
                  >
                    Home
                    <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-slate-200 transition-all duration-200 group-hover:w-[calc(100%-24px)]"></span>
                  </Link>
                  <Link
                    href="/courses"
                    onClick={closeSheet}
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 font-medium transition-all duration-200 relative group text-base sm:text-lg py-3 px-3 rounded-lg"
                  >
                    Courses
                    <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-slate-200 transition-all duration-200 group-hover:w-[calc(100%-24px)]"></span>
                  </Link>
                </nav>

                {/* Mobile Dashboard Button */}
                <div className="mt-auto p-6 border-t border-slate-700/50">
                  <Button
                    onClick={closeSheet}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 hover:text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 border border-slate-600 hover:border-slate-500"
                  >
                    Dashboard
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
