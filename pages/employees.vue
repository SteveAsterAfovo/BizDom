<script setup lang="ts">
/**
 * ── Page Employees ──
 * Gestion des employés : équipe actuelle, recrutement, avantages sociaux
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

// Onglet actif
const activeTab = ref<'team' | 'recruit' | 'perks'>('team')

// Formater le salaire
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

// Statistiques de l'équipe
const teamStats = computed(() => ({
  totalSalary: companyStore.totalSalaries,
  avgMotivation: companyStore.employees.length > 0
    ? Math.round(companyStore.employees.reduce((s, e) => s + e.motivation, 0) / companyStore.employees.length)
    : 0,
  avgFatigue: companyStore.averageFatigue,
  productivity: Math.round(companyStore.productivity * 100),
}))

// Badge de spécialité
const specialtyConfig: Record<string, { label: string; color: string }> = {
  tech: { label: 'Tech', color: 'text-blue-400' },
  sales: { label: 'Ventes', color: 'text-gain-400' },
  creative: { label: 'Créatif', color: 'text-purple-400' },
  hr: { label: 'RH', color: 'text-pink-400' },
  management: { label: 'Direction', color: 'text-warn-400' },
}

// SEO
useHead({
  title: 'Employés',
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8 animate-fade-in p-1">
    <header class="mb-8 text-center sm:text-left">
      <h1 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        👥 Ressources Humaines
      </h1>
      <p class="text-[10px] font-black uppercase tracking-[0.3em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        {{ companyStore.employeeCount }}/{{ companyStore.currentOffice.maxEmployees }} Postes occupés
        <span v-if="!companyStore.canHireMore" class="text-loss-500 ml-2 animate-pulse">⚠ Bureau saturé</span>
      </p>
    </header>

    <!-- Navigation par Onglets -->
    <div class="flex flex-wrap gap-2 p-1.5 rounded-2xl border"
      :class="gameStore.darkMode ? 'bg-dark-900/50 border-white/5' : 'bg-slate-100/50 border-slate-200'">
      <button v-for="tab in ([
        { key: 'team', label: '🏢 Équipe', count: companyStore.employeeCount },
        { key: 'recruit', label: '📋 Recrutement', count: companyStore.recruitPool.length },
        { key: 'perks', label: '🎁 Avantages' },
      ] as const)" :key="tab.key" :class="[
        'flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
        activeTab === tab.key
          ? 'bg-accent-600 text-white shadow-glow-accent'
          : gameStore.darkMode ? 'text-dark-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-white',
      ]" @click="activeTab = tab.key">
        {{ tab.label }}
        <span v-if="'count' in tab && tab.count !== undefined" class="ml-1 opacity-50">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Statistiques Globales RH -->
    <div v-if="activeTab !== 'perks'" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in ([
        { label: 'Masse Salariale', value: formatCurrency(teamStats.totalSalary), color: 'text-accent-500' },
        { label: 'Motivation Moy.', value: `${teamStats.avgMotivation}%`, color: teamStats.avgMotivation >= 70 ? 'text-gain-500' : teamStats.avgMotivation >= 40 ? 'text-warn-500' : 'text-loss-500' },
        { label: 'Fatigue Moy.', value: `${teamStats.avgFatigue}%`, color: teamStats.avgFatigue <= 30 ? 'text-gain-500' : teamStats.avgFatigue <= 60 ? 'text-warn-500' : 'text-loss-500' },
        { label: 'Productivité', value: `${teamStats.productivity}%`, color: 'text-accent-500' },
      ])" :key="stat.label" class="p-6 rounded-[2rem] border transition-all"
        :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
        <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mb-2">{{ stat.label }}</p>
        <p class="text-xl font-black italic" :class="stat.color">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Distribution des Spécialités -->
    <div v-if="activeTab === 'team' && companyStore.employees.length > 0"
      class="flex flex-wrap gap-3 p-6 rounded-[2rem] border"
      :class="gameStore.darkMode ? 'bg-dark-900/30 border-white/5' : 'bg-slate-50 border-slate-200'">
      <span v-for="(count, spec) in companyStore.specialtyDistribution" :key="spec" v-show="count > 0"
        class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm transition-all"
        :class="[
          specialtyConfig[spec]?.color || 'text-dark-400',
          gameStore.darkMode ? 'bg-dark-850 border-white/10' : 'bg-white border-slate-200'
        ]">
        {{ specialtyConfig[spec]?.label || spec }} : {{ count }}
      </span>
    </div>

    <!-- Contenu des Onglets -->
    <Transition name="tab-fade" mode="out-in">
      <!-- Tab : Équipe -->
      <div v-if="activeTab === 'team'" key="team" class="space-y-6">
        <div v-if="companyStore.employees.length === 0"
          class="text-center py-24 rounded-[3rem] border border-dashed border-dark-700/30"
          :class="gameStore.darkMode ? 'bg-dark-900/20' : 'bg-slate-50/50'">
          <span class="text-6xl block mb-6">🏗️</span>
          <p class="font-black italic uppercase tracking-tighter text-2xl text-dark-500">Aucun employé actif</p>
          <button @click="activeTab = 'recruit'" class="mt-8 btn-primary px-8 py-4 rounded-[1.5rem]">Ouvrir le
            recrutement</button>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <EmployeeCard v-for="employee in companyStore.employees" :key="employee.id" :employee="employee" />
        </div>
      </div>

      <!-- Tab : Recruter -->
      <div v-else-if="activeTab === 'recruit'" key="recruit" class="space-y-6">
        <div v-if="!companyStore.canHireMore"
          class="p-6 rounded-3xl bg-loss-500/10 border border-loss-500/30 text-loss-500 text-sm font-black italic uppercase tracking-tight text-center">
          ⚠ Capacité maximale atteinte ! Améliorez vos bureaux pour recruter davantage.
        </div>

        <div v-if="companyStore.recruitPool.length === 0"
          class="text-center py-24 rounded-[3rem] border border-dashed border-dark-700/30"
          :class="gameStore.darkMode ? 'bg-dark-900/20' : 'bg-slate-50/50'">
          <span class="text-6xl block mb-6">📭</span>
          <p class="font-black italic uppercase tracking-tighter text-2xl text-dark-500">Le vivier est vide</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="candidate in companyStore.recruitPool" :key="candidate.id"
            class="p-8 rounded-[2.5rem] border transition-all duration-300 hover:scale-[1.02] shadow-lg"
            :class="gameStore.darkMode ? 'bg-dark-900 border-white/10' : 'bg-white border-slate-200'">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h3 class="text-xl font-black italic tracking-tighter uppercase"
                  :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                  {{ candidate.name }}
                </h3>
                <p class="text-[10px] font-black uppercase text-dark-500 tracking-widest mt-1">{{ candidate.role }}
                </p>
              </div>
              <span class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border" :class="[
                specialtyConfig[candidate.specialty]?.color || 'text-dark-400',
                gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-200 font-bold'
              ]">
                {{ specialtyConfig[candidate.specialty]?.label }}
              </span>
            </div>

            <div class="space-y-4 mb-8">
              <div class="flex justify-between items-center px-4 py-3 rounded-2xl"
                :class="gameStore.darkMode ? 'bg-dark-850' : 'bg-slate-50'">
                <span class="text-[9px] font-black uppercase text-dark-500">Expertise</span>
                <span class="text-warn-500 text-xs">{{ '★'.repeat(candidate.skillLevel) }}{{ '☆'.repeat(5 -
                  candidate.skillLevel) }}</span>
              </div>
              <div class="flex justify-between items-center px-4 py-3 rounded-2xl"
                :class="gameStore.darkMode ? 'bg-dark-850' : 'bg-slate-50'">
                <span class="text-[9px] font-black uppercase text-dark-500">Prétention</span>
                <span class="font-black italic text-accent-500 text-sm">{{ formatCurrency(candidate.salary) }}</span>
              </div>
              <div class="flex justify-between items-center px-4 py-3 rounded-2xl"
                :class="gameStore.darkMode ? 'bg-dark-850' : 'bg-slate-50'">
                <span class="text-[9px] font-black uppercase text-dark-500">Motivation</span>
                <span class="font-black italic text-gain-500 text-sm">{{ candidate.motivation }}%</span>
              </div>
            </div>

            <button :class="[
              'w-full py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md',
              companyStore.canHireMore
                ? 'btn-primary shadow-glow-accent/20'
                : 'bg-dark-800 text-dark-600 border border-white/5 cursor-not-allowed'
            ]" :disabled="!companyStore.canHireMore" @click="companyStore.hireEmployee(candidate.id)">
              {{ companyStore.canHireMore ? '➕ Finaliser l\'embauche' : '🔒 Bureau saturé' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab : Avantages Sociaux -->
      <div v-else key="perks">
        <PerksPanel />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
