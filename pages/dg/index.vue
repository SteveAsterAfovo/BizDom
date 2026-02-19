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
    <header class="mb-8 text-center lg:text-left">
      <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
        🏛️ Bureau du Directeur Général
      </h1>
      <p class="text-dark-400 text-sm font-bold uppercase tracking-widest mt-1">Vision stratégique & Climat social</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <!-- 👑 PROFIL DU DIRIGEANT -->
      <div class="lg:col-span-1 space-y-6">
        <div class="card p-6 bg-gradient-to-br from-accent-600/20 to-dark-900 border-accent-500/30">
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-16 h-16 rounded-2xl bg-dark-850 flex items-center justify-center text-3xl border border-white/10 shadow-glow-accent/10">
              {{ companyStore.company.ceo.appearance === 'suit-1' ? '👔' :
                companyStore.company.ceo.appearance === 'suit-2' ? '👩‍💼' :
                  companyStore.company.ceo.appearance === 'cyber' ? '👨‍💻' :
                    companyStore.company.ceo.appearance === 'casual-1' ? '👦' : '👧' }}
            </div>
            <div>
              <h3 class="text-xl font-black text-white italic tracking-tight leading-tight">{{
                companyStore.company.ceo.firstName }} <br /> {{ companyStore.company.ceo.lastName }}</h3>
              <p class="text-[10px] text-dark-500 font-black uppercase tracking-[0.2em] mt-1">Gérant Majoritaire</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-dark-950/50 border border-white/5">
              <p class="text-[8px] text-dark-500 font-black uppercase mb-1">Parts au Capital</p>
              <div class="flex items-end justify-between">
                <span class="text-2xl font-black italic text-accent-400">{{ companyStore.ceoShare.toFixed(1) }}%</span>
                <span class="text-[8px] text-dark-600 mb-1 font-bold">DECISIF</span>
              </div>
            </div>
            <div class="p-4 rounded-xl bg-dark-950/50 border border-white/5">
              <p class="text-[8px] text-dark-500 font-black uppercase mb-1">Compte Bancaire Privé</p>
              <p class="text-lg font-black text-white">{{ (companyStore.company.ceo.bankBalance || 0).toLocaleString()
                }} FCFA</p>
            </div>
          </div>

          <NuxtLink to="/settings"
            class="block w-full mt-6 py-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 text-center text-[10px] font-black uppercase tracking-widest transition-all">
            Modifier le Profil
          </NuxtLink>
        </div>
      </div>

      <!-- 👥 CLIMAT SOCIAL & MARCHÉ -->
      <div class="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="space-y-6">
          <div class="card p-6 border-accent-500/10 h-full">
            <h3 class="text-white font-black italic uppercase tracking-tight mb-6">Climat Social</h3>

            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="p-4 rounded-2xl bg-dark-850 border border-white/5">
                <p class="text-[9px] text-dark-500 font-black uppercase">Sentiment Global</p>
                <p class="text-xl font-black"
                  :class="companyStore.productivity > 0.8 ? 'text-gain-400' : 'text-loss-500'">
                  {{ companyStore.productivity > 0.8 ? 'EXCELLENT' : companyStore.productivity > 0.5 ? 'STABLE' :
                  'CRITIQUE' }}
                </p>
              </div>
              <div class="p-4 rounded-2xl bg-dark-850 border border-white/5">
                <p class="text-[9px] text-dark-500 font-black uppercase">Mécontents</p>
                <p class="text-xl font-black text-warn-500">
                  {{companyStore.employees.filter(e => e.motivation < 40).length}} </p>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-end text-[10px] font-black uppercase">
                <span class="text-dark-500 italic">Risque de Grève</span>
                <span :class="companyStore.strikeRisk > 50 ? 'text-loss-500' : 'text-accent-400'">{{
                  companyStore.strikeRisk.toFixed(0) }}%</span>
              </div>
              <div class="w-full h-2 bg-dark-800 rounded-full overflow-hidden border border-dark-700">
                <div class="h-full rounded-full transition-all duration-1000"
                  :class="companyStore.strikeRisk > 50 ? 'bg-loss-500 shadow-glow-loss' : 'bg-gain-500'"
                  :style="{ width: `${companyStore.strikeRisk}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6 border-accent-500/10">
          <h3 class="text-white font-black italic uppercase tracking-tight mb-4">Derniers Avis</h3>
          <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="emp in companyStore.employees" :key="emp.id">
              <div v-for="(opinion, i) in emp.opinions" :key="i"
                class="p-3 rounded-xl bg-dark-800 border-l-4 border-accent-500 mb-2 animate-slide-right">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[10px] font-black text-accent-400 uppercase tracking-widest">{{ emp.name }}</span>
                </div>
                <p class="text-xs text-white">{{ opinion }}</p>
              </div>
            </div>
            <div v-if="companyStore.employees.every(e => e.opinions.length === 0)"
              class="text-center py-8 text-dark-500 italic">
              Aucun feedback...
            </div>
          </div>
        </div>

        <!-- 📊 MARCHE -->
        <div class="card p-6 border-accent-500/20">
          <h3 class="text-white font-bold mb-6 flex items-center gap-2">📈 Santé du Marché</h3>
          <div class="p-4 rounded-2xl bg-dark-850 border border-dark-700 mb-6">
            <p class="text-[9px] text-dark-500 font-black uppercase tracking-widest mb-1">Croissance</p>
            <span class="text-2xl font-black italic text-gain-400">
              +{{ (companyStore.market.organicGrowth * 100).toFixed(2) }}%
            </span>
          </div>
          <div class="space-y-4">
            <div v-for="s in specialties" :key="s" class="space-y-1">
              <div class="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                <span class="text-dark-400">{{ s }}</span>
                <span :class="getDemandColor(companyStore.market.demands[s])">{{ companyStore.market.demands[s]
                  }}%</span>
              </div>
              <div class="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
                <div class="h-full bg-accent-500" :style="{ width: `${companyStore.market.demands[s]}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🎯 OBJECTIFS -->
        <div class="card p-6 border-accent-500/30">
          <h3 class="text-white font-bold mb-4 italic uppercase">🎯 Objectifs à court terme</h3>
          <div class="space-y-3">
            <div v-for="quest in questStore.activeQuests" :key="quest.id"
              class="p-3 rounded-xl bg-accent-500/5 border border-accent-500/10">
              <p class="text-xs font-bold text-white mb-1">{{ quest.title }}</p>
              <p class="text-[10px] text-dark-400 leading-tight">{{ quest.description }}</p>
            </div>
            <div v-if="!questStore.hasActiveQuests" class="text-center py-4 text-dark-500 italic text-xs">
              Aucune quête.
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

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-dark-700 rounded-full;
}
</style>
