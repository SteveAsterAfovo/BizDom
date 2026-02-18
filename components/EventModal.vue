<script setup lang="ts">
/**
 * ── EventModal ──
 * Modal popup pour les événements aléatoires du jeu
 * S'affiche automatiquement quand un événement est déclenché
 */
import { useGameStore } from '~/stores/gameStore'

const gameStore = useGameStore()

// Couleur selon le type d'événement
const eventStyle = computed(() => {
  if (!gameStore.currentEvent) return {}
  switch (gameStore.currentEvent.type) {
    case 'gain':
      return { bg: 'bg-gain-500/10', border: 'border-gain-500/30', text: 'text-gain-400', label: 'Gain' }
    case 'loss':
      return { bg: 'bg-loss-500/10', border: 'border-loss-500/30', text: 'text-loss-400', label: 'Perte' }
    case 'employee_departure':
      return { bg: 'bg-warn-500/10', border: 'border-warn-500/30', text: 'text-warn-400', label: 'Départ' }
    case 'boost':
      return { bg: 'bg-accent-500/10', border: 'border-accent-500/30', text: 'text-accent-400', label: 'Boost' }
    default:
      return { bg: 'bg-dark-800', border: 'border-dark-700', text: 'text-dark-300', label: 'Événement' }
  }
})

// Formater l'impact
function formatImpact(): string {
  if (!gameStore.currentEvent) return ''
  const e = gameStore.currentEvent
  switch (e.type) {
    case 'gain':
      return `+${new Intl.NumberFormat('fr-FR').format(e.impactValue)} FCFA`
    case 'loss':
      return `-${new Intl.NumberFormat('fr-FR').format(e.impactValue)} FCFA`
    case 'employee_departure':
      return 'Un employé a quitté'
    case 'boost':
      return `+${e.impactValue} niveau(x) de compétence`
    default:
      return ''
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="gameStore.currentEvent"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
          @click="gameStore.dismissEvent()"
        />

        <!-- Contenu de la modal -->
        <div
          :class="[
            'relative w-full max-w-md rounded-2xl p-6 border animate-slide-up',
            'bg-dark-900 shadow-2xl',
            eventStyle.border,
          ]"
        >
          <!-- Icône et badge -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-4xl">{{ gameStore.currentEvent.icon }}</span>
              <span :class="['badge', eventStyle.bg, eventStyle.text, 'border', eventStyle.border]">
                {{ eventStyle.label }}
              </span>
            </div>
          </div>

          <!-- Titre -->
          <h2 class="text-xl font-bold text-white mb-2">
            {{ gameStore.currentEvent.name }}
          </h2>

          <!-- Description -->
          <p class="text-dark-300 text-sm mb-4 leading-relaxed">
            {{ gameStore.currentEvent.description }}
          </p>

          <!-- Impact -->
          <div
            :class="[
              'p-3 rounded-xl mb-5 border',
              eventStyle.bg, eventStyle.border,
            ]"
          >
            <p class="text-xs text-dark-400 mb-0.5">Impact</p>
            <p :class="['text-lg font-bold', eventStyle.text]">
              {{ formatImpact() }}
            </p>
          </div>

          <!-- Bouton fermer -->
          <button
            class="w-full btn-primary"
            @click="gameStore.dismissEvent()"
          >
            Compris ✓
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Animation de la modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
