<script setup lang="ts">
/**
 * ── Governance Page ──
 * Interface pour gérer le Conseil d'Administration et les décisions stratégiques
 */
import { useCompanyStore } from '~/stores/companyStore'
import type { StrategicDecision, BoardMember } from '~/types'

const companyStore = useCompanyStore()

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
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Gouvernance <span
            class="text-accent-500">& Board</span></h2>
        <p class="text-dark-400 font-bold uppercase tracking-widest text-xs mt-1">Gérez vos relations avec les
          investisseurs et le CODIR</p>
      </div>

      <div class="flex gap-4">
        <!-- General Score Counter -->
        <div
          class="bg-dark-900 px-6 py-3 rounded-2xl border-2 border-accent-500/20 flex flex-col items-center min-w-[120px]">
          <span class="text-[9px] font-black text-accent-500 uppercase tracking-widest mb-1">Score Global</span>
          <span class="text-2xl font-black text-white italic animate-pulse-slow">{{ companyStore.generalScore }}</span>
        </div>

        <div class="bg-dark-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
          <span class="text-xs font-black text-dark-500 uppercase">Satisfaction Board</span>
          <div class="w-32 h-2 bg-dark-800 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-1000"
              :class="companyStore.boardSatisfaction > 50 ? 'bg-gain-500' : 'bg-loss-500'"
              :style="{ width: companyStore.boardSatisfaction + '%' }"></div>
          </div>
          <span class="text-sm font-black text-white">{{ companyStore.boardSatisfaction }}%</span>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Board Members List -->
      <div class="lg:col-span-1 space-y-4">
        <h3 class="text-xs font-black text-dark-500 uppercase tracking-[0.2em] px-2">Table de l'Actionnariat</h3>
        <div v-for="member in companyStore.boardMembers" :key="member.id"
          class="card p-4 flex items-center gap-4 bg-dark-900/50 border-white/5 hover:border-accent-500/30 transition-all group relative overflow-hidden">

          <!-- Individual Vote Badge -->
          <div v-if="meetingStatus !== 'idle'"
            class="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm transition-all animate-fade-in">
            <div v-if="meetingStatus === 'voting'" class="animate-spin text-xl">⏳</div>
            <div v-else :class="member.lastVote === 'yes' ? 'bg-gain-500 text-white' : 'bg-loss-500 text-white'"
              class="px-5 py-2 rounded-full font-black text-xs uppercase shadow-2xl">
              {{ member.lastVote === 'yes' ? 'ACCEPTE ✅' : 'REFUSE ❌' }}
            </div>
          </div>

          <div
            class="w-12 h-12 rounded-xl bg-dark-850 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {{ member.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-black text-white truncate">{{ member.name }}</p>
            <p class="text-[10px] text-dark-500 font-bold uppercase tracking-wider">{{ member.role }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-black text-white italic tracking-tighter">{{ member.sharePercent }}%</p>
            <p class="text-[9px] text-dark-600 font-bold uppercase">Parts</p>
          </div>
          <div class="w-px h-8 bg-white/5"></div>
          <div class="text-right min-w-[40px]">
            <p class="text-[10px] font-black uppercase"
              :class="member.satisfaction > 60 ? 'text-gain-500' : 'text-loss-500'">
              {{ member.satisfaction }}%
            </p>
            <p class="text-[9px] text-dark-600 font-bold uppercase">{{ getPersonalityLabel(member.personality) }}</p>
          </div>
        </div>
      </div>

      <!-- Strategy & Decisions -->
      <div class="lg:col-span-2 space-y-4">
        <h3 class="text-xs font-black text-dark-500 uppercase tracking-[0.2em] px-2">Décisions Stratégiques</h3>

        <!-- Decision Result Alert -->
        <Transition name="slide-down">
          <div v-if="meetingStatus !== 'idle'" :class="[
            'p-4 rounded-2xl border-2 flex items-center gap-4 mb-4',
            meetingStatus === 'voting' ? 'bg-accent-500/10 border-accent-500/40 text-accent-400' :
              meetingStatus === 'approved' ? 'bg-gain-500/10 border-gain-500/40 text-gain-400' :
                'bg-loss-500/10 border-loss-500/40 text-loss-400'
          ]">
            <span v-if="meetingStatus === 'voting'" class="animate-spin text-2xl">⏳</span>
            <span v-if="meetingStatus === 'approved'" class="text-2xl">🗳️</span>
            <span v-if="meetingStatus === 'rejected'" class="text-2xl">🚫</span>
            <p class="font-bold uppercase tracking-tight">
              {{ meetingStatus === 'voting' ? 'Le Conseil délibère en séance...' : lastDecisionResult }}</p>
          </div>
        </Transition>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="dec in potentialDecisions" :key="dec.id"
            class="card p-6 bg-dark-900 border-white/5 flex flex-col justify-between hover:translate-y-[-4px] transition-all relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span class="text-6xl font-black italic">{{ dec.title.split(' ').pop() }}</span>
            </div>

            <div class="relative z-10">
              <h4 class="text-lg font-black text-white mb-2 italic">{{ dec.title }}</h4>
              <p class="text-sm text-dark-400 font-medium leading-relaxed mb-6">{{ dec.description }}</p>

              <div class="space-y-3">
                <div class="flex justify-between items-center bg-dark-850/50 p-3 rounded-xl border border-white/5">
                  <span class="text-[9px] font-black text-dark-500 uppercase">Coût</span>
                  <span class="text-xs font-black" :class="dec.cost > 0 ? 'text-loss-400' : 'text-gain-400'">
                    {{ dec.cost === 0 ? 'INVEST. BLOQUÉ' : dec.cost.toLocaleString() + ' FCFA' }}
                  </span>
                </div>
                <div class="flex justify-between items-center bg-dark-850/50 p-3 rounded-xl border border-white/5">
                  <span class="text-[9px] font-black text-dark-500 uppercase">Acceptation cible</span>
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1 bg-dark-700 rounded-full overflow-hidden">
                      <div class="h-full bg-accent-500" :style="{ width: (dec.boardSupport || 50) + '%' }"></div>
                    </div>
                    <span class="text-xs font-black text-white">{{ dec.boardSupport || 50 }}%</span>
                  </div>
                </div>
                <div class="flex justify-between items-center bg-dark-850/50 p-3 rounded-xl border border-white/5">
                  <span class="text-[9px] font-black text-dark-500 uppercase">Indice de Risque</span>
                  <span class="text-xs font-black" :class="dec.risk > 0.4 ? 'text-loss-500' : 'text-accent-500'">{{
                    Math.round(dec.risk * 100) }}%</span>
                </div>
              </div>
            </div>

            <button @click="submitDecision(dec)"
              :disabled="meetingStatus !== 'idle' || (dec.cost > companyStore.company.cash)"
              class="relative z-10 mt-8 w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-accent-600/10 text-accent-500 border-2 border-accent-500/30 hover:bg-accent-600 hover:text-white hover:border-accent-500 disabled:opacity-30 disabled:grayscale">
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
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
