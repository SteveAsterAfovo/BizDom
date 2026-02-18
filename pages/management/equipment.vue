<script setup lang="ts">
/**
 * ── Equipment Management ──
 */
import { useCompanyStore } from '~/stores/companyStore'

const companyStore = useCompanyStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto animate-fade-in">
    <header class="mb-10">
      <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
        🖥️ Équipement & Infrastructure
      </h1>
      <p class="text-dark-400 text-sm">Améliorez le cadre de travail pour réduire la fatigue de vos équipes</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="card p-8 border-gain-500/20 shadow-glow-gain/5">
        <div
          class="aspect-video rounded-2xl bg-dark-800 mb-6 flex items-center justify-center overflow-hidden border border-dark-700">
          <span class="text-6xl">🏢</span>
        </div>

        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-black text-white mb-2 italic">Bureau Actuel : {{ companyStore.currentOffice.name }}
            </h2>
            <div class="flex gap-4">
              <span class="badge-accent">Capacité: {{ companyStore.currentOffice.maxEmployees }}</span>
              <span class="badge-accent">Prestige: {{ '⭐'.repeat(companyStore.currentOffice.prestige) }}</span>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-dark-850 border border-dark-700">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="text-xs text-accent-400 font-bold uppercase tracking-widest mb-1">Qualité Materielle</p>
                <h3 class="text-white font-bold text-lg">Équipement Niv. {{ companyStore.company.equipmentLevel }}</h3>
              </div>
              <div class="text-right">
                <p class="text-gain-400 text-xs font-bold leading-tight">
                  -{{ ((companyStore.company.equipmentLevel - 1) * 0.5).toFixed(1) }} Fatigue/tic
                </p>
                <p v-if="(useGameStore().currentMonth - companyStore.company.lastUpgradeMonth) > 0"
                  class="text-loss-500 text-[9px] font-black uppercase italic animate-pulse">
                  ⚠️ Obsolescence Active
                </p>
              </div>
            </div>

            <div class="mb-6 space-y-2">
              <div class="flex justify-between text-[10px] text-dark-500 uppercase font-black">
                <span>Âge de l'équipement</span>
                <span
                  :class="(useGameStore().currentMonth - companyStore.company.lastUpgradeMonth) > 3 ? 'text-loss-500' : 'text-dark-300'">
                  {{ useGameStore().currentMonth - companyStore.company.lastUpgradeMonth }} mois (sim)
                </span>
              </div>
              <div class="flex justify-between text-[10px] text-dark-500 uppercase font-black">
                <span>Malus Productivité</span>
                <span
                  :class="(useGameStore().currentMonth - companyStore.company.lastUpgradeMonth) > 0 ? 'text-loss-500' : 'text-gain-500'">
                  -{{ ((useGameStore().currentMonth - companyStore.company.lastUpgradeMonth) * 10).toFixed(0) }}%
                </span>
              </div>
            </div>

            <button
              class="w-full py-4 rounded-xl bg-gain-500 text-white font-black uppercase tracking-widest shadow-glow-gain hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              :disabled="companyStore.cash < (50000 * companyStore.company.equipmentLevel)"
              @click="companyStore.upgradeEquipment()">
              Moderniser ({{ formatCurrency(50000 * companyStore.company.equipmentLevel) }})
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card">
          <h3 class="text-white font-bold mb-4 flex items-center gap-2">🛋️ Ambiance & Confort</h3>
          <p class="text-xs text-dark-400 mb-6">L'équipement ne suffit pas. Pensez à activer des avantages sociaux pour
            un moral d'acier.</p>

          <div class="space-y-4">
            <div v-for="perkId in companyStore.company.activePerks" :key="perkId"
              class="p-4 rounded-xl bg-dark-800 flex items-center justify-between border border-dark-700">
              <span class="text-sm text-white">Perk Actif : #{{ perkId }}</span>
              <span class="text-gain-400 text-[10px] font-bold">ACTIF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
