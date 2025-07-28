export interface FoodPlace {
  id: string|number;
  name: string;
  alias?: string;
  address?: string;
  description?: string;
  lat: number;
  lng: number;
  photo?: string;
  openTime?: string;
  closeTime?: string;
  tags?: string[];
}

const { get, insert, update, remove, upsert } = useCrud('food_places');

export const useFoodPlaces = () => {
  const foodPlaces = ref<FoodPlace[]>([]);

  const getFoodPlaceById = (id: string): FoodPlace | undefined => {
    return foodPlaces.value.find(place => place.id === id);
  };

  return {
    foodPlaces,
    getFoodPlaceById,
    insert
  };
}