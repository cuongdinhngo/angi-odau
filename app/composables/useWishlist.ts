import type { Tables } from '@/types/database.types';

const tableName = 'wishlist';

const { insert, get, remove, update } = useCrud(tableName);

export const useWishlist = () => {
  const wishlist = ref<Tables<'food_places'>[]>([]);

  const loadWishlist = (userId: string) => {
    return useSupabaseClient().rpc('get_wishlist_places', { user_uuid: userId })
  };

  const removeFromWishlist = (placeId: string, userId: string) => {
    return useSupabaseClient().from(tableName).delete().eq('place_id', placeId).eq('user_id', userId);
  }

  return {
    wishlist,
    loadWishlist,
    insert,
    removeFromWishlist
  };
}