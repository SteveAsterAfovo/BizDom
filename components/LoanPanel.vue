<script setup lang="ts">
/**
 * ── LoanPanel ──
 * Gestion des prêts bancaires : emprunter, voir en cours, rembourser
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

// Formulaire de prêt
const loanAmount = ref(50000)
const loanMonths = ref(12)
const errorMsg = ref('')


function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

// Estimation de la mensualité
const estimatedPayment = computed(() => {
  const rate = 0.03
  return Math.round((loanAmount.value * (1 + rate * loanMonths.value)) / loanMonths.value)
})

// Coût total des intérêts
const totalInterest = computed(() => {
  return (estimatedPayment.value * loanMonths.value) - loanAmount.value
})

function handleTakeLoan() {
  errorMsg.value = ''
  if (loanAmount.value > 0 && loanMonths.value > 0) {
    const success = companyStore.takeLoan(loanAmount.value, loanMonths.value)
    if (!success) {
      errorMsg.value = 'Prêt refusé : Capacité de remboursement insuffisante ou trésorerie trop critique.'
      setTimeout(() => errorMsg.value = '', 5000)
    }
  }
}

</script>

<template>
  <div class="card p-6 border rounded-[2rem] shadow-xl space-y-8"
    :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

    <header class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-black italic tracking-tighter uppercase"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          🏦 Banque <span class="text-accent-500">& Crédit</span>
        </h3>
        <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mt-1">Levier financier & gestion des
          dettes</p>
      </div>
      <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
        :class="gameStore.darkMode ? 'bg-dark-850 border border-white/5' : 'bg-slate-50 border border-slate-100'">
        💰
      </div>
    </header>

    <!-- Formulaire d'emprunt -->
    <div class="p-6 rounded-[2rem] border transition-all duration-300"
      :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">

      <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-6 italic"
        :class="gameStore.darkMode ? 'text-accent-500' : 'text-accent-600'">Configuration du prêt</p>

      <!-- Montant -->
      <div class="mb-8">
        <div class="flex justify-between items-end mb-3">
          <label class="text-[10px] font-black uppercase tracking-widest text-dark-500">Montant Principal</label>
          <span class="text-xl font-black italic tracking-tighter"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ formatCurrency(loanAmount) }}</span>
        </div>
        <input v-model.number="loanAmount" type="range" min="10000" max="200000" step="5000" class="w-full h-1.5 bg-dark-700/30 rounded-full appearance-none cursor-pointer accent-accent-500
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                           [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-xl
                           [&::-webkit-slider-thumb]:shadow-glow-accent [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110" />
      </div>

      <!-- Durée -->
      <div class="mb-8">
        <div class="flex justify-between items-end mb-3">
          <label class="text-[10px] font-black uppercase tracking-widest text-dark-500">Période de remboursement</label>
          <span class="text-lg font-black italic tracking-tighter"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ loanMonths }} Mois</span>
        </div>
        <input v-model.number="loanMonths" type="range" min="3" max="24" step="1" class="w-full h-1.5 bg-dark-700/30 rounded-full appearance-none cursor-pointer accent-accent-500
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                           [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-xl
                           [&::-webkit-slider-thumb]:shadow-glow-accent [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110" />
      </div>

      <!-- Estimations -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div class="p-4 rounded-2xl border transition-all"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5 shadow-inner' : 'bg-white border-slate-200 shadow-sm'">
          <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">Mensualité Estimée</p>
          <p class="text-base font-black italic text-warn-500">{{ formatCurrency(estimatedPayment) }}</p>
        </div>
        <div class="p-4 rounded-2xl border transition-all"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5 shadow-inner' : 'bg-white border-slate-200 shadow-sm'">
          <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">Coût Total Intérêts</p>
          <p class="text-base font-black italic text-loss-500">{{ formatCurrency(totalInterest) }}</p>
        </div>
      </div>

      <button
        class="w-full py-5 rounded-2xl bg-accent-500 text-white font-black italic text-[11px] uppercase tracking-[0.2em] shadow-glow-accent hover:scale-[1.02] active:scale-[0.98] transition-all mb-4"
        @click="handleTakeLoan">
        💰 Valider l'emprunt
      </button>

      <!-- Message d'erreur -->
      <Transition name="fade">
        <div v-if="errorMsg"
          class="p-4 rounded-2xl bg-loss-500/10 border border-loss-500/20 text-loss-500 text-[10px] text-center font-black uppercase italic tracking-wider">
          {{ errorMsg }}
        </div>
      </Transition>
    </div>


    <!-- Prêts en cours -->
    <div v-if="companyStore.loans.length > 0">
      <div class="flex items-center gap-3 mb-6">
        <span class="text-sm">📝</span>
        <p class="text-[10px] font-black uppercase tracking-[0.2em]"
          :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">Engagements en cours</p>
      </div>

      <div class="space-y-4">
        <div v-for="loan in companyStore.loans" :key="loan.id"
          class="group p-5 rounded-[2rem] border transition-all duration-300 hover:scale-[1.01]"
          :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-200'">

          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-base font-black italic tracking-tighter"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ formatCurrency(loan.amount) }}</p>
              <p class="text-[10px] font-black text-dark-500 uppercase tracking-widest">Capital restant</p>
            </div>
            <span class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest"
              :class="gameStore.darkMode ? 'bg-warn-500/10 text-warn-500 border border-warn-500/20' : 'bg-warn-50 text-warn-600 border border-warn-200'">
              {{ loan.remainingMonths }} Mois
            </span>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-dashed"
            :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-300'">
            <p class="text-[10px] font-black uppercase tracking-widest text-dark-500 italic">
              Mensualité : <span class="text-loss-500 ml-1">{{ formatCurrency(loan.monthlyPayment) }}</span>
            </p>
            <button
              class="text-[10px] font-black uppercase tracking-widest text-accent-500 hover:text-accent-400 transition-colors"
              @click="companyStore.repayLoan(loan.id)">
              Solder le prêt ✓
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 space-y-4">
      <div class="text-5xl opacity-10">🕊️</div>
      <p class="text-xs font-black uppercase tracking-widest"
        :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">Aucun engagement financier actif</p>
    </div>
  </div>
</template>
