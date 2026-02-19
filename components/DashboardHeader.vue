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
  <header class="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 p-1">
    <!-- Contextual Title -->
    <div>
      <h2 class="text-2xl font-black italic tracking-tighter uppercase"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        Pilotage <span class="text-accent-500">& Stratégie</span>
      </h2>
      <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mt-1">Évolutions mensuelles & Décisions
        critiques</p>
    </div>

    <!-- Actions Specific to the Dashboard -->
    <div class="flex items-center gap-4 w-full sm:w-auto justify-end">
      <!-- Bouton Nouvelle Partie (si game over) -->
      <button v-if="gameStore.gameOver"
        class="px-6 py-3.5 rounded-2xl bg-dark-800 text-dark-200 font-black uppercase text-[10px] tracking-widest border border-white/5 hover:bg-dark-700 transition-all"
        @click="resetGame">
        🔄 Restart
      </button>

      <!-- Bouton Passer au mois suivant -->
      <button :class="[
        'flex-1 sm:flex-none relative overflow-hidden font-black uppercase tracking-[0.2em] px-10 py-4 rounded-2xl transition-all duration-500 shadow-2xl',
        'flex items-center justify-center gap-3 text-[11px] italic',
        gameStore.gameOver
          ? 'bg-dark-800 text-dark-500 cursor-not-allowed opacity-50'
          : gameStore.isSimulating
            ? 'bg-accent-700 text-accent-200 cursor-wait'
            : 'bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:from-accent-500 hover:to-accent-400 shadow-glow-accent hover:shadow-lg active:scale-[0.97]',
      ]" :disabled="gameStore.isSimulating || gameStore.gameOver || gameStore.isPaused" @click="handleNextMonth">

        <div v-if="!gameStore.isSimulating && !gameStore.gameOver"
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-progress-shine pointer-events-none">
        </div>

        <span v-if="gameStore.isSimulating" class="animate-spin text-base">⏳</span>
        <span v-else class="text-xl">⏭️</span>

        <div class="flex flex-col items-start leading-none">
          <span class="text-[8px] opacity-70 mb-1">Passer au</span>
          <span>{{ gameStore.isSimulating ? 'Traitement...' : 'Prochain Mois' }}</span>
        </div>
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
