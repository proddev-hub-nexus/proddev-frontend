import { Button } from "@/general/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 p-8 sm:p-10 lg:p-12 xl:p-16 shadow-2xl">
          {/* Subtle Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Top right subtle accent */}
            <div className="absolute top-0 right-0 w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 bg-gradient-to-bl from-slate-500/20 to-transparent rounded-full blur-3xl"></div>

            {/* Bottom left subtle accent */}
            <div className="absolute -bottom-8 -left-8 w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 bg-gradient-to-tr from-slate-600/30 to-transparent rounded-full blur-2xl"></div>

            {/* Minimal decorative dots */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-slate-300/20 rounded-full"></div>
            <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-slate-300/30 rounded-full"></div>
            <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-slate-300/25 rounded-full"></div>

            {/* Subtle grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            ></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
            {/* Image Section */}
            <div className="flex-shrink-0 order-2 lg:order-1">
              <div className="relative">
                <div className="relative bg-gradient-to-br from-slate-600 to-slate-700 p-4 sm:p-6 rounded-2xl shadow-xl">
                  <Image
                    src="/call-to-action.png"
                    alt="Online learning illustration"
                    width={288}
                    height={259}
                    className="w-48 h-auto sm:w-56 lg:w-72 xl:w-80 drop-shadow-lg rounded-lg"
                    priority
                  />
                  {/* Subtle glow effect around image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-transparent rounded-2xl"></div>
                </div>

                {/* Refined decorative element */}
                <div className="absolute -top-3 -right-3 w-6 h-6 sm:w-8 sm:h-8 bg-slate-400/30 rounded-lg rotate-12 backdrop-blur-sm"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 sm:w-6 sm:h-6 bg-slate-300/20 rounded-full"></div>
              </div>
            </div>

            {/* Text and CTA Section */}
            <div className="flex-1 text-center lg:text-left order-1 lg:order-2 max-w-2xl lg:max-w-none">
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-100 leading-tight">
                  Professional Online Courses &{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Learning Excellence</span>
                    {/* Subtle underline decoration */}
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-slate-400/40 via-slate-300/60 to-slate-400/40 rounded-full"></div>
                  </span>{" "}
                  for Growth
                </h2>

                <p className="text-slate-200 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Advance your career with our expertly crafted courses designed
                  by industry professionals. Learn at your own pace with
                  lifetime access to premium content.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center lg:justify-start pt-2">
                  <Button
                    size="lg"
                    className="bg-slate-100 hover:bg-white text-slate-900 hover:text-slate-800 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group border border-slate-200 w-full sm:w-auto"
                  >
                    Start Learning Today
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent hover:bg-slate-600/50 text-slate-200 hover:text-slate-100 border-slate-400/50 hover:border-slate-300/70 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm w-full sm:w-auto"
                  >
                    Browse Courses
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-4 text-slate-300 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span>10,000+ Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span>Expert Instructors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span>Lifetime Access</span>
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

export default CallToAction;
