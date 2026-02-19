<script setup lang="ts">
/**
 * ── EmployeeCard ──
 * Carte individuelle d'un employé avec compétences, motivation,
 * fatigue, ancienneté, spécialité et actions (augmentation, licenciement)
 */
import type { Employee } from '~/types'
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

interface Props {
  employee: Employee
}

const props = defineProps<Props>()
const companyStore = useCompanyStore()
const gameStore = useGameStore()

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
  tech: { label: 'Tech', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: '💻' },
  sales: { label: 'Ventes', color: 'bg-gain-500/10 text-gain-400 border-gain-500/20', icon: '📊' },
  creative: { label: 'Créatif', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '🎨' },
  hr: { label: 'RH', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: '🤝' },
  management: { label: 'Direction', color: 'bg-warn-500/10 text-warn-400 border-warn-500/20', icon: '👔' },
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
  <div
    class="card p-6 border rounded-[2rem] shadow-xl group transition-all duration-300 hover:scale-[1.01] animate-fade-in"
    :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

    <!-- Header : nom, rôle et spécialité -->
    <div class="flex items-start justify-between mb-6">
      <div class="flex gap-4">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:rotate-6 duration-300 shadow-lg"
          :class="gameStore.darkMode ? 'bg-dark-850 border border-white/5' : 'bg-slate-50 border border-slate-100'">
          {{ specialtyConfig[employee.specialty]?.icon || '👤' }}
        </div>
        <div>
          <h3 class="text-sm font-black italic uppercase tracking-tighter transition-colors"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ employee.name }}</h3>
          <p class="text-[10px] font-black uppercase tracking-widest"
            :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">{{ employee.role }}</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[9px] font-black text-dark-500 uppercase">📅 {{ employee.monthsEmployed }} Mois</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <span class="px-4 py-1.5 rounded-full text-[10px] font-black bg-accent-500 text-white shadow-glow-accent/20">
          {{ formatSalary(employee.salary) }}
        </span>
        <span
          :class="['px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest', specialtyConfig[employee.specialty]?.color || 'bg-dark-700 text-dark-400 border-transparent']">
          {{ specialtyConfig[employee.specialty]?.label }}
        </span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 mb-8">
      <!-- Skill -->
      <div class="p-4 rounded-2xl border transition-all"
        :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100/50'">
        <div class="flex justify-between items-center mb-1">
          <span class="text-[9px] font-black uppercase tracking-widest text-dark-500">Expertise</span>
          <span class="text-xs font-black italic text-warn-500 tracking-tight">{{ skillStars(employee.skillLevel)
          }}</span>
        </div>
      </div>

      <!-- Motivation -->
      <div class="space-y-3">
        <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
          <span class="text-dark-500 italic">Motivation Globale</span>
          <span
            :class="employee.motivation >= 70 ? 'text-gain-500' : employee.motivation >= 40 ? 'text-warn-500' : 'text-loss-500'">
            {{ employee.motivation }}%
          </span>
        </div>
        <div class="w-full h-1.5 rounded-full overflow-hidden p-0.5"
          :class="gameStore.darkMode ? 'bg-dark-800' : 'bg-white border border-slate-200 shadow-sm'">
          <div :class="['h-full rounded-full transition-all duration-1000', motivationColor]"
            :style="{ width: `${employee.motivation}%` }" />
        </div>
      </div>

      <!-- Fatigue -->
      <div class="space-y-3">
        <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
          <span class="text-dark-500 italic">Niveau de Fatigue</span>
          <span
            :class="employee.fatigue >= 80 ? 'text-loss-500' : employee.fatigue >= 50 ? 'text-warn-500' : 'text-accent-500'">
            {{ employee.fatigue }}% {{ employee.fatigue >= 80 ? '⚠️' : '' }}
          </span>
        </div>
        <div class="w-full h-1.5 rounded-full overflow-hidden p-0.5"
          :class="gameStore.darkMode ? 'bg-dark-800' : 'bg-white border border-slate-200 shadow-sm'">
          <div :class="['h-full rounded-full transition-all duration-1000 shadow-inner', fatigueColor]"
            :style="{ width: `${employee.fatigue}%` }" />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-4">
      <button
        class="flex-1 py-4 rounded-2xl bg-gain-500/5 text-gain-500 border-2 border-gain-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-gain-500 hover:text-white transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
        :disabled="gameStore.isPaused" @click="companyStore.raiseSalary(employee.id)">
        💰 Augmenter
      </button>
      <button
        class="flex-1 py-4 rounded-2xl bg-loss-500/5 text-loss-500 border-2 border-loss-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-loss-500 hover:text-white transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
        :disabled="gameStore.isPaused" @click="companyStore.fireEmployee(employee.id)">
        ❌ Licencier
      </button>
    </div>
  </div>
</template>
