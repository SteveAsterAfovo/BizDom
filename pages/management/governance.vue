<script setup lang="ts">
/**
 * ── Governance Page ──
 * Interface pour gérer le Conseil d'Administration et les décisions stratégiques
 */
import { useCompanyStore } from '~/stores/companyStore'
import type { StrategicDecision } from '~/types'

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
    lastDecisionResult.value = `Le Conseil a rejeté votre proposition : "${decision.title}". Votre influence baisse.`
  }

  setTimeout(() => {
    meetingStatus.value = 'idle'
  }, 5000)
}

function getPersonalityLabel(p: string) {
  const labels = { conservative: 'Prudent', aggressive: 'Audacieux', balanced: 'Équilibré' }
  return labels[p as keyof typeof labels] || p
}
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <header class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Gouvernance <span
            class="text-accent-500">& Board</span></h2>
        <p class="text-dark-400 font-bold uppercase tracking-widest text-xs mt-1">Gérez vos relations avec les
          investisseurs et le CODIR</p>
      </div>
      <div class="bg-dark-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
        <span class="text-xs font-black text-dark-500 uppercase">Satisfaction Board</span>
        <div class="w-32 h-2 bg-dark-800 rounded-full overflow-hidden">
          <div class="h-full bg-accent-500 transition-all duration-1000"
            :style="{ width: companyStore.boardSatisfaction + '%' }"></div>
        </div>
        <span class="text-sm font-black text-white">{{ companyStore.boardSatisfaction }}%</span>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Board Members List -->
      <div class="lg:col-span-1 space-y-4">
        <h3 class="text-xs font-black text-dark-500 uppercase tracking-[0.2em] px-2">Membres du Conseil</h3>
        <div v-for="member in companyStore.boardMembers" :key="member.id"
          class="card p-4 flex items-center gap-4 bg-dark-900/50 border-white/5 hover:border-accent-500/30 transition-all group">
          <div
            class="w-12 h-12 rounded-xl bg-dark-850 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {{ member.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-black text-white truncate">{{ member.name }}</p>
            <p class="text-[10px] text-dark-500 font-bold uppercase tracking-wider">{{ member.role }}</p>
          </div>
          <div class="text-right">
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
            <span v-if="meetingStatus === 'approved'" class="text-2xl">✅</span>
            <span v-if="meetingStatus === 'rejected'" class="text-2xl">❌</span>
            <p class="font-bold">{{ meetingStatus === 'voting' ? 'Le Conseil délibère...' : lastDecisionResult }}</p>
          </div>
        </Transition>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="dec in potentialDecisions" :key="dec.id"
            class="card p-6 bg-dark-900 border-white/5 flex flex-col justify-between hover:translate-y-[-4px] transition-all">
            <div>
              <h4 class="text-lg font-black text-white mb-2">{{ dec.title }}</h4>
              <p class="text-sm text-dark-400 font-medium leading-relaxed">{{ dec.description }}</p>

              <div class="mt-6 space-y-2">
                <div class="flex justify-between text-[11px] font-black uppercase">
                  <span class="text-dark-500">Coût Immédiat</span>
                  <span :class="dec.cost > 0 ? 'text-loss-400' : 'text-gain-400'">{{ dec.cost === 0 ? 'GRATUIT' :
                    dec.cost.toLocaleString() + ' FCFA' }}</span>
                </div>
                <div class="flex justify-between text-[11px] font-black uppercase">
                  <span class="text-dark-500">Risque perçu</span>
                  <span :class="dec.risk > 0.4 ? 'text-loss-500' : 'text-accent-500'">{{ Math.round(dec.risk * 100)
                    }}%</span>
                </div>
              </div>
            </div>

            <button @click="submitDecision(dec)"
              :disabled="meetingStatus !== 'idle' || (dec.cost > companyStore.company.cash)"
              class="mt-8 w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-dark-850 text-white border-2 border-dark-700 hover:border-accent-500 hover:text-accent-400 disabled:opacity-30">
              Proposer au Conseil
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
