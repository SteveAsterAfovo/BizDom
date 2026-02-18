<script setup lang="ts">
/**
 * ── SaveGameBanner ──
 * Banner affiché au lancement si une sauvegarde existe
 * Permet de "Reprendre" ou "Nouvelle Partie"
 */
import { usePersistence } from '~/composables/usePersistence'
import { useSimulation } from '~/composables/useSimulation'

const { hasSavedGame, getSaveInfo, loadGame, deleteSave } = usePersistence()
const { resetGame } = useSimulation()

const showBanner = ref(false)
const saveInfo = ref<{ month: number; cash: number; savedAt: number } | null>(null)

// Vérifier au montage si une sauvegarde existe
onMounted(() => {
    if (hasSavedGame()) {
        saveInfo.value = getSaveInfo()
        showBanner.value = true
    }
})

function handleResume() {
    loadGame()
    showBanner.value = false
}

function handleNewGame() {
    deleteSave()
    resetGame()
    showBanner.value = false
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    })
}
</script>

<template>
    <Transition name="banner">
        <div v-if="showBanner && saveInfo"
            class="mb-6 p-5 rounded-2xl bg-accent-600/10 border border-accent-500/30 animate-fade-in">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                        💾
                    </div>
                    <div>
                        <p class="text-white font-bold">Partie sauvegardée trouvée</p>
                        <p class="text-dark-400 text-sm">
                            Mois {{ saveInfo.month }} · {{ formatCurrency(saveInfo.cash) }} ·
                            <span class="text-dark-500">{{ formatDate(saveInfo.savedAt) }}</span>
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn-primary text-sm" @click="handleResume">
                        ▶ Reprendre
                    </button>
                    <button class="btn-secondary text-sm" @click="handleNewGame">
                        🔄 Nouvelle Partie
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.banner-enter-active {
    transition: all 0.4s ease-out;
}

.banner-leave-active {
    transition: all 0.3s ease-in;
}

.banner-enter-from,
.banner-leave-to {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
}
</style>
