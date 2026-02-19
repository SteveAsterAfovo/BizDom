<script setup lang="ts">
/**
 * ── ManagementPanel ──
 * Gestion avancée : Équipement, Formation, Finance
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

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
  <div class="card flex flex-col h-full p-6 border rounded-[2rem] shadow-xl overflow-hidden"
    :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

    <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
      <div>
        <h3 class="text-xl font-black italic tracking-tighter uppercase text-center sm:text-left"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          🏢 Siège <span class="text-accent-500">& Stratégie</span>
        </h3>
        <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mt-1 text-center sm:text-left">Pilotage
          centralisé de votre empire</p>
      </div>

      <div class="flex p-1.5 rounded-2xl border transition-all"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5 shadow-inner' : 'bg-slate-100 border-slate-200'">
        <button v-for="tab in tabs" :key="tab.id"
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          :class="activeTab === tab.id
            ? 'bg-accent-500 text-white shadow-glow-accent'
            : (gameStore.darkMode ? 'text-dark-500 hover:text-white' : 'text-slate-500 hover:text-slate-900')"
          @click="activeTab = tab.id">
          <span class="hidden sm:inline">{{ tab.icon }}</span> {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- RH & FORMATION -->
    <div v-if="activeTab === 'hr'" class="flex-1 space-y-4 animate-fade-in">
      <div v-for="emp in companyStore.employees" :key="emp.id"
        class="group p-5 rounded-[2rem] border transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">

        <!-- Overlay formation (Premium Pulse) -->
        <div v-if="emp.trainingDaysRemaining > 0"
          class="absolute inset-0 bg-accent-600/10 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity">
          <div
            class="flex items-center gap-3 px-6 py-2 rounded-full bg-accent-500/90 text-white border border-accent-400/50 shadow-glow-accent">
            <span class="animate-spin">⌛</span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] italic">
              Formation ({{ emp.trainingDaysRemaining.toFixed(1) }}j)
            </span>
          </div>
        </div>

        <div class="flex items-center gap-5 w-full sm:w-auto">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 duration-500 shadow-lg"
            :class="gameStore.darkMode ? 'bg-dark-900 border border-white/5' : 'bg-white border border-slate-200'">
            👤
          </div>
          <div>
            <p class="text-sm font-black italic tracking-tighter uppercase"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ emp.name }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[9px] font-black uppercase tracking-widest text-dark-500">Compétence</span>
              <div class="flex gap-0.5">
                <span v-for="i in 5" :key="i" class="text-[10px]"
                  :class="i <= emp.skillLevel ? 'text-accent-500' : 'text-dark-700'">★</span>
              </div>
            </div>
          </div>
        </div>

        <button
          class="w-full sm:w-auto px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all disabled:opacity-30 flex items-center justify-center gap-2"
          :class="gameStore.darkMode
            ? 'bg-accent-500/10 text-accent-400 border-accent-500/20 hover:bg-accent-500/20'
            : 'bg-white text-accent-600 border-slate-200 hover:border-accent-500 shadow-sm'"
          :disabled="emp.trainingDaysRemaining > 0 || emp.skillLevel >= 5 || companyStore.cash < (25000 * emp.skillLevel)"
          @click="companyStore.sendToTraining(emp.id)">
          Former <span class="opacity-50">•</span> {{ formatCurrency(25000 * emp.skillLevel) }}
        </button>
      </div>
    </div>

    <!-- BUREAUX & EQUIPEMENT -->
    <div v-if="activeTab === 'office'" class="flex-1 space-y-6 animate-fade-in">
      <div class="p-8 rounded-[2.5rem] relative overflow-hidden border group transition-all duration-500"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'">

        <!-- Decoration -->
        <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-colors"
          :class="gameStore.darkMode ? 'bg-gain-500' : 'bg-gain-600'"></div>

        <div class="relative z-10 text-center sm:text-left">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] mb-3 italic"
            :class="gameStore.darkMode ? 'text-gain-500' : 'text-gain-600'">Standard de Qualité</p>
          <h4 class="text-3xl font-black italic tracking-tighter uppercase mb-2"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
            Équipement <span class="text-accent-500">Lv. {{ companyStore.company.equipmentLevel }}</span>
          </h4>
          <p class="text-xs font-bold leading-relaxed mb-6 max-w-sm"
            :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">
            Optimisez l'ergonomie pour réduire la fatigue journalière de vos équipes de <span
              class="text-accent-500">20%</span>.
          </p>

          <button
            class="w-full py-5 rounded-2xl text-white font-black italic text-[11px] uppercase tracking-[0.2em] shadow-glow-gain hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 bg-gain-500"
            :disabled="companyStore.cash < (50000 * companyStore.company.equipmentLevel)"
            @click="companyStore.upgradeEquipment()">
            Mettre à niveau <span class="opacity-50">|</span> {{ formatCurrency(50000 *
              companyStore.company.equipmentLevel) }}
          </button>
        </div>
      </div>

      <div class="p-6 rounded-[2rem] border flex items-center justify-between"
        :class="gameStore.darkMode ? 'bg-dark-950 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mb-1">Localisation Actuelle</p>
          <span class="text-sm font-black italic text-accent-500 uppercase tracking-tight">{{
            companyStore.currentOffice.name }}</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-xs font-black italic" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
              {{ companyStore.employeeCount }} / {{ companyStore.currentOffice.maxEmployees }}
            </p>
            <p class="text-[8px] font-black uppercase tracking-widest text-dark-500">Capacité HR</p>
          </div>
          <div class="w-2 h-8 rounded-full bg-dark-800 overflow-hidden">
            <div class="w-full bg-accent-500 transition-all duration-1000"
              :style="{ height: `${(companyStore.employeeCount / companyStore.currentOffice.maxEmployees) * 100}%` }">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FINANCE & EQUITY -->
    <div v-if="activeTab === 'finance'" class="flex-1 space-y-6 animate-fade-in">
      <div class="p-8 rounded-[2.5rem] border transition-all"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5 shadow-xl' : 'bg-slate-50 border-slate-200 shadow-sm'">

        <div class="flex justify-between items-center mb-6">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic"
              :class="gameStore.darkMode ? 'text-accent-500' : 'text-accent-600'">Structure de l'Actionnariat</p>
            <h4 class="text-2xl font-black italic tracking-tighter uppercase"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Parts Fondateur</h4>
          </div>
          <p class="text-4xl font-black italic tracking-tighter text-accent-500">
            {{ ((1 - companyStore.company.investorShare) * 100).toFixed(0) }}%
          </p>
        </div>

        <div class="w-full h-3 rounded-full overflow-hidden mb-10 p-0.5 border"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200'">
          <div class="h-full rounded-full bg-accent-500 shadow-glow-accent transition-all duration-1000"
            :style="{ width: `${(1 - companyStore.company.investorShare) * 100}%` }">
          </div>
        </div>

        <div class="p-6 rounded-[2rem] border transition-all"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center text-2xl border border-accent-500/20">
              🚀</div>
            <div>
              <p class="text-sm font-black italic uppercase tracking-tighter"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Série A : Levée de fonds</p>
              <p class="text-[9px] font-bold text-dark-500 uppercase tracking-widest mt-0.5">Injection immédiate de 100
                000 FCFA</p>
            </div>
          </div>

          <p class="text-[10px] font-bold leading-relaxed mb-6 italic"
            :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">
            Consolidez votre trésorerie en cédant <span class="text-accent-500">5%</span> de votre capital à des
            investisseurs providentiels.
          </p>

          <button class="w-full py-4 rounded-xl font-black italic text-[10px] uppercase tracking-[0.2em] transition-all"
            :class="gameStore.darkMode ? 'bg-accent-600 text-white hover:bg-accent-500 shadow-glow-accent' : 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg'"
            @click="companyStore.raiseFunds()">
            Lever des fonds stratégiques
          </button>
        </div>
      </div>

      <div class="text-center space-y-2 py-4">
        <p class="text-[10px] text-dark-500 font-black uppercase tracking-[0.2em] italic">
          🔒 Roadmap Financière
        </p>
        <p class="text-[9px] text-dark-600 font-bold uppercase tracking-widest">
          L'IPO (Introduction en Bourse) sera disponible après la validation de la Série C.
        </p>
      </div>
    </div>
  </div>
</template>
