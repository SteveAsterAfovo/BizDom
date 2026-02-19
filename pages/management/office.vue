<script setup lang="ts">
/**
 * ── Office & Real Estate Management ──
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}

// SEO
useHead({
  title: 'Siège Social & Immobilier',
})
</script>

<template>
  <div class="space-y-10 animate-fade-in p-2 sm:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <header class="text-center sm:text-left pt-4 sm:pt-0">
      <h2 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        Siège <span class="text-accent-500">& Immobilier</span>
      </h2>
      <p class="text-[10px] font-black uppercase tracking-[0.2em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Gérez votre espace de travail et votre culture d'entreprise
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 order-2 lg:order-1">
        <OfficePanel />
      </div>

      <div class="order-1 lg:order-2 space-y-6">
        <!-- Statut du Siège -->
        <div class="card p-8 border rounded-[2.5rem] shadow-xl space-y-8"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <h3 class="text-xl font-black italic uppercase tracking-tighter"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Statut Actuel</h3>

          <div
            class="aspect-video rounded-[2rem] flex items-center justify-center text-7xl transition-transform hover:scale-110 shadow-inner"
            :class="gameStore.darkMode ? 'bg-dark-850 border border-white/5' : 'bg-slate-50 border border-slate-100'">
            {{ companyStore.currentOffice.icon }}
          </div>

          <div class="space-y-6 pt-4">
            <div class="flex justify-between items-center px-2">
              <span class="text-[10px] font-black uppercase tracking-[0.15em]"
                :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">Capacité Totale</span>
              <span class="text-sm font-black italic" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ companyStore.employees.length }} / {{ companyStore.currentOffice.maxEmployees }} Employés
              </span>
            </div>

            <div class="w-full h-2 bg-dark-700/20 rounded-full overflow-hidden">
              <div class="h-full bg-accent-500 shadow-glow-accent transition-all duration-1000"
                :style="{ width: (companyStore.employees.length / companyStore.currentOffice.maxEmployees * 100) + '%' }">
              </div>
            </div>

            <div class="p-6 rounded-2xl border transition-all"
              :class="gameStore.darkMode ? 'bg-dark-850 border-white/5 text-dark-400' : 'bg-slate-50 border-slate-100 text-slate-500'">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-gain-500">🎭 Ambiance</span>
              </div>
              <p class="text-[11px] font-bold italic leading-relaxed">
                Bureaux spacieux. Les employés ont une bonne marge de manœuvre et un cadre de travail stimulant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
