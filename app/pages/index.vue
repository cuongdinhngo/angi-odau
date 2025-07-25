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
            v-for="(restaurant, idx) in foodPlaces"
            :key="idx"
            :lat-lng="[restaurant.lat, restaurant.lng]"
          >
            <LPopup>
              <div style="min-width:200px;max-width:250px;display:flex;flex-direction:column;align-items:center;">
                <img :src="restaurant.image" alt="Image" style="width:100%;height:100px;object-fit:cover;border-radius:8px;box-shadow:0 2px 8px #0002;" />
                <h3 style="margin:8px 0 4px 0;font-size:1.1em;">{{ restaurant.name }}</h3>
                <p style="margin:0;font-size:0.95em;color:#555;">{{ restaurant.description }}</p>
                <p v-if="restaurant.distance !== undefined" style="margin:0;font-size:0.95em;color:#1976d2;font-weight:bold;">
                  Distance: {{ restaurant.distance.toFixed(2) }} km
                </p>
              </div>
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

const { foodPlaces } = useFoodPlaces();
const { currentLocation, getCurrentLocation } = useLocations();

const mapCenter = ref<[number, number]>([0, 0]);

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
</script>