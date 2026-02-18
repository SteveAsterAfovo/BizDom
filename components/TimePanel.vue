<script setup lang="ts">
/**
 * ── TimePanel ──
 * Contrôle du temps réel : Play/Pause, Vitesse, Progression du mois
 */
import { useGameStore } from '~/stores/gameStore'
import { useSimulation } from '~/composables/useSimulation'

const gameStore = useGameStore()
const { startRealTimeSimulation } = useSimulation()

// Démarrer la boucle au montage
onMounted(() => {
  startRealTimeSimulation()
})

const speeds = [
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 5, label: '5x' },
]
</script>

<template>
  <div
    class="card flex flex-col sm:flex-row items-center justify-between gap-4 p-4 !bg-dark-900/40 border-accent-500/10">
    <!-- État & Jour -->
    <div class="flex items-center gap-4">
      <div class="flex flex-col">
        <span class="text-[10px] text-dark-500 uppercase tracking-widest font-bold">Progression</span>
        <span class="text-white font-black text-xl flex items-center gap-2">
          Jour {{ gameStore.currentDay }} <span class="text-dark-600">/ 30</span>
        </span>
      </div>

      <!-- Bouton Play/Pause -->
      <button class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300" :class="gameStore.isPaused
        ? 'bg-gain-500/20 text-gain-400 hover:bg-gain-500/30'
        : 'bg-accent-500/20 text-accent-400 hover:bg-accent-500/30'" @click="gameStore.togglePause">
        <span v-if="gameStore.isPaused" class="text-2xl ml-1">▶️</span>
        <span v-else class="text-2xl">⏸️</span>
      </button>
    </div>

    <!-- Barre de progression -->
    <div class="flex-1 w-full max-w-md">
      <div class="h-3 bg-dark-800 rounded-full overflow-hidden border border-dark-700/30">
        <div class="h-full bg-gradient-to-r from-accent-600 to-accent-400 transition-all duration-300"
          :style="{ width: `${gameStore.monthProgress}%` }"></div>
      </div>
    </div>

    <!-- Sélecteur de vitesse -->
    <div class="flex bg-dark-800 p-1 rounded-xl border border-dark-700/50">
      <button v-for="s in speeds" :key="s.value" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all" :class="gameStore.gameSpeed === s.value
        ? 'bg-accent-600 text-white shadow-glow-accent'
        : 'text-dark-500 hover:text-dark-200'" @click="gameStore.setSpeed(s.value)">
        {{ s.label }}
      </button>
    </div>
  </div>
</template>
