import { SearchResult } from '@/types/search';
import { BookOpen, Hash, CheckSquare, FileText, ArrowRight } from 'lucide-react';

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const getIcon = () => {
    switch (result.type) {
      case 'subject': return <BookOpen className="h-5 w-5" />;
      case 'topic': return <Hash className="h-5 w-5" />;
      case 'task': return <CheckSquare className="h-5 w-5" />;
      case 'note': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getBadgeStyle = () => {
    switch (result.type) {
      case 'subject': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'topic': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'task': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'note': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="group relative p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${getBadgeStyle()}`}>
            {getIcon()}
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {result.title}
          </h3>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getBadgeStyle()}`}>
          {result.type}
        </span>
      </div>

      {result.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 pl-12">
          {result.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 pl-12">
        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Added {new Date(result.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
        <div className="flex items-center text-blue-600 dark:text-blue-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transform duration-200">
          View details <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </div>
  );
}
