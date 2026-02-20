<script setup lang="ts">
/**
 * ── Governance Page ──
 * Interface pour gérer le Conseil d'Administration et les décisions stratégiques
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'
import type { StrategicDecision } from '~/types'

const companyStore = useCompanyStore()
const gameStore = useGameStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value) + ' FCFA'
}

// Décisions mockées pour la démo
const potentialDecisions: StrategicDecision[] = [
  {
    id: 'dec-aggressive-growth',
    title: 'Croissance Agressive 🚀',
    description: 'Investir massivement dans le marketing pour doubler la part de marché.',
    cost: 50000,
    impacts: { marketShare: 5, cash: -50000 },
    risk: 0.6,
    boardSupport: 65
  },
  {
    id: 'dec-frugality',
    title: 'Plan de Frugalité ✂️',
    description: 'Réduire les coûts fixes pour stabiliser la trésorerie.',
    cost: 0,
    impacts: { cash: 20000, motivation: -10 },
    risk: 0.1,
    boardSupport: 40
  },
  {
    id: 'dec-rd',
    title: 'Focus R&D 🧪',
    description: 'Améliorer la qualité des produits pour attirer des clients premium.',
    cost: 30000,
    impacts: { reputation: 10, cash: -30000 },
    risk: 0.3,
    boardSupport: 55
  },
  {
    id: 'dec-social',
    title: 'Bonus Exceptionnel 🧧',
    description: 'Offrir une prime à tous les employés pour booster le moral.',
    cost: 15000,
    impacts: { motivation: 15, cash: -15000 },
    risk: 0,
    boardSupport: 60
  }
]

const meetingStatus = ref<'idle' | 'voting' | 'approved' | 'rejected'>('idle')
const lastDecisionResult = ref<string>('')

async function submitDecision(decision: StrategicDecision) {
  meetingStatus.value = 'voting'

  // Petit délai pour l'effet dramatique
  await new Promise(resolve => setTimeout(resolve, 1500))

  const approved = companyStore.submitStrategicDecision(decision)

  if (approved) {
    meetingStatus.value = 'approved'
    lastDecisionResult.value = `La décision "${decision.title}" a été validée par le Conseil.`
  } else {
    meetingStatus.value = 'rejected'
    lastDecisionResult.value = `Le Conseil a rejeté votre proposition : "${decision.title}".`
  }

  setTimeout(() => {
    meetingStatus.value = 'idle'
  }, 8000)
}

function getPersonalityLabel(p: string) {
  const labels = { conservative: 'Prudent', aggressive: 'Audacieux', balanced: 'Équilibré' }
  return labels[p as keyof typeof labels] || p
}

// SEO
useHead({
  title: 'Gouvernance',
})
</script>

<template>
  <div class="space-y-10 animate-fade-in p-2 sm:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <header class="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-8 pt-4 sm:pt-0">
      <div class="text-center xl:text-left">
        <h2 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mb-2"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          Gouvernance <span class="text-accent-500">& Board</span>
        </h2>
        <p class="text-[10px] font-black uppercase tracking-[0.2em]"
          :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
          Gérez vos relations avec les investisseurs et le CODIR
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-4">
        <!-- Score Global -->
        <div class="px-8 py-4 rounded-[2rem] border min-w-[140px] text-center shadow-lg"
          :class="gameStore.darkMode ? 'bg-dark-900 border-accent-500/20 shadow-glow-accent/5' : 'bg-white border-slate-200 shadow-sm'">
          <span class="text-[9px] font-black text-accent-500 uppercase tracking-widest block mb-1">Score Global</span>
          <span class="text-2xl font-black italic animate-pulse-slow"
            :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ companyStore.generalScore }}</span>
        </div>

        <!-- Valeur Part -->
        <div class="px-8 py-4 rounded-[2rem] border min-w-[140px] text-center shadow-lg"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <span class="text-[9px] font-black text-dark-500 uppercase tracking-widest block mb-1">Valeur Part (1%)</span>
          <span class="text-xl font-black italic text-gain-500">{{ formatCurrency(companyStore.company.sharePrice)
          }}</span>
        </div>

        <!-- Satisfaction Counter -->
        <div class="px-8 py-4 rounded-[2rem] border min-w-[180px] shadow-lg"
          :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">
          <div class="flex justify-between items-center mb-2">
            <span class="text-[9px] font-black text-dark-500 uppercase tracking-widest">Board Satisfaction</span>
            <span class="text-sm font-black italic" :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{
              companyStore.boardSatisfaction }}%</span>
          </div>
          <div class="w-full h-1.5 bg-dark-700/20 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-1000 shadow-glow-accent"
              :class="companyStore.boardSatisfaction > 50 ? 'bg-gain-500 shadow-glow-gain' : 'bg-loss-500 shadow-glow-loss'"
              :style="{ width: companyStore.boardSatisfaction + '%' }"></div>
          </div>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Board Members List -->
      <div class="lg:col-span-1 space-y-6">
        <h3 class="text-[10px] font-black text-dark-500 uppercase tracking-[0.3em] px-4">Actionnariat</h3>
        <div class="space-y-3">
          <div v-for="member in companyStore.boardMembers" :key="member.id"
            class="card p-5 flex items-center gap-5 border rounded-[2rem] transition-all hover:scale-[1.02] relative overflow-hidden group shadow-lg"
            :class="gameStore.darkMode ? 'bg-dark-900 border-white/5 hover:border-accent-500/30' : 'bg-white border-slate-200 hover:border-accent-200 shadow-sm'">

            <!-- Individual Vote Badge -->
            <div v-if="meetingStatus !== 'idle'"
              class="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md transition-all animate-fade-in bg-dark-950/40">
              <div v-if="meetingStatus === 'voting'" class="animate-spin text-2xl">⏳</div>
              <div v-else
                :class="member.lastVote === 'yes' ? 'bg-gain-600' : member.lastVote === 'no' ? 'bg-loss-600' : 'bg-dark-600'"
                class="px-6 py-2.5 rounded-full font-black text-[10px] uppercase shadow-2xl text-white tracking-widest border border-white/10">
                {{ member.lastVote === 'yes' ? 'ACCEPTE ✓' : member.lastVote === 'no' ? 'REFUSE ✕' : 'ABSTENTION ⚪' }}
              </div>
            </div>

            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:rotate-12"
              :class="gameStore.darkMode ? 'bg-dark-850 border border-white/5' : 'bg-slate-50 border border-slate-100'">
              {{ member.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-black italic uppercase tracking-tight truncate"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ member.name }}</p>
              <p class="text-[9px] text-dark-500 font-black uppercase tracking-widest">{{ member.role }}</p>
            </div>

            <div class="text-right">
              <div class="flex flex-col items-end">
                <span class="text-xl font-black italic tracking-tighter"
                  :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ member.sharePercent }}%</span>
                <span class="text-[8px] font-black text-dark-600 uppercase tracking-widest">Parts</span>
              </div>

              <div class="mt-2 text-[9px] font-black uppercase tracking-tighter"
                :class="member.satisfaction > 60 ? 'text-gain-500' : 'text-loss-500'">
                {{ member.satisfaction }}%
              </div>
            </div>

            <!-- Trading Actions (Hover or small icons) -->
            <div class="absolute bottom-2 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.stop="companyStore.sellSharesToMember(member.id, 1)"
                :disabled="companyStore.ceoShare - 1 < 20"
                class="text-[8px] font-black bg-accent-500/10 hover:bg-accent-500 text-accent-500 hover:text-white px-2 py-1 rounded-md border border-accent-500/20 transition-all"
                title="Vendre 1%">
                VENDRE
              </button>
              <button @click.stop="companyStore.buySharesFromMember(member.id, 1)"
                :disabled="companyStore.company.ceo?.bankBalance < companyStore.company.sharePrice"
                class="text-[8px] font-black bg-gain-500/10 hover:bg-gain-500 text-gain-500 hover:text-white px-2 py-1 rounded-md border border-gain-500/20 transition-all"
                title="Racheter 1%">
                RACHETER
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Strategy & Decisions -->
      <div class="lg:col-span-2 space-y-6">
        <h3 class="text-[10px] font-black text-dark-500 uppercase tracking-[0.3em] px-4">Directives Stratégiques</h3>

        <!-- Decision Result Alert -->
        <Transition name="slide-down">
          <div v-if="meetingStatus !== 'idle'" :class="[
            'p-6 rounded-[2.5rem] border-2 flex items-center gap-6 shadow-xl transition-all',
            meetingStatus === 'voting' ? 'bg-accent-500/5 border-accent-500/30 text-accent-500' :
              meetingStatus === 'approved' ? 'bg-gain-500/5 border-gain-500/30 text-gain-500' :
                'bg-loss-500/5 border-loss-500/30 text-loss-500'
          ]">
            <span v-if="meetingStatus === 'voting'" class="animate-spin text-3xl">⏳</span>
            <span v-if="meetingStatus === 'approved'" class="text-3xl">🗳️</span>
            <span v-if="meetingStatus === 'rejected'" class="text-3xl">🚫</span>
            <p class="font-black italic uppercase tracking-tighter text-lg">
              {{ meetingStatus === 'voting' ? 'Le Conseil délibère en séance...' : lastDecisionResult }}</p>
          </div>
        </Transition>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="dec in potentialDecisions" :key="dec.id"
            class="card p-8 border rounded-[2.5rem] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group shadow-lg"
            :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

            <div class="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <span class="text-7xl font-black italic">{{ dec.title.split(' ').pop() }}</span>
            </div>

            <div class="relative z-10">
              <h4 class="text-xl font-black italic tracking-tighter uppercase mb-2"
                :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ dec.title }}</h4>
              <p class="text-xs font-bold leading-relaxed mb-8"
                :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-500'">{{ dec.description }}</p>

              <div class="space-y-3">
                <div class="flex justify-between items-center p-4 rounded-2xl border"
                  :class="gameStore.darkMode ? 'bg-dark-850/50 border-white/5' : 'bg-slate-50 border-slate-100'">
                  <span class="text-[9px] font-black text-dark-500 uppercase tracking-widest">Coût Direct</span>
                  <span class="text-sm font-black italic" :class="dec.cost > 0 ? 'text-loss-500' : 'text-gain-500'">
                    {{ dec.cost === 0 ? 'INVEST. BLOQUÉ' : dec.cost.toLocaleString() + ' FCFA' }}
                  </span>
                </div>

                <div class="flex justify-between items-center p-4 rounded-2xl border"
                  :class="gameStore.darkMode ? 'bg-dark-850/50 border-white/5' : 'bg-slate-50 border-slate-100'">
                  <span class="text-[9px] font-black text-dark-500 uppercase tracking-widest">Approbation Board</span>
                  <div class="flex items-center gap-3">
                    <div class="w-20 h-1.5 bg-dark-700/20 rounded-full overflow-hidden">
                      <div class="h-full bg-accent-500 shadow-glow-accent"
                        :style="{ width: (dec.boardSupport || 50) + '%' }"></div>
                    </div>
                    <span class="text-xs font-black italic"
                      :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">{{ dec.boardSupport || 50 }}%</span>
                  </div>
                </div>

                <div class="flex justify-between items-center p-4 rounded-2xl border"
                  :class="gameStore.darkMode ? 'bg-dark-850/50 border-white/5' : 'bg-slate-50 border-slate-100'">
                  <span class="text-[9px] font-black text-dark-500 uppercase tracking-widest">Indice Corrupt.</span>
                  <span class="text-sm font-black italic" :class="dec.risk > 0.4 ? 'text-loss-500' : 'text-accent-500'">
                    {{ Math.round(dec.risk * 100) }}%
                  </span>
                </div>
              </div>
            </div>

            <button @click="submitDecision(dec)"
              :disabled="meetingStatus !== 'idle' || (dec.cost > companyStore.company.cash) || gameStore.isPaused"
              class="relative z-10 mt-8 w-full btn-primary py-5 rounded-2xl font-black italic text-[10px] uppercase tracking-[0.2em] shadow-glow-accent/20 disabled:opacity-20">
              Convoquer le Collège
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.85;
    transform: scale(1.02);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}
</style>
