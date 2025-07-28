import type { Tables } from '@/types/database.types';

const tableName = 'favourites';

const { insert, get, remove, update } = useCrud(tableName);

export const useFavourites = () => {
  const favourites = ref<Tables<'food_places'>[]>([]);

  const loadFavouritePlaces = (userId: string) => {
    return useSupabaseClient().rpc('get_favourite_places', { user_uuid: userId })
  };

  const removeFromFavourites = (placeId: string, userId: string) => {
    return useSupabaseClient().from(tableName).delete().eq('place_id', placeId).eq('user_id', userId);
  }

  return {
    favourites,
    loadFavouritePlaces,
    insert,
    removeFromFavourites
  };
}