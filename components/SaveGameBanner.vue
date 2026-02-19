<script setup lang="ts">
/**
 * ── SaveGameBanner ──
 * Banner affiché au lancement si une sauvegarde existe
 * Permet de "Reprendre" ou "Nouvelle Partie"
 */
import { usePersistence } from '~/composables/usePersistence'
import { useSimulation } from '~/composables/useSimulation'
import { useGameStore } from '~/stores/gameStore'

const { hasSavedGame, getSaveInfo, loadGame, deleteSave } = usePersistence()
const { resetGame } = useSimulation()
const gameStore = useGameStore()

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
    <Transition name="banner-slide">
        <div v-if="showBanner && saveInfo"
            class="mb-8 p-6 rounded-[2.5rem] border backdrop-blur-xl relative overflow-hidden group shadow-2xl"
            :class="gameStore.darkMode ? 'bg-accent-600/10 border-accent-500/20 shadow-glow-accent/5' : 'bg-white border-slate-200 shadow-xl'">

            <!-- Animated Gradient background -->
            <div class="absolute inset-0 bg-gradient-to-r from-accent-500/5 via-transparent to-accent-500/5 opacity-50">
            </div>

            <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-6 text-center sm:text-left">
                    <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-transform group-hover:scale-110 duration-500"
                        :class="gameStore.darkMode ? 'bg-dark-900 border border-white/5' : 'bg-slate-50 border border-slate-200'">
                        💾
                    </div>
                    <div>
                        <h4 class="text-base font-black italic tracking-tighter uppercase"
                            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Sauvegarde système détectée
                        </h4>
                        <div class="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-1.5">
                            <span class="text-[10px] font-black uppercase tracking-widest text-accent-500 italic">Mois
                                {{ saveInfo.month }}</span>
                            <span class="w-1 h-1 rounded-full bg-dark-600"></span>
                            <span class="text-[10px] font-black uppercase tracking-widest"
                                :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">{{
                                formatCurrency(saveInfo.cash) }}</span>
                            <span class="hidden sm:inline w-1 h-1 rounded-full bg-dark-600"></span>
                            <span class="text-[9px] font-bold text-dark-600 uppercase tracking-tighter">{{
                                formatDate(saveInfo.savedAt) }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        class="flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-black italic text-[11px] uppercase tracking-[0.2em] transition-all bg-accent-500 text-white shadow-glow-accent hover:scale-[1.02] active:scale-[0.98]"
                        @click="handleResume">
                        Reprendre
                    </button>
                    <button
                        class="flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-black italic text-[11px] uppercase tracking-[0.2em] transition-all border"
                        :class="gameStore.darkMode ? 'bg-dark-900 border-white/5 text-dark-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'"
                        @click="handleNewGame">
                        Nouvelle Partie
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.banner-slide-enter-active,
.banner-slide-leave-active {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.banner-slide-enter-from,
.banner-slide-leave-to {
    opacity: 0;
    transform: translateY(-30px) scale(0.98);
}
</style>

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
