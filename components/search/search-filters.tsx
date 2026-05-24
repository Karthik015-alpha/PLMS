import { SearchFiltersInput } from '@/features/search/search.types';
import { Filter, Check } from 'lucide-react';

interface SearchFiltersProps {
  filters: SearchFiltersInput;
  onUpdateFilters: (newFilters: Partial<SearchFiltersInput>) => void;
}

export function SearchFilters({ filters, onUpdateFilters }: SearchFiltersProps) {
  const taskStatuses = ['Pending', 'In Progress', 'Completed'];

  const toggleStatus = (status: string) => {
    const current = filters.taskStatuses || [];
    if (current.includes(status)) {
      onUpdateFilters({ taskStatuses: current.filter(s => s !== status) });
    } else {
      onUpdateFilters({ taskStatuses: [...current, status] });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-6">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Refine Search</h3>
      </div>
      
      <div className="mb-6">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Task Status
        </h4>
        <div className="space-y-3">
          {taskStatuses.map(status => {
            const isChecked = (filters.taskStatuses || []).includes(status);
            return (
              <label 
                key={status} 
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-blue-400'}`}>
                  {isChecked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm transition-colors ${isChecked ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300'}`}>
                  {status}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
