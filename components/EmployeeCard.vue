<script setup lang="ts">
/**
 * ── EmployeeCard ──
 * Carte individuelle d'un employé avec compétences, motivation,
 * et actions (augmentation, licenciement)
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
    <!-- Header : nom et rôle -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-white font-semibold text-base">{{ employee.name }}</h3>
        <p class="text-dark-400 text-sm">{{ employee.role }}</p>
      </div>
      <span class="badge-accent">{{ formatSalary(employee.salary) }}</span>
    </div>

    <!-- Compétence -->
    <div class="mb-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs text-dark-400">Compétence</span>
        <span class="text-sm text-warn-400 tracking-wider">{{ skillStars(employee.skillLevel) }}</span>
      </div>
    </div>

    <!-- Motivation -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1.5">
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
        <div
          :class="['progress-fill', motivationColor]"
          :style="{ width: `${employee.motivation}%` }"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button
        class="flex-1 btn-secondary text-xs py-2"
        @click="companyStore.raiseSalary(employee.id)"
      >
        💰 Augmenter
      </button>
      <button
        class="flex-1 btn-danger text-xs py-2"
        @click="companyStore.fireEmployee(employee.id)"
      >
        ❌ Licencier
      </button>
    </div>
  </div>
</template>
