<script setup lang="ts">
/**
 * ── FinancialCard ──
 * Carte KPI réutilisable affichant un indicateur financier
 * Props : titre, valeur, icône, tendance (up/down/neutral)
 */

interface Props {
  title: string
  value: string | number
  icon: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  trend: 'neutral',
  subtitle: '',
  suffix: '',
})

const gameStore = useGameStore()

// Couleurs selon la tendance
const trendConfig = computed(() => {
  switch (props.trend) {
    case 'up':
      return {
        color: 'text-gain-500 dark:text-gain-400',
        bg: 'bg-gain-500/10',
        border: 'border-gain-500/20',
        glow: 'shadow-glow-gain',
        arrow: '↑'
      }
    case 'down':
      return {
        color: 'text-loss-500 dark:text-loss-400',
        bg: 'bg-loss-500/10',
        border: 'border-loss-500/20',
        glow: 'shadow-glow-loss',
        arrow: '↓'
      }
    default:
      return {
        color: 'text-accent-600 dark:text-accent-400',
        bg: 'bg-accent-500/10',
        border: 'border-accent-500/20',
        glow: '',
        arrow: ''
      }
  }
})
</script>

<template>
  <div :class="[
    'card group cursor-default transition-all duration-300',
    gameStore.darkMode ? trendConfig.glow : 'shadow-sm',
    gameStore.darkMode ? 'bg-dark-900 border-dark-800' : 'bg-white border-slate-200'
  ]">
    <div class="flex items-start justify-between mb-3 text-white">
      <!-- Icône -->
      <div :class="[
        'w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm overflow-hidden',
        trendConfig.bg, trendConfig.border, 'border',
      ]">
        <span class="z-10">{{ icon }}</span>
        <!-- Subtle background decoration -->
        <div class="absolute inset-0 opacity-20 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>
      <!-- Flèche tendance -->
      <span v-if="trend !== 'neutral'" :class="['text-sm font-black', trendConfig.color]">
        {{ trendConfig.arrow }}
      </span>
    </div>

    <!-- Valeur principale -->
    <p :class="[
      'text-2xl font-black tracking-tighter mb-0.5 italic',
      gameStore.darkMode ? 'text-white' : 'text-slate-900'
    ]">
      {{ value }}<span v-if="suffix" class="text-xs font-bold text-dark-400 ml-1">{{ suffix }}</span>
    </p>

    <!-- Titre -->
    <p class="text-[10px] font-black uppercase tracking-widest"
      :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">
      {{ title }}
    </p>

    <!-- Sous-titre optionnel -->
    <p v-if="subtitle" :class="['text-[10px] mt-2 font-bold uppercase truncate', trendConfig.color]">
      {{ subtitle }}
    </p>
  </div>
</template>
