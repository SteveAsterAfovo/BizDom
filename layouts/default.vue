<script setup lang="ts">
/**
 * ── Layout Default ──
 * Layout principal avec sidebar navigable, AchievementToast global
 */
const isSidebarOpen = ref(true)

const navLinks = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/employees', icon: '👥', label: 'Employés' },
  { to: '/reports', icon: '📋', label: 'Rapports' },
  { to: '/achievements', icon: '🏆', label: 'Succès' },
]
</script>

<template>
  <div class="min-h-screen bg-dark-950 flex">
    <!-- ── Sidebar ── -->
    <aside :class="[
      'flex flex-col bg-dark-900 border-r border-dark-800/50 transition-all duration-300',
      isSidebarOpen ? 'w-56' : 'w-16',
    ]">
      <!-- Logo / Header -->
      <div class="p-4 flex items-center gap-3 border-b border-dark-800/50">
        <button class="text-2xl flex-shrink-0" @click="isSidebarOpen = !isSidebarOpen" title="Toggle sidebar">
          🎮
        </button>
        <Transition name="fade">
          <span v-if="isSidebarOpen" class="text-white font-black text-xl tracking-wider">
            BIZDOM
          </span>
        </Transition>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 space-y-1 px-2">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          'hover:bg-dark-800/60 hover:text-white',
          $route.path === link.to
            ? 'bg-accent-600/20 text-accent-400'
            : 'text-dark-400',
        ]">
          <span class="text-lg flex-shrink-0">{{ link.icon }}</span>
          <Transition name="fade">
            <span v-if="isSidebarOpen">{{ link.label }}</span>
          </Transition>
        </NuxtLink>
      </nav>

      <!-- Footer sidebar -->
      <div v-if="isSidebarOpen" class="p-4 border-t border-dark-800/50">
        <p class="text-xs text-dark-600 text-center">BIZDOM v2.0</p>
      </div>
    </aside>

    <!-- ── Contenu principal ── -->
    <main class="flex-1 p-6 lg:p-8 overflow-y-auto max-h-screen">
      <slot />
    </main>

    <!-- ── Composants globaux ── -->
    <EventModal />
    <AchievementToast />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
