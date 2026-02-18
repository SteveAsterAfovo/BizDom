<script setup lang="ts">
/**
 * ── EventModal (Notification Edition) ──
 * Désormais non-bloquante, s'affiche en haut à droite.
 */
import { useGameStore } from '~/stores/gameStore'

const gameStore = useGameStore()
const timer = ref<any>(null)

// Couleur selon le type d'événement
const eventStyle = computed(() => {
  if (!gameStore.currentEvent) return {}
  switch (gameStore.currentEvent.type) {
    case 'gain':
      return { bg: 'bg-gain-500/20', border: 'border-gain-500/40', text: 'text-gain-400', label: 'GAIN' }
    case 'loss':
      return { bg: 'bg-loss-500/20', border: 'border-loss-500/40', text: 'text-loss-400', label: 'PERTE' }
    case 'employee_departure':
      return { bg: 'bg-loss-600/20', border: 'border-loss-500/40', text: 'text-loss-400', label: 'CRISE RH' }
    case 'boost':
      return { bg: 'bg-accent-500/20', border: 'border-accent-500/40', text: 'text-accent-400', label: 'BOOST' }
    default:
      return { bg: 'bg-dark-800', border: 'border-dark-700', text: 'text-dark-300', label: 'INFO' }
  }
})

// Auto-dismiss après 8 secondes
watch(() => gameStore.currentEvent, (newVal) => {
  if (newVal) {
    if (timer.value) clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      gameStore.dismissEvent()
    }, 8000)
  }
})

function formatImpact(): string {
  if (!gameStore.currentEvent) return ''
  const e = gameStore.currentEvent
  switch (e.type) {
    case 'gain': return `+${new Intl.NumberFormat('fr-FR').format(e.impactValue)} FCFA`
    case 'loss': return `-${new Intl.NumberFormat('fr-FR').format(e.impactValue)} FCFA`
    case 'employee_departure': return 'Départ immédiat'
    case 'boost': return `+${e.impactValue} Skill UP`
    default: return ''
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="notification">
      <div v-if="gameStore.currentEvent" class="fixed top-6 right-6 z-[100] w-full max-w-sm pointer-events-auto">
        <!-- Card -->
        <div :class="[
          'relative overflow-hidden rounded-2xl p-5 border shadow-2xl backdrop-blur-md',
          'bg-dark-900/90',
          eventStyle.border,
        ]">
          <!-- Background Glow -->
          <div :class="['absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-20', eventStyle.bg]">
          </div>

          <div class="flex items-start gap-4">
            <span class="text-4xl animate-bounce-slow">{{ gameStore.currentEvent.icon }}</span>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  :class="['text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider', eventStyle.bg, eventStyle.text, eventStyle.border]">
                  {{ eventStyle.label }}
                </span>
              </div>
              <h2 class="text-sm font-black text-white uppercase italic tracking-tighter mb-1">
                {{ gameStore.currentEvent.name }}
              </h2>
              <p class="text-[11px] text-dark-300 leading-tight mb-3">
                {{ gameStore.currentEvent.description }}
              </p>

              <div
                :class="['inline-block px-3 py-1 rounded-lg text-xs font-bold border', eventStyle.bg, eventStyle.border, eventStyle.text]">
                {{ formatImpact() }}
              </div>
            </div>

            <button class="text-dark-500 hover:text-white transition-colors p-1" @click="gameStore.dismissEvent()">
              ✕
            </button>
          </div>

          <!-- Progress Bar (Auto-dismiss) -->
          <div class="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
            <div class="h-full bg-current transition-all duration-[8000ms] ease-linear w-0" :class="eventStyle.text"
              :style="{ width: gameStore.currentEvent ? '100%' : '0%' }"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.notification-enter-from {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

.animate-bounce-slow {
  animation: bounce 3s infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}
</style>
