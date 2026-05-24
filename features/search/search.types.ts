import { SearchResult } from '@/types/search';

// ==================================================
// FILTER & PAYLOAD TYPES
// ==================================================

/**
 * Standard pagination interface supporting generic slice/offset implementations.
 */
export interface SearchPaginationInput {
  page?: number;
  limit?: number;
}

/**
 * Aggregated global filters allowing intersection criteria constraints.
 */
export interface SearchFiltersInput {
  subjects?: string[];
  topics?: string[];
  taskStatuses?: string[];
  noteTypes?: string[];
}

/**
 * Payload sent to backend APIs to execute a universal global search.
 */
export interface GlobalSearchPayload {
  query: string;
  filters?: SearchFiltersInput;
  pagination?: SearchPaginationInput;
}

/**
 * Payload specifically scoped for searching subject resources.
 */
export interface SubjectSearchPayload {
  query: string;
  pagination?: SearchPaginationInput;
}

/**
 * Payload strictly typed for executing deep task lookups.
 */
export interface TaskSearchPayload {
  query: string;
  filters?: {
    subjects?: string[];
    topics?: string[];
    statuses?: string[];
  };
  pagination?: SearchPaginationInput;
}

// ==================================================
// COMPONENT PROP TYPES
// ==================================================

/**
 * Standard interface backing a dynamically rendering Search Result list.
 */
export interface SearchResultListProps {
  results: SearchResult[];
  isLoading?: boolean;
  onSelectResult?: (result: SearchResult) => void;
  emptyStateMessage?: string;
}

/**
 * Properties utilized by a standalone or global search input component.
 */
export interface SearchInputProps {
  initialQuery?: string;
  onSearch: (query: string, filters?: SearchFiltersInput) => Promise<void> | void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}
