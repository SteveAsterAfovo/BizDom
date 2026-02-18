<script setup lang="ts">
/**
 * ── ManagementPanel ──
 * Gestion avancée : Équipement, Formation, Finance
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

const tabs = [
  { id: 'hr', label: 'RH & Formation', icon: '🎓' },
  { id: 'office', label: 'Bureaux & Équip.', icon: '🖥️' },
  { id: 'finance', label: 'Finance & Equity', icon: '💰' },
]

const activeTab = ref('hr')

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}
</script>

<template>
  <div class="card flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-white font-bold text-lg flex items-center gap-2">
        🏢 Siège Social
      </h3>
      <div class="flex bg-dark-800 p-1 rounded-xl border border-dark-700/50">
        <button v-for="tab in tabs" :key="tab.id"
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
          :class="activeTab === tab.id ? 'bg-accent-600 text-white' : 'text-dark-500 hover:text-dark-200'"
          @click="activeTab = tab.id">
          <span>{{ tab.icon }}</span> {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- RH & FORMATION -->
    <div v-if="activeTab === 'hr'" class="flex-1 space-y-4">
      <div v-for="emp in companyStore.employees" :key="emp.id"
        class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 flex items-center justify-between overflow-hidden relative">

        <!-- Overlay formation -->
        <div v-if="emp.trainingDaysRemaining > 0"
          class="absolute inset-0 bg-accent-600/20 backdrop-blur-[1px] flex items-center justify-center">
          <span class="text-xs font-bold text-accent-200 uppercase tracking-widest animate-pulse">
            Formation ({{ emp.trainingDaysRemaining.toFixed(1) }}j)
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-sm">👤</div>
          <div>
            <p class="text-xs font-bold text-white">{{ emp.name }}</p>
            <p class="text-[10px] text-dark-400">Skill : {{ emp.skillLevel }}/5</p>
          </div>
        </div>

        <button
          class="px-3 py-1.5 rounded-lg bg-accent-500/10 text-accent-400 text-[10px] font-bold border border-accent-500/20 hover:bg-accent-500/20 transition-all disabled:opacity-30"
          :disabled="emp.trainingDaysRemaining > 0 || emp.skillLevel >= 5 || companyStore.cash < (25000 * emp.skillLevel)"
          @click="companyStore.sendToTraining(emp.id)">
          Former ({{ formatCurrency(25000 * emp.skillLevel) }})
        </button>
      </div>
    </div>

    <!-- BUREAUX & EQUIPEMENT -->
    <div v-if="activeTab === 'office'" class="flex-1 space-y-6">
      <div
        class="p-4 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-[10px] text-accent-400 font-bold uppercase tracking-widest mb-1">Qualité de Vie</p>
          <h4 class="text-white font-black text-xl mb-2">Équipement Niveau {{ companyStore.company.equipmentLevel }}
          </h4>
          <p class="text-xs text-dark-400 mb-4">Réduit la fatigue accumulée chaque jour par vos employés.</p>

          <button
            class="w-full py-3 rounded-xl bg-gain-500 text-white font-bold text-sm shadow-glow-gain hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            :disabled="companyStore.cash < (50000 * companyStore.company.equipmentLevel)"
            @click="companyStore.upgradeEquipment()">
            Améliorer ({{ formatCurrency(50000 * companyStore.company.equipmentLevel) }})
          </button>
        </div>
      </div>

      <div class="p-4 border border-dark-700/50 rounded-2xl">
        <p class="text-dark-500 text-[10px] uppercase font-bold mb-2">Statut du Bureau</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-white">{{ companyStore.currentOffice.name }}</span>
          <span class="badge-accent text-[10px]">{{ companyStore.employeeCount }} / {{
            companyStore.currentOffice.maxEmployees }} pers.</span>
        </div>
      </div>
    </div>

    <!-- FINANCE & EQUITY -->
    <div v-if="activeTab === 'finance'" class="flex-1 space-y-4">
      <div class="p-4 rounded-2xl bg-dark-800 border border-dark-700">
        <div class="flex justify-between items-center mb-4">
          <p class="text-sm text-dark-300">Equity (Part Joueur)</p>
          <p class="text-xl font-black text-white">{{ ((1 - companyStore.company.investorShare) * 100).toFixed(0) }}%
          </p>
        </div>
        <div class="w-full h-2 bg-dark-700 rounded-full overflow-hidden mb-6">
          <div class="h-full bg-accent-500" :style="{ width: `${(1 - companyStore.company.investorShare) * 100}%` }">
          </div>
        </div>

        <div class="p-4 rounded-xl bg-accent-500/5 border border-accent-500/10 mb-2">
          <p class="text-xs text-accent-300 font-bold mb-1">🚀 Levée de fonds de série A</p>
          <p class="text-[10px] text-dark-400 mb-4">Recevez 100 000 FCFA immédiatement en cédant 5% de vos revenus
            futurs.</p>
          <button
            class="w-full py-2 rounded-lg bg-accent-600 text-white font-bold text-xs hover:bg-accent-500 transition-all"
            @click="companyStore.raiseFunds()">
            Lever des fonds
          </button>
        </div>
      </div>

      <p class="text-[10px] text-center text-dark-500 italic">
        L'IPO (Introduction en Bourse) sera disponible après la Série C.
      </p>
    </div>
  </div>
</template>
