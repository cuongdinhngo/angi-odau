<template>
  <v-container fluid class="pa-0" min-height="100vh">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="pa-0"
      >

        <!-- Leaflet map component -->
        <LMap
          v-if="status === 'success' && currentLocation.lat && currentLocation.lng"
          style="width: 100%; min-height: 100vh;"
          :zoom="15"
          :center="mapCenter"
          :use-global-leaflet="false"
        >

          <!-- OpenStreetMap tile layer -->
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <!-- Markers for wanted places -->
          <LMarker
            v-if="wantedPlaces.length"
            v-for="(place, idx) in wantedPlaces"
            :key="idx"
            :lat-lng="[place?.lat, place?.lng]"
            :ref="el => setMarkerRef(place.id, el)"
          >
            <LTooltip>{{ place.name }}</LTooltip>

            <LPopup ref="popupRefs">
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
                <v-card-text class="pa-0 text-subtitle-2">
                  <p v-if="place.address" class="py-1 ma-0">{{ place.address }}</p>
                  <p v-if="place.description" class="py-1 ma-0">{{ place.description }}</p>
                  <p v-if="place.distance" class="py-1 ma-0">Distance: <span class="font-weight-bold">{{ place.distance ? place.distance.toFixed(2) : 'N/A' }} m</span></p>
                </v-card-text>
                <v-card-actions class="pa-0 d-flex justify-center ga-4">
                  <v-btn icon @click="handleWishlist(place)">
                    <v-icon color="red" :icon="place.isWishlist ? 'mdi-star' : 'mdi-star-outline'" />
                  </v-btn>
                  <v-btn icon>
                    <v-icon color="red" :icon="place.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" />
                  </v-btn>
                </v-card-actions>
              </v-card>
            </LPopup>
          </LMarker>

          <!-- User's current location marker -->
          <LMarker :lat-lng="[currentLocation.lat, currentLocation.lng]" :icon="userIcon">
            <LTooltip>You are here</LTooltip>
          </LMarker>

          <!-- Circle around user's location based on search distance -->
          <LCircle
            v-if="searchQuery.distance && currentLocation.lat && currentLocation.lng"
            :lat-lng="[currentLocation.lat, currentLocation.lng]"
            :radius="searchQuery.distance"
          />
        </LMap>
      </v-col>
    </v-row>
  </v-container>

  <!-- Bottom navigation drawer for wanted places -->
  <v-navigation-drawer
    v-model="sliders.visible"
    permanent
    location="bottom"
    :width="sliders.width"
  >
    <v-sheet
      class="mx-auto"
    >
      <div
        v-if="wantedPlaces.length"
        class="d-flex justify-center align-center" style="position: absolute; top: -28px; right: 0;"
      >
        <v-btn
          flat
          color="green"
          size="small"
          @click="sliders.width = sliders.width === 200 ? 10 : 200"
          tile
        >
          <v-icon :icon="sliders.width === 200 ? 'mdi-chevron-down' : 'mdi-chevron-up'" />
        </v-btn>
      </div>
      <v-slide-group
        center-active
        show-arrows
        class="align-center"
      >
        <v-slide-group-item
          v-for="(place, idx) in wantedPlaces"
          :key="idx"
          v-slot="{ isSelected, toggle }"
        >
          <v-card
            :color="isSelected ? 'primary' : 'grey-lighten-4'"
            class="ma-2 text-center rounded-lg"
            height="180"
            width="120"
            @click="showPlaceDetails(toggle, place)"
          >
            <v-responsive :aspect-ratio="1/1">
              <v-img
                :src="getPlacePhotoUrl(place.photo)"
                width="120"
                cover
                class="rounded-t-lg"
              ></v-img>
            </v-responsive>
            <v-card-title class="text-caption font-weight-bold pb-0 text-wrap">{{ place.name }}</v-card-title>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import L from 'leaflet';
import type { Tables } from '@/types/database.types';
import type { Location } from '@/types/Map';

