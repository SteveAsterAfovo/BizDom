<script setup lang="ts">
/**
 * ── DashboardHeader ──
 * En-tête : nom entreprise, mois, cycle économique, thème, bouton simulation
 */
import { useGameStore } from '~/stores/gameStore'
import { useCompanyStore } from '~/stores/companyStore'
import { useSimulation } from '~/composables/useSimulation'

const gameStore = useGameStore()
const companyStore = useCompanyStore()
const { simulateMonth, resetGame } = useSimulation()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}

function handleNextMonth() {
  if (!gameStore.isSimulating && !gameStore.gameOver) {
    simulateMonth()
  }
}

// Config du cycle économique
const cycleConfig = computed(() => {
  switch (companyStore.market.economicCycle) {
    case 'growth':
      return { label: 'Croissance', icon: '📈', color: 'text-gain-400 bg-gain-500/10 border-gain-500/20' }
    case 'recession':
      return { label: 'Récession', icon: '📉', color: 'text-loss-400 bg-loss-500/10 border-loss-500/20' }
    default:
      return { label: 'Stable', icon: '⚖️', color: 'text-dark-300 bg-dark-700/50 border-dark-600/30' }
  }
})
</script>

<template>
  <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 p-1">
    <!-- Infos de l'entreprise -->
    <div class="w-full md:w-auto">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <h1 class="text-3xl font-black italic tracking-tighter uppercase"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          {{ companyStore.company.name }}
        </h1>
        <span class="badge-accent text-[10px] font-black uppercase">{{ gameStore.formattedMonth }}</span>
        <!-- Badge cycle économique -->
        <span :class="['text-[10px] font-black uppercase px-2 py-0.5 rounded-md border', cycleConfig.color]">
          {{ cycleConfig.icon }} {{ cycleConfig.label }}
        </span>
      </div>
      <p class="flex items-center gap-2 flex-wrap text-sm"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">
        <span class="font-bold">Trésorerie :</span>
        <span :class="companyStore.cash >= 0 ? 'text-gain-500 font-black italic' : 'text-loss-500 font-black italic'">
          {{ formatCurrency(companyStore.cash) }}
        </span>
        <span class="hidden sm:inline text-dark-600">·</span>
        <span class="font-bold ml-0 sm:ml-0">Part de marché : </span>
        <span class="text-accent-500 font-black italic">{{ companyStore.playerMarketShare.toFixed(1) }}%</span>
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
      <!-- Bouton thème -->
      <button class="p-3 rounded-2xl transition-all duration-300 border flex items-center justify-center shadow-sm"
        :class="gameStore.darkMode ? 'bg-dark-850 border-dark-700 text-yellow-400 hover:bg-dark-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
        @click="gameStore.toggleDarkMode()" :title="gameStore.darkMode ? 'Mode clair' : 'Mode sombre'">
        {{ gameStore.darkMode ? '☀️' : '🌙' }}
      </button>

      <!-- Bouton Nouvelle Partie (si game over) -->
      <button v-if="gameStore.gameOver" class="btn-secondary whitespace-nowrap" @click="resetGame">
        🔄 Restart
      </button>

      <!-- Bouton Passer au mois suivant -->
      <button :class="[
        'flex-1 md:flex-none relative overflow-hidden font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl transition-all duration-300',
        'flex items-center justify-center gap-2 text-xs italic',
        gameStore.gameOver
          ? 'bg-dark-700 text-dark-500 cursor-not-allowed opacity-50'
          : gameStore.isSimulating
            ? 'bg-accent-700 text-accent-200 cursor-wait'
            : 'bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:from-accent-500 hover:to-accent-400 shadow-glow-accent hover:shadow-lg active:scale-[0.97]',
      ]" :disabled="gameStore.isSimulating || gameStore.gameOver" @click="handleNextMonth">
        <span v-if="gameStore.isSimulating" class="animate-spin">⏳</span>
        <span v-else class="text-lg">⏭️</span>
        {{ gameStore.isSimulating ? 'Processing...' : gameStore.gameOver ? 'KO' : 'Month' }}
      </button>
    </div>
  </header>

  <!-- Alerte Game Over -->
  <div v-if="gameStore.gameOver"
    class="mb-8 p-6 rounded-3xl bg-loss-600/10 border border-loss-500/30 text-loss-500 animate-slide-up flex flex-col sm:flex-row items-center gap-4">
    <div class="w-12 h-12 rounded-2xl bg-loss-500 flex items-center justify-center text-white text-2xl">💀</div>
    <div class="text-center sm:text-left">
      <p class="font-black uppercase tracking-tighter italic text-xl">Game Over : Faillite !</p>
      <p class="text-sm font-bold opacity-80 mt-1">Votre entreprise a épuisé ses fonds stratégiques.</p>
    </div>
  </div>
</template>
