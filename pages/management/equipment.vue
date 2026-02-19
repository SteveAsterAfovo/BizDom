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
  { id: 'workstation', label: 'Postes de Travail', icon: '💻' },
  { id: 'network', label: 'Réseau & Web', icon: '🌐' },
  { id: 'power', label: 'Énergie', icon: '⚡' },
  { id: 'software', label: 'Logiciels & Cloud', icon: '☁️' },
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

function getMissingDeps(deps: string[]) {
  return deps.filter(d => !isOwned(d)).map(id => {
    return companyStore.infrastructureCatalogue.find(i => i.id === id)?.name || id
  })
}
</script>

<template>
  <div class="space-y-10 animate-fade-in p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <header>
      <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Infrastructure <span
          class="text-accent-500">& Tech</span></h2>
      <p class="text-dark-400 font-bold uppercase tracking-widest text-xs mt-1">Optimisez votre matériel et vos systèmes
        critiques</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

      <!-- Stats / Office Summary -->
      <div class="lg:col-span-1 space-y-6">
        <div class="card p-6 bg-dark-900 border-white/5 space-y-6">
          <div
            class="aspect-square rounded-2xl bg-dark-850 flex items-center justify-center text-5xl border border-dark-700">
            {{ companyStore.currentOffice.icon }}
          </div>
          <div>
            <h3 class="text-lg font-black text-white italic">{{ companyStore.currentOffice.name }}</h3>
            <p class="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Bureau Principal</p>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-dark-500 font-bold uppercase">Qualité Globale</span>
              <span class="text-white font-black">Niv. {{ companyStore.company.equipmentLevel }}</span>
            </div>
            <div class="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
              <div class="h-full bg-accent-500" :style="{ width: (companyStore.company.equipmentLevel * 20) + '%' }">
              </div>
            </div>
          </div>

          <button @click="companyStore.upgradeEquipment()"
            :disabled="!canAfford(50000 * companyStore.company.equipmentLevel)"
            class="w-full py-4 rounded-xl bg-dark-850 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-accent-600 hover:border-accent-500 transition-all disabled:opacity-30">
            Moderniser ({{ formatCurrency(50000 * companyStore.company.equipmentLevel) }})
          </button>
        </div>

        <!-- Obsolescence Warning Stack -->
        <div v-if="(gameStore.currentMonth - companyStore.company.lastUpgradeMonth) > 0"
          class="p-4 rounded-2xl bg-loss-500/10 border border-loss-500/30 text-loss-400">
          <p class="text-[10px] font-black uppercase mb-1 animate-pulse">⚠️ Obsolescence Active</p>
          <p class="text-xs font-bold leading-tight">Âge : {{ gameStore.currentMonth -
            companyStore.company.lastUpgradeMonth }} mois. La productivité décline.</p>
        </div>

        <!-- Infrastructure Malus Alert -->
        <div v-if="companyStore.infrastructureMalus < 1"
          class="p-4 rounded-2xl bg-loss-500/10 border border-loss-500/30 text-loss-400">
          <p class="text-[10px] font-black uppercase mb-1">⚠️ Instabilité Détectée</p>
          <p class="text-xs font-bold leading-tight">Certaines installations manquent de dépendances critiques. Malus :
            -{{ Math.round((1 - companyStore.infrastructureMalus) * 100) }}% productivité.</p>
        </div>
      </div>

      <!-- Infrastructure Catalogue -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Tabs -->
        <div class="flex gap-2 p-1 bg-dark-900/50 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id" :class="[
            'flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap',
            activeCategory === cat.id ? 'bg-accent-600 text-white shadow-glow-accent/20' : 'text-dark-500 hover:text-dark-300'
          ]">
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </div>

        <!-- List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in filteredInfra" :key="item.id"
            class="card p-6 border-white/5 flex flex-col justify-between transition-all"
            :class="isOwned(item.id) ? 'bg-accent-600/5 border-accent-500/20' : 'bg-dark-900'">
            <div>
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-black text-white italic tracking-tight uppercase">{{ item.name }}</h4>
                <span v-if="isOwned(item.id)"
                  class="text-[9px] font-black text-gain-500 bg-gain-500/10 px-2 py-1 rounded">POSSÉDÉ</span>
              </div>
              <p class="text-xs text-dark-500 font-medium mb-4 leading-relaxed">{{ item.description }}</p>

              <div v-if="item.dependencies.length > 0" class="mb-4">
                <p class="text-[9px] font-black text-dark-600 uppercase mb-1">Prérequis :</p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="depId in item.dependencies" :key="depId" :class="[
                    'text-[8px] font-bold px-2 py-0.5 rounded border uppercase',
                    companyStore.company.ownedInfrastructure.includes(depId) ? 'bg-gain-500/10 border-gain-500/30 text-gain-400' : 'bg-loss-500/10 border-loss-500/30 text-loss-400'
                  ]">
                    {{ depId }}
                  </span>
                </div>
              </div>

              <!-- État / Dépréciation -->
              <div class="flex justify-between text-[9px] font-black uppercase">
                <span class="text-dark-500">État : {{ Math.round(item.condition) }}%</span>
                <span :class="item.condition > 50 ? 'text-gain-500' : 'text-loss-500'">
                  {{ item.condition > 50 ? 'Optimal' : 'Usé' }}
                </span>
              </div>
              <div class="w-full h-1 bg-dark-800 rounded-full overflow-hidden mb-2">
                <div class="h-full transition-all duration-500"
                  :class="item.condition > 50 ? 'bg-gain-500' : 'bg-loss-500'" :style="{ width: item.condition + '%' }">
                </div>
              </div>
              <button v-if="item.condition < 100" @click="companyStore.repairInfrastructure(item.id)"
                :disabled="!canAfford(500)"
                class="w-full py-1.5 rounded-lg bg-dark-800 border border-white/5 text-[8px] font-black uppercase tracking-widest text-dark-300 hover:text-white hover:bg-dark-700 transition-all">
                🔧 Réparer (500 FCFA)
              </button>


              <div v-if="item.risky" class="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 mb-4">
                <p class="text-[8px] font-black text-orange-500 uppercase">⚠️ Risque de panne : {{
                  Math.round((item.failureRate || 0) * 100) }}%</p>
              </div>
            </div>

            <div class="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
              <div class="text-xs font-black uppercase">
                <span class="text-dark-600 block text-[9px]">Prix</span>
                <span class="text-white">{{ formatCurrency(item.cost) }}</span>
              </div>
              <button v-if="!isOwned(item.id)" @click="companyStore.purchaseInfrastructure(item.id)"
                :disabled="!canAfford(item.cost)"
                class="px-6 py-3 rounded-xl bg-accent-600 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-30">
                Acquérir
              </button>
              <div v-else class="text-gain-500 flex items-center gap-1 font-black text-[10px] uppercase">
                <span>✓</span> Actif
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
