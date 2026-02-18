<script setup lang="ts">
/**
 * ── OfficePanel ──
 * Panneau de gestion immobilière : bureau actuel, options de déménagement
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

// Bureaux disponibles (supérieurs au bureau actuel)
const availableOffices = computed(() =>
    companyStore.offices.filter((o) => o.id !== companyStore.company.currentOfficeId)
)

const capacityPercent = computed(() => {
    const office = companyStore.currentOffice
    return Math.min(100, Math.round((companyStore.employeeCount / office.maxEmployees) * 100))
})

const capacityColor = computed(() => {
    if (capacityPercent.value >= 90) return 'bg-loss-500'
    if (capacityPercent.value >= 70) return 'bg-warn-500'
    return 'bg-gain-500'
})
</script>

<template>
    <div class="card">
        <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
            🏢 Bureau actuel
        </h3>

        <!-- Bureau actuel -->
        <div class="p-4 rounded-xl bg-dark-850 border border-dark-700/30 mb-4">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">{{ companyStore.currentOffice.icon }}</span>
                    <div>
                        <p class="text-white font-semibold">{{ companyStore.currentOffice.name }}</p>
                        <p class="text-dark-400 text-xs">
                            Loyer : <span class="text-accent-400">{{ formatCurrency(companyStore.currentOffice.rent)
                                }}</span>/mois
                        </p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs text-dark-400">Prestige</p>
                    <p class="text-warn-400 text-sm tracking-wider">
                        {{ '★'.repeat(companyStore.currentOffice.prestige) }}{{ '☆'.repeat(5 -
                            companyStore.currentOffice.prestige) }}
                    </p>
                </div>
            </div>

            <!-- Jauge de capacité -->
            <div>
                <div class="flex justify-between items-center mb-1.5">
                    <span class="text-xs text-dark-400">Capacité</span>
                    <span :class="[
                        'text-xs font-semibold',
                        capacityPercent >= 90 ? 'text-loss-400' :
                            capacityPercent >= 70 ? 'text-warn-400' : 'text-gain-400'
                    ]">
                        {{ companyStore.employeeCount }}/{{ companyStore.currentOffice.maxEmployees }}
                    </span>
                </div>
                <div class="progress-bar">
                    <div :class="['progress-fill', capacityColor]" :style="{ width: `${capacityPercent}%` }" />
                </div>
            </div>
        </div>

        <!-- Options de déménagement -->
        <div v-if="availableOffices.length > 0">
            <p class="text-xs text-dark-400 mb-3 uppercase tracking-wider font-medium">Déménager vers</p>
            <div class="space-y-2">
                <div v-for="office in availableOffices" :key="office.id"
                    class="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 border border-dark-700/30 hover:border-dark-600/50 transition-all">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">{{ office.icon }}</span>
                        <div>
                            <p class="text-dark-200 text-sm font-medium">{{ office.name }}</p>
                            <p class="text-dark-500 text-xs">
                                {{ office.maxEmployees }} places · {{ formatCurrency(office.rent) }}/mois
                            </p>
                        </div>
                    </div>
                    <button :class="[
                        'text-xs px-3 py-1.5 rounded-lg font-medium transition-all',
                        office.id > companyStore.company.currentOfficeId
                            ? 'bg-accent-600/20 text-accent-400 hover:bg-accent-600/30'
                            : 'bg-dark-700 text-dark-400 hover:bg-dark-600'
                    ]" @click="companyStore.upgradeOffice(office.id)">
                        {{ office.id > companyStore.company.currentOfficeId ? '⬆ Upgrade' : '⬇ Downgrade' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
