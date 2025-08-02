"use client";
import React from "react";
import SearchBar from "./search-bar";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowUpRight, Code2, Calendar, UserPlus } from "lucide-react";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      {/* Subtle background decorative elements */}
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="pt-6 sm:pt-8 lg:pt-12">
          <SearchBar />
        </div>

        {/* Main Hero Content */}
        <div className="py-8 sm:py-12 lg:py-16 xl:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-100 leading-tight">
                  Advance Your{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-slate-50">
                      Professional Journey
                    </span>
                    {/* Refined underline with subtle gradient */}
                    <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-blue-500/40 via-indigo-500/60 to-blue-500/40 rounded-full"></div>
                  </span>{" "}
                  with Expert Learning
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Master in-demand skills through comprehensive courses designed
                  by industry professionals. Build expertise that drives career
                  growth.
                </p>
              </div>

              {/* CTA Link */}
              <div className="flex justify-center lg:justify-start">
                <Link
                  href="/courses"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-all duration-200 group hover:scale-105"
                >
                  Explore our courses
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-slate-800/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/70 hover:border-slate-500/60 hover:text-slate-100 rounded-lg px-6 py-3 font-medium transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] order-2 sm:order-1"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Consultation
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-blue-500/20 order-1 sm:order-2"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Start Learning Now
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full"></div>
                  <span>15,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500/60 rounded-full"></div>
                  <span>Expert Instructors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500/60 rounded-full"></div>
                  <span>Industry Certified</span>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Elements */}
            <div className="relative flex justify-center lg:justify-end order-first lg:order-last">
              <div className="relative">
                {/* Code Editor Mock - Responsive */}
                <div className="relative z-20 w-56 sm:w-64 md:w-72 lg:w-80 mb-6 sm:mb-8 lg:mb-0">
                  <div className="bg-slate-800/90 rounded-xl shadow-2xl overflow-hidden border border-slate-600/50 backdrop-blur-sm">
                    {/* Editor Header */}
                    <div className="bg-gradient-to-r from-slate-700 to-slate-600 h-6 sm:h-7 flex items-center px-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-400/80"></div>
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80"></div>
                      </div>
                      <div className="ml-auto text-xs text-slate-400 font-mono hidden sm:block">
                        main.py
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="bg-slate-900/95 p-3 sm:p-4 text-xs sm:text-sm font-mono">
                      <div className="space-y-1">
                        <div>
                          <span className="text-blue-400">def</span>{" "}
                          <span className="text-green-400">
                            calculate_growth
                          </span>
                          <span className="text-slate-300">(skills):</span>
                        </div>
                        <div className="pl-3 sm:pl-4 text-slate-300">
                          <span className="text-blue-400">for</span> skill{" "}
                          <span className="text-blue-400">in</span> skills:
                        </div>
                        <div className="pl-6 sm:pl-8 text-slate-300">
                          progress = skill.learn()
                        </div>
                        <div className="pl-6 sm:pl-8 text-slate-300">
                          <span className="text-blue-400">print</span>(
                          <span className="text-green-400">
                            f&quot;Growth:%&quot;
                          </span>
                          )
                        </div>
                        <div className="pl-3 sm:pl-4 text-slate-300">
                          <span className="text-blue-400">return</span>{" "}
                          <span className="text-orange-400">
                            &quot;Success&quot;
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refined Decorative Arrow */}
                <div className="absolute top-1/2 -right-6 sm:-right-8 lg:-right-12 transform -translate-y-1/2 z-10 hidden sm:block">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-slate-500 opacity-40"
                    viewBox="0 0 94 87"
                    fill="none"
                  >
                    <path
                      d="M1.24376 6.69465C0.811081 7.03789 0.738569 7.66688 1.0818 8.09956L6.67507 15.1505C7.0183 15.5832 7.6473 15.6557 8.07998 15.3124C8.51266 14.9692 8.58517 14.3402 8.24194 13.9075L3.27014 7.64005L9.53762 2.66825C9.9703 2.32502 10.0428 1.69602 9.69958 1.26334C9.35635 0.830662 8.72735 0.75815 8.29467 1.10138L1.24376 6.69465ZM93.6402 86.1211C85.4563 68.9108 78.2194 50.753 65.2149 36.0695C52.15 21.3176 33.3083 10.0963 1.97976 6.48467L1.75071 8.47151C32.6447 12.033 51.0146 23.0522 63.7177 37.3955C76.4813 51.807 83.569 69.599 91.834 86.98L93.6402 86.1211Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* Hero Image */}
                <div className="relative z-10 -mt-2 sm:-mt-4 lg:mt-0">
                  <div className="relative">
                    <Image
                      priority
                      src="/girl.png"
                      alt="Professional learning programming and development skills"
                      width={400}
                      height={400}
                      className="w-64 sm:w-72 md:w-80 lg:w-96 h-auto drop-shadow-2xl"
                    />
                    {/* Refined floating elements around image */}
                    <div className="absolute top-8 sm:top-10 -left-3 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-500/20">
                      <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                    <div className="absolute bottom-16 sm:bottom-20 -right-2 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600/20 rounded-lg backdrop-blur-sm border border-indigo-500/20"></div>
                    <div className="absolute top-1/3 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/15 rounded-full backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
