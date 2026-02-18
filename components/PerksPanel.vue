<script setup lang="ts">
/**
 * ── PerksPanel ──
 * Gestion des avantages sociaux : activer/désactiver les perks
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

function isPerkActive(perkId: number): boolean {
    return companyStore.company.activePerks.includes(perkId)
}

function togglePerk(perkId: number) {
    if (isPerkActive(perkId)) {
        companyStore.removePerk(perkId)
    } else {
        companyStore.addPerk(perkId)
    }
}
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-white font-bold text-lg flex items-center gap-2">
                🎁 Avantages Sociaux
            </h3>
            <span class="badge-accent">
                {{ formatCurrency(companyStore.totalPerkCosts) }}/mois
            </span>
        </div>

        <div class="space-y-3">
            <div v-for="perk in companyStore.availablePerks" :key="perk.id" :class="[
                'p-3 rounded-xl border transition-all duration-200 cursor-pointer',
                isPerkActive(perk.id)
                    ? 'bg-accent-500/10 border-accent-500/30'
                    : 'bg-dark-850 border-dark-700/30 hover:border-dark-600/50'
            ]" @click="togglePerk(perk.id)">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">{{ perk.icon }}</span>
                        <div>
                            <p :class="['text-sm font-medium', isPerkActive(perk.id) ? 'text-white' : 'text-dark-200']">
                                {{ perk.name }}
                            </p>
                            <p class="text-dark-500 text-xs">{{ perk.description }}</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-3">
                        <p class="text-xs text-dark-400">{{ formatCurrency(perk.cost) }}/mois</p>
                        <div class="flex gap-2 mt-1">
                            <span class="text-xs text-gain-400">+{{ perk.motivationBoost }} motiv.</span>
                            <span v-if="perk.fatigueReduction > 0" class="text-xs text-accent-400">-{{
                                perk.fatigueReduction }} fatigue</span>
                        </div>
                    </div>
                </div>

                <!-- Toggle visuel -->
                <div class="flex justify-end mt-2">
                    <div :class="[
                        'w-10 h-5 rounded-full transition-all duration-200 relative',
                        isPerkActive(perk.id) ? 'bg-accent-500' : 'bg-dark-600'
                    ]">
                        <div :class="[
                            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow',
                            isPerkActive(perk.id) ? 'left-5' : 'left-0.5'
                        ]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
