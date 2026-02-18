<script setup lang="ts">
/**
 * ── Layout Principal ──
 * Sidebar de navigation + zone de contenu principale
 * Design sombre premium avec sidebar rétractable
 */

const route = useRoute()

// État de la sidebar (rétractable)
const sidebarCollapsed = ref(false)

// Navigation du jeu
const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊', description: 'Vue d\'ensemble' },
  { path: '/employees', label: 'Employés', icon: '👥', description: 'Gestion du personnel' },
  { path: '/reports', label: 'Rapports', icon: '📈', description: 'Historique mensuel' },
]

// Vérifier si un lien est actif
function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <div class="flex min-h-screen bg-dark-950">
    <!-- ── Sidebar ── -->
    <aside
      :class="[
        'fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-out',
        'bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50',
        sidebarCollapsed ? 'w-20' : 'w-64',
      ]"
    >
      <!-- Logo & titre -->
      <div class="flex items-center gap-3 px-5 py-6 border-b border-dark-700/50">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-xl font-black shadow-glow-accent flex-shrink-0">
          B
        </div>
        <Transition name="fade">
          <div v-if="!sidebarCollapsed" class="overflow-hidden">
            <h1 class="text-lg font-bold tracking-tight text-white">BIZDOM</h1>
            <p class="text-xs text-dark-400">Simulation d'entreprise</p>
          </div>
        </Transition>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
            isActive(item.path)
              ? 'bg-accent-600/20 text-accent-400 shadow-glow-accent'
              : 'text-dark-300 hover:bg-dark-800/60 hover:text-dark-100',
          ]"
        >
          <span class="text-xl flex-shrink-0 w-8 text-center">{{ item.icon }}</span>
          <Transition name="fade">
            <div v-if="!sidebarCollapsed" class="overflow-hidden">
              <span class="font-medium text-sm">{{ item.label }}</span>
              <p class="text-xs text-dark-500 group-hover:text-dark-400">{{ item.description }}</p>
            </div>
          </Transition>
          <!-- Indicateur actif -->
          <div
            v-if="isActive(item.path)"
            class="absolute right-0 w-1 h-8 bg-accent-500 rounded-l-full"
          />
        </NuxtLink>
      </nav>

      <!-- Bouton collapse -->
      <button
        class="mx-3 mb-4 p-2.5 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 transition-all duration-200 flex items-center justify-center"
        @click="sidebarCollapsed = !sidebarCollapsed"
      >
        <span
          :class="[
            'text-lg transition-transform duration-300',
            sidebarCollapsed ? 'rotate-180' : '',
          ]"
        >
          ◀
        </span>
      </button>
    </aside>

    <!-- ── Contenu Principal ── -->
    <main
      :class="[
        'flex-1 transition-all duration-300 min-h-screen',
        sidebarCollapsed ? 'ml-20' : 'ml-64',
      ]"
    >
      <div class="p-6 lg:p-8 max-w-7xl mx-auto">
        <slot />
      </div>
    </main>

    <!-- ── EventModal global ── -->
    <EventModal />
  </div>
</template>

<style scoped>
/* Transitions pour le texte de la sidebar */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
