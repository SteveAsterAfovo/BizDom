<script setup lang="ts">
/**
 * ── CompetitorCard ──
 * Affiche un concurrent IA avec sa part de marché
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'
import type { Competitor } from '~/types'

interface Props {
    competitor: Competitor
}

defineProps<Props>()

const companyStore = useCompanyStore()
const gameStore = useGameStore()
</script>

<template>
    <div class="p-5 rounded-[2rem] border transition-all duration-300 group hover:scale-[1.02]"
        :class="gameStore.darkMode ? 'bg-dark-900 border-white/5 hover:border-accent-500/30 shadow-xl' : 'bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-accent-500/20'">

        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:rotate-6 duration-300"
                    :class="gameStore.darkMode ? 'bg-dark-850 border border-white/5' : 'bg-slate-50 border border-slate-100'">
                    {{ competitor.icon }}
                </div>
                <div>
                    <h4 class="text-sm font-black italic uppercase tracking-tighter transition-colors"
                        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ competitor.name }}</h4>
                    <p class="text-[10px] font-black uppercase tracking-widest"
                        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
                        Force : <span class="text-accent-500">{{ '★'.repeat(competitor.strength) }}{{ '☆'.repeat(5 -
                            competitor.strength) }}</span>
                    </p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-2xl font-black italic tracking-tighter" :class="[
                    competitor.marketShare > companyStore.playerMarketShare ? 'text-loss-500' : 'text-gain-500'
                ]">
                    {{ competitor.marketShare.toFixed(1) }}%
                </p>
                <p class="text-[8px] font-black uppercase tracking-widest text-dark-500">Market Share</p>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-1.5">
            <div class="w-full h-1.5 rounded-full overflow-hidden p-0.5"
                :class="gameStore.darkMode ? 'bg-dark-800' : 'bg-slate-100'">
                <div class="h-full rounded-full transition-all duration-1000 shadow-glow-loss/20"
                    :class="competitor.marketShare > 20 ? 'bg-loss-500 shadow-glow-loss' : 'bg-warn-500 shadow-glow-warn'"
                    :style="{ width: `${Math.min(100, competitor.marketShare)}%` }" />
            </div>
        </div>
    </div>
</template>
