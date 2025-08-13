export default function WelcomeStep() {
  return (
    <div className="text-center space-y-8 sm:space-y-12 max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Professional Header */}
      <div className="space-y-6 sm:space-y-8">
        {/* Classic Logo Treatment */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
              <span className="text-slate-100 font-serif font-bold text-xl sm:text-3xl tracking-wider">
                P
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-slate-600 border border-slate-500"></div>
          </div>
        </div>

        {/* Professional Typography */}
        <div className="space-y-4 sm:space-y-6">
          <div className="border-b border-slate-700 pb-4 sm:pb-6">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-100 leading-tight tracking-wide">
              ProdDev Hub
            </h1>
            <div className="w-12 sm:w-16 h-0.5 bg-slate-600 mx-auto mt-3 sm:mt-4"></div>
          </div>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg mx-auto font-light px-4 sm:px-0">
            Advancing professional excellence through comprehensive educational
            programs designed for today&apos;s industry leaders.
          </p>
        </div>
      </div>

      {/* Professional Features */}
      <div className="space-y-6 sm:space-y-8">
        <h2 className="text-lg sm:text-xl font-serif font-semibold text-slate-200 tracking-wide">
          Distinguished Features
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-md mx-auto">
          <div className="flex items-start space-x-3 sm:space-x-4 text-left p-3 sm:p-4 border border-slate-700 bg-slate-800/30">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-slate-500 mt-1.5 sm:mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="text-slate-200 font-semibold text-xs sm:text-sm tracking-wide mb-1">
                EXPERT INSTRUCTION
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Industry-leading professionals with proven track records
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4 text-left p-3 sm:p-4 border border-slate-700 bg-slate-800/30">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-slate-500 mt-1.5 sm:mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="text-slate-200 font-semibold text-xs sm:text-sm tracking-wide mb-1">
                FLEXIBLE SCHEDULING
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Accommodating busy professional schedules and commitments
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4 text-left p-3 sm:p-4 border border-slate-700 bg-slate-800/30">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-slate-500 mt-1.5 sm:mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="text-slate-200 font-semibold text-xs sm:text-sm tracking-wide mb-1">
                INDUSTRY CERTIFICATION
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Recognized credentials that advance your professional standing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Call to Action */}
      <div className="pt-6 sm:pt-8 border-t border-slate-700">
        <p className="text-sm sm:text-base text-slate-400 font-light tracking-wide px-4 sm:px-0">
          Begin your journey toward professional excellence
        </p>
        <div className="w-6 sm:w-8 h-0.5 bg-slate-600 mx-auto mt-2 sm:mt-3"></div>
      </div>
    </div>
  );
}
