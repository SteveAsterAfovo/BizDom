<script setup lang="ts">
/**
 * ── Project Management Page ──
 * Gère les projets actifs, l'assignation des équipes et le suivi de progression.
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'
import type { Project, Employee } from '~/types'

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
</script>

<template>
  <div class="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <header class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Projets <span
            class="text-accent-500">& Production</span></h2>
        <p class="text-dark-400 font-bold uppercase tracking-widest text-xs mt-1">Gérez votre backlog et maximisez votre
          rentabilité</p>
      </div>
      <button @click="companyStore.generateProject()" class="btn-primary px-6 py-2 rounded-xl text-xs">
        Appel d'offres 📡
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="project in companyStore.activeProjects" :key="project.id"
        class="card p-6 bg-dark-900 border-white/5 flex flex-col justify-between group hover:border-accent-500/30 transition-all relative overflow-hidden">

        <div v-if="project.status === 'completed'"
          class="absolute inset-0 bg-gain-500/10 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <span
            class="bg-gain-500 text-white px-6 py-2 rounded-full font-black uppercase text-sm shadow-glow-gain">Terminé
            ✓</span>
        </div>

        <div>
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-black text-white italic tracking-tight">{{ project.title }}</h3>
            <span :class="[
              'text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest',
              project.status === 'active' ? 'bg-accent-500 text-white animate-pulse' : 'bg-dark-800 text-dark-400'
            ]">
              {{ project.status === 'active' ? 'En Production' : project.status === 'pending' ? 'En Attente' : 'Terminé'
              }}
            </span>
          </div>
          <p class="text-sm text-dark-400 mb-6 leading-relaxed">{{ project.description }}</p>

          <div class="grid grid-cols-3 gap-3 mb-6">
            <div class="p-3 rounded-xl bg-dark-850 border border-white/5">
              <p class="text-[8px] text-dark-500 uppercase font-black mb-1">Gain Estimé</p>
              <p class="text-xs font-black text-gain-400">{{ formatCurrency(project.reward) }}</p>
            </div>
            <div class="p-3 rounded-xl bg-dark-850 border border-white/5">
              <p class="text-[8px] text-dark-500 uppercase font-black mb-1">Délai Proposé</p>
              <p class="text-xs font-black text-white">{{ project.duration }} Jours</p>
            </div>
            <div class="p-3 rounded-xl bg-dark-850 border border-white/5">
              <p class="text-[8px] text-dark-500 uppercase font-black mb-1">Équipe Requise</p>
              <p class="text-xs font-black text-accent-400">{{ project.teamSize }} Membres</p>
            </div>
          </div>

          <!-- Requirements Detail -->
          <div class="flex flex-wrap gap-2 mb-6">
            <div v-for="(count, spec) in project.requiredSpecialties" :key="spec"
              class="px-2 py-1 rounded-lg bg-dark-950/50 border border-white/5 flex items-center gap-2">
              <span class="text-[10px] uppercase font-black text-dark-500">{{ spec }}</span>
              <span class="text-xs font-black"
                :class="companyStore.employees.filter(e => project.assignedEmployees.includes(e.id) && e.specialty === spec).length >= (count as number) ? 'text-gain-400' : 'text-warn-500'">
                {{companyStore.employees.filter(e => project.assignedEmployees.includes(e.id) && e.specialty ===
                  spec).length}}/{{ count }}
              </span>
            </div>
          </div>

          <!-- Progress Bar & Efficiency -->
          <div v-if="project.status === 'active'" class="space-y-3 mb-8">
            <div class="flex justify-between items-center text-[10px] font-black uppercase">
              <span class="text-dark-500 italic">Avancement</span>
              <span class="text-accent-500">{{ Math.round(project.progress) }}%</span>
            </div>
            <div class="w-full h-2 bg-dark-800 rounded-full overflow-hidden p-0.5">
              <div class="h-full bg-accent-500 rounded-full transition-all duration-1000 shadow-glow-accent"
                :style="{ width: project.progress + '%' }"></div>
            </div>

            <div class="flex items-center gap-2">
              <div class="flex-1 h-1 bg-dark-800 rounded-full overflow-hidden">
                <div class="h-full bg-gain-500 transition-all duration-1000"
                  :style="{ width: getProjectEfficiency(project) + '%' }"></div>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[9px] font-black text-dark-500 uppercase tracking-tighter">Efficiency</span>
                <span class="text-[9px] font-black"
                  :class="getProjectEfficiency(project) > 100 ? 'text-gain-400' : 'text-warn-400'">{{
                    getProjectEfficiency(project) }}%</span>
              </div>
            </div>
          </div>

          <!-- Assigned Team Icons -->
          <div class="flex -space-x-2 mb-8">
            <div v-for="empId in project.assignedEmployees" :key="empId"
              class="w-10 h-10 rounded-full bg-dark-800 border-2 border-dark-900 flex items-center justify-center text-xl hover:translate-y-[-4px] transition-transform cursor-help shadow-lg"
              v-tooltip="getEmployee(empId)?.name">
              {{ getEmployee(empId)?.specialty === 'tech' ? '👨‍💻' : getEmployee(empId)?.specialty === 'creative' ?
                '🎨' : '👤' }}
            </div>
            <div v-if="project.assignedEmployees.length < project.teamSize"
              v-for="i in (project.teamSize - project.assignedEmployees.length)" :key="'empty-' + i"
              class="w-10 h-10 rounded-full bg-dark-900 border-2 border-dark-800 border-dashed flex items-center justify-center text-dark-700 text-xs">
              +
            </div>
          </div>
        </div>

        <button v-if="project.status !== 'completed'" @click="openProjectModal(project)"
          class="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-dark-850 text-white border border-white/10 hover:bg-accent-600 hover:border-accent-500 active:scale-95 shadow-glow-accent/5">
          {{ project.assignedEmployees.length > 0 ? 'Gérer le Staff' : 'Assigner une Equipe' }}
        </button>
      </div>
    </div>

    <div v-if="selectedProject"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark-950/90 backdrop-blur-md animate-fade-in">
      <div class="w-full max-w-lg card p-8 border-accent-500/30 bg-dark-900 shadow-2xl">
        <h3 class="text-2xl font-black text-white italic mb-2 tracking-tighter uppercase">Composition de l'Équipe</h3>
        <p class="text-[10px] text-dark-500 mb-8 uppercase tracking-[0.2em]">Projet : {{ selectedProject.title }}</p>

        <!-- Current Status Check -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="p-4 rounded-2xl bg-dark-850 border border-white/5">
            <p class="text-[9px] text-dark-500 font-black uppercase mb-1">Effectif</p>
            <p class="text-lg font-black"
              :class="selectedEmployees.length === selectedProject.teamSize ? 'text-gain-400' : 'text-warn-500'">
              {{ selectedEmployees.length }} / {{ selectedProject.teamSize }}
            </p>
          </div>
          <div class="p-4 rounded-2xl bg-dark-850 border border-white/5">
            <p class="text-[9px] text-dark-500 font-black uppercase mb-1">Status Pré-Production</p>
            <p class="text-xs font-black uppercase"
              :class="selectedEmployees.length === selectedProject.teamSize ? 'text-gain-400' : 'text-loss-400'">
              {{ selectedEmployees.length === selectedProject.teamSize ? 'PRÊT AU DÉPART' : 'INCOMPLET' }}
            </p>
          </div>
        </div>

        <div class="space-y-3 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar mb-8">
          <button v-for="emp in availableEmployees" :key="emp.id"
            @click="selectedEmployees.includes(emp.id) ? selectedEmployees = selectedEmployees.filter(id => id !== emp.id) : selectedEmployees.push(emp.id)"
            :class="[
              'w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group',
              selectedEmployees.includes(emp.id) ? 'bg-accent-600/10 border-accent-500 text-accent-400 shadow-glow-accent/5' : 'bg-dark-850/50 border-white/5 text-dark-500 hover:border-dark-700'
            ]" :disabled="!selectedEmployees.includes(emp.id) && selectedEmployees.length >= selectedProject.teamSize">
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-dark-900 flex items-center justify-center text-xl border border-white/5">
                {{ emp.specialty === 'tech' ? '👨‍💻' : emp.specialty === 'creative' ? '🎨' : '👥' }}
              </div>
              <div class="text-left">
                <p class="text-sm font-black italic uppercase group-hover:text-white transition-colors">{{ emp.name }}
                </p>
                <div class="flex items-center gap-2 text-[9px] uppercase font-black tracking-widest">
                  <span class="text-accent-500">Niv. {{ emp.skillLevel }}</span>
                  <span class="w-1 h-1 bg-dark-700 rounded-full"></span>
                  <span class="text-dark-500">{{ emp.specialty }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-[8px] text-dark-600 uppercase font-black">Motiv.</p>
                <p class="text-[10px] font-black" :class="emp.motivation > 70 ? 'text-gain-400' : 'text-loss-400'">{{
                  emp.motivation }}%</p>
              </div>
              <div v-if="selectedEmployees.includes(emp.id)"
                class="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center text-dark-950 font-black">✓
              </div>
            </div>
          </button>
        </div>

        <div class="flex gap-4">
          <button @click="selectedProject = null"
            class="flex-1 py-4 text-[10px] font-black uppercase text-dark-500 hover:text-white transition-colors tracking-widest">Abandonner</button>
          <button @click="assignTeam"
            class="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-glow-accent transition-all font-black"
            :class="selectedEmployees.length === selectedProject.teamSize ? 'bg-accent-600 text-white hover:bg-accent-500' : 'bg-dark-800 text-dark-600 cursor-not-allowed'">
            Lancer Production
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-dark-700 rounded-full;
}
</style>
