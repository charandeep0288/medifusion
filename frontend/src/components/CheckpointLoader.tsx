import React, { useEffect, useState } from "react";

// Simple utility function to merge class names
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// Simple icons as SVG components
const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

const Circle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const Loader = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

interface Checkpoint {
  id: string;
  label: string;
  description: string;
}

interface CheckpointLoaderProps {
  checkpoints: Checkpoint[];
  autoProgress?: boolean;
  onComplete?: () => void;
}

type CheckpointStatus = "pending" | "loading" | "completed";

const CheckpointLoader: React.FC<CheckpointLoaderProps> = ({
  checkpoints,
  autoProgress = true,
  onComplete,
}) => {
  const [statuses, setStatuses] = useState<CheckpointStatus[]>(
    checkpoints.map(() => "pending")
  );

  useEffect(() => {
    if (!autoProgress) return;

    const progressInterval = setInterval(() => {
      setStatuses((prev) => {
        const newStatuses = [...prev];

        // Find the first loading checkpoint
        const loadingIndex = newStatuses.findIndex(
          (status) => status === "loading"
        );

        if (loadingIndex !== -1) {
          // Complete the loading checkpoint
          newStatuses[loadingIndex] = "completed";

          // Instantly start the next checkpoint if it exists
          if (
            loadingIndex + 1 < newStatuses.length &&
            newStatuses[loadingIndex + 1] === "pending"
          ) {
            newStatuses[loadingIndex + 1] = "loading";
          }
        } else {
          // No loading checkpoint, find the first pending one
          const pendingIndex = newStatuses.findIndex(
            (status) => status === "pending"
          );
          if (pendingIndex !== -1) {
            newStatuses[pendingIndex] = "loading";
          } else {
            // All completed
            clearInterval(progressInterval);
            onComplete?.();
          }
        }

        return newStatuses;
      });
    }, 2000);

    return () => clearInterval(progressInterval);
  }, [autoProgress, onComplete]);

  const getProgressWidth = () => {
    const completedCount = statuses.filter(
      (status) => status === "completed"
    ).length;
    const loadingCount = statuses.filter(
      (status) => status === "loading"
    ).length;
    return ((completedCount + loadingCount * 0.5) / checkpoints.length) * 100;
  };

  const getCheckpointIcon = (status: CheckpointStatus) => {
    switch (status) {
      case "pending":
        return <Circle className="w-5 h-5 text-gray-400" />;
      case "loading":
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: CheckpointStatus) => {
    switch (status) {
      case "pending":
        return "Waiting";
      case "loading":
        return "Processing";
      case "completed":
        return "Completed";
      default:
        return "Waiting";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>

        {/* Animated Progress Line with Gradient */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-1000 ease-out rounded-full shadow-lg transform -translate-y-1/2"
          style={{ width: `${getProgressWidth()}%` }}
        ></div>

        {/* Checkpoints */}
        <div className="flex justify-between relative">
          {checkpoints.map((checkpoint, index) => (
            <div
              key={checkpoint.id}
              className="flex flex-col items-center group"
            >
              {/* Checkpoint Label - Always Visible Above Circle */}
              <div className="mb-4 text-center">
                <h4
                  className={cn(
                    "font-semibold text-sm mb-1 transition-colors duration-300",
                    statuses[index] === "completed"
                      ? "text-green-600"
                      : statuses[index] === "loading"
                      ? "text-blue-600"
                      : "text-gray-500"
                  )}
                >
                  {checkpoint.label}
                </h4>
              </div>

              {/* Checkpoint Icon with Enhanced Animations - Centered on Line */}
              <div
                className={cn(
                  "relative z-10 bg-white p-3 rounded-full border-2 transition-all duration-500 cursor-pointer transform",
                  statuses[index] === "completed"
                    ? "border-green-500 bg-green-50 shadow-lg shadow-green-500/25 scale-110"
                    : statuses[index] === "loading"
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25 scale-105 animate-pulse"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105"
                )}
              >
                {getCheckpointIcon(statuses[index])}
              </div>

              {/* Tooltip on Hover with Status and Description */}
              <div className="absolute top-20 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xl min-w-48">
                  <div className="text-sm font-medium mb-1 text-gray-900">
                    Status: {getStatusText(statuses[index])}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {checkpoint.description}
                  </p>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
              </div>

              {/* Status Badge Below Circle */}
              <div className="mt-3 text-center">
                <div
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium transition-all duration-300",
                    statuses[index] === "completed"
                      ? "bg-green-100 text-green-700 shadow-md"
                      : statuses[index] === "loading"
                      ? "bg-blue-100 text-blue-700 shadow-md animate-pulse"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {getStatusText(statuses[index])}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckpointLoader;
