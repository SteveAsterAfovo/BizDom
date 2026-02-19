<script setup lang="ts">
/**
 * ── QuestLog ──
 * Affiche les objectifs en cours et les récompenses
 */
import { useQuestStore } from '~/stores/questStore'
import { useGameStore } from '~/stores/gameStore'

const questStore = useQuestStore()
const gameStore = useGameStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}
</script>

<template>
  <div v-if="questStore.hasActiveQuests"
    class="fixed bottom-6 right-6 w-full max-w-[20rem] z-50 animate-slide-up px-4 sm:px-0">

    <div class="p-5 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl relative overflow-hidden"
      :class="gameStore.darkMode ? 'bg-dark-900/90 border-white/5 shadow-glow-accent/5' : 'bg-white/95 border-slate-200 shadow-xl'">

      <!-- Glow effect -->
      <div v-if="gameStore.darkMode"
        class="absolute -top-24 -right-24 w-48 h-48 bg-accent-500/10 blur-[60px] rounded-full pointer-events-none">
      </div>

      <header class="flex items-center justify-between mb-5 relative z-10">
        <h3 class="text-[10px] font-black italic uppercase tracking-[0.2em] animate-pulse"
          :class="gameStore.darkMode ? 'text-accent-400' : 'text-accent-600'">
          🎯 Objectifs Stratégiques ({{ questStore.activeQuests.length }})
        </h3>
      </header>

      <div class="space-y-4 relative z-10">
        <div v-for="quest in questStore.activeQuests" :key="quest.id"
          class="group p-4 rounded-[1.5rem] border transition-all duration-300 relative overflow-hidden" :class="[
            quest.completed
              ? (gameStore.darkMode ? 'bg-gain-500/10 border-gain-500/20' : 'bg-gain-50 border-gain-200 shadow-glow-gain/5')
              : (gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm')
          ]">

          <div class="flex justify-between items-start mb-2">
            <h4 class="text-xs font-black italic uppercase tracking-tighter"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ quest.title }}</h4>
            <span v-if="quest.completed" class="text-xs animate-bounce">💎</span>
          </div>

          <p class="text-[10px] font-bold leading-relaxed mb-3"
            :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">{{ quest.description }}</p>

          <!-- Pros/Cons Shorthand -->
          <div v-if="!quest.completed" class="mb-4 space-y-1.5 px-3 py-2 rounded-xl bg-dark-500/5">
            <div v-for="pro in quest.pros?.slice(0, 1)" :key="pro"
              class="text-[8px] font-black uppercase tracking-widest flex items-center gap-2"
              :class="gameStore.darkMode ? 'text-gain-400' : 'text-gain-600'">
              <span class="text-[6px]">▲</span> {{ pro }}
            </div>
            <div v-for="con in quest.cons?.slice(0, 1)" :key="con"
              class="text-[8px] font-black uppercase tracking-widest flex items-center gap-2 text-loss-500">
              <span class="text-[6px]">▼</span> {{ con }}
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-dashed"
            :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-200'">
            <div class="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest"
              :class="gameStore.darkMode ? 'bg-dark-950 text-dark-300' : 'bg-white text-slate-500 shadow-sm border border-slate-100'">
              {{ quest.rewardType === 'cash' ? formatCurrency(quest.rewardValue) : `+${quest.rewardValue} Motivation` }}
            </div>

            <div v-if="quest.deadline" class="flex items-center gap-1.5">
              <span class="text-[9px] font-black uppercase tracking-widest text-loss-500 italic">⌛ J{{ quest.deadline
                }}</span>
            </div>
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
