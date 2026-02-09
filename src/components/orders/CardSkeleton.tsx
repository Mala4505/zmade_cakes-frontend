
export function CardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-zm-greyOlive/10 shadow-sm p-4 space-y-3 animate-pulse"
        >
          {/* Order header */}
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
            <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
          </div>

          {/* Customer info */}
          <div className="flex items-center space-x-2">
            <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
          </div>

          {/* Total */}
          <div className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />

          {/* Action buttons */}
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
            <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
