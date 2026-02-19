<script setup lang="ts">
/**
 * ── OfficePanel ──
 * Panneau de gestion immobilière : bureau actuel, options de déménagement
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

// Bureaux disponibles (supérieurs au bureau actuel)
const availableOffices = computed(() =>
  companyStore.offices.filter((o) => o.id !== companyStore.company.currentOfficeId)
)

const capacityPercent = computed(() => {
  const office = companyStore.currentOffice
  return Math.min(100, Math.round((companyStore.employeeCount / office.maxEmployees) * 100))
})

const capacityColor = computed(() => {
  if (capacityPercent.value >= 90) return 'bg-loss-500 shadow-glow-loss'
  if (capacityPercent.value >= 70) return 'bg-warn-500 shadow-glow-warn'
  return 'bg-gain-500 shadow-glow-gain'
})
</script>

<template>
  <div class="card p-6 border rounded-[2rem] shadow-xl space-y-8"
    :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

    <header>
      <h3 class="text-xl font-black italic tracking-tighter uppercase mb-1"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        🏢 Immobilier <span class="text-accent-500">& Prestige</span>
      </h3>
      <p class="text-[9px] font-black uppercase tracking-widest text-dark-500">Gestion de vos infrastructures</p>
    </header>

    <!-- Bureau actuel -->
    <div class="p-6 rounded-[2rem] border relative overflow-hidden group transition-all duration-500"
      :class="gameStore.darkMode ? 'bg-dark-850 border-white/5 shadow-xl' : 'bg-slate-50 border-slate-200 shadow-sm'">

      <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8">
        <div class="flex items-center gap-5 w-full sm:w-auto">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-2xl transition-transform group-hover:rotate-12 duration-500"
            :class="gameStore.darkMode ? 'bg-dark-900 border border-white/5' : 'bg-white border border-slate-200'">
            {{ companyStore.currentOffice.icon }}
          </div>
          <div>
            <h4 class="text-lg font-black italic tracking-tighter uppercase"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
              {{ companyStore.currentOffice.name }}
            </h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] font-black uppercase tracking-widest text-dark-500">Loyers</span>
              <span class="text-xs font-black italic text-accent-500">{{
                formatCurrency(companyStore.currentOffice.rent) }} / mois</span>
            </div>
          </div>
        </div>

        <div class="text-center sm:text-right">
          <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mb-1">Prestige Entreprise
          </p>
          <div class="flex gap-1 justify-center sm:justify-end">
            <span v-for="i in 5" :key="i" class="text-base"
              :class="i <= companyStore.currentOffice.prestige ? 'text-warn-500' : 'text-dark-700'">
              {{ i <= companyStore.currentOffice.prestige ? '★' : '☆' }} </span>
          </div>
        </div>
      </div>

      <!-- Jauge de capacité -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-black uppercase tracking-widest text-dark-500 italic">Taux
            d'occupation</span>
          <span class="text-xs font-black italic"
            :class="capacityPercent >= 90 ? 'text-loss-500' : capacityPercent >= 70 ? 'text-warn-500' : 'text-gain-500'">
            {{ companyStore.employeeCount }} / {{ companyStore.currentOffice.maxEmployees }} pers.
          </span>
        </div>
        <div class="h-2.5 w-full rounded-full border p-0.5"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-100'">
          <div class="h-full rounded-full transition-all duration-1000" :class="capacityColor"
            :style="{ width: `${capacityPercent}%` }" />
        </div>
        <p v-if="capacityPercent >= 90"
          class="text-[8px] font-black uppercase tracking-widest text-loss-500 text-center italic animate-pulse">
          ⚠️ Alerte Saturation : Déménagement recommandé
        </p>
      </div>
    </div>

    <!-- Options de déménagement -->
    <div v-if="availableOffices.length > 0" class="space-y-4 pt-4 border-t border-dashed"
      :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-200'">
      <p class="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 italic">Solutions alternatives</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="office in availableOffices" :key="office.id"
          class="group/item flex items-center justify-between p-4 rounded-[1.5rem] border transition-all duration-300"
          :class="gameStore.darkMode ? 'bg-dark-950 border-white/5 hover:bg-dark-850' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'">
          <div class="flex items-center gap-4">
            <span class="text-2xl transition-transform group-hover/item:scale-125 duration-500">{{
              office.icon }}</span>
            <div>
              <p class="text-xs font-black italic uppercase tracking-tighter"
                :class="gameStore.darkMode ? 'text-dark-200' : 'text-slate-900'">{{ office.name }}</p>
              <p class="text-[9px] font-black text-dark-500 uppercase tracking-widest mt-0.5">
                {{ office.maxEmployees }} places · {{ formatCurrency(office.rent) }}
              </p>
            </div>
          </div>
          <button
            class="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 disabled:grayscale"
            :disabled="gameStore.isPaused" :class="[
              office.id > companyStore.company.currentOfficeId
                ? 'bg-accent-500/10 text-accent-500 hover:bg-accent-500 hover:text-white border border-accent-500/20 shadow-glow-accent'
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            ]" @click="companyStore.upgradeOffice(office.id)">
            {{ office.id > companyStore.company.currentOfficeId ? '⬆ Upgrade' : '⬇ Down' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
