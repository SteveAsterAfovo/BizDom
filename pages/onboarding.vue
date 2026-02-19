<script setup lang="ts">
/**
* ── Onboarding ──
* Configuration initiale : Nom de la boîte et profil du CEO
*/
import { useCompanyStore } from '~/stores/companyStore'
import type { CEO } from '~/types'

const companyStore = useCompanyStore()
const router = useRouter()

const step = ref(1)

const form = reactive({
  companyName: '',
  ceo: {
    firstName: '',
    lastName: '',
    gender: 'M',
    appearance: 'casual-1'
  } as CEO
})

const avatars = [
  { id: 'casual-1', label: 'Casual Boy', icon: '👦' },
  { id: 'casual-2', label: 'Casual Girl', icon: '👧' },
  { id: 'suit-1', label: 'Alpha CEO', icon: '👔' },
  { id: 'suit-2', label: 'Madame DG', icon: '👩‍💼' },
  { id: 'cyber', label: 'Coder', icon: '👨‍💻' },
]

onMounted(() => {
  const saved = localStorage.getItem('bizdom_save_v1')
  if (saved) {
    const data = JSON.parse(saved)
    if (data.company?.isConfigured) {
      // Charger les données si nécessaire ou simplement rediriger
      router.push('/')
    }
  }
})

function finishOnboarding() {
  if (!form.companyName || !form.ceo.firstName) return

  companyStore.company.name = form.companyName
  companyStore.company.ceo = { ...form.ceo }
  companyStore.company.isConfigured = true

  // Sauvegarder l'état initial
  localStorage.setItem('bizdom_save_v1', JSON.stringify({
    company: companyStore.company,
    employees: companyStore.employees
  }))

  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-dark-950 flex items-center justify-center p-6 bg-glow overflow-hidden">
    <!-- Background Decor -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2">
    </div>
    <div
      class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-loss-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2">
    </div>

    <div class="w-full max-w-xl relative">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">BIZDOM <span
            class="text-accent-500">INIT</span></h1>
        <p class="text-dark-400 font-bold uppercase tracking-widest text-xs">Veuillez configurer votre structure Capital
          Dominion</p>
      </div>

      <!-- Card -->
      <div class="card p-10 bg-dark-900/80 backdrop-blur-xl border-white/5 shadow-2xl relative overflow-hidden">

        <!-- Step 1: Company Profile -->
        <div v-if="step === 1" class="space-y-8 animate-slide-up">
          <div>
            <label class="block text-[10px] font-black text-accent-400 uppercase tracking-widest mb-3">Nom de
              l'Organisation</label>
            <input v-model="form.companyName" type="text" placeholder="ex: Dominion Corp"
              class="w-full bg-dark-850 border-2 border-dark-700 rounded-2xl p-4 text-white font-bold focus:border-accent-500 outline-none transition-all placeholder:text-dark-600" />
          </div>

          <div class="pt-4">
            <button @click="step = 2" :disabled="!form.companyName"
              class="w-full btn-primary py-5 rounded-2xl shadow-glow-accent">
              Continuer vers le Profil CEO →
            </button>
          </div>
        </div>

        <!-- Step 2: CEO Profile -->
        <div v-if="step === 2" class="space-y-8 animate-slide-up">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-dark-500 uppercase tracking-widest mb-2">Prénom</label>
              <input v-model="form.ceo.firstName" type="text" placeholder="John" class="input-minimal" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-dark-500 uppercase tracking-widest mb-2">Nom</label>
              <input v-model="form.ceo.lastName" type="text" placeholder="Doe" class="input-minimal" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-dark-500 uppercase tracking-widest mb-3">Sexe</label>
            <div class="flex gap-3">
              <button v-for="g in ['M', 'F', 'NB']" :key="g" @click="form.ceo.gender = (g as any)" :class="[
                'flex-1 py-3 rounded-xl font-bold border-2 transition-all',
                form.ceo.gender === g ? 'bg-accent-600 border-accent-500 text-white' : 'bg-dark-850 border-dark-700 text-dark-400'
              ]">
                {{ g }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-dark-500 uppercase tracking-widest mb-3">Apparence</label>
            <div class="flex justify-between gap-2">
              <button v-for="av in avatars" :key="av.id" @click="form.ceo.appearance = av.id" :class="[
                'w-12 h-12 flex items-center justify-center text-2xl rounded-xl border-2 transition-all',
                form.ceo.appearance === av.id ? 'bg-accent-600 border-accent-500 scale-110 shadow-glow-accent' : 'bg-dark-850 border-dark-700 opacity-50'
              ]">
                {{ av.icon }}
              </button>
            </div>
          </div>

          <div class="pt-6 flex gap-3">
            <button @click="step = 1"
              class="px-6 rounded-2xl bg-dark-800 text-white font-bold border border-white/5">Retour</button>
            <button @click="finishOnboarding" :disabled="!form.ceo.firstName"
              class="flex-1 btn-primary py-5 rounded-2xl shadow-glow-accent">
              Fonder l'entreprise ✓
            </button>
          </div>
        </div>

      </div>

      <!-- Step Counter -->
      <div class="flex justify-center mt-8 gap-2">
        <div v-for="i in 2" :key="i"
          :class="['h-1.5 rounded-full transition-all duration-500', step === i ? 'w-8 bg-accent-500' : 'w-2 bg-dark-800']">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-minimal {
  @apply w-full bg-dark-850 border-2 border-dark-700 rounded-2xl p-4 text-white font-bold focus:border-accent-500 outline-none transition-all placeholder:text-dark-600;
}

.bg-glow {
  background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
}
</style>
