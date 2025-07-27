export interface SearchQuery {
  searchText: string;
  tags: string[];
  distance: number;
  isWishlist?: boolean;
  isFavorite?: boolean;
}

export const useSearchQuery = () => useState<SearchQuery>(
  'searchQuery',
  () => ({
    searchText: '',
    tags: [],
    distance: 0,
    isWishlist: false,
    isFavorite: false,
  })
);

export const resetSearchQuery = () => {
  const searchQuery = useSearchQuery();
  searchQuery.value.searchText = '';
  searchQuery.value.tags = [];
  searchQuery.value.distance = 0;
  searchQuery.value.isWishlist = false;
  searchQuery.value.isFavorite = false;
}
