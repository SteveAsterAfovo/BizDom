<script setup lang="ts">
/**
 * ── Marketing & Market Analysis ──
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}

// SEO
useHead({
  title: 'Marketing & Marché',
})
</script>

<template>
  <div class="space-y-10 animate-fade-in p-2 sm:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <header class="text-center sm:text-left pt-4 sm:pt-0">
      <h2 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        Marketing <span class="text-accent-500">& Marché</span>
      </h2>
      <p class="text-[10px] font-black uppercase tracking-[0.2em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Conquérez de nouvelles parts de marché et gérez votre réputation
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div class="lg:col-span-3 order-2 lg:order-1 space-y-10">
        <MarketingPanel />

        <!-- Market Claims -->
        <div class="card p-8 border rounded-[2.5rem] shadow-xl"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <div class="flex items-center justify-between mb-8 px-4">
            <h3 class="text-xl font-black italic uppercase tracking-tighter"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Réclamations Clients</h3>
            <span class="text-2xl">📣</span>
          </div>

          <div v-if="companyStore.marketClaims.length === 0"
            class="text-center py-20 bg-dark-850/10 rounded-[2rem] border-dashed border-2 border-dark-700/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-dark-500">Aucune réclamation active. Vos
              clients sont ravis !</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="claim in companyStore.marketClaims" :key="claim.id"
              class="p-6 rounded-[2rem] border transition-all duration-300 hover:scale-[1.02] relative group shadow-lg"
              :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">

              <div class="flex justify-between items-start mb-4">
                <span class="text-[9px] font-black uppercase px-3 py-1 rounded-lg border tracking-widest" :class="claim.intensity > 0.5
                  ? 'bg-loss-500 text-white border-loss-400'
                  : 'bg-warn-500/10 text-warn-600 border-warn-500/30'">
                  Urgence: {{ Math.round(claim.intensity * 100) }}%
                </span>
                <span :class="claim.intensity > 0.5 ? 'animate-pulse' : ''">⚠️</span>
              </div>

              <p class="text-sm font-bold leading-relaxed mb-6"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ claim.description }}</p>

              <button
                class="w-full btn-primary py-4 rounded-xl font-black italic text-[10px] uppercase tracking-widest shadow-glow-accent/20 transition-all active:scale-95">
                {{ claim.actionLabel }} ({{ formatCurrency(claim.actionCost) }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Market Stats Sidebar -->
      <div class="lg:col-span-1 order-1 lg:order-2 space-y-6">
        <div class="card p-8 border rounded-[2.5rem] shadow-xl text-center space-y-6"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-dark-500">Parts de Marché</h3>

          <div class="aspect-square flex flex-col items-center justify-center p-8 rounded-[2rem] border shadow-inner"
            :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
            <span class="text-4xl font-black italic tracking-tighter text-accent-500">{{
              companyStore.playerMarketShare.toFixed(1) }}%</span>
            <p class="text-[9px] font-black text-dark-600 uppercase tracking-widest mt-1">BIZ-POWER</p>
          </div>

          <div class="pt-6 border-t space-y-4" :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
            <div
              class="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-dark-500">
              <span>Reputation</span>
              <span class="text-gain-500">92/100</span>
            </div>
            <div class="w-full h-1.5 bg-dark-700/20 rounded-full overflow-hidden">
              <div class="h-full bg-gain-500 shadow-glow-gain" style="width: 92%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
