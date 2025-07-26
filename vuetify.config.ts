import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          highlight: '#319795',
          background: '#f0e7db',
          surface: '#F5F5F5',
          faceoff: '#BB86FC',
          badge: '#1976D2',
        }
      },
      dark: {
        colors: {
          primary: '#BB86FC',
          secondary: '#03DAC6',
          accent: '#03DAC5',
          error: '#CF6679',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          highlight: '#319795',
          background: '#121212',
          surface: '#1E1E1E',
          faceoff: '#319795',
          badge: '#1976D2',
        }
      }
    }
  },
  defaults: {
    VBtn: {
      class: 'text-none'
    }
  },
})