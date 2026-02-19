<script setup lang="ts">
/**
 * ── MonthlyReport ──
 * Carte détaillée d'un rapport mensuel avec toutes les métriques
 */
import type { MonthlyReport } from '~/types'
import { useGameStore } from '~/stores/gameStore'

const gameStore = useGameStore()

interface Props {
  report: MonthlyReport
}

const props = defineProps<Props>()
const isExpanded = ref(false)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}
</script>

<template>
  <div class="group relative overflow-hidden rounded-[2rem] border transition-all duration-500 cursor-pointer" :class="[
    gameStore.darkMode ? 'bg-dark-900 border-white/5 hover:border-accent-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-accent-500/20',
    isExpanded ? (gameStore.darkMode ? 'border-accent-500/50 shadow-glow-accent/5' : 'border-accent-300 ring-4 ring-accent-500/5') : '',
  ]" @click="isExpanded = !isExpanded">

    <!-- Header rapide -->
    <div class="p-6 flex items-center justify-between">
      <div class="flex items-center gap-5">
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black italic tracking-tighter shadow-lg transition-transform group-hover:scale-110 duration-500"
          :class="gameStore.darkMode ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'bg-accent-50 text-accent-600 border border-accent-100'">
          M{{ report.month }}
        </div>
        <div>
          <h4 class="text-sm font-black italic uppercase tracking-tighter"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Rapport Mensuel</h4>
          <p class="text-[11px] font-black italic tracking-widest mt-0.5"
            :class="report.netProfit >= 0 ? 'text-gain-500' : 'text-loss-500'">
            {{ report.netProfit >= 0 ? '收益' : '损失' }} : {{ report.netProfit >= 0 ? '+' : '' }}{{
              formatCurrency(report.netProfit) }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="hidden sm:block text-right">
          <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mb-0.5">Trésorerie</p>
          <p class="text-xs font-black italic" :class="gameStore.darkMode ? 'text-dark-300' : 'text-slate-600'">{{
            formatCurrency(report.cashAfter) }}</p>
        </div>
        <div class="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300" :class="[
          gameStore.darkMode ? 'border-white/5 bg-dark-850' : 'border-slate-100 bg-slate-50',
          isExpanded ? 'rotate-180 bg-accent-500 border-accent-500 text-white' : (gameStore.darkMode ? 'text-dark-500' : 'text-slate-400')
        ]">
          <span class="text-[10px]">▼</span>
        </div>
      </div>
    </div>

    <!-- Détails (expanded) -->
    <Transition name="report-expand">
      <div v-if="isExpanded" class="px-6 pb-6 pt-2 space-y-6">
        <div class="h-px w-full border-t border-dashed"
          :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-200'"></div>

        <!-- Revenus & Charges -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl border transition-all"
            :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
            <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1 italic">Chiffre d'Affaires</p>
            <p class="text-base font-black italic text-gain-500">{{ formatCurrency(report.revenue) }}</p>
          </div>
          <div class="p-4 rounded-2xl border transition-all"
            :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
            <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1 italic">Dépenses
              Opérationnelles</p>
            <p class="text-base font-black italic text-loss-500">{{ formatCurrency(report.totalExpenses) }}</p>
          </div>
        </div>

        <!-- Détail des charges -->
        <div class="p-5 rounded-[2rem] border space-y-3"
          :class="gameStore.darkMode ? 'bg-dark-950 border-white/5 shadow-inner' : 'bg-white border-slate-100 shadow-sm'">
          <div v-for="(val, label) in {
            'Salaires & Charges': report.totalSalaries,
            'Coûts fixes & Infra': report.fixedCosts,
            'Loyer Immobiliers': report.officeRent,
            'Budget Marketing': report.marketingBudget,
            'Avantages Sociaux': report.perksCost,
            'Service de la Dette': report.loanPayments
          }" :key="label" class="flex justify-between items-center group/row">
            <span
              class="text-[10px] font-black uppercase tracking-widest text-dark-500 group-hover/row:text-dark-400 transition-colors">{{
              label }}</span>
            <span class="text-[11px] font-black italic"
              :class="gameStore.darkMode ? 'text-dark-200' : 'text-slate-900'">{{ formatCurrency(val || 0) }}</span>
          </div>
          <div class="pt-3 border-t border-dashed transition-colors"
            :class="gameStore.darkMode ? 'border-white/10' : 'border-slate-200'">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black uppercase tracking-widest text-accent-500 italic">Prélèvements
                Fiscaux</span>
              <span class="text-[11px] font-black italic text-accent-500">{{ formatCurrency(report.taxes) }}</span>
            </div>
          </div>
        </div>

        <!-- KPI du mois -->
        <div class="grid grid-cols-3 gap-4">
          <div v-for="kpi in [
            { label: 'Clients', val: report.customerBase, desc: `+${report.newCustomers}/-${report.churnedCustomers}`, color: 'text-accent-500' },
            { label: 'Satisfaction', val: `${report.satisfaction}%`, desc: 'Standard Qualité', color: report.satisfaction >= 70 ? 'text-gain-500' : report.satisfaction >= 40 ? 'text-warn-500' : 'text-loss-500' },
            { label: 'Productivité', val: `${(report.productivity * 100).toFixed(0)}%`, desc: 'Efficience RH', color: 'text-accent-500' }
          ]" :key="kpi.label" class="p-4 rounded-2xl border text-center transition-all bg-dark-500/5"
            :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
            <p class="text-[8px] font-black uppercase tracking-widest text-dark-600 mb-1">{{ kpi.label }}</p>
            <p class="text-base font-black italic tracking-tighter" :class="kpi.color">{{ kpi.val }}</p>
            <p class="text-[7px] font-black uppercase tracking-[0.2em] text-dark-500 mt-0.5">{{ kpi.desc }}</p>
          </div>
        </div>

        <!-- Événement du mois -->
        <div v-if="report.event" class="p-6 rounded-[2rem] border relative overflow-hidden group/event" :class="[
          report.event.type === 'gain' ? (gameStore.darkMode ? 'bg-gain-500/10 border-gain-500/20 shadow-glow-gain/5' : 'bg-gain-50 border-gain-500/20') :
            report.event.type === 'loss' ? (gameStore.darkMode ? 'bg-loss-500/10 border-loss-500/20 shadow-glow-loss/5' : 'bg-loss-50 border-loss-500/20') :
              (gameStore.darkMode ? 'bg-warn-500/10 border-warn-500/20 shadow-glow-warn/5' : 'bg-warn-50 border-warn-500/20')
        ]">
          <div class="flex items-center gap-5 relative z-10">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-transform group-hover/event:scale-110 duration-500"
              :class="gameStore.darkMode ? 'bg-dark-900/50' : 'bg-white/50'">
              {{ report.event.icon }}
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] italic mb-1"
                :class="report.event.type === 'gain' ? 'text-gain-500' : report.event.type === 'loss' ? 'text-loss-500' : 'text-warn-500'">
                Impact Mensuel : {{ report.event.type.toUpperCase() }}
              </p>
              <h5 class="text-sm font-black italic uppercase tracking-tighter"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ report.event.name }}</h5>
              <p class="text-[11px] font-bold leading-normal mt-1"
                :class="gameStore.darkMode ? 'text-dark-300' : 'text-slate-500'">{{ report.event.description }}</p>
            </div>
          </div>
        </div>

        <!-- Final Impact -->
        <div class="flex items-center justify-between p-6 rounded-[2rem] border shadow-2xl transition-all"
          :class="gameStore.darkMode ? 'bg-accent-600/10 border-accent-500/30' : 'bg-accent-500 border-accent-400 text-white'">
          <div>
            <p class="text-[9px] font-black uppercase tracking-widest italic opacity-80">Trésorerie consolidée</p>
            <p class="text-xl font-black italic tracking-tighter"
              :class="gameStore.darkMode ? 'text-accent-400' : 'text-white'">{{ formatCurrency(report.cashAfter) }}</p>
          </div>
          <div class="text-2xl opacity-40">📊</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.report-expand-enter-active,
.report-expand-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top;
}

.report-expand-enter-from,
.report-expand-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
  max-height: 0;
  overflow: hidden;
}

.report-expand-enter-to,
.report-expand-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
  max-height: 2000px;
}
</style>
