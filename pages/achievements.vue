<script setup lang="ts">
/**
 * ── Page Achievements ──
 * Page dédiée aux succès : débloqués et verrouillés avec progression
 */
import { useGameStore } from '~/stores/gameStore'

const gameStore = useGameStore()

const unlockedAchievements = computed(() =>
  gameStore.achievements.filter((a) => a.unlocked)
)

const lockedAchievements = computed(() =>
  gameStore.achievements.filter((a) => !a.unlocked)
)

useHead({
  title: 'Succès',
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-10 animate-fade-in p-1">
    <header class="text-center sm:text-left">
      <h1 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        🏆 Galerie des Succès
      </h1>
      <p class="text-[10px] font-black uppercase tracking-[0.3em]"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        {{ gameStore.unlockedCount }}/{{ gameStore.achievements.length }} Trophées collectés — {{
          gameStore.achievementProgress }}% de complétion
      </p>
    </header>

    <!-- Barre de progression globale -->
    <div class="card p-8 rounded-[2.5rem] border shadow-lg"
      :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
      <div class="flex items-end justify-between mb-4">
        <div>
          <h3 class="font-black italic uppercase tracking-widest text-dark-500 text-[10px] mb-1">Status de l'Empire</h3>
          <p class="text-2xl font-black italic" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
            Progression Globale</p>
        </div>
        <span class="text-3xl font-black italic text-warn-500">{{ gameStore.achievementProgress }}%</span>
      </div>
      <div class="h-4 bg-dark-700/20 rounded-full overflow-hidden border border-white/5">
        <div
          class="h-full bg-gradient-to-r from-warn-600 to-warn-400 rounded-full transition-all duration-1000 shadow-glow-warn"
          :style="{ width: `${gameStore.achievementProgress}%` }" />
      </div>
    </div>

    <!-- Succès débloqués -->
    <div v-if="unlockedAchievements.length > 0" class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-6 bg-warn-500 rounded-full"></div>
        <h2 class="text-xl font-black italic uppercase tracking-tight"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">✨ Exploits Réalisés</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="achievement in unlockedAchievements" :key="achievement.id"
          class="p-6 rounded-[2rem] border transition-all duration-300 hover:scale-[1.02] shadow-md group"
          :class="gameStore.darkMode ? 'bg-warn-500/10 border-warn-500/20' : 'bg-warn-50 border-warn-200'">
          <div class="flex items-center gap-5 mb-4">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:rotate-12"
              :class="gameStore.darkMode ? 'bg-warn-500/20' : 'bg-warn-100'">
              {{ achievement.icon }}
            </div>
            <div>
              <p class="font-black italic uppercase tracking-tighter text-lg"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ achievement.name }}</p>
              <p class="text-xs font-bold leading-tight"
                :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-600'">{{ achievement.description }}</p>
            </div>
          </div>
          <div class="pt-4 border-t" :class="gameStore.darkMode ? 'border-warn-500/10' : 'border-warn-200'">
            <p v-if="achievement.unlockedAt"
              class="text-[9px] font-black uppercase tracking-widest text-warn-600 text-right">
              Obtenu au mois {{ achievement.unlockedAt }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Succès verrouillés -->
    <div v-if="lockedAchievements.length > 0" class="space-y-6 pt-10">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-6 bg-dark-500 rounded-full opacity-30"></div>
        <h2 class="text-xl font-black italic uppercase tracking-tight"
          :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">🔒 Défis à Relever</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="achievement in lockedAchievements" :key="achievement.id"
          class="p-6 rounded-[2rem] border shadow-sm transition-all"
          :class="gameStore.darkMode ? 'bg-dark-900/50 border-white/5 opacity-40' : 'bg-slate-50 border-slate-200 opacity-60'">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl grayscale shadow-inner"
              :class="gameStore.darkMode ? 'bg-dark-850' : 'bg-slate-100'">
              {{ achievement.icon }}
            </div>
            <div>
              <p class="font-black italic uppercase tracking-tighter text-lg"
                :class="gameStore.darkMode ? 'text-dark-300' : 'text-slate-500'">{{ achievement.name }}</p>
              <p class="text-[10px] font-bold leading-tight"
                :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">{{ achievement.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Aucun succès -->
    <div v-if="gameStore.achievements.length === 0"
      class="text-center py-24 rounded-[3rem] border border-dashed border-dark-700/30">
      <span class="text-6xl block mb-6">🏆</span>
      <p class="font-black italic uppercase tracking-tighter text-2xl text-dark-500">Silence radio dans la galerie</p>
    </div>
  </div>
</template>
