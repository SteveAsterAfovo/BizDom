<script setup lang="ts">
/**
 * ── Layout Default ──
 * Layout principal avec sidebar navigable, AchievementToast global
 */
import { useSimulation } from '~/composables/useSimulation'
import { useCompanyStore } from '~/stores/companyStore'

const isSidebarOpen = ref(true)
const { startRealTimeSimulation } = useSimulation()
const companyStore = useCompanyStore()

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
  { to: '/dg', icon: '🏛️', label: 'Hub DG' },
  { to: '/employees', icon: '👥', label: 'Employés' },
  { to: '/management/equipment', icon: '🖥️', label: 'Équipement' },
  { to: '/management/equity', icon: '💰', label: 'Finance' },
  { to: '/management/quests', icon: '🎯', label: 'Quêtes' },
  { to: '/reports', icon: '📋', label: 'Rapports' },
  { to: '/achievements', icon: '🏆', label: 'Succès' },
]
</script>

<template>
  <div class="min-h-screen bg-dark-950 flex">
    <!-- ── Sidebar ── -->
    <aside :class="[
      'flex flex-col bg-dark-900 border-r border-dark-800/50 transition-all duration-300',
      isSidebarOpen ? 'w-56' : 'w-16',
    ]">
      <!-- Logo / Header -->
      <div class="p-4 flex items-center gap-3 border-b border-dark-800/50">
        <button class="text-2xl flex-shrink-0" @click="isSidebarOpen = !isSidebarOpen" title="Toggle sidebar">
          🎮
        </button>
        <Transition name="fade">
          <span v-if="isSidebarOpen" class="text-white font-black text-xl tracking-wider">
            BIZDOM
          </span>
        </Transition>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 space-y-1 px-2">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          'hover:bg-dark-800/60 hover:text-white',
          $route.path === link.to
            ? 'bg-accent-600/20 text-accent-400'
            : 'text-dark-400',
        ]">
          <span class="text-lg flex-shrink-0">{{ link.icon }}</span>
          <Transition name="fade">
            <span v-if="isSidebarOpen">{{ link.label }}</span>
          </Transition>
        </NuxtLink>
      </nav>

      <!-- CEO Profile / Stats -->
      <div v-if="companyStore.company.isConfigured" class="mt-auto p-4 border-t border-dark-800/50 bg-dark-950/20">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-accent-600/20 border border-accent-500/30 flex items-center justify-center text-xl shadow-glow-accent/5">
            {{ getCEOIcon(companyStore.company.ceo?.appearance) }}
          </div>
          <Transition name="fade">
            <div v-if="isSidebarOpen" class="overflow-hidden">
              <p class="text-xs font-black text-white truncate italic">{{ companyStore.company.ceo?.firstName }} {{
                companyStore.company.ceo?.lastName }}</p>
              <p class="text-[9px] text-accent-500 font-bold uppercase truncate tracking-widest">{{
                companyStore.company.name }}</p>
            </div>
          </Transition>
        </div>
      </div>

      <div v-if="isSidebarOpen" class="p-4 border-t border-dark-800/50 text-center">
        <p class="text-[10px] text-accent-500 font-black uppercase tracking-[0.2em]">BIZDOM v6.0</p>
        <p class="text-[8px] text-dark-600 mt-1 uppercase font-bold">Inception Edition</p>
      </div>
    </aside>

    <!-- ── Contenu principal ── -->
    <main class="flex-1 p-6 lg:p-8 overflow-y-auto max-h-screen">
      <slot />
    </main>

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
</style>
