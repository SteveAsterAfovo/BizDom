<script setup lang="ts">
/**
 * ── Equipment & Infrastructure Management ──
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

const categories = [
  { id: 'workstation', label: 'Postes', icon: '💻' },
  { id: 'network', label: 'Réseau', icon: '🌐' },
  { id: 'power', label: 'Énergie', icon: '⚡' },
  { id: 'software', label: 'Logiciels', icon: '☁️' },
]

const activeCategory = ref('workstation')

const filteredInfra = computed(() => {
  return companyStore.infrastructureCatalogue.filter(item => item.category === activeCategory.value)
})

function isOwned(id: string) {
  return companyStore.company.ownedInfrastructure.includes(id)
}

function canAfford(cost: number) {
  return companyStore.company.cash >= cost
}

// SEO
useHead({
  title: 'Infrastructure',
})
</script>

<template>
  <div class="space-y-10 animate-fade-in p-2 sm:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <header class="text-center sm:text-left pt-4 sm:pt-0">
      <h2 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        Infrastructure <span class="text-accent-500">& Tech</span>
      </h2>
      <p class="text-[10px] font-black uppercase tracking-[0.2em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Optimisez votre arsenal technologique et vos systèmes critiques
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Stats / Office Summary -->
      <div class="lg:col-span-1 space-y-6 order-2 lg:order-1">
        <div class="card p-8 border rounded-[2.5rem] shadow-xl space-y-8"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <div
            class="aspect-square rounded-[2rem] flex items-center justify-center text-5xl border shadow-inner transition-transform hover:scale-105"
            :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
            {{ companyStore.currentOffice.icon }}
          </div>
          <div>
            <h3 class="text-xl font-black italic uppercase tracking-tighter"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ companyStore.currentOffice.name }}</h3>
            <p class="text-[10px] text-dark-500 font-black uppercase tracking-widest mt-1">Quartier Général</p>
          </div>

          <div class="space-y-4">
            <div
              class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-dark-500">
              <span>Niveau Technologique</span>
              <span :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ companyStore.company.equipmentLevel
              }}</span>
            </div>
            <div class="w-full h-2 bg-dark-700/20 rounded-full overflow-hidden">
              <div class="h-full bg-accent-500 shadow-glow-accent transition-all duration-1000"
                :style="{ width: (companyStore.company.equipmentLevel * 20) + '%' }">
              </div>
            </div>
          </div>

          <button @click="companyStore.upgradeEquipment()"
            :disabled="!canAfford(50000 * companyStore.company.equipmentLevel) || gameStore.isPaused"
            class="w-full btn-primary py-5 rounded-2xl font-black italic text-[10px] uppercase tracking-[0.2em] shadow-glow-accent/20 disabled:opacity-20">
            Moderniser ({{ formatCurrency(50000 * companyStore.company.equipmentLevel) }})
          </button>
        </div>

        <!-- Alerts Stack -->
        <div class="space-y-4">
          <div v-if="(gameStore.currentMonth - companyStore.company.lastUpgradeMonth) > 0"
            class="p-6 rounded-[2rem] border transition-all"
            :class="gameStore.darkMode ? 'bg-loss-500/5 border-loss-500/20 text-loss-400' : 'bg-rose-50 border-rose-100 text-rose-600'">
            <p class="text-[10px] font-black uppercase tracking-widest mb-1 animate-pulse">⚠️ Obsolescence Active</p>
            <p class="text-xs font-bold leading-tight">Cycle : {{ gameStore.currentMonth -
              companyStore.company.lastUpgradeMonth }} mois. La productivité décline.</p>
          </div>

          <div v-if="companyStore.infrastructureMalus < 1" class="p-6 rounded-[2rem] border transition-all"
            :class="gameStore.darkMode ? 'bg-warn-500/5 border-warn-500/20 text-warn-500' : 'bg-amber-50 border-amber-100 text-amber-600'">
            <p class="text-[10px] font-black uppercase tracking-widest mb-1">⚠️ Instabilité</p>
            <p class="text-xs font-bold leading-tight">Dépendances manquantes. Malus : -{{ Math.round((1 -
              companyStore.infrastructureMalus) * 100) }}%.</p>
          </div>
        </div>
      </div>

      <!-- Infrastructure Catalogue -->
      <div class="lg:col-span-3 space-y-8 order-1 lg:order-2">
        <!-- Tabs -->
        <div class="flex gap-2 p-1.5 rounded-2xl border overflow-x-auto no-scrollbar"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-slate-100 border-slate-200'">
          <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id" :class="[
            'flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap',
            activeCategory === cat.id
              ? 'bg-accent-600 text-white shadow-glow-accent'
              : gameStore.darkMode ? 'text-dark-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-white'
          ]">
            <span>{{ cat.icon }}</span>
            <span class="hidden sm:inline">{{ cat.label }}</span>
          </button>
        </div>

        <!-- List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="item in filteredInfra" :key="item.id"
            class="card p-8 border rounded-[2.5rem] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-lg"
            :class="[
              isOwned(item.id)
                ? (gameStore.darkMode ? 'bg-accent-600/5 border-accent-500/30' : 'bg-accent-50 border-accent-200')
                : (gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200')
            ]">
            <div>
              <div class="flex justify-between items-start mb-4">
                <h4 class="text-lg font-black italic tracking-tighter uppercase"
                  :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ item.name }}</h4>
                <span v-if="isOwned(item.id)"
                  class="text-[9px] font-black text-gain-600 dark:text-gain-400 bg-gain-500/10 px-3 py-1 rounded-lg border border-gain-500/20">ACTIF</span>
              </div>
              <p class="text-xs font-bold leading-relaxed mb-6"
                :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">{{ item.description }}</p>

              <div v-if="item.dependencies.length > 0" class="mb-6">
                <p class="text-[9px] font-black text-dark-500 uppercase tracking-widest mb-2">Dépendances :</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="depId in item.dependencies" :key="depId" :class="[
                    'text-[8px] font-black px-3 py-1 rounded-lg border uppercase tracking-tighter',
                    companyStore.company.ownedInfrastructure.includes(depId)
                      ? 'bg-gain-500/5 border-gain-500/20 text-gain-500'
                      : 'bg-loss-500/5 border-loss-500/20 text-loss-500'
                  ]">
                    {{ depId }}
                  </span>
                </div>
              </div>

              <!-- État -->
              <div class="space-y-2 mb-6">
                <div class="flex justify-between text-[9px] font-black uppercase tracking-widest">
                  <span class="text-dark-500">Condition : {{ Math.round(item.condition) }}%</span>
                  <span :class="item.condition > 50 ? 'text-gain-500' : 'text-loss-500'">
                    {{ item.condition > 50 ? 'OPTIMAL' : 'CRITIQUE' }}
                  </span>
                </div>
                <div class="w-full h-1.5 bg-dark-700/20 rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-500"
                    :class="item.condition > 50 ? 'bg-gain-500' : 'bg-loss-500'"
                    :style="{ width: item.condition + '%' }">
                  </div>
                </div>
                <button v-if="isOwned(item.id)" @click="companyStore.repairInfrastructure(item.id)"
                  :disabled="!canAfford(Math.max(50, Math.round((100 - item.condition) * 10))) || gameStore.isPaused || item.condition >= 100"
                  class="mt-2 w-full py-2.5 rounded-xl bg-dark-800/10 border border-dark-700/20 text-[9px] font-black uppercase tracking-widest text-dark-500 hover:text-white hover:bg-accent-600 hover:border-accent-500 transition-all disabled:opacity-20">
                  <span v-if="item.condition >= 100">✨ Parfait État</span>
                  <span v-else>🔧 Maintenance ({{ Math.max(50, Math.round((100 - item.condition) * 10)) }} FCFA)</span>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between mt-auto pt-6 border-t"
              :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
              <div class="flex flex-col">
                <span class="text-[9px] font-black text-dark-500 uppercase tracking-widest">Investissement</span>
                <span class="font-black italic text-sm" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{
                  formatCurrency(item.cost) }}</span>
              </div>
              <button v-if="!isOwned(item.id)" @click="companyStore.purchaseInfrastructure(item.id)"
                :disabled="!canAfford(item.cost) || gameStore.isPaused"
                class="px-8 py-3.5 rounded-2xl bg-accent-600 text-white font-black italic text-[10px] uppercase tracking-widest hover:shadow-glow-accent transition-all disabled:opacity-30 disabled:grayscale">
                Acquérir
              </button>
              <div v-else class="flex items-center gap-2 text-gain-500 font-black italic text-xs uppercase">
                <span class="text-lg">✓</span> <span>Opérationnel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
