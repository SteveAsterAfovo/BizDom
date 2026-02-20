<script setup lang="ts">
/**
 * ── Project Management Page ──
 * Gère les projets actifs, l'assignation des équipes et le suivi de progression.
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'
import type { Project } from '~/types'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}

const selectedProject = ref<Project | null>(null)
const selectedEmployees = ref<number[]>([])

function openProjectModal(project: Project) {
  selectedProject.value = project
  selectedEmployees.value = [...project.assignedEmployees]
}

function assignTeam() {
  if (!selectedProject.value) return
  companyStore.assignEmployeesToProject(selectedProject.value.id, selectedEmployees.value)
  selectedProject.value = null
}

const availableEmployees = computed(() => {
  return companyStore.employees.filter(e => !e.isOnStrike && e.trainingDaysRemaining <= 0)
})

function getEmployee(id: number) {
  return companyStore.employees.find(e => e.id === id)
}

function getProjectEfficiency(project: Project) {
  const assigned = companyStore.employees.filter(e => project.assignedEmployees.includes(e.id))
  if (assigned.length === 0) return 0
  const avgMotivation = assigned.reduce((s, e) => s + e.motivation, 0) / assigned.length
  const avgFatigue = assigned.reduce((s, e) => s + e.fatigue, 0) / assigned.length
  const score = ((0.5 + (avgMotivation / 100)) * (1 - (avgFatigue / 200))) * 100
  return Math.min(150, Math.round(score))
}

// Generate project if empty or for demo
onMounted(() => {
  if (companyStore.activeProjects.length === 0) {
    companyStore.generateProject()
    companyStore.generateProject()
  }
})

/**
 * Computed réactif : map de timers par projet
 * Se met à jour automatiquement à chaque tick (gameStore.now change chaque seconde)
 */
