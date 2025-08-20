"use client";

const EmptyState: React.FC = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-12">
    <div className="w-12 h-12 mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
      <svg
        className="w-6 h-6 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    </div>
    <h3 className="text-slate-300 text-center mb-2">No courses available</h3>
    <p className="text-slate-400 text-sm text-center">
      Check back later for new courses
    </p>
  </div>
);

export default EmptyState;
