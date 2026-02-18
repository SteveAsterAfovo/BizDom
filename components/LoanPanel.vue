<script setup lang="ts">
/**
 * ── LoanPanel ──
 * Gestion des prêts bancaires : emprunter, voir en cours, rembourser
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

// Formulaire de prêt
const loanAmount = ref(50000)
const loanMonths = ref(12)

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
    if (loanAmount.value > 0 && loanMonths.value > 0) {
        companyStore.takeLoan(loanAmount.value, loanMonths.value)
    }
}
</script>

<template>
    <div class="card">
        <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
            🏦 Banque
        </h3>

        <!-- Formulaire d'emprunt -->
        <div class="p-4 rounded-xl bg-dark-850 border border-dark-700/30 mb-4">
            <p class="text-xs text-dark-400 uppercase tracking-wider font-medium mb-3">Nouvel emprunt</p>

            <!-- Montant -->
            <div class="mb-3">
                <div class="flex justify-between items-center mb-1">
                    <label class="text-sm text-dark-400">Montant</label>
                    <span class="text-accent-400 font-semibold text-sm">{{ formatCurrency(loanAmount) }}</span>
                </div>
                <input v-model.number="loanAmount" type="range" min="10000" max="200000" step="5000" class="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:shadow-glow-accent [&::-webkit-slider-thumb]:cursor-pointer" />
            </div>

            <!-- Durée -->
            <div class="mb-4">
                <div class="flex justify-between items-center mb-1">
                    <label class="text-sm text-dark-400">Durée</label>
                    <span class="text-dark-200 font-semibold text-sm">{{ loanMonths }} mois</span>
                </div>
                <input v-model.number="loanMonths" type="range" min="3" max="24" step="1" class="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:shadow-glow-accent [&::-webkit-slider-thumb]:cursor-pointer" />
            </div>

            <!-- Estimations -->
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="p-2 rounded-lg bg-dark-800/50 text-center">
                    <p class="text-xs text-dark-400">Mensualité</p>
                    <p class="text-sm font-bold text-warn-400">{{ formatCurrency(estimatedPayment) }}</p>
                </div>
                <div class="p-2 rounded-lg bg-dark-800/50 text-center">
                    <p class="text-xs text-dark-400">Intérêts totaux</p>
                    <p class="text-sm font-bold text-loss-400">{{ formatCurrency(totalInterest) }}</p>
                </div>
            </div>

            <button class="w-full btn-primary text-sm" @click="handleTakeLoan">
                💰 Emprunter {{ formatCurrency(loanAmount) }}
            </button>
        </div>

        <!-- Prêts en cours -->
        <div v-if="companyStore.loans.length > 0">
            <p class="text-xs text-dark-400 uppercase tracking-wider font-medium mb-3">Prêts en cours</p>
            <div class="space-y-2">
                <div v-for="loan in companyStore.loans" :key="loan.id"
                    class="p-3 rounded-xl bg-dark-800/50 border border-dark-700/30">
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-sm text-white font-medium">{{ formatCurrency(loan.amount) }}</p>
                        <span class="badge-warn">{{ loan.remainingMonths }} mois restants</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="text-xs text-dark-400">
                            Mensualité : <span class="text-loss-400">{{ formatCurrency(loan.monthlyPayment) }}</span>
                        </p>
                        <button class="text-xs text-accent-400 hover:text-accent-300 transition-colors"
                            @click="companyStore.repayLoan(loan.id)">
                            Rembourser ✓
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-4">
            <p class="text-dark-500 text-sm">Aucun prêt en cours</p>
        </div>
    </div>
</template>
