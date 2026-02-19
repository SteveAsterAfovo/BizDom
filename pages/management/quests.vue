<script setup lang="ts">
/**
 * ── Quest Management ──
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

// SEO
useHead({
  title: 'Objectifs & Quêtes',
})
</script>

<template>
  <div class="p-2 sm:p-6 max-w-7xl mx-auto animate-fade-in space-y-10">
    <!-- Header -->
    <header class="text-center sm:text-left pt-4 sm:pt-0">
      <h1 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        🎯 Objectifs <span class="text-accent-500">& Quêtes</span>
      </h1>
      <p class="text-[10px] font-black uppercase tracking-[0.2em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Gérez vos missions stratégiques et réclamez vos primes de performance
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="quest in questStore.activeQuests" :key="quest.id"
        class="card relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] p-8 border rounded-[2.5rem] shadow-xl"
        :class="[
          gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm',
          quest.completed ? (gameStore.darkMode ? 'border-gain-500/50 bg-gain-500/5 shadow-glow-gain/10' : 'border-gain-500 bg-gain-50/50 shadow-lg shadow-gain-500/10') : ''
        ]">

        <!-- Badge Statut -->
        <div v-if="quest.completed"
          class="absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest animate-bounce-subtle shadow-lg"
          :class="gameStore.darkMode ? 'bg-gain-500 text-white shadow-glow-gain' : 'bg-gain-500 text-white shadow-lg'">
          COMPLÉTÉE ✓
        </div>

        <div class="space-y-6">
          <header>
            <p class="text-[10px] text-accent-500 font-black uppercase tracking-[0.2em] mb-2 italic">Phase
              Opérationnelle</p>
            <h3 class="text-xl font-black italic uppercase tracking-tighter leading-tight"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ quest.title }}</h3>
          </header>

          <p class="text-xs font-bold leading-relaxed" :class="gameStore.darkMode ? 'text-dark-300' : 'text-slate-500'">
            {{ quest.description }}</p>

          <!-- Pros/Cons Columns -->
          <div class="grid grid-cols-2 gap-6 py-4 border-y"
            :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
            <div class="space-y-3">
              <p class="text-[8px] font-black text-dark-500 uppercase tracking-widest">Impact Positif</p>
              <div v-for="pro in quest.pros" :key="pro"
                class="text-[10px] text-gain-500 font-black flex items-start gap-2">
                <span class="mt-0.5 animate-pulse">▲</span> {{ pro }}
              </div>
            </div>
            <div class="space-y-3">
              <p class="text-[8px] font-black text-dark-500 uppercase tracking-widest">Risques</p>
              <div v-for="con in quest.cons" :key="con"
                class="text-[10px] text-loss-500 font-black flex items-start gap-2">
                <span class="mt-0.5 opacity-50">▼</span> {{ con }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl border transition-all"
              :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
              <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">Bonus</p>
              <span class="text-sm font-black italic" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ quest.rewardType === 'cash' ? formatCurrency(quest.rewardValue) : `+${quest.rewardValue} Mo` }}
              </span>
            </div>
            <div v-if="quest.failurePenalty" class="p-4 rounded-2xl border transition-all"
              :class="gameStore.darkMode ? 'bg-loss-500/5 border-loss-500/20' : 'bg-loss-50 border-loss-100'">
              <p class="text-[8px] font-black uppercase tracking-widest text-loss-500 mb-1">Malus</p>
              <span class="text-sm font-black italic text-loss-500">
                -{{ formatCurrency(quest.failurePenalty) }}
              </span>
            </div>
          </div>

          <!-- Deadline -->
          <div v-if="quest.deadline" class="space-y-3 pt-2">
            <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span class="text-dark-500 italic">Temps restant</span>
              <span class="text-loss-500 animte-pulse">Expire J{{ quest.deadline }}</span>
            </div>
            <div class="w-full h-1.5 rounded-full overflow-hidden"
              :class="gameStore.darkMode ? 'bg-dark-800' : 'bg-slate-100 pb-0.5 border border-slate-200 shadow-inner'">
              <div class="h-full bg-loss-500 rounded-full shadow-glow-loss" :style="{ width: '70%' }"></div>
            </div>
          </div>

          <button v-if="quest.completed"
            class="w-full py-5 rounded-2xl bg-gain-500 text-white font-black italic text-[11px] uppercase tracking-[0.2em] shadow-glow-gain hover:scale-[1.02] active:scale-[0.98] transition-all"
            @click="questStore.completeQuest(quest.id)">
            Réclamer Bonus
          </button>
          <div v-else
            class="text-center py-4 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-dashed rounded-2xl"
            :class="gameStore.darkMode ? 'text-dark-500 border-white/5 bg-dark-950/20' : 'text-slate-400 border-slate-100 bg-slate-50/50'">
            Opération en cours...
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!questStore.hasActiveQuests" class="lg:col-span-3 py-32 text-center space-y-6">
        <div class="text-6xl sm:text-8xl grayscale opacity-10 italic font-black"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">QUIET OFFICE</div>
        <p class="text-sm font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed"
          :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">
          Aucun objectif majeur pour le moment. <br class="hidden sm:block" /> Continuez la simulation pour explorer de
          nouvelles opportunités stratégiques.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bounce-subtle-enter-active {
  animation: bounce-subtle 0.5s ease-out;
}

@keyframes bounce-subtle {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  70% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle-float 3s ease-in-out infinite;
}

@keyframes bounce-subtle-float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}
</style>
