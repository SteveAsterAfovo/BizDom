<script setup lang="ts">
/**
 * ── Bank & Finance Page ──
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
  title: 'Banque',
})
</script>

<template>
  <div class="space-y-10 animate-fade-in p-2 sm:p-6 max-w-7xl mx-auto">
    <header class="text-center sm:text-left pt-4 sm:pt-0">
      <h2 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        Banque <span class="text-accent-500">& Crédits</span>
      </h2>
      <p class="text-[10px] font-black uppercase tracking-[0.2em] mt-2"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Gestion de la dette et optimisation de la trésorerie
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <LoanPanel />
      </div>

      <div class="space-y-6">
        <!-- Résumé Financier -->
        <div class="card p-8 border rounded-[2.5rem] shadow-xl"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <h3 class="font-black italic uppercase text-lg mb-8"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Résumé Financier</h3>

          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-black uppercase tracking-widest text-dark-500">Trésorerie Actuelle</span>
              <span class="font-black italic text-sm"
                :class="companyStore.company.cash >= 0 ? 'text-gain-500' : 'text-loss-500'">
                {{ formatCurrency(companyStore.company.cash) }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-[9px] font-black uppercase tracking-widest text-dark-500">Dette Totale</span>
              <span class="text-loss-500 font-black italic text-sm">
                {{formatCurrency(companyStore.loans.reduce((s, l) => s + (l.monthlyPayment * l.remainingMonths), 0))}}
              </span>
            </div>

            <div class="flex justify-between items-center pt-6 border-t"
              :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
              <span class="text-[9px] font-black uppercase tracking-widest text-dark-500">Capacité d'emprunt</span>
              <span class="text-accent-500 font-black italic text-sm">
                {{ formatCurrency(companyStore.loanRepaymentCapacity) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Conseil Pro -->
        <div class="p-8 rounded-[2.5rem] border transition-all"
          :class="gameStore.darkMode ? 'bg-accent-500/5 border-accent-500/20' : 'bg-accent-50 border-accent-100'">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-lg">💡</span>
            <p class="text-[10px] text-accent-600 font-black uppercase tracking-widest">Conseil Stratégique</p>
          </div>
          <p class="text-xs font-bold leading-relaxed" :class="gameStore.darkMode ? 'text-dark-300' : 'text-slate-600'">
            Maintenez votre <span class="text-accent-500">Score Global</span> au dessus de <span
              class="text-accent-500">400</span> pour débloquer des taux d'intérêts préférentiels auprès de la BIZ-BANK.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
