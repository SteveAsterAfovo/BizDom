<script setup lang="ts">
/**
 * ── LineChart ──
 * Composant graphique réutilisable basé sur Chart.js (vue-chartjs)
 * Utilisation : <LineChart :labels="[...]" :datasets="[...]" title="..." />
 */
import { Line } from 'vue-chartjs'
import { useGameStore } from '~/stores/gameStore'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const gameStore = useGameStore()

interface Dataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
  fill?: boolean
}

interface Props {
  labels: string[]
  datasets: Dataset[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

// Couleurs par défaut (Thème Sombre)
const darkColors = [
  { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },   // accent
  { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },    // gain
  { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },    // warn
  { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },     // loss
]

// Couleurs par défaut (Thème Clair)
const lightColors = [
  { border: '#4f46e5', bg: 'rgba(79, 70, 229, 0.05)' },   // accent
  { border: '#059669', bg: 'rgba(5, 150, 105, 0.05)' },    // gain
  { border: '#d97706', bg: 'rgba(217, 119, 6, 0.05)' },    // warn
  { border: '#dc2626', bg: 'rgba(220, 38, 38, 0.05)' },     // loss
]

const currentColors = computed(() => gameStore.darkMode ? darkColors : lightColors)

// Configuration des données du graphique
const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((ds, i) => ({
    ...ds,
    borderColor: ds.borderColor || currentColors.value[i % currentColors.value.length].border,
    backgroundColor: ds.backgroundColor || currentColors.value[i % currentColors.value.length].bg,
    fill: ds.fill !== undefined ? ds.fill : true,
    tension: 0.4,
    borderWidth: 3,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: ds.borderColor || currentColors.value[i % currentColors.value.length].border,
    pointBorderColor: gameStore.darkMode ? '#0f172a' : '#ffffff',
    pointBorderWidth: 2,
  })),
}))

// Options du graphique (Réactif au mode sombre)
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      display: props.datasets.length > 1,
      position: 'top' as const,
      labels: {
        color: gameStore.darkMode ? '#94a3b8' : '#64748b',
        font: { family: 'Inter', size: 10, weight: 'bold' as const },
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20
      },
    },
    tooltip: {
      backgroundColor: gameStore.darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      titleColor: gameStore.darkMode ? '#f1f5f9' : '#0f172a',
      bodyColor: gameStore.darkMode ? '#cbd5e1' : '#475569',
      borderColor: gameStore.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      cornerRadius: 12,
      padding: 12,
      titleFont: { family: 'Inter', size: 13, weight: 'bold' as const },
      bodyFont: { family: 'Inter', size: 12, weight: 'bold' as const },
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      boxPadding: 6,
      usePointStyle: true
    },
  },
  scales: {
    x: {
      grid: {
        color: gameStore.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        drawTicks: false
      },
      ticks: {
        color: gameStore.darkMode ? '#475569' : '#94a3b8',
        font: { family: 'Inter', size: 10, weight: 'bold' as const },
        padding: 10
      },
      border: { display: false }
    },
    y: {
      grid: {
        color: gameStore.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        drawTicks: false
      },
      ticks: {
        color: gameStore.darkMode ? '#475569' : '#94a3b8',
        font: { family: 'Inter', size: 10, weight: 'bold' as const },
        padding: 10,
        callback: (value: any) => {
          if (typeof value === 'number') {
            return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(value)
          }
          return value
        },
      },
      border: { display: false }
    },
  },
}))
</script>

<template>
  <div class="card p-6 border rounded-[2rem] shadow-xl overflow-hidden"
    :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

    <div class="flex items-center justify-between mb-6">
      <h3 v-if="title" class="text-[10px] font-black uppercase tracking-[0.2em] italic"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        {{ title }}
      </h3>
      <div v-if="labels.length > 0" class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full animate-pulse bg-accent-500 shadow-glow-accent"></span>
        <span class="text-[8px] font-black uppercase tracking-widest text-dark-500">Live Data</span>
      </div>
    </div>

    <div class="h-64 sm:h-72 w-full">
      <Line v-if="labels.length > 0" :data="chartData" :options="chartOptions" />
      <div v-else class="h-full flex flex-col items-center justify-center gap-4 text-center">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl opacity-20"
          :class="gameStore.darkMode ? 'bg-dark-800' : 'bg-slate-50'">📊</div>
        <p class="text-xs font-bold uppercase tracking-widest max-w-[200px]"
          :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">
          Pas encore de données. Simulez un mois pour commencer l'analyse.
        </p>
      </div>
    </div>
  </div>
</template>
