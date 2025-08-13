import type { Location } from '@/types/Map';

export const userFreeAPIs = () => {
  const config = useRuntimeConfig();

  // Get address by IP using ipinfo.io
  const getLatLngByIP = async (): Promise<Location | null> => {
    try {
      const response = await fetch(`https://ipinfo.io/json?token=${config.ipInfoToken}`);
      const data = await response.json();
      if (data && data.loc) {
        const [lat, lng] = data.loc.split(',').map(Number);
        return { lat, lng };
      }
      return null;
    } catch (error) {
      console.error('[FreeAPIs] getLatLngByIP: ', error);
      return null;
    }
  }

  return {
    getLatLngByIP,
  }
}