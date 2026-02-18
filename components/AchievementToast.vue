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
      <div v-if="gameStore.recentAchievement" class="fixed top-6 right-6 z-[60] max-w-sm">
        <div class="p-4 rounded-2xl bg-dark-900 border border-warn-500/30 shadow-2xl animate-bounce-soft">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-warn-500/20 flex items-center justify-center text-2xl flex-shrink-0">
              {{ gameStore.recentAchievement.icon }}
            </div>
            <div>
              <p class="text-xs text-warn-400 uppercase tracking-wider font-semibold mb-0.5">
                🏆 Succès débloqué !
              </p>
              <p class="text-white font-bold text-sm">
                {{ gameStore.recentAchievement.name }}
              </p>
              <p class="text-dark-400 text-xs">
                {{ gameStore.recentAchievement.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
