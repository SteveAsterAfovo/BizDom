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

      <!-- Right: Dark Mode & Profile -->
      <div class="flex items-center gap-3 sm:gap-6">
        <!-- Dark Mode Toggle -->
        <button
          class="w-10 h-10 rounded-xl transition-all duration-300 border flex items-center justify-center shadow-sm"
          :class="gameStore.darkMode ? 'bg-dark-850 border-dark-700 text-yellow-400 hover:bg-dark-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'"
          @click="gameStore.toggleDarkMode()" :title="gameStore.darkMode ? 'Light Theme' : 'Dark Theme'">
          {{ gameStore.darkMode ? '☀️' : '🌙' }}
        </button>

        <!-- Profile Link -->
        <NuxtLink to="/settings" class="flex items-center gap-3 group">
          <div class="hidden sm:flex flex-col text-right">
            <p class="text-[10px] font-black uppercase tracking-tight italic leading-tight"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
              {{ companyStore.company.ceo?.firstName }} {{ companyStore.company.ceo?.lastName }}
            </p>
            <p class="text-[8px] text-accent-500 font-bold uppercase tracking-widest">ADMINISTRATEUR</p>
          </div>
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg border transition-all group-hover:scale-110 active:scale-95"
            :class="gameStore.darkMode ? 'bg-dark-850 border-white/10' : 'bg-white border-slate-200 shadow-sm'">
            {{ getCEOIcon(companyStore.company.ceo?.appearance) }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
