<script setup lang="ts">
/**
 * ── Equity Management ──
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

const sellAmount = ref(5)

function handleSellShares() {
  if (companyStore.sellShares(sellAmount.value)) {
    // Succès
  }
}

// SEO
useHead({
  title: 'Finance & Capital',
})
</script>

<template>
  <div class="space-y-10 animate-fade-in p-2 sm:p-6 max-w-7xl mx-auto">
    <header class="text-center sm:text-left pt-4 sm:pt-0">
      <h1 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        Finance <span class="text-accent-500">& Capital</span>
      </h1>
      <p class="text-[10px] font-black uppercase tracking-[0.2em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Gestion de la structure du capital et levées de fonds
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Répartition du Capital -->
      <div class="card p-8 border rounded-[2.5rem] shadow-xl space-y-8"
        :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
        <h3 class="text-xl font-black italic uppercase tracking-tighter"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Répartition du Capital</h3>

        <div class="relative flex items-center justify-center p-8">
          <!-- Chart Simplifié (CSS Pie) -->
          <div class="relative h-64 w-64 flex items-center justify-center group">
            <div class="absolute inset-0 rounded-full border-[24px] transition-colors"
              :class="gameStore.darkMode ? 'border-dark-800' : 'border-slate-100'"></div>
            <div
              class="absolute inset-0 rounded-full border-[24px] border-accent-500 transition-all duration-1000 shadow-glow-accent/20"
              :style="{ clipPath: `polygon(50% 50%, 50% 0%, ${100}% 0%, ${100}% ${100}%, ${0}% ${100}%, ${0}% ${0}%, 50% 0%)` }">
            </div>

            <div class="text-center transition-transform group-hover:scale-110">
              <p class="text-5xl font-black italic tracking-tighter"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ companyStore.ceoShare.toFixed(0) }}%
              </p>
              <p class="text-[10px] text-dark-500 uppercase font-black tracking-widest mt-1">Capital Détenu</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t"
          :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
          <div class="p-6 rounded-[2rem] border"
            :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
            <p class="text-[9px] text-dark-500 font-black uppercase tracking-widest mb-1">Fortune Perso (Cash)</p>
            <span class="text-lg font-black italic text-accent-500">{{
              formatCurrency(companyStore.company.ceo?.bankBalance || 0) }}</span>
          </div>

          <div class="p-6 rounded-[2rem] border"
            :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
            <p class="text-[9px] text-dark-500 font-black uppercase tracking-widest mb-1">Fortune Nette (Estimée)</p>
            <span class="text-lg font-black italic text-gain-500">{{ formatCurrency(companyStore.ceoNetWorth) }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <!-- Vendre des parts -->
        <div class="card p-8 border rounded-[2.5rem] shadow-xl space-y-8"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <h3 class="text-xl font-black italic uppercase tracking-tighter"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Céder des Parts</h3>

          <div class="space-y-6">
            <div class="flex justify-between items-end">
              <label class="text-[10px] text-dark-500 font-black uppercase tracking-widest">Parts à céder</label>
              <span class="text-3xl font-black italic text-accent-500">{{ sellAmount }}%</span>
            </div>
            <input v-model.number="sellAmount" type="range" min="1" max="25" step="1"
              class="w-full h-2 bg-dark-700/20 rounded-full appearance-none cursor-pointer accent-accent-500" />
          </div>

          <div class="p-6 rounded-2xl border transition-all"
            :class="gameStore.darkMode ? 'bg-dark-850 border-white/5 text-dark-400' : 'bg-slate-50 border-slate-100 text-slate-500'">
            <div class="flex justify-between items-center mb-2">
              <span class="text-[10px] font-black uppercase tracking-widest">Valeur Estimée</span>
              <span class="text-sm font-black italic text-gain-500">+ {{ formatCurrency(sellAmount *
                companyStore.company.sharePrice * 0.9) }}</span>
            </div>
            <p class="text-[9px] font-bold italic leading-tight">Une décote de 10% est appliquée pour frais de
              transaction et dilution accélérée.</p>
          </div>

          <button @click="handleSellShares" :disabled="companyStore.ceoShare - sellAmount < 10 || gameStore.isPaused"
            class="w-full btn-primary py-5 rounded-2xl font-black italic text-[10px] uppercase tracking-[0.2em] shadow-glow-accent/20 disabled:opacity-20">
            Confirmer la Transaction
          </button>
        </div>

        <!-- Lever des fonds -->
        <div class="p-8 rounded-[2.5rem] border transition-all space-y-6"
          :class="gameStore.darkMode ? 'bg-gradient-to-br from-accent-600/10 to-dark-950 border-accent-500/20' : 'bg-gradient-to-br from-accent-50 to-white border-accent-100'">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-black italic uppercase tracking-tighter text-accent-600 dark:text-accent-500">
                Série A - Expansion</h3>
              <p class="text-[10px] text-dark-500 font-black uppercase tracking-widest mt-1">Levée de fonds stratégique
              </p>
            </div>
            <span class="text-3xl">🚀</span>
          </div>

          <p class="text-xs font-bold leading-relaxed" :class="gameStore.darkMode ? 'text-dark-300' : 'text-slate-600'">
            Injectez <span class="text-gain-500">100 000 FCFA</span> de trésorerie immédiate. En contrepartie, versez
            une redevance de <span class="text-loss-500">5%</span> de vos revenus mensuels.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl border"
              :class="gameStore.darkMode ? 'bg-dark-950/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'">
              <span class="text-[9px] font-black uppercase tracking-widest text-dark-500 block mb-2">Climat
                Social</span>
              <div class="flex items-center gap-2">
                <span :class="companyStore.strikeRisk <= 40 ? 'text-gain-500' : 'text-loss-500'"
                  class="text-[10px] font-black italic">
                  {{ companyStore.strikeRisk <= 40 ? 'ÉLIGIBLE ✓' : 'REFUSÉ ✕' }} </span>
                    <span class="text-[10px] font-bold text-dark-500">({{ companyStore.strikeRisk.toFixed(0) }}%)</span>
              </div>
            </div>

            <div class="p-4 rounded-xl border"
              :class="gameStore.darkMode ? 'bg-dark-950/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'">
              <span class="text-[9px] font-black uppercase tracking-widest text-dark-500 block mb-2">Satisfaction
                Board</span>
              <div class="flex items-center gap-2">
                <span :class="companyStore.boardSatisfaction >= 50 ? 'text-gain-500' : 'text-loss-500'"
                  class="text-[10px] font-black italic">
                  {{ companyStore.boardSatisfaction >= 50 ? 'ÉLIGIBLE ✓' : 'REFUSÉ ✕' }}
                </span>
                <span class="text-[10px] font-bold text-dark-500">({{ companyStore.boardSatisfaction }}%)</span>
              </div>
            </div>
          </div>

          <button @click="companyStore.raiseFunds()"
            :disabled="companyStore.strikeRisk > 40 || companyStore.boardSatisfaction < 50 || gameStore.isPaused"
            class="w-full py-5 rounded-2xl font-black italic text-[10px] uppercase tracking-[0.2em] transition-all border-2"
            :class="companyStore.strikeRisk <= 40 && companyStore.boardSatisfaction >= 50
              ? 'bg-accent-600 text-white border-accent-500 hover:shadow-glow-accent'
              : 'bg-dark-800/10 text-dark-500 border-dark-700/20 cursor-not-allowed'">
            Signer le Pacte d'Actionnaires
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
