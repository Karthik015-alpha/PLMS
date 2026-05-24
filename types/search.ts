/**
 * Global Search Result entity type identifier.
 */
export type SearchResultType = 'subject' | 'topic' | 'task' | 'note';

/**
 * Universal interface representing a standardized Search Result item.
 * Allows polymorphic consumption of multiple modules within a single UI thread.
 */
export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  subjectId?: string;
  topicId?: string;
  createdAt: Date | string;
}

/**
 * Interface standardizing global pagination metadata specifically for search results.
 */
export interface SearchPaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
}

/**
 * Generic API response wrapper tailored for complex paginated search lookups.
 */
export interface SearchApiResponse<T> {
  success: boolean;
  data?: T;
  pagination?: SearchPaginationMetadata;
  error?: string;
  message?: string;
}

/**
 * Standard list response expected when a search is dispatched.
 */
export type SearchListResponse = SearchApiResponse<SearchResult[]>;
