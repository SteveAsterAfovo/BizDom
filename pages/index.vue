<script setup lang="ts">
/**
 * ── Page Dashboard ──
 * Page principale du jeu : KPIs, graphiques, marketing, bureaux, banque,
 * concurrence, satisfaction, événements
 */
import { useGameStore } from '~/stores/gameStore'
import { useCompanyStore } from '~/stores/companyStore'

const gameStore = useGameStore()
const companyStore = useCompanyStore()

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        maximumFractionDigits: 0,
    }).format(value) + ' FCFA'
}

// Tendance basée sur le dernier rapport
const profitTrend = computed(() => {
    const last = gameStore.lastReport
    if (!last) return 'neutral'
    return last.netProfit >= 0 ? 'up' : 'down'
})

const lastProfit = computed(() => {
    const last = gameStore.lastReport
    if (!last) return '—'
    return (last.netProfit >= 0 ? '+' : '') + formatCurrency(last.netProfit)
})

// Derniers événements
const recentEvents = computed(() =>
    gameStore.eventHistory.slice(-3).reverse()
)

// SEO
useHead({
    title: 'Dashboard — BIZDOM',
})
</script>

<template>
    <div>
        <!-- En-tête avec bouton simulation -->
        <DashboardHeader />

        <!-- Contrôle du temps réel -->
        <TimePanel class="mb-6" />

        <!-- Banner de sauvegarde -->
        <SaveGameBanner />

        <!-- ── KPI Cards ── -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <FinancialCard title="Trésorerie" :value="formatCurrency(companyStore.cash)" icon="💰"
                :trend="companyStore.cash >= 100000 ? 'up' : companyStore.cash > 0 ? 'neutral' : 'down'" />
            <FinancialCard title="Profit du mois" :value="lastProfit" icon="📊" :trend="profitTrend"
                :subtitle="gameStore.lastReport ? `Mois ${gameStore.lastReport.month}` : 'Aucun rapport'" />
            <FinancialCard title="Employés"
                :value="`${companyStore.employeeCount}/${companyStore.currentOffice.maxEmployees}`" icon="👥"
                trend="neutral" :subtitle="`Productivité : ${(companyStore.productivity * 100).toFixed(0)}%`" />
            <FinancialCard title="Clients" :value="companyStore.market.customerBase" icon="🎯"
                :trend="companyStore.estimatedNewCustomers > 0 ? 'up' : 'neutral'"
                :subtitle="`Satisfaction : ${companyStore.market.satisfaction}%`" />
        </div>

        <!-- ── Graphiques ── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <LineChart title="📈 Évolution de la trésorerie" :labels="gameStore.monthLabels" :datasets="[
                { label: 'Trésorerie', data: gameStore.cashHistory, borderColor: '#6366f1' },
            ]" />
            <LineChart title="💹 Revenus & Profit net" :labels="gameStore.monthLabels" :datasets="[
                { label: 'Revenus', data: gameStore.revenueHistory, borderColor: '#10b981' },
                { label: 'Profit net', data: gameStore.netProfitHistory, borderColor: '#f59e0b' },
            ]" />
        </div>

        <!-- ── Gestion : Marketing + Bureau + Banque ── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <MarketingPanel />
            <OfficePanel />
            <LoanPanel />
        </div>

        <!-- ── Concurrence & Satisfaction ── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <!-- Concurrents -->
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-white font-bold text-lg flex items-center gap-2">
                        🏆 Marché & Concurrence
                    </h3>
                    <span class="badge-accent">
                        Votre part : {{ companyStore.playerMarketShare.toFixed(1) }}%
                    </span>
                </div>
                <div class="space-y-3">
                    <!-- Part du joueur -->
                    <div class="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xl">🏅</span>
                                <p class="text-sm font-semibold text-accent-400">{{ companyStore.company.name }}</p>
                            </div>
                            <p class="text-lg font-bold text-accent-400">{{ companyStore.playerMarketShare.toFixed(1)
                            }}%</p>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill bg-accent-500"
                                :style="{ width: `${companyStore.playerMarketShare}%` }" />
                        </div>
                    </div>
                    <!-- Concurrents IA -->
                    <CompetitorCard v-for="comp in companyStore.competitors" :key="comp.id" :competitor="comp" />
                </div>
            </div>

            <!-- Satisfaction & Fatigue -->
            <div class="card">
                <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    📊 Indicateurs de santé
                </h3>
                <div class="space-y-4">
                    <!-- Satisfaction -->
                    <div class="p-4 rounded-xl bg-dark-850 border border-dark-700/30">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-dark-300 text-sm font-medium">😊 Satisfaction client (NPS)</span>
                            <span :class="[
                                'font-bold text-lg',
                                companyStore.market.satisfaction >= 70 ? 'text-gain-400' :
                                    companyStore.market.satisfaction >= 40 ? 'text-warn-400' : 'text-loss-400'
                            ]">
                                {{ companyStore.market.satisfaction }}%
                            </span>
                        </div>
                        <div class="progress-bar h-3">
                            <div :class="[
                                'progress-fill',
                                companyStore.market.satisfaction >= 70 ? 'bg-gain-500' :
                                    companyStore.market.satisfaction >= 40 ? 'bg-warn-500' : 'bg-loss-500'
                            ]" :style="{ width: `${companyStore.market.satisfaction}%` }" />
                        </div>
                        <p class="text-xs text-dark-500 mt-2">
                            Churn : {{ (companyStore.market.churnRate * 100).toFixed(1) }}% des clients perdus/mois
                        </p>
                    </div>

                    <!-- Fatigue moyenne -->
                    <div class="p-4 rounded-xl bg-dark-850 border border-dark-700/30">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-dark-300 text-sm font-medium">😓 Fatigue moyenne</span>
                            <span :class="[
                                'font-bold text-lg',
                                companyStore.averageFatigue <= 30 ? 'text-gain-400' :
                                    companyStore.averageFatigue <= 60 ? 'text-warn-400' : 'text-loss-400'
                            ]">
                                {{ companyStore.averageFatigue }}%
                            </span>
                        </div>
                        <div class="progress-bar h-3">
                            <div :class="[
                                'progress-fill',
                                companyStore.averageFatigue <= 30 ? 'bg-gain-500' :
                                    companyStore.averageFatigue <= 60 ? 'bg-warn-500' : 'bg-loss-500'
                            ]" :style="{ width: `${companyStore.averageFatigue}%` }" />
                        </div>
                        <p class="text-xs text-dark-500 mt-2">
                            Activez des avantages sociaux pour réduire la fatigue
                        </p>
                    </div>

                    <!-- Achievements rapide -->
                    <div class="p-4 rounded-xl bg-dark-850 border border-dark-700/30">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-dark-300 text-sm font-medium">🏆 Succès</span>
                            <span class="font-bold text-lg text-warn-400">
                                {{ gameStore.unlockedCount }}/{{ gameStore.achievements.length }}
                            </span>
                        </div>
                        <div class="progress-bar h-3">
                            <div class="progress-fill bg-warn-500"
                                :style="{ width: `${gameStore.achievementProgress}%` }" />
                        </div>
                        <NuxtLink to="/achievements"
                            class="text-xs text-accent-400 hover:text-accent-300 mt-2 inline-block transition-colors">
                            Voir tous les succès →
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Événements récents ── -->
        <div class="card">
            <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                🔔 Événements récents
            </h3>

            <div v-if="recentEvents.length === 0" class="text-dark-500 text-sm py-4 text-center">
                Aucun événement pour le moment.<br />
                Simulez un mois pour commencer !
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div v-for="event in recentEvents" :key="event.id + '-' + Math.random()" :class="[
                    'p-3 rounded-xl border transition-all duration-200',
                    event.type === 'gain' ? 'bg-gain-500/5 border-gain-500/20' :
                        event.type === 'loss' ? 'bg-loss-500/5 border-loss-500/20' :
                            event.type === 'boost' ? 'bg-accent-500/5 border-accent-500/20' :
                                'bg-warn-500/5 border-warn-500/20'
                ]">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">{{ event.icon }}</span>
                        <div>
                            <p class="text-sm font-medium text-white">{{ event.name }}</p>
                            <p class="text-xs text-dark-400">{{ event.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
