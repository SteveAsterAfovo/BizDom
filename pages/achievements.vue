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
    title: 'Succès — BIZDOM',
})
</script>

<template>
    <div>
        <h1 class="text-3xl font-bold text-white tracking-tight mb-1">🏆 Succès</h1>
        <p class="text-dark-400 mb-6">
            {{ gameStore.unlockedCount }}/{{ gameStore.achievements.length }} débloqués — {{
                gameStore.achievementProgress }}% de progression
        </p>

        <!-- Barre de progression globale -->
        <div class="card mb-8">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-white font-bold text-lg">Progression globale</h3>
                <span class="text-warn-400 font-bold text-xl">{{ gameStore.achievementProgress }}%</span>
            </div>
            <div class="h-4 bg-dark-700/50 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-warn-600 to-warn-400 rounded-full transition-all duration-700 ease-out"
                    :style="{ width: `${gameStore.achievementProgress}%` }" />
            </div>
        </div>

        <!-- Succès débloqués -->
        <div v-if="unlockedAchievements.length > 0" class="mb-8">
            <h2 class="text-lg font-semibold text-warn-400 mb-4">✨ Débloqués</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="achievement in unlockedAchievements" :key="achievement.id"
                    class="p-4 rounded-2xl bg-warn-500/10 border border-warn-500/20 animate-fade-in">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-12 h-12 rounded-xl bg-warn-500/20 flex items-center justify-center text-2xl">
                            {{ achievement.icon }}
                        </div>
                        <div>
                            <p class="text-white font-semibold">{{ achievement.name }}</p>
                            <p class="text-dark-400 text-xs">{{ achievement.description }}</p>
                        </div>
                    </div>
                    <p v-if="achievement.unlockedAt" class="text-xs text-warn-400 text-right">
                        Débloqué au mois {{ achievement.unlockedAt }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Succès verrouillés -->
        <div v-if="lockedAchievements.length > 0">
            <h2 class="text-lg font-semibold text-dark-500 mb-4">🔒 Verrouillés</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="achievement in lockedAchievements" :key="achievement.id"
                    class="p-4 rounded-2xl bg-dark-850 border border-dark-700/30 opacity-60">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-12 h-12 rounded-xl bg-dark-700/50 flex items-center justify-center text-2xl grayscale">
                            {{ achievement.icon }}
                        </div>
                        <div>
                            <p class="text-dark-300 font-semibold">{{ achievement.name }}</p>
                            <p class="text-dark-500 text-xs">{{ achievement.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Aucun succès -->
        <div v-if="gameStore.achievements.length === 0" class="text-center py-16 text-dark-500">
            <span class="text-5xl block mb-4">🏆</span>
            <p class="text-lg">Aucun succès disponible pour le moment.</p>
        </div>
    </div>
</template>
