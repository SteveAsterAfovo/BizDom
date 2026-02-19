<script setup lang="ts">
/**
 * ── MarketingPanel ──
 * Panneau de contrôle marketing avec 3 canaux distincts
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

// Budgets locaux liés aux sliders
const channelBudgets = ref(
  companyStore.marketingChannels.map((ch) => ch.budget)
)

// Synchroniser avec le store
watch(channelBudgets, (vals) => {
  vals.forEach((budget, i) => {
    companyStore.setChannelBudget(companyStore.marketingChannels[i].id, budget)
  })
}, { deep: true })

// Estimation du ROI global
const estimatedROI = computed(() => {
  const newCustomers = companyStore.estimatedNewCustomers
  const estimatedRevenue = newCustomers * companyStore.company.revenuePerCustomer
  const totalBudget = companyStore.totalMarketingBudget
  if (totalBudget <= 0) return 0
  return Math.round(((estimatedRevenue - totalBudget) / totalBudget) * 100)
})

// Formater les montants
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

// Estimation clients par canal
function channelEstimate(index: number): number {
  const ch = companyStore.marketingChannels[index]
  return Math.round(ch.budget * ch.efficiency * companyStore.salesBonus)
}
</script>

<template>
  <div class="card p-6 border rounded-[2rem] shadow-xl space-y-8"
    :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

    <header class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-black italic tracking-tighter uppercase"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          📢 Marketing <span class="text-accent-500">& Expansion</span>
        </h3>
        <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mt-1">Acquisition clients & ROI
          stratégique</p>
      </div>
      <div class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
        :class="gameStore.darkMode ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'bg-accent-50 text-accent-600 border border-accent-100'">
        {{ formatCurrency(companyStore.totalMarketingBudget) }} / mois
      </div>
    </header>

    <!-- Canaux Marketing -->
    <div class="space-y-6">
      <div v-for="(channel, index) in companyStore.marketingChannels" :key="channel.id"
        class="group p-5 rounded-[2rem] border transition-all duration-300"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">

        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-110 duration-500"
              :class="gameStore.darkMode ? 'bg-dark-900 border border-white/5' : 'bg-white border border-slate-200'">
              {{ channel.icon }}
            </div>
            <div>
              <span class="text-sm font-black italic uppercase tracking-tighter"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ channel.name }}</span>
              <p class="text-[10px] font-black text-dark-500 uppercase tracking-widest mt-0.5">{{ channel.description }}
              </p>
            </div>
          </div>
          <span class="text-lg font-black italic tracking-tighter"
            :class="gameStore.darkMode ? 'text-accent-400' : 'text-accent-600'">
            {{ formatCurrency(channelBudgets[index]) }}
          </span>
        </div>

        <input v-model.number="channelBudgets[index]" type="range" min="0" max="15000" step="500" class="w-full h-1.5 bg-dark-700/30 rounded-full appearance-none cursor-pointer accent-accent-500
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                 [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-xl
                 [&::-webkit-slider-thumb]:shadow-glow-accent
                 [&::-webkit-slider-thumb]:cursor-pointer
                 [&::-webkit-slider-thumb]:transition-all
                 [&::-webkit-slider-thumb]:hover:scale-110" />

        <div class="flex justify-between items-center mt-3">
          <span class="text-[8px] font-black uppercase tracking-widest text-dark-600">Min: 0</span>
          <span class="text-[9px] font-black uppercase tracking-widest italic"
            :class="gameStore.darkMode ? 'text-accent-500' : 'text-accent-600'">
            🚀 +{{ channelEstimate(index) }} clients estimés
          </span>
          <span class="text-[8px] font-black uppercase tracking-widest text-dark-600">Max: 15K</span>
        </div>
      </div>
    </div>

    <!-- Estimations globales -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dashed"
      :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-200'">

      <div class="p-4 rounded-2xl border text-center transition-all"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
        <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">Nouveaux Clients</p>
        <p class="text-xl font-black italic tracking-tighter text-accent-500">
          +{{ companyStore.estimatedNewCustomers }}
        </p>
      </div>

      <div class="p-4 rounded-2xl border text-center transition-all"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
        <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">ROI Estimé</p>
        <p class="text-xl font-black italic tracking-tighter"
          :class="estimatedROI >= 0 ? 'text-gain-500' : 'text-loss-500'">
          {{ estimatedROI }}%
        </p>
      </div>

      <div class="p-4 rounded-2xl border text-center transition-all"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
        <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">Multiplicateur</p>
        <p class="text-xl font-black italic tracking-tighter text-gain-500">
          x{{ companyStore.salesBonus.toFixed(1) }}
        </p>
      </div>
    </div>
  </div>
</template>
