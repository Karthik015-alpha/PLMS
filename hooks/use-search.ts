import { useState, useCallback, useEffect, useRef } from 'react';
import { SearchResult } from '@/types/search';
import { GlobalSearchPayload, SearchFiltersInput, SearchPaginationInput } from '@/features/search/search.types';

export interface UnifiedSearchResults {
  subjects: SearchResult[];
  topics: SearchResult[];
  tasks: SearchResult[];
  notes: SearchResult[];
  totalCount: number;
}

/**
 * Custom hook to abstract complex debounced global search lookups.
 */
export function useSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersInput>({});
  const [pagination, setPagination] = useState<SearchPaginationInput>({ page: 1, limit: 20 });
  
  const [results, setResults] = useState<UnifiedSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = async (
    currentQuery: string, 
    currentFilters: SearchFiltersInput, 
    currentPagination: SearchPaginationInput
  ) => {
    // If the query is empty or less than the required validation length (2), abort early.
    if (!currentQuery.trim() || currentQuery.trim().length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: GlobalSearchPayload = {
        query: currentQuery.trim(),
        filters: currentFilters,
        pagination: currentPagination,
      };

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details?._errors?.[0] || 'An error occurred during search.');
      }

      // Assert typing since we built the backend to match UnifiedSearchResults natively.
      setResults(data.data as UnifiedSearchResults);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message || 'An unknown error occurred.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Primary side-effect trigger:
   * Re-evaluates whenever query or filters change, debouncing HTTP requests securely.
   */
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Optimistic loading state indicating we are actively debouncing input.
    if (query.trim().length >= 2) {
      setIsLoading(true);
    }

    timeoutRef.current = setTimeout(() => {
      performSearch(query, filters, pagination);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, filters, pagination, debounceMs]);

  /**
   * Helper to merge new filters cleanly and reset pagination back to page 1 to prevent empty views.
   */
  const updateFilters = useCallback((newFilters: Partial<SearchFiltersInput>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return {
    query,
    setQuery,
    filters,
    updateFilters,
    pagination,
    setPagination,
    results,
    isLoading,
    error,
  };
}
