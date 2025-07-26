<template>
  <v-app>
    <NavDrawer
      v-model="navMenu"
    />

    <v-app-bar
      app
      :class="['elevation-0 border-b-thin pb-1']"
    >
      <v-app-bar-nav-icon
        v-if="mdAndDown"
        @click="navMenu = !navMenu"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <!-- Search field -->
      <v-text-field
        append-inner-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        variant="outlined"
        density="compact"
        rounded="pill"
        flat
      />

      <v-btn
        icon="mdi-tune"
      ></v-btn>

      <!-- Distance filter -->
      <v-btn icon>
        <v-icon icon="mdi-map-marker-radius-outline" size="large"/>
        <v-menu activator="parent" :close-on-content-click="false">
          <v-card width="300" class="py-2">
            <v-card-title class="text-subtitle-1 font">Filter by Distance</v-card-title>
            <v-card-text class="">
              <v-slider
                v-model="distance"
                :max="3"
                :ticks="distanceLabels"
                show-ticks="always"
                step="1"
                tick-size="4"
              ></v-slider>
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="flat"
                color="primary"
                @click="getUserDistance"
              >Apply</v-btn>
              <v-btn
                variant="tonal"
                color="primary"
                @click="$emit('close')"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-account-circle-outline">
      </v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
const { mdAndDown } = useDisplay();
const searchQuery = useSearchQuery();
const { currentLocation, getCurrentLocation } = useLocations();

const navMenu = ref(false);
const distance = ref(0);

const distanceLabels = {
  0: '500m',
  1: '1km',
  2: '2km',
  3: '5km',
};
const mapDistance: Record<number, number> = {
  0: 500,
  1: 1000,
  2: 2000,
  3: 5000,
}

onMounted(async () => {
  await getCurrentLocation();
  if (currentLocation) {
    console.log('Current location:', currentLocation);
  } else {
    console.warn('Current location not available');
  }
});

async function getUserDistance() {
  searchQuery.value.distance = mapDistance[distance.value] ?? 0;
}
</script>