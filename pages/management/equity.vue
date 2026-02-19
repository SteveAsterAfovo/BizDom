<script setup lang="ts">
/**
 * ── Equity Management ──
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

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

</script>

<template>
  <div class="p-6 max-w-7xl mx-auto animate-fade-in">
    <header class="mb-10">
      <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
        💰 Finance & Equity
      </h1>
      <p class="text-dark-400 text-sm">Gérez la structure du capital et levez des fonds pour votre croissance</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card p-8 border-accent-500/20">
        <h3 class="text-white font-bold mb-8">Répartition du Capital</h3>

        <div class="relative flex items-center justify-center mb-12 h-64 w-64 mx-auto">
          <!-- Chart Simplifié (CSS Pie) -->
          <div class="absolute inset-0 rounded-full border-[20px] border-dark-800"></div>
          <div class="absolute inset-0 rounded-full border-[20px] border-accent-500 transition-all duration-1000"
            :style="{ clipPath: `polygon(50% 50%, 50% 0%, ${100}% 0%, ${100}% ${100}%, ${0}% ${100}%, ${0}% ${0}%, 50% 0%)` }">
          </div>

          <div class="text-center">
            <p class="text-4xl font-black text-white italic">{{ ((1 - companyStore.company.investorShare) *
              100).toFixed(0) }}%</p>
            <p class="text-[10px] text-dark-500 uppercase font-black">Capital Détenu</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center p-4 rounded-2xl bg-dark-800 border-l-4 border-accent-500">
            <div>
              <p class="text-[10px] text-dark-500 font-black uppercase">Fortune Perso (Cash)</p>
              <span class="text-sm font-black text-white">{{ formatCurrency(companyStore.company.ceo?.bankBalance || 0)
                }}</span>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-dark-500 font-black uppercase">Capital Détenu</p>
              <span class="text-xl font-black text-accent-400">{{ ((1 - companyStore.company.investorShare) *
                100).toFixed(0) }}%</span>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-dark-900 border border-white/5">
            <p class="text-[10px] text-dark-500 font-black uppercase mb-1">Fortune Nette Estimée (Parts incluses)</p>
            <p class="text-2xl font-black text-white italic tracking-tighter">{{
              formatCurrency(companyStore.ceoNetWorth) }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Vendre des parts -->
        <div class="p-8 rounded-3xl bg-dark-900 border border-white/10">
          <h3 class="text-xl font-black text-white mb-6 italic tracking-tight uppercase">💰 Vendre des parts</h3>

          <div class="mb-6">
            <div class="flex justify-between items-end mb-2">
              <label class="text-[10px] text-dark-500 font-black uppercase">Parts à céder</label>
              <span class="text-2xl font-black text-white italic">{{ sellAmount }}%</span>
            </div>
            <input v-model.number="sellAmount" type="range" min="1" max="25" step="1"
              class="w-full h-2 bg-dark-800 rounded-full appearance-none cursor-pointer" />
          </div>

          <div class="p-4 rounded-2xl bg-dark-850 border border-white/5 mb-6">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-dark-400">Valeur estimée</span>
              <span class="text-gain-400 font-bold">+ {{ formatCurrency(sellAmount * companyStore.company.sharePrice *
                0.9) }}</span>
            </div>
            <p class="text-[9px] text-dark-600 italic leading-tight">10% de décote appliquée pour frais de transaction
              et dilution accélérée.</p>
          </div>

          <button @click="handleSellShares" :disabled="(1 - companyStore.company.investorShare) * 100 - sellAmount < 10"
            class="w-full py-4 rounded-xl bg-accent-600 text-white font-black uppercase tracking-widest hover:bg-accent-500 transition-all shadow-glow-accent disabled:opacity-30">
            Confirmer la Vente
          </button>
        </div>
        <div class="p-8 rounded-3xl bg-gradient-to-br from-accent-600/20 to-dark-900 border border-accent-500/30">
          <h3 class="text-xl font-black text-white mb-2 italic tracking-tight">🚀 Lever des fonds - Série A</h3>
          <p class="text-sm text-dark-300 mb-6">
            Obtenez <strong class="text-white">100 000 FCFA</strong> de trésorerie immédiate. En contrepartie, vous
            cédez <strong class="text-loss-400">5%</strong> de vos revenus mensuels à vie.
          </p>

          <div class="mb-6 space-y-3">
            <div class="p-4 rounded-xl bg-dark-950/50 border border-dark-700">
              <div class="flex justify-between items-center mb-1">
                <span class="text-[9px] uppercase font-black text-dark-500">Santé Sociale</span>
                <span :class="companyStore.strikeRisk <= 40 ? 'text-gain-400' : 'text-loss-500'"
                  class="text-[10px] font-black italic">
                  {{ companyStore.strikeRisk <= 40 ? 'ÉLIGIBLE ✓' : 'REFUSÉ ✕' }} </span>
              </div>
              <p v-if="companyStore.strikeRisk > 40" class="text-[8px] text-loss-600 leading-tight italic">
                Risque de grève trop élevé ({{ companyStore.strikeRisk.toFixed(0) }}% > 40%).
              </p>
            </div>

            <div class="p-4 rounded-xl bg-dark-950/50 border border-dark-700">
              <div class="flex justify-between items-center mb-1">
                <span class="text-[9px] uppercase font-black text-dark-500">Satisfaction Conseil</span>
                <span :class="companyStore.boardSatisfaction >= 50 ? 'text-gain-400' : 'text-loss-500'"
                  class="text-[10px] font-black italic">
                  {{ companyStore.boardSatisfaction >= 50 ? 'ÉLIGIBLE ✓' : 'REFUSÉ ✕' }} </span>
              </div>
              <p v-if="companyStore.boardSatisfaction < 50" class="text-[8px] text-loss-600 leading-tight italic">
                Le Board n'a pas assez confiance ({{ companyStore.boardSatisfaction }}% < 50%). </p>
            </div>
          </div>

          <button class="w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-glow-accent"
            :class="companyStore.strikeRisk <= 40 ? 'bg-accent-600 text-white hover:bg-accent-500' : 'bg-dark-800 text-dark-600 cursor-not-allowed border border-dark-700'"
            @click="companyStore.raiseFunds()" :disabled="companyStore.strikeRisk > 40">
            Signer le pacte (100k)
          </button>
        </div>

        <div class="card bg-dark-850 opacity-50 border-dashed">
          <h3 class="text-white font-bold mb-2">🏛️ Introduction en Bourse (IPO)</h3>
          <p class="text-[10px] text-dark-500 italic">Bientôt disponible. Requiert un Siège Premium et au moins 1M FCFA
            de capital propre.</p>
        </div>
      </div>
    </div>
  </div>
</template>
