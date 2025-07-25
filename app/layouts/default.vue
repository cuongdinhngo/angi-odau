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
      <v-btn
        icon="mdi-map-marker-radius-outline"
      ></v-btn>
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
const navMenu = ref(true);
</script>