export function SearchLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-6"></div>

      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-4"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="p-5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              </div>
              <div className="w-16 h-6 rounded-full bg-gray-100 dark:bg-gray-800"></div>
            </div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3 ml-13 mt-4"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 ml-13 mt-2"></div>
            <div className="mt-6 border-t border-gray-50 dark:border-gray-800 pt-4 flex justify-between">
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
