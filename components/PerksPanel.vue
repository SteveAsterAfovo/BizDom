<script setup lang="ts">
/**
 * ── PerksPanel ──
 * Gestion des avantages sociaux : activer/désactiver les perks
 */
import { ref, reactive } from 'vue'
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

const selectedDurations = reactive<Record<number, number>>({
  5: 7,
  6: 7
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

function isPerkActive(perkId: number): boolean {
  return companyStore.company.activePerks.includes(perkId)
}

function togglePerk(perkId: number) {
  if (perkId >= 5) {
    // Boost temporaire
    companyStore.buyBoost(perkId, selectedDurations[perkId] || 7)
    return
  }

  if (isPerkActive(perkId)) {
    companyStore.removePerk(perkId)
  } else {
    companyStore.addPerk(perkId)
  }
}
</script>

<template>
  <div class="card p-6 border rounded-[2rem] shadow-xl space-y-8"
    :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

    <header class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-black italic tracking-tighter uppercase mb-1"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          🎁 Social <span class="text-accent-500">& Culture</span>
        </h3>
        <p class="text-[9px] font-black uppercase tracking-widest text-dark-500">Bien-être & Motivation des
          équipes</p>
      </div>
      <div class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        :class="gameStore.darkMode ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'bg-accent-50 text-accent-600 border border-accent-100'">
        Niveau {{ companyStore.company.level }}
      </div>
      <div class="flex gap-4">
        <div class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="gameStore.darkMode ? 'bg-gain-500/10 text-gain-400 border border-gain-500/20' : 'bg-gain-50 text-gain-600 border border-gain-100'">
          🧠 Motiv: {{ Math.round(companyStore.globalMotivation) }}%
        </div>
        <div class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="gameStore.darkMode ? 'bg-loss-500/10 text-loss-400 border border-loss-500/20' : 'bg-rose-50 text-rose-600 border border-rose-100'">
          ☕ Fatigue: {{ Math.round(companyStore.globalFatigue) }}%
        </div>
        <div class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="gameStore.darkMode ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'bg-accent-50 text-accent-600 border border-accent-100'">
          {{ formatCurrency(companyStore.totalPerkCosts) }} / m
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="perk in companyStore.availablePerks" :key="perk.id"
        class="group relative p-5 rounded-[2rem] border transition-all duration-300 overflow-hidden" :class="[
          isPerkActive(perk.id)
            ? (gameStore.darkMode ? 'bg-accent-500/10 border-accent-500/30' : 'bg-accent-50 border-accent-200 shadow-glow-accent/5')
            : (gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm hover:border-accent-500/30')
        ]">

        <div class="flex items-start justify-between relative z-10">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-110 duration-500"
              :class="gameStore.darkMode ? 'bg-dark-900 border border-white/5' : 'bg-white border border-slate-200'">
              {{ perk.icon }}
            </div>
            <div>
              <p class="text-sm font-black italic uppercase tracking-tighter transition-colors"
                :class="isPerkActive(perk.id) ? 'text-accent-500' : (gameStore.darkMode ? 'text-white' : 'text-slate-900')">
                {{ perk.name }}
              </p>
              <p class="text-[10px] font-bold uppercase tracking-widest mt-0.5"
                :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-500'">{{ perk.description }}
              </p>
            </div>
          </div>

          <!-- Custom Toggle Switch -->
          <div class="flex flex-col items-end gap-2">
            <div
              class="w-10 h-5 rounded-full p-0.5 transition-all duration-300 relative border cursor-pointer disabled:opacity-30 disabled:grayscale"
              :class="[
                isPerkActive(perk.id)
                  ? 'bg-accent-500 border-accent-400 shadow-glow-accent'
                  : (gameStore.darkMode ? 'bg-dark-950 border-white/5' : 'bg-slate-200 border-slate-300')
              ]" @click="!gameStore.isPaused && togglePerk(perk.id)">
              <div class="w-3.5 h-3.5 rounded-full shadow-sm transition-all duration-500 transform" :class="[
                isPerkActive(perk.id) ? 'translate-x-5 bg-white' : 'translate-x-0 bg-dark-500'
              ]" />
            </div>
          </div>
        </div>

        <!-- Duration Selection for temporary boosts -->
        <div v-if="!isPerkActive(perk.id)" class="mt-4 flex items-center gap-2">
          <p class="text-[8px] font-black uppercase text-dark-500 tracking-widest">Durée :</p>
          <select v-model="selectedDurations[perk.id]" :disabled="gameStore.isPaused"
            class="bg-transparent border-none text-[10px] font-black uppercase tracking-tight outline-none focus:ring-0 cursor-pointer disabled:opacity-20 translate-y-[2px]"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'" @click.stop>
            <option :value="7" class="bg-dark-900">7 Jrs</option>
            <option :value="14" class="bg-dark-900">14 Jrs</option>
            <option :value="30" class="bg-dark-900">30 Jrs</option>
          </select>
        </div>

        <div
          class="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/50"
          :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
          <div class="flex gap-3">
            <span
              class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-gain-500/10 text-gain-500 border border-gain-500/20">
              +{{ perk.motivationBoost }} Motiv.
            </span>
            <span v-if="perk.fatigueReduction > 0"
              class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-accent-500/10 text-accent-400 border border-accent-500/20">
              -{{ perk.fatigueReduction }} Fatigue
            </span>
          </div>
          <span class="text-[10px] font-black italic text-dark-500 uppercase tracking-tighter">
            {{ formatCurrency(perk.cost) }} <span class="opacity-50">/j</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
