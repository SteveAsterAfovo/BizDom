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
  title: 'Dashboard',
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <FinancialCard title="Trésorerie" :value="formatCurrency(companyStore.cash)" icon="💰"
        :trend="companyStore.cash >= 100000 ? 'up' : companyStore.cash > 0 ? 'neutral' : 'down'"
        :subtitle="companyStore.cash < 0 ? 'Risque de faillite !' : 'Trésorerie saine'" />
      <FinancialCard title="Profit du mois" :value="lastProfit" icon="📊" :trend="profitTrend"
        :subtitle="companyStore.company.investorShare > 0 ? `Equity : ${((1 - companyStore.company.investorShare) * 100).toFixed(0)}%` : (gameStore.lastReport ? `Variation : ${((gameStore.lastReport.netProfit / (gameStore.reports[gameStore.reports.length - 2]?.netProfit || 1)) * 100).toFixed(0)}%` : 'Aucun rapport')" />
      <FinancialCard title="Employés"
        :value="`${companyStore.employeeCount}/${companyStore.currentOffice.maxEmployees}`" icon="👥" trend="neutral"
        :subtitle="companyStore.strikeRisk > 30 ? `⚠️ Risque grève: ${companyStore.strikeRisk.toFixed(0)}%` : `Productivité : ${(companyStore.productivity * 100).toFixed(0)}%`" />
      <FinancialCard title="Clients" :value="Math.max(0, companyStore.market.customerBase)" icon="🎯"
        :trend="companyStore.estimatedNewCustomers > 0 ? 'up' : 'neutral'"
        :subtitle="`Churn : ${(companyStore.market.churnRate * 100).toFixed(1)}%`" />
    </div>

    <!-- ── Projets Actifs ── -->
    <div v-if="companyStore.activeProjects.filter(p => p.status === 'active').length > 0" class="mb-10">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-black italic uppercase tracking-tighter text-xl"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          🚀 Projets en production ({{companyStore.activeProjects.filter(p => p.status === 'active').length}})
        </h3>
        <NuxtLink to="/management/projects"
          class="text-[10px] font-black uppercase text-accent-500 hover:text-accent-400">
          Gérer la production →
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in companyStore.activeProjects.filter(p => p.status === 'active')" :key="project.id"
          class="card p-5 border rounded-[2rem] shadow-lg animate-fade-in"
          :class="gameStore.darkMode ? 'bg-dark-950/50 border-white/5 shadow-glow-accent/5' : 'bg-white border-slate-100 shadow-sm'">
          <div class="flex justify-between items-start mb-4">
            <h4 class="text-sm font-black italic uppercase tracking-tight truncate pr-4"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ project.title }}</h4>
            <span
              class="text-[8px] font-black bg-accent-500 text-white px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </div>
          <div class="space-y-3">
            <div class="progress-bar h-1.5 bg-dark-800 rounded-full overflow-hidden">
              <div class="progress-fill h-full bg-accent-500 shadow-glow-accent transition-all duration-1000"
                :style="{ width: project.progress + '%' }" />
            </div>
            <div class="flex justify-between text-[9px] font-bold uppercase tracking-widest text-dark-500">
              <span>Progression</span>
              <span>{{ Math.round(project.progress) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Graphiques ── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <LineChart title="📈 Évolution de la trésorerie" :labels="gameStore.monthLabels" :datasets="[
        { label: 'Trésorerie', data: gameStore.cashHistory, borderColor: '#6366f1' },
      ]" />
      <LineChart title="💹 Revenus & Profit net" :labels="gameStore.monthLabels" :datasets="[
        { label: 'Revenus', data: gameStore.revenueHistory, borderColor: '#10b981' },
        { label: 'Profit net', data: gameStore.netProfitHistory, borderColor: '#f59e0b' },
      ]" />
    </div>

    <!-- ── BANNIERE DIRECTEUR GENERAL ── -->
    <NuxtLink to="/dg" class="block mb-10 group">
      <div
        class="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-r transition-all duration-500 border flex flex-col sm:flex-row items-center justify-between shadow-lg hover:shadow-glow-accent/20"
        :class="gameStore.darkMode ? 'from-accent-600/20 via-dark-800 to-dark-900 border-accent-500/30' : 'from-accent-50 via-white to-slate-50 border-accent-200'">
        <div class="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 shadow-sm"
            :class="gameStore.darkMode ? 'bg-accent-600/20 shadow-glow-accent/20' : 'bg-white border border-accent-100'">
            🏛️
          </div>
          <div>
            <h2 class="text-2xl font-black italic tracking-tighter uppercase"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
              Dashboard Stratégique (DG)
            </h2>
            <p class="text-sm font-bold uppercase tracking-widest mt-1"
              :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
              Gérez le climat social et anticipez le marché.
            </p>
          </div>
        </div>
        <div class="mt-6 sm:mt-0 text-accent-500 text-2xl group-hover:translate-x-3 transition-transform duration-300">
          ➜
        </div>
      </div>
    </NuxtLink>

    <!-- ── Statistiques ── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      <MarketingPanel />
      <div class="grid grid-cols-1 gap-4">
        <OfficePanel />
        <LoanPanel />
      </div>
    </div>

    <!-- ── Concurrence & Satisfaction ── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <!-- Concurrents -->
      <div class="card p-6" :class="gameStore.darkMode ? 'bg-dark-900 border-dark-800' : 'bg-white border-slate-200'">
        <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h3 class="font-black italic uppercase tracking-tighter text-xl"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
            🏆 Marché & Concurrence
          </h3>
          <span class="badge-accent py-1 px-3 text-[10px] uppercase font-black">
            Votre part : {{ companyStore.playerMarketShare.toFixed(1) }}%
          </span>
        </div>
        <div class="space-y-4">
          <!-- Part du joueur -->
          <div class="p-4 rounded-3xl border transition-all duration-300"
            :class="gameStore.darkMode ? 'bg-accent-500/5 border-accent-500/20 shadow-glow-accent/5' : 'bg-accent-50/50 border-accent-100 shadow-sm'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🏅</span>
                <p class="text-sm font-black uppercase italic"
                  :class="gameStore.darkMode ? 'text-accent-400' : 'text-accent-600'">
                  {{ companyStore.company.name || 'Ma Startup' }}
                </p>
              </div>
              <p class="text-xl font-black" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ companyStore.playerMarketShare.toFixed(1) }}%
              </p>
            </div>
            <div class="progress-bar h-2">
              <div class="progress-fill bg-accent-500 shadow-glow-accent"
                :style="{ width: `${companyStore.playerMarketShare}%` }" />
            </div>
          </div>
          <!-- Concurrents IA -->
          <CompetitorCard v-for="comp in companyStore.competitors" :key="comp.id" :competitor="comp" />
        </div>
      </div>

      <!-- Satisfaction & Fatigue -->
      <div class="card p-6" :class="gameStore.darkMode ? 'bg-dark-900 border-dark-800' : 'bg-white border-slate-200'">
        <h3 class="font-black italic uppercase tracking-tighter text-xl mb-6"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          📊 Indicateurs de santé
        </h3>
        <div class="space-y-6">
          <!-- Satisfaction -->
          <div class="p-4 rounded-3xl border group"
            :class="gameStore.darkMode ? 'bg-dark-850 border-dark-700/50' : 'bg-slate-50 border-slate-100'">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">
                😊 Satisfaction client (NPS)
              </span>
              <span class="font-black italic text-xl" :class="[
                companyStore.market.satisfaction >= 70 ? 'text-gain-500' :
                  companyStore.market.satisfaction >= 40 ? 'text-warn-500' : 'text-loss-500'
              ]">
                {{ companyStore.market.satisfaction }}%
              </span>
            </div>
            <div class="progress-bar h-3 bg-dark-700/30 rounded-full overflow-hidden">
              <div :class="[
                'progress-fill transition-all duration-1000',
                companyStore.market.satisfaction >= 70 ? 'bg-gain-500 shadow-glow-gain' :
                  companyStore.market.satisfaction >= 40 ? 'bg-warn-500 shadow-glow-warn' : 'bg-loss-500 shadow-glow-loss'
              ]" :style="{ width: `${companyStore.market.satisfaction}%` }" />
            </div>
            <p class="text-[9px] font-bold uppercase mt-3 tracking-widest text-dark-500">
              Churn : {{ (companyStore.market.churnRate * 100).toFixed(1) }}% des clients perdus/mois
            </p>
          </div>

          <!-- Fatigue moyenne -->
          <div class="p-4 rounded-3xl border"
            :class="gameStore.darkMode ? 'bg-dark-850 border-dark-700/50' : 'bg-slate-50 border-slate-100'">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">
                😓 Fatigue moyenne
              </span>
              <span class="font-black italic text-xl" :class="[
                companyStore.averageFatigue <= 30 ? 'text-gain-500' :
                  companyStore.averageFatigue <= 60 ? 'text-warn-500' : 'text-loss-500'
              ]">
                {{ companyStore.averageFatigue }}%
              </span>
            </div>
            <div class="progress-bar h-3 bg-dark-700/30 rounded-full overflow-hidden">
              <div :class="[
                'progress-fill transition-all duration-1000',
                companyStore.averageFatigue <= 30 ? 'bg-gain-500 shadow-glow-gain' :
                  companyStore.averageFatigue <= 60 ? 'bg-warn-500 shadow-glow-warn' : 'bg-loss-500 shadow-glow-loss'
              ]" :style="{ width: `${companyStore.averageFatigue}%` }" />
            </div>
          </div>

          <!-- Achievements rapide -->
          <div class="p-4 rounded-3xl border border-dashed border-accent-500/30">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[10px] font-black uppercase text-accent-500 tracking-widest">🏆 Progression
                Succès</span>
              <span class="font-black italic text-xl text-accent-500">
                {{ gameStore.unlockedCount }}/{{ gameStore.achievements.length }}
              </span>
            </div>
            <div class="progress-bar h-1.5 bg-accent-500/10">
              <div class="progress-fill bg-accent-500" :style="{ width: `${gameStore.achievementProgress}%` }" />
            </div>
            <NuxtLink to="/achievements"
              class="text-[9px] font-black uppercase text-accent-500 hover:text-accent-400 mt-3 inline-block transition-colors tracking-widest italic group">
              Détails des trophées <span class="group-hover:translate-x-1 inline-block transition-transform">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Événements récents ── -->
    <div class="card p-6" :class="gameStore.darkMode ? 'bg-dark-900 border-dark-800' : 'bg-white border-slate-200'">
      <h3 class="font-black italic uppercase tracking-tighter text-xl mb-6"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        🔔 Événements récents
      </h3>

      <div v-if="recentEvents.length === 0"
        class="text-dark-500 font-bold uppercase text-[10px] py-8 text-center bg-slate-50/50 dark:bg-dark-850/30 rounded-[2rem] border border-dashed border-dark-700/20">
        Aucun événement archivé.<br />
        Veuillez simuler un cycle.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="event in recentEvents" :key="event.id" :class="[
          'p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] shadow-sm',
          event.type === 'gain' ? (gameStore.darkMode ? 'bg-gain-500/5 border-gain-500/20' : 'bg-gain-50 border-gain-100') :
            event.type === 'loss' ? (gameStore.darkMode ? 'bg-loss-500/5 border-loss-500/20' : 'bg-loss-50 border-loss-100') :
              event.type === 'boost' ? (gameStore.darkMode ? 'bg-accent-500/5 border-accent-500/20' : 'bg-accent-50 border-accent-100') :
                (gameStore.darkMode ? 'bg-warn-500/5 border-warn-500/20' : 'bg-warn-50 border-warn-100')
        ]">
          <div class="flex items-center gap-4">
            <span class="text-3xl filter drop-shadow-sm">{{ event.icon }}</span>
            <div class="min-w-0">
              <p class="text-sm font-black uppercase truncate italic"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ event.name }}</p>
              <p class="text-xs font-bold truncate" :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">{{
                event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
