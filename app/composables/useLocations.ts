export interface Location {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

const VIET_NAM = ['vietnam', 'việt nam'];
const OPEN_STREET_MAP = 'OpenStreetMap';
const GOOGLE_MAP = 'GoogleMap';

export const useLocations = (mode: string = OPEN_STREET_MAP) => {

  const currentMode = mode;
  const openStreetMap = useOpenStreetMap();
  const currentLocation = reactive<Location>({ lat: 0, lng: 0 });
  const config = useRuntimeConfig();
  const danangLocation = { lat: 16.0544, lng: 108.2022 };

    // Get address by IP using ipinfo.io
  const getLatLngByIP = async (): Promise<Location | null> => {
    try {
      const response = await fetch(`https://ipinfo.io/json?token=${config.public.ipInfoToken}`);
      const data = await response.json();
      if (data && data.loc) {
        const [lat, lng] = data.loc.split(',').map(Number);
        return { lat, lng };
      }
      return null;
    } catch (error) {
      console.error('[getLatLngByIP]', error);
      return null;
    }
  }

  const getCurrentLocation = async () => {
    if ('geolocation' in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            currentLocation.lat = position.coords.latitude;
            currentLocation.lng = position.coords.longitude;
            resolve({ lat: currentLocation.lat, lng: currentLocation.lng });
          },
          (error) => {
            reject(error);
          }
        );
      });
    } else {
      const currentLatLng = await getLatLngByIP();
      if (currentLatLng) {
        currentLocation.lat = currentLatLng.lat;
        currentLocation.lng = currentLatLng.lng;
      } else {
        console.warn('Could not get current location, using default (Da Nang)');
        currentLocation.lat = danangLocation.lat;
        currentLocation.lng = danangLocation.lng;
      }
    }
  }

  const getNearestLocation = (locations: Location[]): Location | null => {
    if (locations.length === 0) return null;

    const filteredLocations = locations.filter(loc => loc.lat !== null && loc.lng !== null);
    if (filteredLocations.length === 0) return null;

    let nearest = locations[0];
    let minDistance = Infinity;

    filteredLocations.forEach(location => {
      const distance = Math.sqrt(
        Math.pow(location.lat - currentLocation.lat, 2) +
        Math.pow(location.lng - currentLocation.lng, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = location;
      }
    });

    return nearest ?? null;
  }

  const getDistance = (loc1: Location, loc2: Location): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);
    const lat1 = toRad(loc1.lat);
    const lat2 = toRad(loc2.lat);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const getLatLongFromAddress = async (address: string): Promise<Location | null> => {
    try {
      switch (currentMode) {
        case OPEN_STREET_MAP:
          return await openStreetMap.getLatLongFromAddress(fullfillAddress(address));
        default:
          throw new Error(`Unsupported mode: ${currentMode}`);
      }
    } catch (error) {
      console.error(`[getLatLongFromAddress] ${address}`, error);
      return null;
    }
  }

  const fullfillAddress = (address: string): string => {
    const hasVietnam = VIET_NAM.some(country => address.toLowerCase().includes(country));
    if (hasVietnam) return address;
    return `${address}, Vietnam`;
  }
  

  return {
    currentLocation,
    getCurrentLocation,
    getNearestLocation,
    getDistance,
    getLatLongFromAddress,
  };
}