export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-zm-greyOlive/10 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-zm-greyOlive">
            <th className="px-4 py-3">Order #</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-t border-zm-greyOlive/10">
              <td className="px-4 py-3">
                <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
