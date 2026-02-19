<script setup lang="ts">
/**
 * ── Page Rapports ──
 * Historique mensuel : tableau, graphiques, indicateurs de performance
 */
import { useGameStore } from '~/stores/gameStore'
import { useCompanyStore } from '~/stores/companyStore'

const gameStore = useGameStore()
const companyStore = useCompanyStore()

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
  title: 'Rapports',
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-12 animate-fade-in p-1">
    <!-- Header -->
    <header class="text-center sm:text-left">
      <h1 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        📈 Rapports d'Activité
      </h1>
      <p class="text-[10px] font-black uppercase tracking-[0.3em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Analyse de performance & Historique financier
      </p>
    </header>

    <!-- ── Mois en cours (Estimation) ── -->
    <section v-if="gameStore.currentMonth > 0" class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-6 bg-accent-500 rounded-full"></div>
        <h2 class="text-xl font-black italic uppercase tracking-tight"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Projection du Mois</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="projection in ([
          { label: 'Trésorerie Actuelle', value: formatCurrency(companyStore.company.cash), color: 'text-white' },
          { label: 'Revenu Estimé', value: `≈ ${formatCurrency(companyStore.market.customerBase * companyStore.company.revenuePerCustomer * companyStore.productivity)}`, color: 'text-gain-500' },
          { label: 'Charges Fixes', value: formatCurrency(companyStore.company.fixedCosts + companyStore.officeRent), color: 'text-loss-500' },
          { label: 'Risque de Grève', value: `${companyStore.strikeRisk.toFixed(1)}%`, color: companyStore.strikeRisk > 50 ? 'text-loss-500' : 'text-accent-500' },
        ])" :key="projection.label" class="p-8 rounded-[2rem] border shadow-lg transition-transform hover:scale-[1.02]"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mb-2">{{ projection.label }}</p>
          <p class="text-xl font-black italic"
            :class="[projection.color === 'text-white' && !gameStore.darkMode ? 'text-slate-900' : projection.color]">
            {{ projection.value }}
          </p>
        </div>
      </div>
    </section>

    <!-- État vide -->
    <div v-if="gameStore.reports.length === 0"
      class="text-center py-24 rounded-[3rem] border border-dashed border-dark-700/30"
      :class="gameStore.darkMode ? 'bg-dark-900/20' : 'bg-slate-50/50'">
      <p class="text-6xl mb-6">📊</p>
      <p class="font-black italic uppercase tracking-tighter text-2xl text-dark-500">Aucun rapport archivé</p>
      <p class="text-xs font-bold text-dark-400 mt-2 uppercase tracking-widest">
        Bouclez votre premier mois pour voir les données apparaître.
      </p>
      <NuxtLink to="/" class="btn-primary inline-block mt-8 px-10 py-4 rounded-2xl">
        ← Retour au Dashboard
      </NuxtLink>
    </div>

    <template v-else>
      <!-- ── Résumé Global ── -->
      <section v-if="stats" class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div v-for="stat in ([
          { label: 'Cycles Joués', value: stats.months, color: 'text-accent-500' },
          { label: 'CA Cumulé', value: formatCurrency(stats.totalRevenue), color: 'text-gain-500' },
          { label: 'Bénéfice Net', value: formatCurrency(stats.totalProfit), color: stats.totalProfit >= 0 ? 'text-gain-500' : 'text-loss-500' },
          { label: 'Taxes Versées', value: formatCurrency(stats.totalTaxes), color: 'text-warn-500' },
          { label: 'Efficience Moy.', value: `${(stats.avgProductivity * 100).toFixed(0)}%`, color: 'text-accent-500' },
        ])" :key="stat.label" class="card p-5 text-center rounded-3xl border"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-100 shadow-sm'">
          <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">{{ stat.label }}</p>
          <p class="text-base font-black italic uppercase" :class="stat.color">{{ stat.value }}</p>
        </div>
      </section>

      <!-- ── Graphiques ── -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div v-for="chart in ([
          { title: '💰 Trésorerie', data: gameStore.cashHistory, color: '#6366f1' },
          { title: '📊 Profit net', data: gameStore.netProfitHistory, color: '#f59e0b' },
          { title: '😊 Satisfaction', data: gameStore.satisfactionHistory, color: '#10b981' },
        ])" :key="chart.title" class="p-6 rounded-[2.5rem] border"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <LineChart :title="chart.title" :labels="gameStore.monthLabels" :datasets="[
            { label: chart.title.substring(2), data: chart.data, borderColor: chart.color },
          ]" />
        </div>
      </section>

      <!-- ── Tableau détaillé ── -->
      <section class="card p-8 rounded-[2.5rem] border shadow-xl overflow-hidden"
        :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-1.5 h-6 bg-accent-500 rounded-full"></div>
          <h3 class="text-xl font-black italic uppercase tracking-tight text-white"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Synthèse Chronologique</h3>
        </div>

        <div class="overflow-x-auto -mx-8">
          <table class="w-full text-[11px] font-bold uppercase tracking-tight">
            <thead>
              <tr class="border-b"
                :class="gameStore.darkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'">
                <th class="py-4 px-6 text-left text-dark-500">Mois</th>
                <th class="py-4 px-6 text-right text-dark-500">Revenus</th>
                <th class="py-4 px-6 text-right text-dark-500">Dépenses</th>
                <th class="py-4 px-6 text-right text-dark-500">Bénéfice</th>
                <th class="py-4 px-6 text-right text-dark-500">Taxes</th>
                <th class="py-4 px-6 text-right text-dark-500">Net</th>
                <th class="py-4 px-6 text-right text-dark-500 font-black">Cash</th>
                <th class="py-4 px-6 text-center text-dark-500">Evt</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="gameStore.darkMode ? 'divide-white/5' : 'divide-slate-50'">
              <tr v-for="report in sortedReports" :key="report.month" class="transition-colors"
                :class="gameStore.darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'">
                <td class="py-4 px-6 italic" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Mois {{
                  report.month }}</td>
                <td class="py-4 px-6 text-right text-gain-500">{{ formatCurrency(report.revenue) }}</td>
                <td class="py-4 px-6 text-right text-loss-500">{{ formatCurrency(report.totalExpenses) }}</td>
                <td class="py-4 px-6 text-right italic" :class="report.profit >= 0 ? 'text-gain-500' : 'text-loss-500'">
                  {{ formatCurrency(report.profit) }}
                </td>
                <td class="py-4 px-6 text-right text-warn-500">{{ formatCurrency(report.taxes) }}</td>
                <td class="py-4 px-6 text-right font-black italic"
                  :class="report.netProfit >= 0 ? 'text-gain-500 border-r-2 border-gain-500/20' : 'text-loss-500 border-r-2 border-loss-500/20'">
                  {{ formatCurrency(report.netProfit) }}
                </td>
                <td class="py-4 px-6 text-right font-black italic"
                  :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ formatCurrency(report.cashAfter) }}
                </td>
                <td class="py-4 px-6 text-center text-xl">
                  <span v-if="report.event" :title="report.event.name">{{ report.event.icon }}</span>
                  <span v-else class="text-dark-700 opacity-20">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ── Détails des rapports (cartes) ── -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-accent-500 rounded-full"></div>
          <h2 class="text-xl font-black italic uppercase tracking-tight"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Archives Détaillées</h2>
        </div>
        <div class="space-y-6">
          <MonthlyReport v-for="report in sortedReports" :key="'detail-' + report.month" :report="report" />
        </div>
      </section>
    </template>
  </div>
</template>
