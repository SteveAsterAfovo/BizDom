<script setup lang="ts">
/**
 * ── DG Hub ──
 * Vision stratégique : Feedback employés, Demandes du marché, Objectifs DG
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useQuestStore } from '~/stores/questStore'

const companyStore = useCompanyStore()
const questStore = useQuestStore()

const specialties = ['tech', 'sales', 'creative', 'hr', 'management'] as const

function getDemandColor(value: number): string {
  if (value > 80) return 'text-gain-400'
  if (value < 30) return 'text-loss-400'
  return 'text-white'
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
    <header class="mb-8">
      <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
        🏛️ Hub du Directeur Général
      </h1>
      <p class="text-dark-400 text-sm">Vision stratégique et climat social de Capital Dominion</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- 👥 CLIMAT SOCIAL (Feedbacks) -->
      <div class="lg:col-span-2 space-y-4">
        <div class="card">
          <h3 class="text-white font-bold mb-4 flex items-center gap-2">
            🗣️ Derniers Avis des Employés
          </h3>
          <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="emp in companyStore.employees" :key="emp.id">
              <div v-for="(opinion, i) in emp.opinions" :key="i"
                class="p-3 rounded-xl bg-dark-800 border-l-4 border-accent-500 mb-2 animate-slide-right"
                :style="{ animationDelay: `${i * 100}ms` }">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[10px] font-black text-accent-400 uppercase tracking-widest">{{ emp.name }}</span>
                  <span class="text-[10px] text-dark-500 italic">{{ opinion.split(']')[0] + ']' }}</span>
                </div>
                <p class="text-xs text-white">{{ opinion.split(']')[1] }}</p>
              </div>
            </div>
            <div v-if="companyStore.employees.every(e => e.opinions.length === 0)"
              class="text-center py-8 text-dark-500 italic">
              Aucun feedback pour le moment. La simulation doit tourner...
            </div>
          </div>
        </div>
      </div>

      <!-- 📊 ANALYSE DU MARCHÉ -->
      <div class="space-y-6">
        <div class="card">
          <h3 class="text-white font-bold mb-4 flex items-center gap-2">
            📈 Analyse des Demandes
          </h3>
          <div class="space-y-4">
            <div v-for="s in specialties" :key="s" class="space-y-1">
              <div class="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                <span class="text-dark-400">{{ s }}</span>
                <span :class="getDemandColor(companyStore.market.demands[s])">
                  {{ companyStore.market.demands[s] }}%
                </span>
              </div>
              <div class="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-1000"
                  :class="companyStore.market.demands[s] > 80 ? 'bg-gain-500' : 'bg-accent-500'"
                  :style="{ width: `${companyStore.market.demands[s]}%` }"></div>
              </div>
            </div>
          </div>
          <p class="mt-4 text-[9px] text-dark-500 leading-tight">
            Un haut index indique un segment prêt à payer plus cher ou plus facile à acquérir.
          </p>
        </div>

        <!-- 🎯 OBJECTIFS ACTUELS -->
        <div class="card border-accent-500/30">
          <h3 class="text-white font-bold mb-4 flex items-center gap-2">
            🎯 Objectifs Stratégiques
          </h3>
          <div class="space-y-3">
            <div v-for="quest in questStore.activeQuests" :key="quest.id"
              class="p-3 rounded-xl bg-accent-500/5 border border-accent-500/10">
              <p class="text-xs font-bold text-white mb-1">{{ quest.title }}</p>
              <p class="text-[10px] text-dark-400">{{ quest.description }}</p>
            </div>
            <div v-if="!questStore.hasActiveQuests" class="text-center py-4 text-dark-500 italic text-xs">
              Pas de quête active.
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 10px;
}
</style>
