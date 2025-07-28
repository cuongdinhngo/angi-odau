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

      <!-- Distance filter -->
      <v-btn icon>
        <v-icon icon="mdi-map-marker-radius-outline" size="large"/>
        <v-menu
          activator="parent"
          :close-on-content-click="false"
        >
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

      <!-- Secret -->
      <v-btn
        icon
        @click="secretDialog = true"
      >
        <v-icon icon="mdi-gift-outline"/>
      </v-btn>

      <!-- User profile menu -->
      <v-btn icon>
        <v-icon icon="mdi-account-circle-outline"/>
        <v-menu
          activator="parent"
          :close-on-content-click="false"
        >
          <v-card
            v-if="!authenticatedUser"
            class="py-2"
          >
            <v-list
              density="compact"
              slim
            >
              <v-list-item
                prepend-icon="mdi-login"
                title="Login"
                @click="navigateTo('/login')"
              >
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-account-plus"
                title="Register"
                @click="navigateTo('/register')"
              >
              </v-list-item>
            </v-list>
          </v-card>
          <v-card
            v-else
            class="py-2"
          >
            <v-card-title class="text-subtitle-1 font-weight-bold">Hi! {{ user?.name }}</v-card-title>
            <v-divider></v-divider>
            <v-list
              density="compact"
              slim
            >
              <v-list-item
                title="Muốn thử"
                @click="handleSearchQuery('isWishlist')"
              >
                <template #prepend>
                  <v-icon color="amber" icon="mdi-star" />
                </template>
              </v-list-item>
              <v-list-item
                title="Yêu thích"
                @click="handleSearchQuery('isFavorite')"
              >
                <template #prepend>
                  <v-icon color="red" icon="mdi-heart" />
                </template>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-map-marker-plus"
                title="Add new place"
                @click="navigateTo('/profile')"
              >
                <template #prepend>
                  <v-icon color="blue" icon="mdi-map-marker-plus" />
                </template>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-logout"
                title="Logout"
                @click="logout()"
              >
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { resetSearchQuery } from '@/composables/useSearchQuery';

const { mdAndDown } = useDisplay();
const searchQuery = useSearchQuery();
const { currentLocation, getCurrentLocation } = useLocations();
const { user, get:getUserInfo } = useUsers();

const navMenu = ref(true);
const distance = ref(0);
const authenticatedUser = useSupabaseUser();

const secretDialog = ref(false);
provide('secretDialog', secretDialog);

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
  if (authenticatedUser) {
    const { data, error } = await getUserInfo(authenticatedUser.value.id);
    if (error) {
      console.error('Error fetching user info:', error);
    } else {
      user.value = data;
      console.log('Current User => ', authenticatedUser.value, user.value);
    }
  }
});

function handleSearchQuery(type: 'isWishlist' | 'isFavorite') {
  resetSearchQuery();
  searchQuery.value.isWishlist = type === 'isWishlist';
  searchQuery.value.isFavorite = type === 'isFavorite';
}

async function getUserDistance() {
  searchQuery.value.distance = mapDistance[distance.value] ?? 0;
  searchQuery.value.isWishlist = false;
  searchQuery.value.isFavorite = false;
}
</script>