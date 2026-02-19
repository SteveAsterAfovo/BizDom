<script setup lang="ts">
/**
 * ── Layout Default ──
 * Layout principal avec sidebar navigable, AchievementToast global
 */
import { useSimulation } from '~/composables/useSimulation'
import { useCompanyStore } from '~/stores/companyStore'

const { startRealTimeSimulation } = useSimulation()
const companyStore = useCompanyStore()
const gameStore = useGameStore()

onMounted(() => {
  // Initialisation des préférences (Dark Mode, Sidebar)
  gameStore.initializePreferences()

  // Chargement de la sauvegarde
  const saved = localStorage.getItem('bizdom_save_v1')
  if (saved) {
    const data = JSON.parse(saved)
    companyStore.$patch(data)
  }

  startRealTimeSimulation()
})

const navLinks = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/dg', icon: '🏛️', label: 'Directeur Général' },
  { to: '/management/equity', icon: '💰', label: 'Finance' },
  { to: '/management/governance', icon: '⚖️', label: 'Gouvernance' },
  { to: '/management/projects', icon: '🛠️', label: 'Projets Production' },
  { to: '/employees', icon: '👥', label: 'RH & Equipes' },
  { to: '/management/market', icon: '🎯', label: 'Marketing' },
  { to: '/management/bank', icon: '🏦', label: 'Ma Banque' },
  { to: '/management/equipment', icon: '🖥️', label: 'Infrastructure' },
  { to: '/management/office', icon: '🏢', label: 'Siège Social' },
  { to: '/management/quests', icon: '🚀', label: 'Quêtes' },
  { to: '/reports', icon: '📋', label: 'Rapports' },
  { to: '/achievements', icon: '🏆', label: 'Succès' },
  { to: '/settings', icon: '⚙️', label: 'Paramètres' },
]
</script>

<template>
  <div class="min-h-screen transition-colors duration-300 flex"
    :class="gameStore.darkMode ? 'bg-dark-950 text-white' : 'bg-slate-100 text-dark-900'">

    <!-- Overlay mobile -->
    <div v-if="gameStore.isMobileMenuOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
      @click="gameStore.isMobileMenuOpen = false"></div>

    <!-- ── Sidebar ── -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-[60] lg:relative flex flex-col transition-all duration-300 border-r shadow-2xl lg:shadow-none',
      gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200',
      gameStore.isSidebarOpen ? 'w-64' : 'w-20',
      gameStore.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]">
      <!-- Logo / Header -->
      <div class="p-6 flex items-center justify-between border-b"
        :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="text-2xl flex-shrink-0">🎮</div>
          <Transition name="fade">
            <span v-if="gameStore.isSidebarOpen" class="font-black text-xl tracking-wider truncate"
              :class="gameStore.darkMode ? 'text-white' : 'text-dark-900'">
              BIZDOM
            </span>
          </Transition>
        </div>
        <button class="hidden lg:block p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          @click="gameStore.toggleSidebar()" title="Toggle sidebar">
          <span class="text-dark-400 rotate-0 transition-transform"
            :class="{ 'rotate-180': !gameStore.isSidebarOpen }">❮</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 space-y-1.5 px-3 overflow-y-auto custom-scrollbar">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" :class="[
          'flex items-center gap-3 px-3 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group',
          $route.path === link.to
            ? 'bg-accent-500 text-white shadow-glow-accent'
            : gameStore.darkMode ? 'text-dark-400 hover:bg-dark-850 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-dark-900',
        ]" @click="gameStore.isMobileMenuOpen = false">
          <span class="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">{{ link.icon }}</span>
          <Transition name="fade">
            <span v-if="gameStore.isSidebarOpen" class="truncate leading-none">{{ link.label }}</span>
          </Transition>
        </NuxtLink>
      </nav>

      <!-- Footer Version -->
      <div v-if="gameStore.isSidebarOpen" class="p-6 border-t text-center"
        :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
        <p class="text-[9px] text-accent-500 font-black uppercase tracking-[0.2em] animate-pulse">BIZDOM v7.2</p>
      </div>
    </aside>

    <!-- ── Contenu principal ── -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden overflow-y-auto custom-scrollbar">

      <!-- Global Header (Fixed) -->
      <GlobalHeader />

      <main class="flex-1 p-4 sm:p-6 lg:p-10 pt-24"> <!-- pt-24 to account for fixed GlobalHeader -->
        <slot />
      </main>

      <!-- ── Composants globaux ── -->
      <EventModal />
      <AchievementToast />
      <QuestLog />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.5);
  border-radius: 9999px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.5);
}
</style>
