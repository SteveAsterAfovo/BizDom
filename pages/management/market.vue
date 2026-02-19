<script setup lang="ts">
/**
 * ── Marketing & Market Analysis ──
 */
import { useCompanyStore } from '~/stores/companyStore'
const companyStore = useCompanyStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}
</script>

<template>
  <div class="space-y-10 animate-fade-in p-6 max-w-7xl mx-auto">
    <header>
      <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Marketing <span
          class="text-accent-500">& Marché</span></h2>
      <p class="text-dark-400 font-bold uppercase tracking-widest text-xs mt-1">Conquérez de nouvelles parts de marché
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div class="lg:col-span-3">
        <MarketingPanel />

        <!-- Market Claims (New Section) -->
        <div class="mt-10 card p-8 bg-dark-900 border-white/5">
          <h3 class="text-xl font-black text-white italic mb-6">Réclamations Clients 📣</h3>
          <div v-if="companyStore.marketClaims.length === 0" class="text-center py-10">
            <p class="text-dark-500 font-black uppercase text-xs">Aucune réclamation active. Vos clients sont ravis !
            </p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="claim in companyStore.marketClaims" :key="claim.id"
              class="p-5 rounded-2xl bg-dark-850 border border-white/5 relative group">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded"
                  :class="claim.intensity > 0.5 ? 'bg-loss-500 text-white' : 'bg-warn-500 text-black'">
                  Intensité: {{ Math.round(claim.intensity * 100) }}%
                </span>
              </div>
              <p class="text-sm font-bold text-white mb-2">{{ claim.description }}</p>
              <button
                class="mt-4 w-full py-2 bg-accent-600 text-white font-black text-[10px] rounded-lg uppercase transition-all hover:scale-105">
                {{ claim.actionLabel }} ({{ formatCurrency(claim.actionCost) }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card p-6 bg-dark-900 border-white/5">
          <h3 class="text-white font-bold mb-4 italic">Parts de Marché</h3>
          <div class="flex items-center justify-center p-6 bg-dark-850 rounded-2xl border border-white/5 mb-4">
            <span class="text-4xl font-black text-accent-500">{{ companyStore.playerMarketShare.toFixed(1) }}%</span>
          </div>
          <!-- ... concurrents mini list ... -->
        </div>
      </div>
    </div>
  </div>
</template>
