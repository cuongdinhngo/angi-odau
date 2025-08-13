import type { Location } from "~/types/Map";

export const useGoogleAPIs = () => {
  const config = useRuntimeConfig();
  const GOOGLE_MAP_API = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.public.googleMapApiKey}`;
  
  const getLatLongFromAddress = async (address: string): Promise<Location | null> => {
    console.log('[GOOGLE_MAP] Fetching location for address:', address);
    const fullApiRequest = `${GOOGLE_MAP_API}&address=${encodeURIComponent(address)}`;
    console.log('[GOOGLE_MAP] Full API Request:', fullApiRequest);
    try {
      const response = await fetch(fullApiRequest);
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('[GoogleMapAPI] Error fetching location:', error);
      return null;
    }
  };

  const getLatLngByIP = async (): Promise<Location | null> => {
    try {
      console.log('CONFIG => ', config.public);
      console.log('Fetching location by IP using Google Maps API');
      const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${config.public.googleMapApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          considerIp: true,
        }),
      });
      
      const data = await response.json();
      
      if (data && data.location) {
        console.log('Location fetched by IP:', data.location);
        return {
          lat: data.location.lat,
          lng: data.location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('[GoogleMapAPI] Error fetching location by IP:', error);
      return null;
    }
  };


  return {
    getLatLongFromAddress,
    getLatLngByIP
  }
}