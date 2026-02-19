<script setup lang="ts">
/**
 * ── Layout Default ──
 * Layout principal avec sidebar navigable, AchievementToast global
 */
import { useSimulation } from '~/composables/useSimulation'
import { useCompanyStore } from '~/stores/companyStore'

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const { startRealTimeSimulation } = useSimulation()
const companyStore = useCompanyStore()
const gameStore = useGameStore()

onMounted(() => {
  const saved = localStorage.getItem('bizdom_save_v1')
  if (saved) {
    const data = JSON.parse(saved)
    companyStore.$patch(data)
  }
})

const avatars = [
  { id: 'casual-1', icon: '👦' },
  { id: 'casual-2', icon: '👧' },
  { id: 'suit-1', icon: '👔' },
  { id: 'suit-2', icon: '👩‍💼' },
  { id: 'cyber', icon: '👨‍💻' },
]

function getCEOIcon(id?: string) {
  return avatars.find(a => a.id === id)?.icon || '👤'
}

onMounted(() => {
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
    :class="gameStore.darkMode ? 'bg-dark-950 text-white' : 'bg-slate-50 text-dark-900'">

    <!-- Overlay mobile -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
      @click="isMobileMenuOpen = false"></div>

    <!-- ── Sidebar ── -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-50 lg:relative flex flex-col transition-all duration-300 border-r',
      gameStore.darkMode ? 'bg-dark-900 border-dark-800/50' : 'bg-white border-slate-200',
      isSidebarOpen ? 'w-64' : 'w-20',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]">
      <!-- Logo / Header -->
      <div class="p-4 flex items-center justify-between border-b"
        :class="gameStore.darkMode ? 'border-dark-800/50' : 'border-slate-100'">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="text-2xl flex-shrink-0">🎮</div>
          <Transition name="fade">
            <span v-if="isSidebarOpen" class="font-black text-xl tracking-wider truncate"
              :class="gameStore.darkMode ? 'text-white' : 'text-dark-900'">
              BIZDOM
            </span>
          </Transition>
        </div>
        <button class="hidden lg:block p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          @click="isSidebarOpen = !isSidebarOpen" title="Toggle sidebar">
          <span class="text-dark-400">❮</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 space-y-1 px-3 overflow-y-auto custom-scrollbar">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group',
          $route.path === link.to
            ? 'bg-accent-600/10 text-accent-500 dark:text-accent-400'
            : gameStore.darkMode ? 'text-dark-400 hover:bg-dark-850 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-dark-900',
        ]" @click="isMobileMenuOpen = false">
          <span class="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">{{ link.icon }}</span>
          <Transition name="fade">
            <span v-if="isSidebarOpen" class="truncate">{{ link.label }}</span>
          </Transition>
        </NuxtLink>
      </nav>

      <!-- CEO Profile / Stats -->
      <div v-if="companyStore.company.isConfigured" class="mt-auto p-4 border-t"
        :class="gameStore.darkMode ? 'border-dark-800/50 bg-dark-950/20' : 'border-slate-100 bg-slate-50/50'">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border transition-all"
            :class="gameStore.darkMode ? 'bg-accent-600/20 border-accent-500/30 shadow-glow-accent/5' : 'bg-white border-slate-200'">
            {{ getCEOIcon(companyStore.company.ceo?.appearance) }}
          </div>
          <Transition name="fade">
            <div v-if="isSidebarOpen" class="overflow-hidden">
              <p class="text-[10px] font-black uppercase tracking-tight truncate italic"
                :class="gameStore.darkMode ? 'text-white' : 'text-dark-900'">
                {{ companyStore.company.ceo?.firstName }} {{ companyStore.company.ceo?.lastName }}
              </p>
              <p class="text-[9px] text-accent-500 font-bold uppercase truncate tracking-widest">
                {{ companyStore.company.name }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <div v-if="isSidebarOpen" class="p-4 border-t text-center"
        :class="gameStore.darkMode ? 'border-dark-800/50' : 'border-slate-100'">
        <p class="text-[10px] text-accent-500 font-black uppercase tracking-[0.2em]">BIZDOM v7.1</p>
        <p class="text-[8px] text-dark-600 dark:text-dark-500 mt-1 uppercase font-bold">Responsivness Update</p>
      </div>
    </aside>

    <!-- ── Contenu principal ── -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Top Bar Mobile -->
      <div class="lg:hidden p-4 flex items-center justify-between border-b z-30"
        :class="gameStore.darkMode ? 'bg-dark-900 border-dark-800' : 'bg-white border-slate-200'">
        <button @click="isMobileMenuOpen = true" class="text-2xl">
          ☰
        </button>
        <span class="font-black tracking-tighter italic">BIZDOM</span>
        <div class="w-8"></div> <!-- Spacer -->
      </div>

      <main class="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto custom-scrollbar">
        <slot />
      </main>
    </div>

    <!-- ── Composants globaux ── -->
    <EventModal />
    <AchievementToast />
    <QuestLog />
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
