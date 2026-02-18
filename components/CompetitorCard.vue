<script setup lang="ts">
/**
 * ── CompetitorCard ──
 * Affiche un concurrent IA avec sa part de marché
 */
import { useCompanyStore } from '~/stores/companyStore'
import type { Competitor } from '~/types'

interface Props {
    competitor: Competitor
}

defineProps<Props>()

const companyStore = useCompanyStore()
</script>

<template>
    <div class="p-3 rounded-xl bg-dark-850 border border-dark-700/30 transition-all hover:border-dark-600/50">
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
                <span class="text-xl">{{ competitor.icon }}</span>
                <div>
                    <p class="text-sm font-medium text-dark-200">{{ competitor.name }}</p>
                    <p class="text-xs text-dark-500">
                        Force : {{ '★'.repeat(competitor.strength) }}{{ '☆'.repeat(5 - competitor.strength) }}
                    </p>
                </div>
            </div>
            <div class="text-right">
                <p :class="[
                    'text-lg font-bold',
                    competitor.marketShare > companyStore.playerMarketShare ? 'text-loss-400' : 'text-dark-300'
                ]">
                    {{ competitor.marketShare.toFixed(1) }}%
                </p>
                <p class="text-xs text-dark-500">part de marché</p>
            </div>
        </div>
        <!-- Barre de part de marché -->
        <div class="progress-bar">
            <div class="progress-fill bg-loss-500/60" :style="{ width: `${Math.min(100, competitor.marketShare)}%` }" />
        </div>
    </div>
</template>
