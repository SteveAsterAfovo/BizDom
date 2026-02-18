<script setup lang="ts">
/**
 * ── MonthlyReport ──
 * Carte détaillée d'un rapport mensuel avec toutes les métriques
 */
import type { MonthlyReport } from '~/types'

interface Props {
  report: MonthlyReport
}

const props = defineProps<Props>()
const isExpanded = ref(false)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}
</script>

<template>
  <div :class="[
    'card animate-fade-in cursor-pointer',
    isExpanded ? 'ring-1 ring-accent-500/30' : '',
  ]" @click="isExpanded = !isExpanded">
    <!-- Header rapide -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center text-lg font-bold text-accent-400">
          {{ report.month }}
        </div>
        <div>
          <p class="text-white font-semibold text-sm">Mois {{ report.month }}</p>
          <p :class="[
            'text-xs font-medium',
            report.netProfit >= 0 ? 'text-gain-400' : 'text-loss-400'
          ]">
            {{ report.netProfit >= 0 ? '+' : '' }}{{ formatCurrency(report.netProfit) }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-dark-400">{{ formatCurrency(report.cashAfter) }}</span>
        <span class="text-dark-500 transition-transform duration-200"
          :style="{ transform: isExpanded ? 'rotate(180deg)' : '' }">
          ▼
        </span>
      </div>
    </div>

    <!-- Détails (expanded) -->
    <Transition name="expand">
      <div v-if="isExpanded" class="mt-4 pt-4 border-t border-dark-700/30 space-y-3">
        <!-- Revenus & Charges -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-2 rounded-lg bg-dark-850 text-center">
            <p class="text-xs text-dark-400">Revenus</p>
            <p class="text-sm font-bold text-gain-400">{{ formatCurrency(report.revenue) }}</p>
          </div>
          <div class="p-2 rounded-lg bg-dark-850 text-center">
            <p class="text-xs text-dark-400">Dépenses</p>
            <p class="text-sm font-bold text-loss-400">{{ formatCurrency(report.totalExpenses) }}</p>
          </div>
        </div>

        <!-- Détail des charges -->
        <div class="text-sm space-y-1.5">
          <div class="flex justify-between text-dark-400">
            <span>Salaires</span>
            <span class="text-dark-200">{{ formatCurrency(report.totalSalaries) }}</span>
          </div>
          <div class="flex justify-between text-dark-400">
            <span>Coûts fixes</span>
            <span class="text-dark-200">{{ formatCurrency(report.fixedCosts) }}</span>
          </div>
          <div class="flex justify-between text-dark-400">
            <span>Loyer bureau</span>
            <span class="text-dark-200">{{ formatCurrency(report.officeRent) }}</span>
          </div>
          <div class="flex justify-between text-dark-400">
            <span>Marketing</span>
            <span class="text-dark-200">{{ formatCurrency(report.marketingBudget) }}</span>
          </div>
          <div v-if="report.perksCost > 0" class="flex justify-between text-dark-400">
            <span>Avantages sociaux</span>
            <span class="text-dark-200">{{ formatCurrency(report.perksCost) }}</span>
          </div>
          <div v-if="report.loanPayments > 0" class="flex justify-between text-dark-400">
            <span>Remboursement prêts</span>
            <span class="text-warn-400">{{ formatCurrency(report.loanPayments) }}</span>
          </div>
          <div class="flex justify-between text-dark-400 pt-1 border-t border-dark-700/30">
            <span>Taxes</span>
            <span class="text-dark-200">{{ formatCurrency(report.taxes) }}</span>
          </div>
        </div>

        <!-- KPI du mois -->
        <div class="grid grid-cols-3 gap-2 pt-2">
          <div class="p-2 rounded-lg bg-dark-850 text-center">
            <p class="text-xs text-dark-500">Clients</p>
            <p class="text-xs font-bold text-accent-400">{{ report.customerBase }}</p>
            <p class="text-[10px] text-dark-500">
              +{{ report.newCustomers }} / -{{ report.churnedCustomers }}
            </p>
          </div>
          <div class="p-2 rounded-lg bg-dark-850 text-center">
            <p class="text-xs text-dark-500">Satisfaction</p>
            <p :class="[
              'text-xs font-bold',
              report.satisfaction >= 70 ? 'text-gain-400' :
                report.satisfaction >= 40 ? 'text-warn-400' : 'text-loss-400'
            ]">{{ report.satisfaction }}%</p>
          </div>
          <div class="p-2 rounded-lg bg-dark-850 text-center">
            <p class="text-xs text-dark-500">Productivité</p>
            <p class="text-xs font-bold text-accent-400">{{ (report.productivity * 100).toFixed(0) }}%</p>
          </div>
        </div>

        <!-- Événement du mois -->
        <div v-if="report.event" :class="[
          'p-3 rounded-xl border',
          report.event.type === 'gain' ? 'bg-gain-500/5 border-gain-500/20' :
            report.event.type === 'loss' ? 'bg-loss-500/5 border-loss-500/20' :
              'bg-warn-500/5 border-warn-500/20'
        ]">
          <div class="flex items-center gap-2">
            <span>{{ report.event.icon }}</span>
            <div>
              <p class="text-sm font-medium text-white">{{ report.event.name }}</p>
              <p class="text-xs text-dark-400">{{ report.event.description }}</p>
            </div>
          </div>
        </div>

        <!-- Cash final -->
        <div class="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 text-center">
          <p class="text-xs text-dark-400 mb-1">Trésorerie fin de mois</p>
          <p class="text-lg font-bold text-accent-400">{{ formatCurrency(report.cashAfter) }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
</style>
