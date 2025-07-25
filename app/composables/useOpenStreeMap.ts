import type { Location } from '@/types/Map';

const OPENSTREETMAP_API = 'https://nominatim.openstreetmap.org/search';

export const useOpenStreetMap = () => {

  const getLatLongFromAddress = async (address: string): Promise<Location | null> => {
    const fullApiRequest = `${OPENSTREETMAP_API}?q=${encodeURIComponent(address)}&format=json`;
    try {
      const response = await fetch(fullApiRequest);
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  };

  return {
    getLatLongFromAddress,
  };
}