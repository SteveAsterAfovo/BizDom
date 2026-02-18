<script setup lang="ts">
/**
 * ── LineChart ──
 * Composant graphique réutilisable basé sur Chart.js (vue-chartjs)
 * Utilisation : <LineChart :labels="[...]" :datasets="[...]" title="..." />
 */
import { Line } from 'vue-chartjs'
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

// Couleurs par défaut
const defaultColors = [
    { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },   // accent
    { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },    // gain
    { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },    // warn
    { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },     // loss
]

// Configuration des données du graphique
const chartData = computed(() => ({
    labels: props.labels,
    datasets: props.datasets.map((ds, i) => ({
        ...ds,
        borderColor: ds.borderColor || defaultColors[i % defaultColors.length].border,
        backgroundColor: ds.backgroundColor || defaultColors[i % defaultColors.length].bg,
        fill: ds.fill !== undefined ? ds.fill : true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: ds.borderColor || defaultColors[i % defaultColors.length].border,
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
    })),
}))

// Options du graphique (thème sombre)
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
                color: '#94a3b8',
                font: { family: 'Inter', size: 12 },
                boxWidth: 12,
                boxHeight: 12,
                borderRadius: 3,
                useBorderRadius: true,
            },
        },
        tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            titleFont: { family: 'Inter', size: 13, weight: 'bold' as const },
            bodyFont: { family: 'Inter', size: 12 },
        },
    },
    scales: {
        x: {
            grid: { color: 'rgba(51, 65, 85, 0.3)' },
            ticks: {
                color: '#64748b',
                font: { family: 'Inter', size: 11 },
            },
        },
        y: {
            grid: { color: 'rgba(51, 65, 85, 0.3)' },
            ticks: {
                color: '#64748b',
                font: { family: 'Inter', size: 11 },
                callback: (value: any) => {
                    if (typeof value === 'number') {
                        return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(value)
                    }
                    return value
                },
            },
        },
    },
}))
</script>

<template>
    <div class="card">
        <h3 v-if="title" class="text-white font-bold text-sm mb-4">{{ title }}</h3>
        <div class="h-64">
            <Line v-if="labels.length > 0" :data="chartData" :options="chartOptions" />
            <div v-else class="h-full flex items-center justify-center text-dark-500 text-sm">
                Pas encore de données. Simulez un mois pour commencer.
            </div>
        </div>
    </div>
</template>
