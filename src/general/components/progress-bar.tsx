import React from "react";

export type ProgressVariant = "chained" | "linear" | "circular" | "segmented";

interface ProgressBarProps {
  variant?: ProgressVariant;
  currentIndex: number;
  previousIndex?: number;
  items: unknown[];
  activeColor?: string;
  previousColor?: string;
  completedColor?: string;
  defaultColor?: string;
}

export default function ProgressBar({
  variant = "linear",
  currentIndex,
  previousIndex,
  items,
  activeColor = "bg-green-400",
  previousColor = "bg-green-600",
  completedColor = "bg-green-400",
  defaultColor = "bg-gray-300",
}: ProgressBarProps) {
  switch (variant) {
    case "circular":
      return (
        <div className="flex items-center justify-center gap-2 w-full">
          {items.map((_, index) => (
            <span
              key={index}
              className={`h-4 w-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? activeColor
                  : index === previousIndex
                    ? previousColor
                    : index < currentIndex
                      ? completedColor
                      : defaultColor
              }`}
              aria-current={index === currentIndex ? "step" : undefined}
            />
          ))}
        </div>
      );

    case "chained":
      return (
        <div className="flex items-center justify-between w-full h-4">
          {items.map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <span
                className={`h-4 w-4 rounded-full flex-shrink-0 transition-all duration-300 ${
                  index === currentIndex
                    ? activeColor
                    : index === previousIndex
                      ? previousColor
                      : index < currentIndex
                        ? completedColor
                        : defaultColor
                }`}
                aria-current={index === currentIndex ? "step" : undefined}
              />
              {index < items.length - 1 && (
                <span
                  className={`h-1 w-full transition-all duration-300 ${
                    index < currentIndex
                      ? index === (previousIndex ?? -1) - 1
                        ? previousColor
                        : completedColor
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      );

    case "linear":
      const safeLength = Math.max(items.length - 1, 1);
      const progressPercentage = (currentIndex / safeLength) * 100;
      const fullyComplete = currentIndex === items.length - 1;
      return (
        <div
          className="relative w-full h-4 bg-gray-100 rounded overflow-hidden"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={items.length}
        >
          <div
            className={`h-full ${activeColor} transition-all duration-300 ${
              fullyComplete ? "rounded" : "rounded-l"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      );

    case "segmented":
    default:
      return (
        <div className="flex items-center gap-2 w-full h-2 sm:h-3 md:h-4">
          {items.map((_, index) => (
            <span
              key={index}
              className={`h-1 md:h-4 flex-1 rounded transition-all duration-300 ${
                index === currentIndex
                  ? activeColor
                  : index === previousIndex
                    ? previousColor
                    : index < currentIndex
                      ? completedColor
                      : defaultColor
              }`}
              aria-current={index === currentIndex ? "step" : undefined}
            />
          ))}
        </div>
      );
  }
}
