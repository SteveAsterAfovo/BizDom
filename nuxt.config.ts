// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    ['nuxt-gtag', {
      id: process.env.GTAG_ID || 'G-Q69BM5Q7MR',
      enabled: process.env.NODE_ENV === 'production'
    }],
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://bizdom.netlify.app',
    name: 'BIZDOM',
  },

  sitemap: {
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
      { label: 'Hreflangs', select: 'count(xhtml:link)', width: '25%' },
    ],
  },

  // Configuration Tailwind
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  // Configuration de l'application
  app: {
    head: {
      title: 'BIZDOM — Simulation d\'Entreprise',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Jeu de simulation entrepreneuriale - Gérez votre entreprise et bâtissez votre empire !' },
        { name: 'google-site-verification', content: 'OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' },
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://bizdom.netlify.app' }
      ],
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },
})
