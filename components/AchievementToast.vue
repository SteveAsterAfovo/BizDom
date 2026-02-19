<script setup lang="ts">
/**
 * ── AchievementToast ──
 * Toast notification animée affichée quand un succès est débloqué
 */
import { useGameStore } from '~/stores/gameStore'

const gameStore = useGameStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="gameStore.recentAchievement"
        class="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 z-[100] w-[calc(100%-2rem)] max-w-sm pointer-events-none">

        <div
          class="group p-1 rounded-[2rem] transition-all duration-500 overflow-hidden shadow-2xl animate-bounce-subtle pointer-events-auto"
          :class="gameStore.darkMode ? 'bg-dark-900/90 border border-white/5 backdrop-blur-xl' : 'bg-white/90 border border-slate-200 backdrop-blur-xl'">

          <div class="px-5 py-4 flex items-center gap-4">
            <!-- Icon with Glow -->
            <div class="relative flex-shrink-0">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-500"
                :class="gameStore.darkMode ? 'bg-warn-500/10 border border-warn-500/20 shadow-glow-warn/10' : 'bg-warn-50 border border-warn-100 shadow-lg shadow-warn-500/10'">
                {{ gameStore.recentAchievement.icon }}
              </div>
              <!-- Pulse Effect -->
              <div class="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-warn-500"></div>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-1 italic"
                :class="gameStore.darkMode ? 'text-warn-500' : 'text-warn-600'">
                🏆 Succès débloqué
              </p>
              <h4 class="text-sm font-black italic uppercase tracking-tighter truncate"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ gameStore.recentAchievement.name }}
              </h4>
              <p class="text-[11px] font-bold leading-tight opacity-70 truncate mt-0.5"
                :class="gameStore.darkMode ? 'text-dark-300' : 'text-slate-500'">
                {{ gameStore.recentAchievement.description }}
              </p>
            </div>
          </div>

          <!-- Progress bar timer visual -->
          <div class="h-1 w-full bg-dark-800/20 overflow-hidden">
            <div class="h-full bg-warn-500 animate-loading-bar origin-left"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9) rotate(-2deg);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

@keyframes bounce-subtle {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes loading-bar {
  0% {
    transform: scaleX(1);
  }

  100% {
    transform: scaleX(0);
  }
}

.animate-loading-bar {
  animation: loading-bar 5s linear forwards;
}
</style>
