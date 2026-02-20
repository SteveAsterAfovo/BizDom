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
  { value: 10, label: '10x' },
  { value: 20, label: '20x' },
]
</script>

<template>
  <div
    class="card p-4 sm:p-6 border rounded-[1.5rem] sm:rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12"
    :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

    <!-- Timer & Play State -->
    <div class="flex items-center gap-4 sm:gap-6 w-full lg:w-auto shrink-0 justify-between lg:justify-start">
      <div class="flex flex-col">
        <span class="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-dark-500 italic mb-1">Cycle
          Temporel</span>
        <div class="flex items-baseline gap-2">
          <span class="text-xl sm:text-2xl font-black italic tracking-tighter"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
            Jour {{ gameStore.currentDay }}
          </span>
          <span class="text-[10px] sm:text-xs font-black text-dark-600 italic">/ 30</span>
        </div>
      </div>

      <!-- Play/Pause Button (Premium Design) -->
      <button
        class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 relative group overflow-hidden border"
        :class="gameStore.isPaused
          ? (gameStore.darkMode ? 'bg-gain-500/10 text-gain-400 border-gain-500/20' : 'bg-gain-50 text-gain-600 border-gain-200')
          : (gameStore.darkMode ? 'bg-accent-500/10 text-accent-400 border-accent-500/20 shadow-glow-accent/20' : 'bg-accent-50 text-accent-600 border-accent-200')"
        @click="gameStore.togglePause">

        <!-- Ripple effect simulator -->
        <div class="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 transition-opacity"></div>

        <span v-if="gameStore.isPaused" class="text-xl sm:text-2xl relative z-10 translate-x-0.5">▶</span>
        <span v-else class="text-xl sm:text-2xl relative z-10 italic font-black">||</span>
      </button>
    </div>

    <!-- Central Progress Bar -->
    <div class="flex-1 w-full relative">
      <div class="flex items-center justify-between mb-2 sm:mb-3">
        <span class="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-dark-500">Flux de
          production</span>
        <span class="text-[9px] sm:text-[10px] font-black italic text-accent-500 uppercase">{{
          gameStore.monthProgress.toFixed(0)
          }}%</span>
      </div>
      <div class="h-2.5 sm:h-3.5 w-full rounded-full border p-0.5 shadow-inner transition-all duration-500"
        :class="gameStore.darkMode ? 'bg-dark-950 border-white/5' : 'bg-slate-100 border-slate-200'">
        <div
          class="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400 shadow-glow-accent transition-all duration-1000 relative overflow-hidden"
          :style="{ width: `${gameStore.monthProgress}%` }">
          <!-- Animated shine -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-progress-shine">
          </div>
        </div>
      </div>
    </div>

    <!-- Speed Selector (Advanced Utility) -->
    <div class="w-full lg:w-auto overflow-x-auto custom-scrollbar-hide">
      <div
        class="flex items-center sm:grid sm:grid-cols-5 lg:flex gap-1 sm:gap-2 lg:gap-3 bg-dark-500/5 p-1 rounded-xl sm:rounded-2xl border transition-all"
        :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-200'">
        <button v-for="s in speeds" :key="s.value"
          class="flex-1 min-w-[38px] px-1 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black italic uppercase tracking-tighter transition-all"
          :class="gameStore.gameSpeed === s.value
            ? 'bg-accent-500 text-white shadow-glow-accent'
            : (gameStore.darkMode ? 'text-dark-500 hover:text-white' : 'text-slate-500 hover:text-slate-900')"
          @click="gameStore.setSpeed(s.value)">
          {{ s.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress-shine {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(200%);
  }
}

.animate-progress-shine {
  animation: progress-shine 2s infinite linear;
}
</style>
