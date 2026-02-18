<script setup lang="ts">
/**
 * ── Page Rapports ──
 * Historique mensuel : tableau, graphiques, indicateurs de performance
 */
import { useGameStore } from '~/stores/gameStore'

const gameStore = useGameStore()

// Formater montant
function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        maximumFractionDigits: 0,
    }).format(value) + ' FCFA'
}

// Rapports triés du plus récent au plus ancien
const sortedReports = computed(() =>
    [...gameStore.reports].reverse()
)

// Statistiques globales
const stats = computed(() => {
    if (gameStore.reports.length === 0) return null
    const reports = gameStore.reports
    const totalRevenue = reports.reduce((s, r) => s + r.revenue, 0)
    const totalProfit = reports.reduce((s, r) => s + r.netProfit, 0)
    const totalTaxes = reports.reduce((s, r) => s + r.taxes, 0)
    const avgProductivity = reports.reduce((s, r) => s + r.productivity, 0) / reports.length
    const totalEvents = reports.filter((r) => r.event !== null).length

    return {
        totalRevenue,
        totalProfit,
        totalTaxes,
        avgProductivity,
        totalEvents,
        months: reports.length,
    }
})

// SEO
useHead({
    title: 'Rapports — BIZDOM',
})
</script>

<template>
    <div>
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                📈 Rapports Mensuels
            </h1>
            <p class="text-dark-400 text-sm mt-1">
                Historique complet de la performance de votre entreprise
            </p>
        </div>

        <!-- État vide -->
        <div v-if="gameStore.reports.length === 0" class="card text-center py-16">
            <p class="text-5xl mb-4">📊</p>
            <p class="text-dark-300 text-lg font-medium">Aucun rapport disponible</p>
            <p class="text-dark-500 text-sm mt-2">
                Retournez au dashboard et cliquez sur "Mois suivant" pour générer votre premier rapport.
            </p>
            <NuxtLink to="/" class="btn-primary inline-block mt-6">
                ← Retour au Dashboard
            </NuxtLink>
        </div>

        <template v-else>
            <!-- ── Résumé Global ── -->
            <div v-if="stats" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <div class="card text-center">
                    <p class="text-xs text-dark-400 mb-1">Mois joués</p>
                    <p class="text-2xl font-bold text-accent-400">{{ stats.months }}</p>
                </div>
                <div class="card text-center">
                    <p class="text-xs text-dark-400 mb-1">Revenus cumulés</p>
                    <p class="text-lg font-bold text-gain-400">{{ formatCurrency(stats.totalRevenue) }}</p>
                </div>
                <div class="card text-center">
                    <p class="text-xs text-dark-400 mb-1">Profit net cumulé</p>
                    <p :class="['text-lg font-bold', stats.totalProfit >= 0 ? 'text-gain-400' : 'text-loss-400']">
                        {{ formatCurrency(stats.totalProfit) }}
                    </p>
                </div>
                <div class="card text-center">
                    <p class="text-xs text-dark-400 mb-1">Impôts payés</p>
                    <p class="text-lg font-bold text-warn-400">{{ formatCurrency(stats.totalTaxes) }}</p>
                </div>
                <div class="card text-center">
                    <p class="text-xs text-dark-400 mb-1">Productivité moy.</p>
                    <p class="text-2xl font-bold text-accent-400">{{ (stats.avgProductivity * 100).toFixed(0) }}%</p>
                </div>
            </div>

            <!-- ── Graphiques ── -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <LineChart title="💰 Trésorerie" :labels="gameStore.monthLabels" :datasets="[
                    { label: 'Trésorerie', data: gameStore.cashHistory, borderColor: '#6366f1' },
                ]" />
                <LineChart title="📊 Profit net" :labels="gameStore.monthLabels" :datasets="[
                    { label: 'Profit net', data: gameStore.netProfitHistory, borderColor: '#f59e0b' },
                ]" />
                <LineChart title="😊 Satisfaction" :labels="gameStore.monthLabels" :datasets="[
                    { label: 'Satisfaction', data: gameStore.satisfactionHistory, borderColor: '#10b981' },
                ]" />
            </div>

            <!-- ── Tableau détaillé ── -->
            <div class="card overflow-hidden mb-8">
                <h3 class="text-white font-bold text-lg mb-4">📋 Tableau de synthèse</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-dark-700/50">
                                <th class="text-left py-3 px-3 text-dark-400 font-medium">Mois</th>
                                <th class="text-right py-3 px-3 text-dark-400 font-medium">Revenus</th>
                                <th class="text-right py-3 px-3 text-dark-400 font-medium">Charges</th>
                                <th class="text-right py-3 px-3 text-dark-400 font-medium">Profit</th>
                                <th class="text-right py-3 px-3 text-dark-400 font-medium">Impôts</th>
                                <th class="text-right py-3 px-3 text-dark-400 font-medium">Net</th>
                                <th class="text-right py-3 px-3 text-dark-400 font-medium">Cash</th>
                                <th class="text-center py-3 px-3 text-dark-400 font-medium">Événement</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="report in sortedReports" :key="report.month"
                                class="border-b border-dark-700/20 hover:bg-dark-800/50 transition-colors">
                                <td class="py-3 px-3 text-white font-medium">Mois {{ report.month }}</td>
                                <td class="py-3 px-3 text-right text-gain-400">{{ formatCurrency(report.revenue) }}</td>
                                <td class="py-3 px-3 text-right text-loss-400">{{ formatCurrency(report.totalExpenses)
                                }}</td>
                                <td
                                    :class="['py-3 px-3 text-right font-medium', report.profit >= 0 ? 'text-gain-400' : 'text-loss-400']">
                                    {{ formatCurrency(report.profit) }}
                                </td>
                                <td class="py-3 px-3 text-right text-dark-300">{{ formatCurrency(report.taxes) }}</td>
                                <td
                                    :class="['py-3 px-3 text-right font-bold', report.netProfit >= 0 ? 'text-gain-400' : 'text-loss-400']">
                                    {{ formatCurrency(report.netProfit) }}
                                </td>
                                <td class="py-3 px-3 text-right text-white">{{ formatCurrency(report.cashAfter) }}</td>
                                <td class="py-3 px-3 text-center">
                                    <span v-if="report.event" :title="report.event.name">{{ report.event.icon }}</span>
                                    <span v-else class="text-dark-600">—</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ── Détails des rapports (cartes) ── -->
            <div>
                <h3 class="text-white font-bold text-lg mb-4">📄 Détails par mois</h3>
                <div class="space-y-3">
                    <MonthlyReport v-for="report in sortedReports" :key="'detail-' + report.month" :report="report" />
                </div>
            </div>
        </template>
    </div>
</template>
