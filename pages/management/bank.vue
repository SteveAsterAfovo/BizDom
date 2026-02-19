<script setup lang="ts">
/**
 * ── Bank & Finance Page ──
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
      <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Banque <span
          class="text-accent-500">& Crédits</span></h2>
      <p class="text-dark-400 font-bold uppercase tracking-widest text-xs mt-1">Gérez votre dette et votre trésorerie
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <LoanPanel />
      </div>
      <div class="space-y-6">
        <div class="card p-6 bg-dark-900 border-white/5">
          <h3 class="text-white font-bold mb-4 italic">Résumé Financier</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center text-xs">
              <span class="text-dark-500 font-bold uppercase">Trésorerie Actuelle</span>
              <span class="text-white font-black">{{ formatCurrency(companyStore.company.cash) }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-dark-500 font-bold uppercase">Dette Totale</span>
              <span class="text-loss-400 font-black">{{formatCurrency(companyStore.loans.reduce((s, l) => s +
                (l.monthlyPayment * l.remainingMonths), 0)) }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-dark-500 font-bold uppercase">Capacité d'emprunt</span>
              <span class="text-gain-400 font-black">{{ formatCurrency(companyStore.loanRepaymentCapacity) }}</span>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-3xl bg-accent-500/5 border border-accent-500/20">
          <p class="text-[10px] text-accent-500 font-black uppercase mb-1">💡 Conseil Pro</p>
          <p class="text-xs text-dark-300 font-medium">Maintenez votre Score Global au dessus de 400 pour débloquer des
            taux d'intérêts préférentiels.</p>
        </div>
      </div>
    </div>
  </div>
</template>
