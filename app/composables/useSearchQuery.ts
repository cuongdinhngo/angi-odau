export interface SearchQuery {
  searchText: string;
  tags: string[];
  distance: number;
}

export const useSearchQuery = () => useState<SearchQuery>(
  'searchQuery',
  () => ({
    searchText: '',
    tags: [],
    distance: 0,
  })
);