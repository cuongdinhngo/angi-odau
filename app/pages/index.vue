<template>
  <v-container fluid class="pa-0" min-height="100vh">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="pa-0"
      >
        <LMap
          v-if="status === 'success' && currentLocation.lat && currentLocation.lng"
          style="width: 100%; min-height: 100vh;"
          :zoom="15"
          :center="mapCenter"
          :use-global-leaflet="false"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LMarker
            v-if="wantedPlaces.length"
            v-for="(place, idx) in wantedPlaces"
            :key="idx"
            :lat-lng="[place?.lat, place?.lng]"
          >
            <LPopup>
              <v-card class="pa-0 rounded-lg text-center elevation-0 bg-transparent">
                <v-img
                  :src="getPlacePhotoUrl(place.photo)"
                  rounded="lg"
                  width="100px"
                  height="100px"
                  class="mx-auto"
                  cover
                ></v-img>
                <v-card-title class="text-subtitle-1 font-weight-bold pb-0">{{ place.name }}</v-card-title>
                <v-card-text class="my-1 text-subtitle-2">
                  <p v-if="place.address" class="py-1 ma-0">{{ place.address }}</p>
                  <p v-if="place.description" class="py-1 ma-0">{{ place.description }}</p>
                  <p v-if="place.distance" class="py-1 ma-0">Distance: <span class="font-weight-bold">{{ place.distance ? place.distance.toFixed(2) : 'N/A' }} km</span></p>
                </v-card-text>
              </v-card>
            </LPopup>
          </LMarker>
          <!-- User's current location marker -->
          <LMarker :lat-lng="[currentLocation.lat, currentLocation.lng]" :icon="userIcon">
            <LTooltip>You are here</LTooltip>
          </LMarker>
        </LMap>
      </v-col>

    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import L from 'leaflet';
import type { Tables } from '@/types/database.types';
import type { Location } from '@/types/Map';

const { currentLocation, getCurrentLocation, getDistance } = useLocations();

const supabase = useSupabaseClient();
const searchQuery = useSearchQuery();
const mapCenter = ref<[number, number]>([0, 0]);

type FoodPlaceWithDistance = Tables<'food_places'> & { distance?: number };
const wantedPlaces = ref<FoodPlaceWithDistance[]>([]);

// Custom icon for user location
const userIcon = L.icon({
  iconUrl: iconPath('location.png'),
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const { status } = useAsyncData(async () => {
  // Get current location
  await getCurrentLocation();
  // Set map center to user's current location
  mapCenter.value = [currentLocation.lat, currentLocation.lng];
});

watch(
  () => searchQuery,
  async (newSearchQueries) => {
    console.log('Search query changed:', newSearchQueries.value);
    if (newSearchQueries.value.distance) {
      const { data, error } = await supabase.rpc('food_places_within_distance', {
        user_lat: currentLocation.lat,
        user_lng: currentLocation.lng,
        radius: newSearchQueries.value.distance,
      });
      if (error) {
        console.error('Error fetching places:', error);
        wantedPlaces.value = [];
      } else {
        wantedPlaces.value = data ?? [];
        // Calculate distance for each place
        wantedPlaces.value.forEach(place => {
          place.distance = getDistance(
            currentLocation,
            { lat: place.lat, lng: place.lng } as Location
          );
        });
        console.log('Fetched places:', wantedPlaces.value);
      }
    }
  },
  { immediate: true, deep: true }
);
</script>