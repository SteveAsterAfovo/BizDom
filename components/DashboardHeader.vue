<script setup lang="ts">
/**
 * ── DashboardHeader ──
 * En-tête principal : nom de l'entreprise, mois courant, bouton simulation
 */
import { useGameStore } from '~/stores/gameStore'
import { useCompanyStore } from '~/stores/companyStore'
import { useSimulation } from '~/composables/useSimulation'

const gameStore = useGameStore()
const companyStore = useCompanyStore()
const { simulateMonth, resetGame } = useSimulation()

// Formater le cash en FCFA
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
</script>

<template>
  <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
    <!-- Infos de l'entreprise -->
    <div>
      <div class="flex items-center gap-3 mb-1">
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {{ companyStore.company.name }}
        </h1>
        <span class="badge-accent text-sm">{{ gameStore.formattedMonth }}</span>
      </div>
      <p class="text-dark-400 text-sm">
        Trésorerie : 
        <span 
          :class="companyStore.cash >= 0 ? 'text-gain-400 font-semibold' : 'text-loss-400 font-semibold'"
        >
          {{ formatCurrency(companyStore.cash) }}
        </span>
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <!-- Bouton Nouvelle Partie (si game over) -->
      <button
        v-if="gameStore.gameOver"
        class="btn-secondary"
        @click="resetGame"
      >
        🔄 Nouvelle Partie
      </button>

      <!-- Bouton Passer au mois suivant -->
      <button
        :class="[
          'relative overflow-hidden font-bold px-6 py-3 rounded-xl transition-all duration-300',
          'flex items-center gap-2 text-sm',
          gameStore.gameOver
            ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
            : gameStore.isSimulating
              ? 'bg-accent-700 text-accent-200 cursor-wait'
              : 'bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:from-accent-500 hover:to-accent-400 shadow-glow-accent hover:shadow-lg active:scale-[0.97]',
        ]"
        :disabled="gameStore.isSimulating || gameStore.gameOver"
        @click="handleNextMonth"
      >
        <span v-if="gameStore.isSimulating" class="animate-spin">⏳</span>
        <span v-else>⏩</span>
        {{ gameStore.isSimulating ? 'Simulation...' : gameStore.gameOver ? 'Faillite !' : 'Mois suivant' }}
      </button>
    </div>
  </header>

  <!-- Alerte Game Over -->
  <div
    v-if="gameStore.gameOver"
    class="mb-6 p-4 rounded-2xl bg-loss-600/20 border border-loss-500/30 text-loss-300 animate-fade-in"
  >
    <p class="font-bold text-lg">💀 Faillite !</p>
    <p class="text-sm mt-1">Votre entreprise n'a plus de fonds. Cliquez sur "Nouvelle Partie" pour recommencer.</p>
  </div>
</template>
