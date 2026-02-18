<script setup lang="ts">
/**
 * ── MonthlyReport ──
 * Affichage structuré d'un rapport mensuel sous forme de carte
 */
import type { MonthlyReport } from '~/types'

interface Props {
  report: MonthlyReport
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
})

const isOpen = ref(props.expanded)

// Formater montant en FCFA
function formatCurrency(value: number): string {
  const prefix = value >= 0 ? '' : ''
  return prefix + new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}
</script>

<template>
  <div class="card">
    <!-- Header cliquable -->
    <button
      class="w-full flex items-center justify-between"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3">
        <span class="text-lg">📄</span>
        <div class="text-left">
          <h3 class="text-white font-semibold">Mois {{ report.month }}</h3>
          <p class="text-xs text-dark-400">
            {{ report.employeeCount }} employés · {{ report.customerBase }} clients
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span :class="[
          'text-sm font-bold',
          report.netProfit >= 0 ? 'text-gain-400' : 'text-loss-400'
        ]">
          {{ report.netProfit >= 0 ? '+' : '' }}{{ formatCurrency(report.netProfit) }}
        </span>
        <span :class="['transition-transform duration-200', isOpen ? 'rotate-180' : '']">
          ▾
        </span>
      </div>
    </button>

    <!-- Détails du rapport -->
    <Transition name="expand">
      <div v-if="isOpen" class="mt-4 pt-4 border-t border-dark-700/50 space-y-3">
        <!-- Grille de métriques -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
            <p class="text-xs text-dark-400">Revenus</p>
            <p class="text-sm font-semibold text-gain-400">{{ formatCurrency(report.revenue) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
            <p class="text-xs text-dark-400">Charges totales</p>
            <p class="text-sm font-semibold text-loss-400">{{ formatCurrency(report.totalExpenses) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
            <p class="text-xs text-dark-400">Salaires</p>
            <p class="text-sm font-semibold text-dark-200">{{ formatCurrency(report.totalSalaries) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
            <p class="text-xs text-dark-400">Impôts</p>
            <p class="text-sm font-semibold text-dark-200">{{ formatCurrency(report.taxes) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
            <p class="text-xs text-dark-400">Marketing</p>
            <p class="text-sm font-semibold text-accent-400">{{ formatCurrency(report.marketingBudget) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
            <p class="text-xs text-dark-400">Productivité</p>
            <p class="text-sm font-semibold text-accent-400">{{ (report.productivity * 100).toFixed(0) }}%</p>
          </div>
        </div>

        <!-- Nouveaux clients -->
        <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30">
          <p class="text-xs text-dark-400">Nouveaux clients ce mois</p>
          <p class="text-sm font-semibold text-accent-400">+{{ report.newCustomers }}</p>
        </div>

        <!-- Événement -->
        <div
          v-if="report.event"
          :class="[
            'p-3 rounded-xl border',
            report.event.type === 'gain' ? 'bg-gain-500/10 border-gain-500/20' :
            report.event.type === 'loss' ? 'bg-loss-500/10 border-loss-500/20' :
            report.event.type === 'boost' ? 'bg-accent-500/10 border-accent-500/20' :
            'bg-warn-500/10 border-warn-500/20'
          ]"
        >
          <p class="text-xs text-dark-400 mb-0.5">Événement</p>
          <p class="text-sm font-semibold text-white">
            {{ report.event.icon }} {{ report.event.name }}
          </p>
        </div>

        <!-- Cash final -->
        <div class="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
          <p class="text-xs text-dark-400">Trésorerie après ce mois</p>
          <p class="text-lg font-bold text-white">{{ formatCurrency(report.cashAfter) }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
