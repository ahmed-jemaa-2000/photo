export function OrderStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
            <div className="h-4 w-12 bg-gray-100 rounded"></div>
          </div>
          <div className="h-3 w-16 bg-gray-100 rounded mb-2"></div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function OrderTableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="h-4 w-12 bg-gray-100 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                    <div className="h-3 w-32 bg-gray-50 rounded"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-28 bg-gray-100 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-16 bg-gray-100 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-20 bg-gray-100 rounded-lg"></div>
                    <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OrderCardsSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-5 w-16 bg-gray-100 rounded"></div>
            <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-4 w-32 bg-gray-100 rounded"></div>
            <div className="h-3 w-36 bg-gray-50 rounded"></div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-28 bg-gray-100 rounded"></div>
            <div className="h-4 w-20 bg-gray-100 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 flex-1 bg-gray-100 rounded-lg"></div>
            <div className="h-9 w-9 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Cards Skeleton */}
      <OrderStatsCardsSkeleton />

      {/* Search and Filters Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="h-10 bg-gray-100 rounded-lg"></div>
        <div className="flex gap-3">
          <div className="h-10 w-40 bg-gray-100 rounded-lg"></div>
          <div className="h-10 w-40 bg-gray-100 rounded-lg"></div>
          <div className="h-10 w-40 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="h-4 w-32 bg-gray-100 rounded"></div>
          <div className="h-10 w-32 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <OrderTableSkeleton />
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="block md:hidden bg-white rounded-xl border border-gray-200 overflow-hidden">
        <OrderCardsSkeleton />
      </div>
    </div>
  );
}
