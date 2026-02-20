<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestStore } from '~/stores/questStore'
import { useGameStore } from '~/stores/gameStore'

const questStore = useQuestStore()
const gameStore = useGameStore()
const router = useRouter()

const localShow = ref(true)

function closeLog() {
  localShow.value = false
}

function navigateToQuests() {
  router.push('/management/quests')
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}
</script>

<template>
  <div v-if="questStore.hasActiveQuests && localShow"
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
        <button @click="closeLog" class="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
          :class="gameStore.darkMode ? 'hover:bg-white/5 text-dark-400' : 'hover:bg-slate-100 text-slate-400'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="space-y-4 relative z-10 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
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

      <!-- Global Navigation Button -->
      <button @click="navigateToQuests"
        class="mt-6 w-full py-4 rounded-2xl text-[10px] font-black italic uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-lg border text-center flex items-center justify-center gap-2 group/btn"
        :class="gameStore.darkMode
          ? 'bg-accent-500/10 text-accent-400 border-accent-500/30 hover:bg-accent-500/20 hover:shadow-glow-accent/5'
          : 'bg-accent-50 text-accent-600 border-accent-100 hover:bg-accent-100 shadow-slate-200/50'">
        <span>Gérer toutes les missions</span>
        <span class="transition-transform group-hover/btn:translate-x-1">→</span>
      </button>
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