type FoodPlaceWithDistance = Tables<'food_places'> & { distance?: number, isWishlist?: boolean, isFavorite?: boolean };

const { currentLocation, getCurrentLocation, getDistance } = useLocations();
const { loadWishlist, insert:addToWishlist, removeFromWishlist } = useWishlist();

const supabase = useSupabaseClient();
const searchQuery = useSearchQuery();
const mapCenter = ref<[number, number]>([0, 0]);
const route = useRoute();
const router = useRouter();
const authenticatedUser = useSupabaseUser();
const wantedPlaces = ref<FoodPlaceWithDistance[]>([]);
const sliders = reactive({
  visible: false,
  width: 200,
});
const markerRefs = ref({});


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

async function handleWishlist(place: FoodPlaceWithDistance) {
  if (!authenticatedUser.value) {
    // Redirect to login if user is not authenticated
    navigateTo({ name: 'login' });
    return;
  }

  if (place.isWishlist) {
    // Remove from wishlist
    await removeFromWishlist(
      place.id,
      authenticatedUser.value.id
    );
    place.isWishlist = false;
  } else {
    // Add to wishlist
    await addToWishlist({
      user_id: authenticatedUser.value.id,
      place_id: place.id,
    });
    place.isWishlist = true;
  }
}

// Capture reference when rendering
function setMarkerRef(id: number, el) {
  if (el) {
    markerRefs.value[id] = el;
  }
}

function showPlaceDetails(toggle: any, place: FoodPlaceWithDistance) {
  console.log('SHOWING marketRefs => ', markerRefs.value);
  toggle();
  mapCenter.value = [place.lat, place.lng] as [number, number];
  const marker = markerRefs.value[place.id]
  if (marker?.leafletObject) {
    marker.leafletObject.openPopup()
  }
}

watch(
  () => searchQuery,
  async (newSearchQueries) => {
    console.log('Search query changed:', newSearchQueries.value);
    let filters: {
      user_lat?: number,
      user_lng?: number,
      radius?: number,
      tags_filter?: any[],
      text_query?: string,
    } = {};


    // Build new query object based on search values
    const newQuery: Record<string, string> = {};
    if (newSearchQueries.value.distance) {
      filters.user_lat = currentLocation.lat;
      filters.user_lng = currentLocation.lng;
      filters.radius = newSearchQueries.value.distance;
      newQuery.distance = String(newSearchQueries.value.distance);
    }
    if (newSearchQueries.value.tags && newSearchQueries.value.tags.length > 0) {
      filters.tags_filter = newSearchQueries.value.tags;
      newQuery.tags = newSearchQueries.value.tags.join(',');
    }

    // Only update if query actually changed
    const currentQuery = { ...route.query };
    const queriesAreDifferent = JSON.stringify(currentQuery) !== JSON.stringify(newQuery);
    if (queriesAreDifferent) {
      router.replace({ query: newQuery });
    }

    // Fetch places based on filters distance OR tags OR text query
    if (filters.radius || filters.tags_filter || filters.text_query) {
      console.log('Fetching places with filters:', JSON.stringify(filters));
      const { data, error } = await supabase.rpc('search_food_places', filters);
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

    // If wishlist is requested, load wishlist items
    if (newSearchQueries.value.isWishlist && authenticatedUser.value?.id) {
      const { data: wishlist, error } = await loadWishlist(authenticatedUser.value.id);
      if (error) {
        console.error('Error loading wishlist:', error);
      } else {
        wantedPlaces.value = wishlist.map(place => ({
          ...place,
          distance: getDistance(
            currentLocation,
            { lat: place.lat, lng: place.lng } as Location
          ),
          isWishlist: true,
        }));
      }

    }

    // Update sliders visibility based on wanted places
    sliders.visible = wantedPlaces.value.length > 0;

    // Map center to your current location
    mapCenter.value = [currentLocation.lat, currentLocation.lng];

    console.log('Updated wanted places:', wantedPlaces.value.length);
  },
  { immediate: true, deep: true }
);
</script>