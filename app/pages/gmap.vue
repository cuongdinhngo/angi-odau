<template>
  <v-container fluid min-height="100vh">
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12">
        <h1>Google Map Sample</h1>
        <div id="gmap" style="width: 100%; min-height: 100vh;"></div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

// Sample restaurant data
const restaurants = [
  { name: 'Bún Chả Cá Bà Lữ', lat: 16.06778, lng: 108.22083 },
  { name: 'Mì Quảng Bà Mua', lat: 16.06111, lng: 108.21278 },
  { name: 'Bánh Xèo Bà Dưỡng', lat: 16.06194, lng: 108.21389 },
  { name: 'Cơm Gà A Hải', lat: 16.07000, lng: 108.22444 },
  { name: 'Chè Liên', lat: 16.07333, lng: 108.21917 },
];


const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

onMounted(() => {
  console.log('Google Maps API Key:', GOOGLE_MAPS_API_KEY);
  const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['marker']
  });
  loader.load().then(() => {
    initMap();
  });
});

function initMap() {
  // Try to center on user's location, fallback to Da Nang
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const center = { lat: latitude, lng: longitude };
        const map = new google.maps.Map(document.getElementById('gmap'), {
          center,
          zoom: 15,
          mapId: GOOGLE_MAPS_ID,
          gestureHandling: 'greedy',
        });
        // Add restaurant markers
        restaurants.forEach(r => {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: r.lat, lng: r.lng },
            map,
            title: r.name,
          });
          const infowindow = new google.maps.InfoWindow({
            content: `<strong>${r.name}</strong>`
          });
          marker.addListener('click', () => {
            infowindow.open(map, marker);
          });
        });
        // Custom blue star SVG icon for current location
        const blueStar = document.createElement('div');
        blueStar.innerHTML = `
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,5 24.755,15.45 36,15.45 27.122,22.36 30.877,32.81 20,26.9 9.123,32.81 12.878,22.36 4,15.45 15.245,15.45" fill="#4285F4" stroke="#fff" stroke-width="2"/>
          </svg>
        `;
        const userMarker = new google.maps.marker.AdvancedMarkerElement({
          position: center,
          map,
          title: 'Your Location',
          content: blueStar,
        });
        const info = new google.maps.InfoWindow({ content: '<strong>Your Location</strong>' });
        userMarker.addListener('click', () => {
          info.open(map, userMarker);
        });
      },
      (err) => {
        // If denied or error, fallback to Da Nang
        const center = { lat: 16.06778, lng: 108.22083 };
        const map = new google.maps.Map(document.getElementById('gmap'), {
          center,
          zoom: 17,
          mapId: GOOGLE_MAPS_ID,
          gestureHandling: 'greedy',
        });
        // Add restaurant markers
        restaurants.forEach(r => {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: r.lat, lng: r.lng },
            map,
            title: r.name,
          });
          const infowindow = new google.maps.InfoWindow({
            content: `<strong>${r.name}</strong>`
          });
          marker.addListener('click', () => {
            infowindow.open(map, marker);
          });
        });
      }
    );
  } else {
    // If geolocation not supported, fallback to Da Nang
    const center = { lat: 16.06778, lng: 108.22083 };
    const map = new google.maps.Map(document.getElementById('gmap'), {
      center,
      zoom: 17,
      mapId: GOOGLE_MAPS_ID,
      gestureHandling: 'greedy',
    });
    // Add restaurant markers
    restaurants.forEach(r => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: r.lat, lng: r.lng },
        map,
        title: r.name,
      });
      const infowindow = new google.maps.InfoWindow({
        content: `<strong>${r.name}</strong>`
      });
      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });
    });
  }
}
</script>