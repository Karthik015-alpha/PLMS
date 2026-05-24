"use client";

import { useSearch } from '@/hooks/use-search';
import { SearchResult } from '@/types/search';

export default function SearchPage() {
  const { query, setQuery, filters, updateFilters, results, isLoading, error } = useSearch(300);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Global Search</h1>
      
      {/* Search Input Box */}
      <div className="mb-8 relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search subjects, topics, tasks, or notes... (min 2 chars)"
          className="w-full p-4 pl-12 border border-gray-300 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <svg 
          className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Search Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm sticky top-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-5 border-b pb-3">Filters</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Task Status</h4>
              <div className="space-y-3">
                {['Pending', 'Completed', 'In Progress'].map(status => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-colors"
                      checked={(filters.taskStatuses || []).includes(status)}
                      onChange={(e) => {
                        const current = filters.taskStatuses || [];
                        if (e.target.checked) updateFilters({ taskStatuses: [...current, status] });
                        else updateFilters({ taskStatuses: current.filter(s => s !== status) });
                      }}
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">{status}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Search Results Display Area */}
        <div className="flex-1">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-100 border border-gray-200 rounded-xl"></div>
              ))}
            </div>
          ) : !results && query.trim().length >= 2 ? (
            <div className="flex justify-center items-center py-20 text-gray-500">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          ) : !results ? (
            <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Begin Typing to Search</h3>
              <p className="text-gray-500 mt-1">Enter at least 2 characters to search across your entire workspace.</p>
            </div>
          ) : results.totalCount === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No Results Found</h3>
              <p className="text-gray-500 mt-1">We couldn't find anything matching "{query}". Try adjusting your query or filters.</p>
            </div>
          ) : (
            <div className="space-y-10">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Found {results.totalCount} result{results.totalCount === 1 ? '' : 's'} across your workspace
              </p>

              {results.subjects.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Subjects</h2>
                  <div className="space-y-4">
                    {results.subjects.map(subject => <ResultCard key={subject.id} result={subject} />)}
                  </div>
                </section>
              )}

              {results.topics.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Topics</h2>
                  <div className="space-y-4">
                    {results.topics.map(topic => <ResultCard key={topic.id} result={topic} />)}
                  </div>
                </section>
              )}

              {results.tasks.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Tasks</h2>
                  <div className="space-y-4">
                    {results.tasks.map(task => <ResultCard key={task.id} result={task} />)}
                  </div>
                </section>
              )}

              {results.notes.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Notes</h2>
                  <div className="space-y-4">
                    {results.notes.map(note => <ResultCard key={note.id} result={note} />)}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: SearchResult }) {
  // Styling distinct label colors based on type context
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'subject': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'topic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'task': return 'bg-green-100 text-green-800 border-green-200';
      case 'note': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
          {result.title}
        </h4>
        <span className={`text-xs uppercase px-2.5 py-1 rounded-full font-semibold border ${getTypeColor(result.type)}`}>
          {result.type}
        </span>
      </div>
      
      {result.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {result.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Added {new Date(result.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 font-medium">View details &rarr;</span>
      </div>
    </div>
  );
}
