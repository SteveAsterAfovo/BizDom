<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const heroImagePath = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600";
const baseUrl = "https://bizdom.netlify.app";

useSeoMeta({
  title: 'BIZDOM — Simulation d\'Entreprise',
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | BIZDOM` : 'BIZDOM - Simulation d\'Entreprise';
  },
  ogTitle: 'BIZDOM - Simulation d\'Entreprise',
  description: 'Jeu de simulation entrepreneuriale - Gérez votre entreprise et bâtissez votre empire !',
  ogDescription: 'Jeu de simulation entrepreneuriale - Gérez votre entreprise et bâtissez votre empire !',
  ogImage: heroImagePath,
  ogUrl: baseUrl,
  ogType: 'website',
  ogLocale: 'fr_FR',
  ogSiteName: 'BIZDOM',
  twitterCard: 'summary_large_image',
  twitterTitle: 'BIZDOM - Simulation d\'Entreprise',
  twitterDescription: 'Jeu de simulation entrepreneuriale - Gérez votre entreprise et bâtissez votre empire !',
  twitterImage: heroImagePath,
})

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>
