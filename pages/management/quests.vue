<script setup lang="ts">
/**
 * ── Quest Management ──
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
  <div class="p-6 max-w-7xl mx-auto animate-fade-in">
    <header class="mb-10">
      <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
        🎯 Objectifs & Quêtes
      </h1>
      <p class="text-dark-400 text-sm">Gérez vos missions en cours et récupérez vos récompenses</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="quest in questStore.activeQuests" :key="quest.id"
        class="card relative overflow-hidden group transition-all"
        :class="quest.completed ? 'border-gain-500 bg-gain-500/5 shadow-glow-gain/10' : ''">

        <div v-if="quest.completed" class="absolute top-4 right-4 text-gain-400 animate-bounce">
          ✅ COMPLÉTÉE
        </div>

        <div class="space-y-4">
          <div>
            <p class="text-[10px] text-accent-400 font-bold uppercase tracking-widest mb-1 italic">Mission</p>
            <h3 class="text-white font-black text-lg leading-tight uppercase tracking-tight">{{ quest.title }}</h3>
          </div>

          <p class="text-sm text-dark-300">{{ quest.description }}</p>

          <!-- Pros/Cons Columns -->
          <div class="grid grid-cols-2 gap-3 pb-2">
            <div class="space-y-1">
              <p class="text-[8px] font-black text-dark-500 uppercase tracking-widest">Avantages</p>
              <div v-for="pro in quest.pros" :key="pro"
                class="text-[10px] text-gain-400 font-bold flex items-start gap-1">
                <span class="mt-0.5">▲</span> {{ pro }}
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-[8px] font-black text-dark-500 uppercase tracking-widest">Inconvénients</p>
              <div v-for="con in quest.cons" :key="con"
                class="text-[10px] text-loss-400 font-bold flex items-start gap-1">
                <span class="mt-0.5">▼</span> {{ con }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-dark-850 border border-dark-700/50">
              <p class="text-[9px] text-dark-500 uppercase font-black mb-1 tracking-tighter">Récompense</p>
              <span class="text-sm font-black text-white">
                {{ quest.rewardType === 'cash' ? formatCurrency(quest.rewardValue) : `+${quest.rewardValue} Mo` }}
              </span>
            </div>
            <div v-if="quest.failurePenalty" class="p-4 rounded-xl bg-loss-500/5 border border-loss-500/20">
              <p class="text-[9px] text-loss-500 uppercase font-black mb-1 tracking-tighter">Pénalité</p>
              <span class="text-sm font-black text-loss-400">
                -{{ formatCurrency(quest.failurePenalty) }}
              </span>
            </div>
          </div>

          <div v-if="quest.deadline" class="flex items-center gap-2">
            <div class="flex-1 h-1 bg-dark-800 rounded-full overflow-hidden">
              <!-- Calculer % temps restant -->
              <div class="h-full bg-loss-500" :style="{ width: '70%' }"></div>
            </div>
            <span class="text-[9px] text-loss-400 font-black uppercase tracking-widest">Expire J{{ quest.deadline
              }}</span>
          </div>

          <button v-if="quest.completed"
            class="w-full py-3 rounded-xl bg-gain-500 text-white font-black uppercase tracking-widest shadow-glow-gain hover:scale-[1.02] active:scale-[0.98] transition-all"
            @click="questStore.completeQuest(quest.id)">
            Réclamer Bonus
          </button>
          <div v-else
            class="text-center py-2 text-[10px] text-dark-500 font-bold uppercase tracking-widest border border-dashed border-dark-700 rounded-xl">
            Objectif en cours
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!questStore.hasActiveQuests" class="lg:col-span-3 py-20 text-center">
        <div class="text-6xl mb-4 grayscale opacity-20 italic font-black text-white">QUIET OFFICE</div>
        <p class="text-dark-500 text-sm">Aucun objectif majeur pour le moment. <br /> Continuez la simulation pour
          recevoir de nouvelles propositions.</p>
      </div>
    </div>
  </div>
</template>
