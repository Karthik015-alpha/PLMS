import { SearchX, Keyboard } from 'lucide-react';

interface EmptySearchProps {
  query: string;
}

export function EmptySearch({ query }: EmptySearchProps) {
  if (query.trim().length >= 2) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50 dark:bg-gray-900/50">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-6">
          <SearchX className="h-10 w-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Results Found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          We couldn't find anything matching "<span className="font-semibold text-gray-700 dark:text-gray-300">{query}</span>". 
          Try adjusting your search query or expanding your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50 dark:bg-gray-900/50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-6">
        <Keyboard className="h-10 w-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Begin Typing to Search</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        Enter at least 2 characters to trigger a global search across your subjects, tasks, topics, and notes.
      </p>
    </div>
  );
}
