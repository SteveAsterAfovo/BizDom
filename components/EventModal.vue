<script setup lang="ts">
/**
 * ── EventModal (Notification Edition) ──
 * Affiche en haut à droite.
 */
import { useGameStore } from '~/stores/gameStore'

const gameStore = useGameStore()
const timer = ref<any>(null)

// Couleur selon le type d'événement
const eventStyle = computed(() => {
  if (!gameStore.currentEvent) return {}
  switch (gameStore.currentEvent.type) {
    case 'gain':
      return {
        bg: 'bg-gain-500/10',
        border: 'border-gain-500/30',
        text: 'text-gain-500',
        label: 'GAIN',
        iconBg: 'bg-gain-500/10'
      }
    case 'loss':
      return {
        bg: 'bg-loss-500/10',
        border: 'border-loss-500/30',
        text: 'text-loss-500',
        label: 'PERTE',
        iconBg: 'bg-loss-500/10'
      }
    case 'employee_departure':
      return {
        bg: 'bg-loss-600/10',
        border: 'border-loss-500/30',
        text: 'text-loss-500',
        label: 'CRISE RH',
        iconBg: 'bg-loss-600/10'
      }
    case 'boost':
      return {
        bg: 'bg-accent-500/10',
        border: 'border-accent-500/30',
        text: 'text-accent-500',
        label: 'BOOST',
        iconBg: 'bg-accent-500/10'
      }
    default:
      return {
        bg: 'bg-dark-800/20',
        border: 'border-dark-700/30',
        text: 'text-dark-300',
        label: 'INFO',
        iconBg: 'bg-dark-800'
      }
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
      <div v-if="gameStore.currentEvent"
        class="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 z-[110] w-[calc(100%-2rem)] max-w-sm pointer-events-none">

        <!-- Card -->
        <div
          class="group relative overflow-hidden rounded-[2.5rem] p-6 border shadow-2xl backdrop-blur-xl pointer-events-auto transition-all duration-500"
          :class="[
            gameStore.darkMode ? 'bg-dark-900/90 border-white/5' : 'bg-white/90 border-slate-200',
            eventStyle.border,
          ]">

          <!-- Background Glow -->
          <div
            :class="['absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[70px] opacity-20 transition-colors duration-700', eventStyle.bg]">
          </div>

          <div class="flex items-start gap-5">
            <!-- Icon -->
            <div class="relative flex-shrink-0">
              <div class="w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-xl animate-bounce-slow"
                :class="[eventStyle.iconBg, gameStore.darkMode ? 'border border-white/5' : 'border border-slate-100']">
                {{ gameStore.currentEvent.icon }}
              </div>
            </div>

            <div class="flex-1 min-w-0 pt-1">
              <div class="flex items-center gap-3 mb-2">
                <span
                  :class="['text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-[0.2em] italic shadow-sm', eventStyle.bg, eventStyle.text, eventStyle.border]">
                  {{ eventStyle.label }}
                </span>
              </div>

              <h2 class="text-base font-black italic uppercase tracking-tighter mb-1 transition-colors"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ gameStore.currentEvent.name }}
              </h2>

              <p class="text-[11px] font-bold leading-relaxed mb-4"
                :class="gameStore.darkMode ? 'text-dark-300' : 'text-slate-500'">
                {{ gameStore.currentEvent.description }}
              </p>

              <div
                :class="['inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-glow-accent/5', eventStyle.bg, eventStyle.border, eventStyle.text]">
                {{ formatImpact() }}
              </div>
            </div>

            <button class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors border"
              :class="gameStore.darkMode ? 'text-dark-500 hover:text-white border-white/5 bg-dark-850' : 'text-slate-400 hover:text-slate-900 border-slate-100 bg-slate-50'"
              @click="gameStore.dismissEvent()">
              ✕
            </button>
          </div>

          <!-- Progress Bar (Auto-dismiss) -->
          <div class="absolute bottom-0 left-0 h-1.5 w-full bg-dark-800/10">
            <div class="h-full origin-left transition-all duration-[8000ms] ease-linear shadow-glow-accent"
              :class="[eventStyle.text, 'bg-current']" :style="{ width: gameStore.currentEvent ? '100%' : '0%' }"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-enter-from {
  transform: translateY(-20px) scale(0.9) rotate(2deg);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(40px) scale(0.95);
  opacity: 0;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
