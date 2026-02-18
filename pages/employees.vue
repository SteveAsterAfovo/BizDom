<script setup lang="ts">
/**
 * ── Page Employés ──
 * Gestion du personnel : visualisation, recrutement, augmentation, licenciement
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

// Onglet actif (équipe / recrutement)
const activeTab = ref<'team' | 'recruit'>('team')

// Formater le salaire
function formatSalary(salary: number): string {
    return new Intl.NumberFormat('fr-FR').format(salary) + ' FCFA'
}

// Étoiles de compétence
function skillStars(level: number): string {
    return '★'.repeat(level) + '☆'.repeat(5 - level)
}

// SEO
useHead({
    title: 'Employés — BIZDOM',
})
</script>

<template>
    <div>
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    👥 Gestion du Personnel
                </h1>
                <p class="text-dark-400 text-sm mt-1">
                    {{ companyStore.employeeCount }} employés · Masse salariale :
                    <span class="text-accent-400 font-semibold">{{ formatSalary(companyStore.totalSalaries) }}</span>
                    /mois
                </p>
            </div>

            <!-- Onglets -->
            <div class="flex bg-dark-800 rounded-xl p-1 border border-dark-700/50">
                <button :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    activeTab === 'team'
                        ? 'bg-accent-600/20 text-accent-400'
                        : 'text-dark-400 hover:text-dark-200'
                ]" @click="activeTab = 'team'">
                    Mon équipe
                </button>
                <button :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative',
                    activeTab === 'recruit'
                        ? 'bg-accent-600/20 text-accent-400'
                        : 'text-dark-400 hover:text-dark-200'
                ]" @click="activeTab = 'recruit'">
                    Recrutement
                    <span v-if="companyStore.recruitPool.length > 0"
                        class="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                        {{ companyStore.recruitPool.length }}
                    </span>
                </button>
            </div>
        </div>

        <!-- ── Onglet : Mon équipe ── -->
        <div v-if="activeTab === 'team'">
            <div v-if="companyStore.employees.length === 0" class="card text-center py-12">
                <p class="text-4xl mb-3">😰</p>
                <p class="text-dark-400">Vous n'avez plus d'employés !</p>
                <p class="text-dark-500 text-sm mt-1">Allez dans l'onglet Recrutement pour embaucher.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <EmployeeCard v-for="employee in companyStore.employees" :key="employee.id" :employee="employee" />
            </div>

            <!-- Résumé productivité -->
            <div class="mt-6 card">
                <h3 class="text-white font-bold text-sm mb-3">📊 Résumé productivité</h3>
                <div class="grid grid-cols-3 gap-4">
                    <div class="text-center">
                        <p class="text-2xl font-bold text-accent-400">{{ (companyStore.productivity * 100).toFixed(0)
                            }}%</p>
                        <p class="text-xs text-dark-400 mt-1">Productivité globale</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-dark-200">{{ companyStore.employeeCount }}</p>
                        <p class="text-xs text-dark-400 mt-1">Employés actifs</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-warn-400">{{ formatSalary(companyStore.totalSalaries) }}</p>
                        <p class="text-xs text-dark-400 mt-1">Masse salariale</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Onglet : Recrutement ── -->
        <div v-if="activeTab === 'recruit'">
            <div v-if="companyStore.recruitPool.length === 0" class="card text-center py-12">
                <p class="text-4xl mb-3">🏖️</p>
                <p class="text-dark-400">Plus de candidats disponibles pour le moment.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="candidate in companyStore.recruitPool" :key="candidate.id" class="card animate-fade-in">
                    <!-- Info candidat -->
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-white font-semibold text-base">{{ candidate.name }}</h3>
                            <p class="text-dark-400 text-sm">{{ candidate.role }}</p>
                        </div>
                        <span class="badge-warn">Candidat</span>
                    </div>

                    <!-- Compétence -->
                    <div class="mb-3">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs text-dark-400">Compétence</span>
                            <span class="text-sm text-warn-400 tracking-wider">{{ skillStars(candidate.skillLevel)
                                }}</span>
                        </div>
                    </div>

                    <!-- Salaire demandé -->
                    <div class="mb-4">
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-dark-400">Salaire demandé</span>
                            <span class="text-sm text-accent-400 font-semibold">{{ formatSalary(candidate.salary)
                                }}</span>
                        </div>
                    </div>

                    <!-- Bouton recruter -->
                    <button class="w-full btn-primary text-sm" @click="companyStore.hireEmployee(candidate.id)">
                        ✅ Recruter
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
