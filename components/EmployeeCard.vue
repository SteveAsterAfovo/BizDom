<script setup lang="ts">
/**
 * ── EmployeeCard ──
 * Carte individuelle d'un employé avec compétences, motivation,
 * fatigue, ancienneté, spécialité et actions (augmentation, licenciement)
 */
import type { Employee } from '~/types'
import { useCompanyStore } from '~/stores/companyStore'

interface Props {
  employee: Employee
}

const props = defineProps<Props>()
const companyStore = useCompanyStore()

// Couleur de la barre de motivation
const motivationColor = computed(() => {
  if (props.employee.motivation >= 70) return 'bg-gain-500'
  if (props.employee.motivation >= 40) return 'bg-warn-500'
  return 'bg-loss-500'
})

// Couleur fatigue
const fatigueColor = computed(() => {
  if (props.employee.fatigue >= 80) return 'bg-loss-500'
  if (props.employee.fatigue >= 50) return 'bg-warn-500'
  return 'bg-accent-500'
})

// Badge de spécialité
const specialtyConfig: Record<string, { label: string; color: string; icon: string }> = {
  tech: { label: 'Tech', color: 'bg-blue-500/20 text-blue-400', icon: '💻' },
  sales: { label: 'Ventes', color: 'bg-gain-500/20 text-gain-400', icon: '📊' },
  creative: { label: 'Créatif', color: 'bg-purple-500/20 text-purple-400', icon: '🎨' },
  hr: { label: 'RH', color: 'bg-pink-500/20 text-pink-400', icon: '🤝' },
  management: { label: 'Direction', color: 'bg-warn-500/20 text-warn-400', icon: '👔' },
}

// Formater le salaire
function formatSalary(salary: number): string {
  return new Intl.NumberFormat('fr-FR').format(salary) + ' FCFA'
}

// Étoiles de compétence
function skillStars(level: number): string {
  return '★'.repeat(level) + '☆'.repeat(5 - level)
}
</script>

<template>
  <div class="card animate-fade-in">
    <!-- Header : nom, rôle et spécialité -->
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="text-white font-semibold text-base">{{ employee.name }}</h3>
        <p class="text-dark-400 text-sm">{{ employee.role }}</p>
      </div>
      <div class="flex flex-col items-end gap-1">
        <span class="badge-accent text-xs">{{ formatSalary(employee.salary) }}</span>
        <span :class="['badge text-xs', specialtyConfig[employee.specialty]?.color || 'bg-dark-700 text-dark-400']">
          {{ specialtyConfig[employee.specialty]?.icon }} {{ specialtyConfig[employee.specialty]?.label }}
        </span>
      </div>
    </div>

    <!-- Ancienneté -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-xs text-dark-500">📅 {{ employee.monthsEmployed }} mois d'ancienneté</span>
    </div>

    <!-- Compétence -->
    <div class="mb-2">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs text-dark-400">Compétence</span>
        <span class="text-sm text-warn-400 tracking-wider">{{ skillStars(employee.skillLevel) }}</span>
      </div>
    </div>

    <!-- Motivation -->
    <div class="mb-2">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs text-dark-400">Motivation</span>
        <span :class="[
          'text-xs font-semibold',
          employee.motivation >= 70 ? 'text-gain-400' :
            employee.motivation >= 40 ? 'text-warn-400' : 'text-loss-400'
        ]">
          {{ employee.motivation }}%
        </span>
      </div>
      <div class="progress-bar">
        <div :class="['progress-fill', motivationColor]" :style="{ width: `${employee.motivation}%` }" />
      </div>
    </div>

    <!-- Fatigue -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs text-dark-400">Fatigue</span>
        <span :class="[
          'text-xs font-semibold',
          employee.fatigue >= 80 ? 'text-loss-400' :
            employee.fatigue >= 50 ? 'text-warn-400' : 'text-accent-400'
        ]">
          {{ employee.fatigue }}%
          <span v-if="employee.fatigue >= 80" class="ml-1">⚠️</span>
        </span>
      </div>
      <div class="progress-bar">
        <div :class="['progress-fill', fatigueColor]" :style="{ width: `${employee.fatigue}%` }" />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button class="flex-1 btn-secondary text-xs py-2" @click="companyStore.raiseSalary(employee.id)">
        💰 Augmenter
      </button>
      <button class="flex-1 btn-danger text-xs py-2" @click="companyStore.fireEmployee(employee.id)">
        ❌ Licencier
      </button>
    </div>
  </div>
</template>
