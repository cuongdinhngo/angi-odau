export interface FoodPlace {
  id: string|number;
  name: string;
  address?: string;
  description?: string;
  lat: number;
  lng: number;
  image?: string;
  openTime?: string;
  closeTime?: string;
  tags?: string[];
}

export const useFoodPlaces = () => {
  const foodPlaces = ref<FoodPlace[]>([]);


  const loadFoodPlaces = async () => {
    // Dynamic import for Vite compatibility
    const data = await import('../storages/places.json');
    console.log('Loaded food places:', data);
    foodPlaces.value = data.default as FoodPlace[];
  };

  loadFoodPlaces();

  const getFoodPlaceById = (id: string): FoodPlace | undefined => {
    return foodPlaces.value.find(place => place.id === id);
  };

  return {
    foodPlaces,
    getFoodPlaceById,
  };
}