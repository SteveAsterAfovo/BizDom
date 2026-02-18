<script setup lang="ts">
/**
 * ── MarketingPanel ──
 * Panneau de contrôle marketing : slider budget, estimation clients, ROI
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

// Budget marketing local (lié au slider)
const localBudget = ref(companyStore.marketingBudget)

// Synchroniser avec le store
watch(localBudget, (val) => {
  companyStore.setMarketingBudget(val)
})

// Estimation du ROI
const estimatedROI = computed(() => {
  const newCustomers = companyStore.estimatedNewCustomers
  const estimatedRevenue = newCustomers * companyStore.company.revenuePerCustomer
  const roi = localBudget.value > 0
    ? ((estimatedRevenue - localBudget.value) / localBudget.value) * 100
    : 0
  return Math.round(roi)
})

// Formater les montants
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}
</script>

<template>
  <div class="card">
    <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
      📢 Marketing
    </h3>

    <!-- Slider Budget -->
    <div class="mb-5">
      <div class="flex justify-between items-center mb-2">
        <label class="text-sm text-dark-400">Budget mensuel</label>
        <span class="text-accent-400 font-semibold text-sm">
          {{ formatCurrency(localBudget) }}
        </span>
      </div>
      <input
        v-model.number="localBudget"
        type="range"
        min="0"
        max="30000"
        step="500"
        class="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer
               [&::-webkit-slider-thumb]:appearance-none
               [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
               [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:shadow-glow-accent
               [&::-webkit-slider-thumb]:cursor-pointer
               [&::-webkit-slider-thumb]:transition-all
               [&::-webkit-slider-thumb]:hover:bg-accent-400"
      />
      <div class="flex justify-between text-xs text-dark-500 mt-1">
        <span>0</span>
        <span>30 000</span>
      </div>
    </div>

    <!-- Estimations -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Nouveaux clients estimés -->
      <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
        <p class="text-xs text-dark-400 mb-1">Nouveaux clients</p>
        <p class="text-lg font-bold text-accent-400">
          +{{ companyStore.estimatedNewCustomers }}
        </p>
      </div>

      <!-- ROI estimé -->
      <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
        <p class="text-xs text-dark-400 mb-1">ROI estimé</p>
        <p :class="[
          'text-lg font-bold',
          estimatedROI >= 0 ? 'text-gain-400' : 'text-loss-400'
        ]">
          {{ estimatedROI }}%
        </p>
      </div>
    </div>
  </div>
</template>
