<script setup lang="ts">
/**
 * ── GlobalHeader ──
 * Header fixe regroupant les infos vitales de l'entreprise, 
 * le profil CEO et les contrôles globaux.
 */
import { useGameStore } from '~/stores/gameStore'
import { useCompanyStore } from '~/stores/companyStore'

const gameStore = useGameStore()
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}

// Config du cycle économique
const cycleConfig = computed(() => {
  switch (companyStore.market.economicCycle) {
    case 'growth':
      return { label: 'Croissance', icon: '📈', color: 'text-gain-400 bg-gain-500/10 border-gain-500/10' }
    case 'recession':
      return { label: 'Récession', icon: '📉', color: 'text-loss-400 bg-loss-500/10 border-loss-500/10' }
    default:
      return { label: 'Stable', icon: '⚖️', color: 'text-dark-400 bg-dark-700/20 border-dark-700/30' }
  }
})
</script>

<template>
  <header class="fixed top-0 right-0 left-0 lg:transition-all duration-300 z-40 border-b backdrop-blur-xl" :class="[
    gameStore.darkMode ? 'bg-dark-900/90 border-white/5' : 'bg-white/90 border-slate-200 shadow-sm',
    gameStore.isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
  ]">
    <div v-if="companyStore.company.isConfigured" class="px-4 sm:px-8 h-20 flex items-center justify-between gap-6">

      <!-- Left: Toggle Mobile & Company Stats -->
      <div class="flex items-center gap-4 sm:gap-6 overflow-hidden">
        <!-- Mobile Menu Toggle -->
        <button
          class="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all active:scale-95 shadow-sm border"
          :class="gameStore.darkMode ? 'bg-dark-850 border-white/5 text-white hover:bg-dark-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
          @click="gameStore.toggleMobileMenu()">
          ☰
        </button>

        <div class="hidden sm:flex flex-col">
          <h1 class="text-sm font-black italic tracking-tighter uppercase truncate max-w-[150px]"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
            {{ companyStore.company.name }}
          </h1>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[9px] font-black uppercase tracking-widest text-accent-500">{{ gameStore.formattedMonth
            }}</span>
            <span :class="['text-[8px] font-black uppercase px-1.5 py-0.5 rounded border', cycleConfig.color]">
              {{ cycleConfig.icon }} {{ cycleConfig.label }}
            </span>
          </div>
        </div>

        <!-- Cash Flow (Vital) -->
        <div class="flex flex-col items-center sm:items-start">
          <span class="text-[9px] font-black uppercase tracking-[0.2em] text-dark-500 italic">Trésorerie</span>
          <span class="text-xs sm:text-base font-black italic tracking-tighter"
            :class="companyStore.cash >= 0 ? 'text-gain-500' : 'text-loss-500'">
            {{ formatCurrency(companyStore.cash) }}
          </span>
        </div>
      </div>

      <!-- Right: Time Controls, Dark Mode & Profile -->
      <div class="flex items-center gap-2 sm:gap-6">
        <!-- Simulation Controls (Quick Access) -->
        <div
          class="flex items-center gap-1 sm:gap-2 bg-dark-500/5 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-white/5 overflow-hidden">
          <button @click="gameStore.togglePause"
            class="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center transition-all border shrink-0"
            :class="gameStore.isPaused
              ? 'bg-gain-500/10 text-gain-400 border-gain-500/20'
              : 'bg-accent-500/10 text-accent-400 border-accent-500/20'">
            {{ gameStore.isPaused ? '▶' : '||' }}
          </button>

          <!-- Vitesse (v9.1) -->
          <div
            class="flex items-center gap-0.5 bg-dark-950/20 rounded-md sm:rounded-lg p-0.5 border border-white/5 shrink-0">
            <button v-for="speed in [1, 2, 5, 10]" :key="speed" @click="gameStore.setSpeed(speed)"
              class="px-1 py-0.5 sm:px-1.5 sm:py-1 rounded-sm sm:rounded-md text-[6px] sm:text-[8px] font-black italic uppercase transition-all"
              :class="[
                gameStore.gameSpeed === speed ? 'bg-accent-500 text-white shadow-glow-accent' : 'text-dark-500 hover:text-white',
                speed > 2 ? 'hidden sm:block' : ''
              ]">
              {{ speed }}x
            </button>
          </div>

          <div class="hidden sm:flex flex-col px-1 sm:px-2 min-w-[35px] sm:min-w-[60px] shrink-0">
            <div
              class="flex justify-between text-[5px] sm:text-[8px] font-black uppercase tracking-widest text-dark-500 mb-0.5">
              <span>Cycle</span>
              <span>{{ gameStore.monthProgress.toFixed(0) }}%</span>
            </div>
            <div class="h-0.5 sm:h-1 bank-dark-950 rounded-full overflow-hidden flex border border-white/5">
              <div class="h-full bg-accent-500 shadow-glow-accent transition-all duration-1000"
                :style="{ width: `${gameStore.monthProgress}%` }"></div>
            </div>
          </div>
        </div>

        <!-- Dark Mode Toggle -->
        <button
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl transition-all duration-300 border flex items-center justify-center shadow-sm shrink-0"
          :class="gameStore.darkMode ? 'bg-dark-850 border-dark-700 text-yellow-400 hover:bg-dark-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'"
          @click="gameStore.toggleDarkMode()" :title="gameStore.darkMode ? 'Light Theme' : 'Dark Theme'">
          {{ gameStore.darkMode ? '☀️' : '🌙' }}
        </button>

        <!-- Profile Link -->
        <NuxtLink to="/settings" class="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div class="hidden lg:flex flex-col text-right">
            <span class="text-[10px] font-black uppercase tracking-widest leading-none mb-1"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
              {{ companyStore.company.ceo?.firstName }} {{ companyStore.company.ceo?.lastName }}
            </span>
            <span class="text-[8px] font-bold text-dark-500 uppercase tracking-tighter">Éditer Profil</span>
          </div>
          <div
            class="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent-600 to-accent-400 p-0.5 shadow-lg group-hover:scale-110 group-hover:shadow-glow-accent/30 transition-all duration-300">
            <div
              class="w-full h-full rounded-[7px] sm:rounded-[9px] bg-dark-900 flex items-center justify-center overflow-hidden border border-white/10 text-xl sm:text-2xl">
              {{ getCEOIcon(companyStore.company.ceo?.appearance) }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
