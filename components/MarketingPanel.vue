<script setup lang="ts">
/**
 * ── MarketingPanel ──
 * Panneau de contrôle marketing avec 3 canaux distincts
 * Chaque canal a son propre slider de budget et son efficacité
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

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
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white font-bold text-lg flex items-center gap-2">
        📢 Marketing
      </h3>
      <span class="badge-accent">
        {{ formatCurrency(companyStore.totalMarketingBudget) }}/mois
      </span>
    </div>

    <!-- Canaux Marketing -->
    <div class="space-y-4 mb-5">
      <div v-for="(channel, index) in companyStore.marketingChannels" :key="channel.id">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="text-lg">{{ channel.icon }}</span>
            <div>
              <span class="text-sm text-dark-200 font-medium">{{ channel.name }}</span>
              <p class="text-xs text-dark-500">{{ channel.description }}</p>
            </div>
          </div>
          <span class="text-accent-400 font-semibold text-sm">
            {{ formatCurrency(channelBudgets[index]) }}
          </span>
        </div>
        <input v-model.number="channelBudgets[index]" type="range" min="0" max="15000" step="500" class="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                 [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:shadow-glow-accent
                 [&::-webkit-slider-thumb]:cursor-pointer
                 [&::-webkit-slider-thumb]:transition-all
                 [&::-webkit-slider-thumb]:hover:bg-accent-400" />
        <div class="flex justify-between text-xs text-dark-500 mt-0.5">
          <span>0</span>
          <span class="text-accent-400">+{{ channelEstimate(index) }} clients estimés</span>
          <span>15 000</span>
        </div>
      </div>
    </div>

    <!-- Estimations globales -->
    <div class="grid grid-cols-3 gap-3">
      <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 text-center">
        <p class="text-xs text-dark-400 mb-1">Nouveaux clients</p>
        <p class="text-lg font-bold text-accent-400">
          +{{ companyStore.estimatedNewCustomers }}
        </p>
      </div>
      <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 text-center">
        <p class="text-xs text-dark-400 mb-1">ROI estimé</p>
        <p :class="[
          'text-lg font-bold',
          estimatedROI >= 0 ? 'text-gain-400' : 'text-loss-400'
        ]">
          {{ estimatedROI }}%
        </p>
      </div>
      <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 text-center">
        <p class="text-xs text-dark-400 mb-1">Bonus ventes</p>
        <p class="text-lg font-bold text-gain-400">
          x{{ companyStore.salesBonus.toFixed(1) }}
        </p>
      </div>
    </div>
  </div>
</template>
