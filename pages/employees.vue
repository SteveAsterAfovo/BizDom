<script setup lang="ts">
/**
 * ── Page Employees ──
 * Gestion des employés : équipe actuelle, recrutement, avantages sociaux
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

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
    title: 'Employés — BIZDOM',
})
</script>

<template>
    <div>
        <h1 class="text-3xl font-bold text-white tracking-tight mb-1">👥 Employés</h1>
        <p class="text-dark-400 mb-6">
            {{ companyStore.employeeCount }}/{{ companyStore.currentOffice.maxEmployees }} places occupées
            <span v-if="!companyStore.canHireMore" class="text-loss-400 ml-2">⚠ Bureau plein</span>
        </p>

        <!-- Onglets -->
        <div class="flex gap-2 mb-6">
            <button v-for="tab in ([
                { key: 'team', label: '🏢 Équipe', count: companyStore.employeeCount },
                { key: 'recruit', label: '📋 Recruter', count: companyStore.recruitPool.length },
                { key: 'perks', label: '🎁 Avantages' },
            ] as const)" :key="tab.key" :class="[
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                    ? 'bg-accent-600 text-white shadow-glow-accent'
                    : 'bg-dark-800 text-dark-400 hover:text-dark-200 hover:bg-dark-700',
            ]" @click="activeTab = tab.key">
                {{ tab.label }}
                <span v-if="tab.count !== undefined" class="ml-1 text-xs opacity-60">({{ tab.count }})</span>
            </button>
        </div>

        <!-- Stats résumé équipe -->
        <div v-if="activeTab !== 'perks'" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 text-center">
                <p class="text-xs text-dark-400 mb-1">Masse salariale</p>
                <p class="text-sm font-bold text-accent-400">{{ formatCurrency(teamStats.totalSalary) }}</p>
            </div>
            <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 text-center">
                <p class="text-xs text-dark-400 mb-1">Motivation moy.</p>
                <p :class="[
                    'text-sm font-bold',
                    teamStats.avgMotivation >= 70 ? 'text-gain-400' :
                        teamStats.avgMotivation >= 40 ? 'text-warn-400' : 'text-loss-400'
                ]">{{ teamStats.avgMotivation }}%</p>
            </div>
            <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 text-center">
                <p class="text-xs text-dark-400 mb-1">Fatigue moy.</p>
                <p :class="[
                    'text-sm font-bold',
                    teamStats.avgFatigue <= 30 ? 'text-gain-400' :
                        teamStats.avgFatigue <= 60 ? 'text-warn-400' : 'text-loss-400'
                ]">{{ teamStats.avgFatigue }}%</p>
            </div>
            <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 text-center">
                <p class="text-xs text-dark-400 mb-1">Productivité</p>
                <p class="text-sm font-bold text-accent-400">{{ teamStats.productivity }}%</p>
            </div>
        </div>

        <!-- Distribution spécialités -->
        <div v-if="activeTab === 'team' && companyStore.employees.length > 0" class="flex flex-wrap gap-2 mb-6">
            <span v-for="(count, spec) in companyStore.specialtyDistribution" :key="spec" v-show="count > 0"
                :class="['badge text-xs', `${specialtyConfig[spec]?.color || 'text-dark-400'} bg-dark-800 border border-dark-700/30`]">
                {{ specialtyConfig[spec]?.label || spec }} : {{ count }}
            </span>
        </div>

        <!-- Tab : Équipe -->
        <div v-if="activeTab === 'team'">
            <div v-if="companyStore.employees.length === 0" class="text-center py-12 text-dark-500">
                <span class="text-4xl block mb-3">🏗️</span>
                <p>Aucun employé. Recrutez votre première équipe !</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <EmployeeCard v-for="employee in companyStore.employees" :key="employee.id" :employee="employee" />
            </div>
        </div>

        <!-- Tab : Recruter -->
        <div v-if="activeTab === 'recruit'">
            <div v-if="!companyStore.canHireMore"
                class="mb-4 p-3 rounded-xl bg-loss-500/10 border border-loss-500/20 text-loss-300 text-sm">
                ⚠ Bureau plein ! Déménagez vers un bureau plus grand pour recruter.
            </div>

            <div v-if="companyStore.recruitPool.length === 0" class="text-center py-12 text-dark-500">
                <span class="text-4xl block mb-3">📭</span>
                <p>Aucun candidat disponible pour le moment.</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div v-for="candidate in companyStore.recruitPool" :key="candidate.id" class="card animate-fade-in">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="text-white font-semibold">{{ candidate.name }}</h3>
                            <p class="text-dark-400 text-sm">{{ candidate.role }}</p>
                        </div>
                        <span
                            :class="['badge text-xs', specialtyConfig[candidate.specialty]?.color || 'text-dark-400', 'bg-dark-800 border border-dark-700/30']">
                            {{ specialtyConfig[candidate.specialty]?.label }}
                        </span>
                    </div>

                    <div class="mb-3 text-sm space-y-1">
                        <div class="flex justify-between text-dark-400">
                            <span>Compétence</span>
                            <span class="text-warn-400">{{ '★'.repeat(candidate.skillLevel) }}{{ '☆'.repeat(5 -
                                candidate.skillLevel) }}</span>
                        </div>
                        <div class="flex justify-between text-dark-400">
                            <span>Salaire demandé</span>
                            <span class="text-accent-400">{{ formatCurrency(candidate.salary) }}</span>
                        </div>
                        <div class="flex justify-between text-dark-400">
                            <span>Motivation</span>
                            <span class="text-gain-400">{{ candidate.motivation }}%</span>
                        </div>
                    </div>

                    <button :class="[
                        'w-full text-sm py-2 rounded-xl font-medium transition-all',
                        companyStore.canHireMore
                            ? 'btn-primary'
                            : 'bg-dark-700 text-dark-500 cursor-not-allowed'
                    ]" :disabled="!companyStore.canHireMore" @click="companyStore.hireEmployee(candidate.id)">
                        {{ companyStore.canHireMore ? '✅ Recruter' : '🔒 Bureau plein' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Tab : Avantages Sociaux -->
        <div v-if="activeTab === 'perks'">
            <PerksPanel />
        </div>
    </div>
</template>