const projectTimers = computed(() => {
  // Force la réactivité en lisant gameStore.now
  const now = gameStore.now
  const timers: Record<string, { timeLeft: string; remainingDays: string; isUrgent: boolean }> = {}

  companyStore.activeProjects.forEach((project: Project) => {
    // ── Temps avant expiration (appels d'offres pending) ──
    let timeLeft = ''
    let isUrgent = false
    if (project.expiresAt) {
      const diff = project.expiresAt - now
      if (diff <= 0) {
        timeLeft = 'Expiré'
        isUrgent = true
      } else {
        const totalSeconds = Math.floor(diff / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        timeLeft = minutes > 0 ? `${minutes}m ${String(seconds).padStart(2, '0')}s` : `${seconds}s`
        isUrgent = totalSeconds < 60
      }
    }

    // ── Durée restante (projets actifs en production) ──
    let remainingDays = `${project.duration} Jours`
    if (project.status === 'active') {
      const efficiency = getProjectEfficiency(project) / 100 || 1
      const remainingPercent = 100 - project.progress
      // 1 jour-jeu = 120 secondes réelles
      const totalSecondsRemaining = ((remainingPercent / 100) * (project.duration * 120)) / efficiency

      const hours = Math.floor(totalSecondsRemaining / 3600)
      const minutes = Math.floor((totalSecondsRemaining % 3600) / 60)
      const seconds = Math.floor(totalSecondsRemaining % 60)

      if (hours > 0) {
        remainingDays = `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      } else if (minutes > 0) {
        remainingDays = `${minutes}m ${String(seconds).padStart(2, '0')}s`
      } else {
        remainingDays = `${seconds}s`
      }
    }

    timers[project.id] = { timeLeft, remainingDays, isUrgent }
  })

  return timers
})

/** Calcul du total des spécialités requises pour un projet */
function getRequiredTotal(project: Project): number {
  return Object.values(project.requiredSpecialties).reduce((sum, v) => sum + (v || 0), 0)
}

// SEO
useHead({
  title: 'Production & Projets',
})
</script>

<template>
  <div class="space-y-10 animate-fade-in p-2 sm:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 pt-4 sm:pt-0">
      <div class="text-center sm:text-left">
        <h2 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          Projets <span class="text-accent-500">& Production</span>
        </h2>
        <p class="text-[10px] font-black uppercase tracking-[0.2em]"
          :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
          Gérez votre backlog et maximisez votre rentabilité opérationnelle
        </p>
      </div>
      <button @click="companyStore.generateProject()" :disabled="gameStore.isPaused"
        class="btn-primary px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow-accent/20 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale">
        Appel d'offres 📡
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div v-for="project in companyStore.activeProjects" :key="project.id"
        class="card p-8 border rounded-[2.5rem] shadow-xl flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
        :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

        <!-- Overlay Terminé -->
        <div v-if="project.status === 'completed'"
          class="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-gain-500/5 animate-fade-in">
          <div
            class="bg-gain-500 text-white px-8 py-3 rounded-full font-black uppercase text-sm shadow-glow-gain animate-bounce-subtle">
            Terminé ✓
          </div>
        </div>

        <div>
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <h3 class="text-2xl font-black italic tracking-tighter uppercase"
              :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ project.title }}</h3>
            <span :class="[
              'text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm',
              project.status === 'active' ? 'bg-accent-500 text-white animate-pulse' :
                project.status === 'pending' ? 'bg-dark-800 text-dark-400 border border-white/5' :
                  'bg-gain-500 text-white'
            ]">
              {{ project.status === 'active' ? 'Production' : project.status === 'pending' ? 'Tender' : 'Terminé' }}
            </span>
          </div>

          <!-- Time Left for Pending Projects -->
          <div v-if="project.status === 'pending' && project.expiresAt" class="mb-4">
            <div
              class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors duration-500"
              :class="projectTimers[project.id]?.isUrgent ? 'text-loss-500 animate-pulse' : 'text-warn-500'">
              <span class="text-base">⏱</span>
              <span>Expire dans :</span>
              <span class="font-mono tabular-nums text-[11px] tracking-tight"
                :class="projectTimers[project.id]?.isUrgent ? 'text-loss-400' : 'text-warn-400'">
                {{ projectTimers[project.id]?.timeLeft }}
              </span>
            </div>
          </div>

          <p class="text-sm font-bold leading-relaxed mb-8"
            :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">{{ project.description }}</p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div class="p-4 rounded-2xl border"
              :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
              <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">Gain Estimé</p>
              <p class="text-sm font-black italic text-gain-500">{{ formatCurrency(project.reward) }}</p>
            </div>
            <div class="p-4 rounded-2xl border"
              :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
              <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">Coût</p>
              <p class="text-sm font-black italic text-loss-500">{{ formatCurrency(project.cost) }}</p>
            </div>
            <div class="p-4 rounded-2xl border transition-all"
              :class="project.status === 'active' ? (gameStore.darkMode ? 'bg-accent-500/5 border-accent-500/20' : 'bg-accent-50 border-accent-100') : (gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100')">
              <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">
                {{ project.status === 'active' ? 'Restant' : 'Délai' }}
              </p>
              <p class="text-sm font-black italic font-mono tabular-nums"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
                {{ projectTimers[project.id]?.remainingDays }}
              </p>
            </div>
            <div class="p-4 rounded-2xl border"
              :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
              <p class="text-[8px] font-black uppercase tracking-widest text-dark-500 mb-1">Équipe</p>
              <p class="text-sm font-black italic text-accent-500">{{ getRequiredTotal(project) }} Membres</p>
            </div>
          </div>

          <!-- Requirements Detail -->
          <div class="flex flex-wrap gap-3 mb-8">
            <div v-for="(count, spec) in project.requiredSpecialties" :key="spec"
              class="px-4 py-2 rounded-xl border flex items-center gap-3 transition-colors"
              :class="gameStore.darkMode ? 'bg-dark-950/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'">
              <span class="text-[9px] font-black uppercase tracking-widest text-dark-500">{{ spec }}</span>
              <span class="text-xs font-black italic"
                :class="companyStore.employees.filter(e => project.assignedEmployees.includes(e.id) && e.specialty === spec).length >= (count as number) ? 'text-gain-500' : 'text-warn-500'">
                {{companyStore.employees.filter(e => project.assignedEmployees.includes(e.id) && e.specialty ===
                  spec).length}} / {{ count }}
              </span>
            </div>
          </div>

          <!-- Progress Bar & Efficiency -->
          <div v-if="project.status === 'active'" class="space-y-4 mb-8 p-6 rounded-3xl border shadow-inner"
            :class="gameStore.darkMode ? 'bg-dark-950/20 border-white/5' : 'bg-slate-50/50 border-slate-100'">
            <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span class="text-dark-500 italic">Avancement Global</span>
              <span class="text-accent-500">{{ Math.round(project.progress) }}%</span>
            </div>
            <div class="w-full h-2 rounded-full overflow-hidden p-0.5"
              :class="gameStore.darkMode ? 'bg-dark-800' : 'bg-white border border-slate-200 shadow-sm'">
              <div class="h-full bg-accent-500 rounded-full transition-all duration-1000 shadow-glow-accent"
                :style="{ width: project.progress + '%' }"></div>
            </div>

            <div class="flex items-center gap-4 pt-2">
              <div class="flex-1 h-1.5 rounded-full overflow-hidden"
                :class="gameStore.darkMode ? 'bg-dark-800' : 'bg-slate-200'">
                <div class="h-full transition-all duration-1000 shadow-glow-gain"
                  :class="getProjectEfficiency(project) > 100 ? 'bg-gain-500' : 'bg-warn-500'"
                  :style="{ width: Math.min(100, getProjectEfficiency(project)) + '%' }"></div>
              </div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-[9px] font-black text-dark-500 uppercase tracking-tighter">Efficiency</span>
                <span class="text-[11px] font-black italic"
                  :class="getProjectEfficiency(project) > 100 ? 'text-gain-500' : 'text-warn-500'">{{
                    getProjectEfficiency(project) }}%</span>
              </div>
            </div>
          </div>

          <!-- Assigned Team Icons -->
          <div class="flex -space-x-3 mb-10">
            <div v-for="empId in project.assignedEmployees" :key="empId"
              class="w-12 h-12 rounded-2xl bg-dark-800 border-2 flex items-center justify-center text-2xl hover:translate-y-[-6px] hover:z-10 transition-all cursor-help shadow-xl group/icon"
              :class="gameStore.darkMode ? 'border-dark-900 bg-dark-800' : 'border-white bg-slate-100 shadow-sm'">
              {{ getEmployee(empId)?.specialty === 'tech' ? '👨‍💻' : getEmployee(empId)?.specialty === 'creative' ?
                '🎨' : '👥' }}
              <!-- Tooltip Simple -->
              <div
                class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-dark-950 text-white text-[10px] font-black rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">
                {{ getEmployee(empId)?.name }}
              </div>
            </div>
            <div v-if="project.assignedEmployees.length < project.teamSize"
              v-for="i in (project.teamSize - project.assignedEmployees.length)" :key="'empty-' + i"
              class="w-12 h-12 rounded-2xl border-2 border-dashed flex items-center justify-center text-dark-700 text-sm"
              :class="gameStore.darkMode ? 'bg-dark-950/30 border-dark-800' : 'bg-slate-50 border-slate-200'">
              +
            </div>
          </div>
        </div>

        <div v-if="project.status !== 'completed'" class="flex gap-3">
          <!-- Bouton Renoncer (Annulation) -->
          <button @click="companyStore.cancelProject(project.id)" :disabled="gameStore.isPaused"
            class="w-12 h-auto rounded-2xl flex items-center justify-center transition-all bg-dark-800/20 text-dark-500 border-2 border-white/5 hover:bg-loss-500/10 hover:text-loss-500 hover:border-loss-500/20 active:scale-95 disabled:opacity-20"
            title="Renoncer au projet">
            🚫
          </button>

          <button @click="openProjectModal(project)" :disabled="gameStore.isPaused"
            class="flex-1 py-5 rounded-2xl font-black italic text-[11px] uppercase tracking-[0.2em] transition-all bg-dark-800/40 text-dark-400 border-2 border-white/5 hover:bg-dark-800 hover:text-white active:scale-95 disabled:opacity-20">
            {{ project.assignedEmployees.length > 0 ? 'Staff' : 'Equipe' }}
          </button>

          <button v-if="project.status === 'active'" @click="companyStore.stopProject(project.id)"
            :disabled="gameStore.isPaused"
            class="flex-[2] py-5 rounded-2xl font-black italic text-[11px] uppercase tracking-[0.2em] transition-all bg-loss-500/10 text-loss-500 border-2 border-loss-500/20 hover:bg-loss-500 hover:text-white hover:shadow-glow-loss active:scale-95 disabled:opacity-20">
            Pause Production ⏸
          </button>

          <button v-else @click="companyStore.startProject(project.id)"
            :disabled="gameStore.isPaused || project.assignedEmployees.length < project.teamSize"
            class="flex-[2] py-5 rounded-2xl font-black italic text-[11px] uppercase tracking-[0.2em] transition-all bg-accent-600/5 text-accent-500 border-2 border-accent-500/20 hover:bg-accent-600 hover:text-white hover:border-accent-500 hover:shadow-glow-accent active:scale-95 shadow-lg disabled:opacity-20 disabled:grayscale">
            Lancer Production 🚀
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Team Assignment -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedProject"
          class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-dark-950/90 backdrop-blur-md">
          <div
            class="w-full max-w-2xl card p-6 sm:p-10 border shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-2xl shadow-slate-900/10'">

            <button @click="selectedProject = null"
              class="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors border"
              :class="gameStore.darkMode ? 'bg-dark-850 hover:bg-dark-800 border-white/5 text-dark-400' : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-400'">
              ✕
            </button>

            <header class="mb-10 text-center sm:text-left pr-12">
              <h3 class="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase mb-2"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">Composition de l'Équipe</h3>
              <p class="text-[10px] font-black uppercase tracking-[0.2em]"
                :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">Assignation : {{ selectedProject.title
                }}</p>
            </header>

            <!-- Status Check -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div class="p-6 rounded-[2rem] border shadow-inner"
                :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
                <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mb-2">Effectif Requis</p>
                <div class="flex items-end gap-3">
                  <span class="text-4xl font-black italic tracking-tighter"
                    :class="selectedEmployees.length === selectedProject.teamSize ? 'text-gain-500' : 'text-warn-500'">
                    {{ selectedEmployees.length }}
                  </span>
                  <span class="text-xl font-black text-dark-700 mb-1">/ {{ selectedProject.teamSize }}</span>
                </div>
              </div>
              <div class="p-6 rounded-[2rem] border shadow-inner flex flex-col justify-center"
                :class="gameStore.darkMode ? 'bg-dark-850 border-white/5' : 'bg-slate-50 border-slate-100'">
                <p class="text-[9px] font-black uppercase tracking-widest text-dark-500 mb-2">Statut Opérationnel</p>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full shadow-glow-accent"
                    :class="selectedEmployees.length === selectedProject.teamSize ? 'bg-gain-500 shadow-glow-gain' : 'bg-loss-500 shadow-glow-loss'">
                  </div>
                  <span class="text-xs font-black uppercase tracking-widest"
                    :class="selectedEmployees.length === selectedProject.teamSize ? 'text-gain-500' : 'text-loss-500'">
                    {{ selectedEmployees.length === selectedProject.teamSize ? 'PRÊT AU DÉPART' : 'INCOMPLET' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Employee List -->
            <div class="space-y-4 overflow-y-auto pr-3 custom-scrollbar mb-10 flex-1">
              <button v-for="emp in availableEmployees" :key="emp.id"
                @click="selectedEmployees.includes(emp.id) ? selectedEmployees = selectedEmployees.filter(id => id !== emp.id) : selectedEmployees.push(emp.id)"
                :class="[
                  'w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all group active:scale-[0.98]',
                  selectedEmployees.includes(emp.id)
                    ? (gameStore.darkMode ? 'bg-accent-600/10 border-accent-500 text-accent-400 shadow-glow-accent/5' : 'bg-accent-50 border-accent-200 text-accent-700 shadow-lg shadow-accent-500/10')
                    : (gameStore.darkMode ? 'bg-dark-850/50 border-white/5 text-dark-500 hover:border-dark-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 shadow-sm')
                ]"
                :disabled="(!selectedEmployees.includes(emp.id) && selectedEmployees.length >= (selectedProject?.teamSize || 0)) || (companyStore.activeProjects.some(p => p.id !== selectedProject?.id && p.status !== 'completed' && p.assignedEmployees.includes(emp.id)))">

                <div class="flex items-center gap-5">
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform"
                    :class="gameStore.darkMode ? 'bg-dark-900 border border-white/5 group-hover:rotate-12' : 'bg-slate-100 border border-slate-200 group-hover:rotate-12'">
                    {{ emp.specialty === 'tech' ? '👨‍💻' : emp.specialty === 'creative' ? '🎨' : '👥' }}
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-black italic uppercase tracking-tight transition-colors"
                      :class="gameStore.darkMode ? 'group-hover:text-white' : 'group-hover:text-slate-900'">{{ emp.name
                      }}</p>
                    <div class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mt-1">
                      <span class="text-accent-500">Niv. {{ emp.skillLevel }}</span>
                      <span class="w-1 h-1 rounded-full"
                        :class="gameStore.darkMode ? 'bg-dark-700' : 'bg-slate-300'"></span>
                      <span class="text-dark-500">{{ emp.specialty }}</span>
                      <template
                        v-if="companyStore.activeProjects.some(p => p.id !== selectedProject?.id && p.status !== 'completed' && p.assignedEmployees.includes(emp.id))">
                        <span class="w-1 h-1 rounded-full bg-loss-500"></span>
                        <span class="text-loss-500 font-black animate-pulse">OCCUPÉ</span>
                      </template>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-6">
                  <div class="text-right hidden sm:block">
                    <p class="text-[8px] font-black uppercase tracking-widest text-dark-600">Motivation</p>
                    <p class="text-xs font-black italic"
                      :class="emp.motivation > 70 ? 'text-gain-500' : 'text-loss-500'">{{
                        emp.motivation }}%</p>
                  </div>
                  <div v-if="selectedEmployees.includes(emp.id)"
                    class="w-8 h-8 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform animate-scale-in"
                    :class="gameStore.darkMode ? 'bg-accent-500 text-dark-950' : 'bg-accent-500 text-white'">
                    ✓
                  </div>
                </div>
              </button>
            </div>

            <!-- Footer Tools -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t"
              :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
              <button @click="selectedProject = null"
                class="flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                :class="gameStore.darkMode ? 'text-dark-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'">
                Annuler
              </button>
              <button @click="assignTeam"
                class="flex-[2] py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.97]"
                :class="selectedEmployees.length === selectedProject.teamSize
                  ? 'bg-accent-600 text-white hover:bg-accent-500 shadow-glow-accent/30'
                  : (gameStore.darkMode ? 'bg-dark-800 text-dark-600 cursor-not-allowed opacity-40' : 'bg-slate-100 text-slate-300 cursor-not-allowed')">
                Lancer la Production
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(64, 64, 64, 0.5);
  /* Equivalent to bg-dark-700/50 */
  border-radius: 9999px;
  /* Equivalent to rounded-full */
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce-subtle {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
