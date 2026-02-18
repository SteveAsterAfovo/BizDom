<script setup lang="ts">
/**
 * ── Page Dashboard ──
 * Page principale du jeu : KPIs, graphiques, marketing, événements
 */
import { useGameStore } from '~/stores/gameStore'
import { useCompanyStore } from '~/stores/companyStore'

const gameStore = useGameStore()
const companyStore = useCompanyStore()

// Formater le cash en FCFA
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

// Derniers événements pour notification
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

        <!-- ── KPI Cards ── -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <FinancialCard title="Trésorerie" :value="formatCurrency(companyStore.cash)" icon="💰"
                :trend="companyStore.cash >= 100000 ? 'up' : companyStore.cash > 0 ? 'neutral' : 'down'" />
            <FinancialCard title="Profit du mois" :value="lastProfit" icon="📊" :trend="profitTrend"
                :subtitle="gameStore.lastReport ? `Mois ${gameStore.lastReport.month}` : 'Aucun rapport'" />
            <FinancialCard title="Employés" :value="companyStore.employeeCount" icon="👥" trend="neutral"
                :subtitle="`Productivité : ${(companyStore.productivity * 100).toFixed(0)}%`" />
            <FinancialCard title="Clients" :value="companyStore.market.customerBase" icon="🎯"
                :trend="companyStore.estimatedNewCustomers > 0 ? 'up' : 'neutral'"
                :subtitle="`+${companyStore.estimatedNewCustomers} estimés`" />
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

        <!-- ── Marketing + Événements ── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Panneau Marketing -->
            <MarketingPanel />

            <!-- Notifications événements récents -->
            <div class="card">
                <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    🔔 Événements récents
                </h3>

                <div v-if="recentEvents.length === 0" class="text-dark-500 text-sm py-4 text-center">
                    Aucun événement pour le moment.<br />
                    Simulez un mois pour commencer !
                </div>

                <div v-else class="space-y-2">
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
    </div>
</template>
