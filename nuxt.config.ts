// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  // Configuration Tailwind
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  // Configuration de l'application
  app: {
    head: {
      title: 'BIZDOM — Simulation d\'Entreprise',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Jeu de simulation entrepreneuriale - Gérez votre entreprise et bâtissez votre empire !' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' },
      ],
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },
})
