// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  // The WebSocket client touches window/document/navigator at module load, so the
  // whole app runs as an SPA. This keeps the layered ws/ code untouched.
  ssr: false,

  // Keep the Feature-Sliced Design layout under src/ (@ -> src).
  srcDir: 'src',

  // Free up src/pages for the FSD "pages" layer; Nuxt routing lives in src/routes.
  dir: {
    pages: 'routes',
  },

  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt', '@vueuse/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Simple Chat',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Real-time chat app built with Nuxt + Nuxt UI' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },
})
