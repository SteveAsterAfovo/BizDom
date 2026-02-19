<script setup lang="ts">
/**
 * ── DG Hub ──
 * Vision stratégique : Feedback employés, Demandes du marché, Objectifs DG
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useQuestStore } from '~/stores/questStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const questStore = useQuestStore()
const gameStore = useGameStore()

const specialties = ['tech', 'sales', 'creative', 'hr', 'management'] as const

function getDemandColor(value: number): string {
  if (value > 80) return 'text-gain-500'
  if (value < 30) return 'text-loss-500'
  return 'text-accent-500'
}

// SEO
useHead({
  title: 'Bureau du DG',
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8 animate-fade-in p-1">
    <header class="mb-10 text-center lg:text-left">
      <h1 class="text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        🏛️ Bureau du DG
      </h1>
      <p class="text-[10px] font-black uppercase tracking-[0.3em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Vision stratégique & Climat social
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

      <!-- 👑 PROFIL DU DIRIGEANT -->
      <div class="lg:col-span-4 xl:col-span-3 space-y-6">
        <div class="card p-8 transition-all duration-500 border rounded-[2.5rem] shadow-lg"
          :class="gameStore.darkMode ? 'bg-gradient-to-br from-accent-600/20 to-dark-900 border-accent-500/30' : 'bg-white border-slate-200 shadow-sm'">
          <div class="flex items-center gap-6 mb-8">
            <div class="w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-md border"
              :class="gameStore.darkMode ? 'bg-dark-850 border-white/10 shadow-glow-accent/10' : 'bg-slate-50 border-slate-200'">
              {{ companyStore.company.ceo?.appearance === 'suit-1' ? '👔' :
                companyStore.company.ceo?.appearance === 'suit-2' ? '👩‍💼' :
                  companyStore.company.ceo?.appearance === 'cyber' ? '👨‍💻' :
                    companyStore.company.ceo?.appearance === 'casual-1' ? '👦' : '👧' }}
            </div>
            <div>
              <h3 class="text-2xl font-black italic tracking-tighter leading-tight"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ companyStore.company.ceo?.firstName || '' }} <br /> {{ companyStore.company.ceo?.lastName || '' }}
              </h3>
              <p class="text-[9px] font-black uppercase tracking-[0.2em] mt-2 text-accent-500">Gérant Majoritaire</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="p-5 rounded-2xl border transition-colors"
              :class="gameStore.darkMode ? 'bg-dark-950/50 border-white/5' : 'bg-slate-50 border-slate-100'">
              <p class="text-[8px] text-dark-500 font-black uppercase mb-1">Parts au Capital</p>
              <div class="flex items-end justify-between">
                <span class="text-3xl font-black italic text-accent-500">{{ companyStore.ceoShare.toFixed(1) }}%</span>
                <span class="text-[8px] text-dark-400 mb-1 font-black">DECISIF</span>
              </div>
            </div>
            <div class="p-5 rounded-2xl border transition-colors"
              :class="gameStore.darkMode ? 'bg-dark-950/50 border-white/5' : 'bg-slate-50 border-slate-100'">
              <p class="text-[8px] text-dark-500 font-black uppercase mb-1">Compte Bancaire Privé</p>
              <p class="text-xl font-black italic" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ (companyStore.company.ceo?.bankBalance || 0).toLocaleString() }} FCFA
              </p>
            </div>
          </div>

          <NuxtLink to="/settings"
            class="block w-full mt-8 py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm"
            :class="gameStore.darkMode ? 'bg-dark-850 hover:bg-dark-800 border-white/10 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'">
            Modifier le Profil
          </NuxtLink>
        </div>
      </div>

      <!-- 👥 CLIMAT SOCIAL & MARCHÉ -->
      <div class="lg:col-span-8 xl:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">

        <div class="space-y-8">
          <div class="card p-8 border h-full rounded-[2.5rem]"
            :class="gameStore.darkMode ? 'bg-dark-900 border-accent-500/10' : 'bg-white border-slate-200'">
            <h3 class="font-black italic uppercase tracking-tighter text-xl mb-8"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
              Climat Social
            </h3>

            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="p-5 rounded-3xl border"
                :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
                <p class="text-[9px] text-dark-500 font-black uppercase tracking-widest mb-1">Sentiment</p>
                <p class="text-lg font-black italic"
                  :class="companyStore.productivity > 0.8 ? 'text-gain-500' : 'text-loss-500'">
                  {{ companyStore.productivity > 0.8 ? 'EXCELLENT' : companyStore.productivity > 0.5 ? 'STABLE' :
                    'CRITIQUE' }}
                </p>
              </div>
              <div class="p-5 rounded-3xl border"
                :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
                <p class="text-[9px] text-dark-500 font-black uppercase tracking-widest mb-1">Mécontents</p>
                <p class="text-lg font-black italic text-warn-500">
                  {{companyStore.employees.filter(e => e.motivation < 40).length}} </p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-end text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="text-dark-500 italic">Risque de Grève</span>
                <span :class="companyStore.strikeRisk > 50 ? 'text-loss-500' : 'text-accent-500'">{{
                  companyStore.strikeRisk.toFixed(0) }}%</span>
              </div>
              <div class="w-full h-3 bg-dark-700/20 rounded-full overflow-hidden border border-dark-700/10">
                <div class="h-full rounded-full transition-all duration-1000"
                  :class="companyStore.strikeRisk > 50 ? 'bg-loss-500 shadow-glow-loss' : 'bg-gain-500 shadow-glow-gain'"
                  :style="{ width: `${companyStore.strikeRisk}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-8 border rounded-[2.5rem]"
          :class="gameStore.darkMode ? 'bg-dark-900 border-accent-500/10' : 'bg-white border-slate-200'">
          <h3 class="font-black italic uppercase tracking-tighter text-xl mb-6"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
            Derniers Avis
          </h3>
          <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <template v-for="emp in companyStore.employees" :key="emp.id">
              <div v-for="(opinion, i) in emp.opinions" :key="i"
                class="p-4 rounded-2xl border-l-4 transition-all animate-slide-right"
                :class="gameStore.darkMode ? 'bg-dark-850 border-dark-700 border-l-accent-500' : 'bg-slate-50 border-slate-100 border-l-accent-500'">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-[10px] font-black text-accent-500 uppercase tracking-widest italic">{{ emp.name
                  }}</span>
                </div>
                <p class="text-xs font-medium leading-relaxed"
                  :class="gameStore.darkMode ? 'text-white' : 'text-slate-700'">{{ opinion }}</p>
              </div>
            </template>
            <div v-if="companyStore.employees.every(e => e.opinions.length === 0)"
              class="text-center py-12 text-dark-500 font-black uppercase tracking-widest italic text-[10px]">
              Aucun feedback...
            </div>
          </div>
        </div>

        <!-- 📊 MARCHE -->
        <div class="card p-8 border rounded-[2.5rem]"
          :class="gameStore.darkMode ? 'bg-dark-900 border-accent-500/20' : 'bg-white border-slate-200'">
          <h3 class="font-black italic uppercase tracking-tighter text-xl mb-8 flex items-center gap-3"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
            📈 Santé du Marché
          </h3>
          <div class="p-6 rounded-3xl border mb-8"
            :class="gameStore.darkMode ? 'bg-dark-850 border-dark-700 shadow-sm' : 'bg-slate-50 border-slate-100 shadow-sm'">
            <p class="text-[9px] text-dark-500 font-black uppercase tracking-[0.2em] mb-2 leading-none">Croissance
              Organique</p>
            <span class="text-3xl font-black italic text-gain-500">
              +{{ (companyStore.market.organicGrowth * 100).toFixed(2) }}%
            </span>
          </div>
          <div class="space-y-5">
            <div v-for="s in specialties" :key="s" class="space-y-2">
              <div class="flex justify-between text-[10px] uppercase font-black tracking-[0.2em] leading-none">
                <span class="text-dark-400 italic">{{ s }}</span>
                <span :class="getDemandColor(companyStore.market.demands[s])">{{ companyStore.market.demands[s]
                }}%</span>
              </div>
              <div class="w-full h-2 bg-dark-700/10 rounded-full overflow-hidden">
                <div class="h-full bg-accent-500 shadow-glow-accent transition-all duration-1000"
                  :style="{ width: `${companyStore.market.demands[s]}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🎯 OBJECTIFS -->
        <div class="card p-8 border rounded-[2.5rem]"
          :class="gameStore.darkMode ? 'bg-dark-900 border-accent-500/30' : 'bg-white border-slate-200'">
          <h3 class="font-black italic uppercase tracking-tighter text-xl mb-6"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
            🎯 Quêtes DG
          </h3>
          <div class="space-y-4">
            <div v-for="quest in questStore.activeQuests" :key="quest.id"
              class="p-5 rounded-2xl border transition-all hover:scale-[1.02]"
              :class="gameStore.darkMode ? 'bg-accent-500/5 border-accent-500/20' : 'bg-accent-50/50 border-accent-100'">
              <p class="text-sm font-black italic mb-2 uppercase"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ quest.title }}</p>
              <p class="text-[10px] font-bold leading-relaxed"
                :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">
                {{ quest.description }}</p>
            </div>
            <div v-if="!questStore.hasActiveQuests"
              class="text-center py-12 text-dark-500 font-black uppercase tracking-widest italic text-[10px]">
              Aucun objectif prioritaire.
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

/* @tailwind components; */

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(51, 65, 85, 0.5);
  border-radius: 9999px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 1);
}
</style>
