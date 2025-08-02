import React from "react";
import Logo from "./logo";
import Link from "next/link";

import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full pt-12 sm:pt-16 lg:pt-20 bg-slate-900 text-slate-100 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Logo className="text-xl sm:text-2xl font-bold text-slate-100 mb-4" />
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-sm">
              Empowering professionals with cutting-edge skills through
              expert-led courses. Build your future with industry-recognized
              certifications.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>hello@proddevhub.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>+234 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <Link
                href="/"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
              </Link>
              <Link
                href="/"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
              </Link>
              <Link
                href="/"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-slate-100 mb-4 sm:mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Courses", href: "/courses" },
                // { name: "Services", href: "/expert-services" },
                // { name: "Contact", href: "/contact-us" },
                // { name: "Help Center", href: "/help-center" },
                // { name: "Privacy Policy", href: "/privacy-policy" },
                // { name: "Terms & Conditions", href: "/terms-and-conditions" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Courses</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/courses"
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Explore All Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?highlight=featured"
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Featured Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            {/* Trust badges */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500/60 rounded-full"></div>
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
              &copy; 2024 Proddev Hub. All rights reserved. Building careers
              through education.
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-slate-500">
              <Link
                href="/privacy-policy"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Cookies
              </Link>
              <Link
                href="/accessibility"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
