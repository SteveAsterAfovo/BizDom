<script setup lang="ts">
/**
 * ── QuestLog ──
 * Affiche les objectifs en cours et les récompenses
 */
import { useQuestStore } from '~/stores/questStore'

const questStore = useQuestStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}
</script>

<template>
  <div v-if="questStore.hasActiveQuests" class="fixed bottom-6 right-6 w-80 z-50 animate-slide-up">
    <div class="card !p-4 !bg-dark-900 border-accent-500/30 shadow-2xl">
      <h3 class="text-accent-400 font-bold text-sm mb-3 flex items-center gap-2">
        🎯 Objectifs en cours ({{ questStore.activeQuests.length }})
      </h3>

      <div class="space-y-3">
        <div v-for="quest in questStore.activeQuests" :key="quest.id"
          class="p-3 rounded-xl border transition-all duration-300"
          :class="quest.completed ? 'bg-gain-500/20 border-gain-500/40' : 'bg-dark-800 border-dark-700/50'">

          <div class="flex justify-between items-start mb-1">
            <p class="text-xs font-bold text-white">{{ quest.title }}</p>
            <span v-if="quest.completed" class="text-xs text-gain-400">✅</span>
          </div>
          <p class="text-[10px] text-dark-400 mb-2">{{ quest.description }}</p>

          <div class="flex items-center justify-between">
            <span class="text-[10px] bg-dark-700 px-2 py-0.5 rounded text-dark-300">
              {{ quest.rewardType === 'cash' ? formatCurrency(quest.rewardValue) : `+${quest.rewardValue} Motivation` }}
            </span>

            <span v-if="quest.deadline" class="text-[9px] text-loss-400 font-bold uppercase">
              ⌛ Expire J{{ quest.deadline }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.4s ease-out forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
