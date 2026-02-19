<script setup lang="ts">
/**
 * ── Office & Real Estate Management ──
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
  <div class="space-y-10 animate-fade-in p-6 max-w-7xl mx-auto">
    <header>
      <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Siège <span class="text-accent-500">&
          Immobilier</span></h2>
      <p class="text-dark-400 font-bold uppercase tracking-widest text-xs mt-1">Gérez votre espace de travail et votre
        culture</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <OfficePanel />
      </div>
      <div class="space-y-6">
        <div class="card p-6 bg-dark-900 border-white/5">
          <h3 class="text-white font-bold mb-4 italic">Statut du Siège</h3>
          <div
            class="aspect-video rounded-2xl bg-dark-850 flex items-center justify-center text-6xl border border-white/5 mb-6">
            {{ companyStore.currentOffice.icon }}
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center text-xs">
              <span class="text-dark-500 font-bold uppercase">Capacité</span>
              <span class="text-white font-black">{{ companyStore.employees.length }} / {{
                companyStore.currentOffice.maxEmployees }} Employés</span>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-3xl bg-gain-500/5 border border-gain-500/20">
          <p class="text-[10px] text-gain-500 font-black uppercase mb-1">🎭 Ambiance</p>
          <p class="text-xs text-dark-300 font-medium">Bureaux spacieux. Les employés ont une bonne marge de manœuvre.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
