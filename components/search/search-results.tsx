import { SearchResult } from '@/types/search';
import { ResultCard } from './result-card';

export interface UnifiedSearchResults {
  subjects: SearchResult[];
  topics: SearchResult[];
  tasks: SearchResult[];
  notes: SearchResult[];
  totalCount: number;
}

interface SearchResultsProps {
  results: UnifiedSearchResults;
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Showing <span className="font-bold text-gray-900 dark:text-gray-100">{results.totalCount}</span> results
        </p>
      </div>

      {results.subjects.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            Subjects
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">{results.subjects.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {results.subjects.map(subject => <ResultCard key={subject.id} result={subject} />)}
          </div>
        </section>
      )}

      {results.topics.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            Topics
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">{results.topics.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {results.topics.map(topic => <ResultCard key={topic.id} result={topic} />)}
          </div>
        </section>
      )}

      {results.tasks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            Tasks
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">{results.tasks.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {results.tasks.map(task => <ResultCard key={task.id} result={task} />)}
          </div>
        </section>
      )}

      {results.notes.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            Notes
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">{results.notes.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {results.notes.map(note => <ResultCard key={note.id} result={note} />)}
          </div>
        </section>
      )}
    </div>
  );
}
