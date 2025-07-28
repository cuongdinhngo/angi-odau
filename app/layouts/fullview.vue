<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row no-gutters>
          <v-col
            cols="12"
          >
            <div class="d-flex justify-center align-center" style="min-height: 100vh;">
              <slot />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>