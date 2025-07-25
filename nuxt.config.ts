// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/leaflet', 'vuetify-nuxt-module'],
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
      googleMapsId: process.env.VITE_GOOGLE_MAPS_ID,
      ipInfoToken: process.env.VITE_IP_INFO_TOKEN,
    },
  },
})