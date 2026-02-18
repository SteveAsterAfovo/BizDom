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

// Couleurs selon la tendance
const trendConfig = computed(() => {
  switch (props.trend) {
    case 'up':
      return { color: 'text-gain-400', bg: 'bg-gain-500/10', border: 'border-gain-500/20', glow: 'shadow-glow-gain', arrow: '↑' }
    case 'down':
      return { color: 'text-loss-400', bg: 'bg-loss-500/10', border: 'border-loss-500/20', glow: 'shadow-glow-loss', arrow: '↓' }
    default:
      return { color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/20', glow: '', arrow: '' }
  }
})
</script>

<template>
  <div :class="['card group cursor-default', trendConfig.glow]">
    <div class="flex items-start justify-between mb-3">
      <!-- Icône -->
      <div
        :class="[
          'w-11 h-11 rounded-xl flex items-center justify-center text-xl',
          trendConfig.bg, trendConfig.border, 'border',
        ]"
      >
        {{ icon }}
      </div>
      <!-- Flèche tendance -->
      <span
        v-if="trend !== 'neutral'"
        :class="['text-sm font-bold', trendConfig.color]"
      >
        {{ trendConfig.arrow }}
      </span>
    </div>

    <!-- Valeur principale -->
    <p :class="['text-2xl font-bold tracking-tight text-white mb-0.5']">
      {{ value }}<span v-if="suffix" class="text-sm text-dark-400 ml-1">{{ suffix }}</span>
    </p>

    <!-- Titre -->
    <p class="text-sm text-dark-400">{{ title }}</p>

    <!-- Sous-titre optionnel -->
    <p v-if="subtitle" :class="['text-xs mt-1', trendConfig.color]">
      {{ subtitle }}
    </p>
  </div>
</template>
