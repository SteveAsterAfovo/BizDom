<script setup lang="ts">
/**
* ── Onboarding ──
* Configuration initiale : Nom de la boîte et profil du CEO
*/
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'
import type { CEO } from '~/types'

const companyStore = useCompanyStore()
const gameStore = useGameStore()
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

// SEO
useHead({
  title: 'Onboarding',
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-500 overflow-hidden relative"
    :class="gameStore.darkMode ? 'bg-dark-950' : 'bg-slate-50'">

    <!-- Background Decor -->
    <div
      class="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent-600/10 blur-[80px] sm:blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2">
    </div>
    <div
      class="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-loss-600/10 blur-[80px] sm:blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2">
    </div>

    <div class="w-full max-w-xl relative">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-2"
          :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
          BIZDOM <span class="text-accent-500">INIT</span>
        </h1>
        <p class="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]"
          :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
          Configuration structure Capital Dominion
        </p>
      </div>

      <!-- Card -->
      <div
        class="card p-6 sm:p-10 backdrop-blur-xl border shadow-2xl relative overflow-hidden transition-all duration-300 rounded-[2.5rem]"
        :class="gameStore.darkMode ? 'bg-dark-900/80 border-white/5' : 'bg-white/90 border-slate-200'">

        <!-- Step 1: Company Profile -->
        <div v-if="step === 1" class="space-y-8 animate-slide-up">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest mb-4 italic"
              :class="gameStore.darkMode ? 'text-accent-400' : 'text-accent-600'">
              🏢 Nom de l'Organisation
            </label>
            <input v-model="form.companyName" type="text" placeholder="ex: Dominion Corp"
              class="w-full text-lg sm:text-xl p-5 rounded-2xl border-2 outline-none transition-all font-black italic"
              :class="gameStore.darkMode ? 'bg-dark-850 border-dark-700 text-white focus:border-accent-500 placeholder:text-dark-600' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-accent-500 placeholder:text-slate-300'" />
          </div>

          <div class="pt-4">
            <button @click="step = 2" :disabled="!form.companyName"
              class="w-full py-5 rounded-2xl shadow-glow-accent font-black uppercase tracking-widest italic transition-all active:scale-95 disabled:opacity-50"
              :class="gameStore.darkMode ? 'btn-primary' : 'bg-accent-500 text-white hover:bg-accent-600'">
              Profil CEO ➜
            </button>
          </div>
        </div>

        <!-- Step 2: CEO Profile -->
        <div v-if="step === 2" class="space-y-8 animate-slide-up">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest mb-2"
                :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">Prénom</label>
              <input v-model="form.ceo.firstName" type="text" placeholder="John" class="input-minimal" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest mb-2"
                :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">Nom</label>
              <input v-model="form.ceo.lastName" type="text" placeholder="Doe" class="input-minimal" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest mb-3"
              :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">Sexe</label>
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <button v-for="g in ['M', 'F', 'NB']" :key="g" @click="form.ceo.gender = (g as any)" :class="[
                'flex-1 py-4 rounded-xl font-black italic border-2 transition-all text-xs sm:text-sm',
                form.ceo.gender === g
                  ? 'bg-accent-600 border-accent-500 text-white shadow-glow-accent'
                  : gameStore.darkMode ? 'bg-dark-850 border-dark-700 text-dark-400' : 'bg-slate-50 border-slate-100 text-slate-400'
              ]">
                {{ g }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest mb-4"
              :class="gameStore.darkMode ? 'text-dark-500' : 'text-slate-400'">Apparence</label>
            <div class="flex flex-wrap justify-center sm:justify-between gap-3 sm:gap-2">
              <button v-for="av in avatars" :key="av.id" @click="form.ceo.appearance = av.id" :class="[
                'w-14 h-14 flex items-center justify-center text-3xl rounded-2xl border-2 transition-all duration-300',
                form.ceo.appearance === av.id
                  ? 'bg-accent-600 border-accent-500 scale-110 shadow-glow-accent text-white'
                  : gameStore.darkMode ? 'bg-dark-850 border-dark-700 opacity-50' : 'bg-slate-50 border-slate-100 opacity-50'
              ]">
                {{ av.icon }}
              </button>
            </div>
          </div>

          <div class="pt-6 flex flex-col sm:flex-row gap-4">
            <button @click="step = 1"
              class="w-full sm:px-8 py-5 rounded-2xl font-black uppercase tracking-widest italic border transition-all"
              :class="gameStore.darkMode ? 'bg-dark-800 text-white border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'">
              Retour
            </button>
            <button @click="finishOnboarding" :disabled="!form.ceo.firstName"
              class="flex-1 py-5 rounded-2xl shadow-glow-accent font-black uppercase tracking-widest italic transition-all"
              :class="gameStore.darkMode ? 'btn-primary' : 'bg-accent-600 text-white hover:bg-accent-700'">
              Fonder l'empire ✓
            </button>
          </div>
        </div>

      </div>

      <!-- Step Counter -->
      <div class="flex justify-center mt-10 gap-3">
        <div v-for="i in 2" :key="i"
          :class="['h-2 rounded-full transition-all duration-500 shadow-sm', step === i ? 'w-10 bg-accent-500' : 'w-2 bg-dark-800 dark:bg-dark-800 bg-slate-200']">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-minimal {
  width: 100%;
  border-width: 2px;
  border-radius: 1rem;
  padding: 1rem;
  font-weight: 900;
  font-style: italic;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

@media (min-width: 640px) {
  .input-minimal {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

.dark .input-minimal {
  background-color: #1e293b;
  /* bg-dark-850 approx */
  border-color: #1e293b;
  /* border-dark-700 approx */
  color: #ffffff;
}

.dark .input-minimal:focus {
  border-color: #6366f1;
  /* focus:border-accent-500 */
}

.dark .input-minimal::placeholder {
  color: #475569;
  /* placeholder:text-dark-600 */
}

.input-minimal:not(.dark *) {
  background-color: #f8fafc;
  /* bg-slate-50 */
  border-color: #f1f5f9;
  /* border-slate-100 */
  color: #0f172a;
  /* text-slate-900 */
}

.input-minimal:not(.dark *):focus {
  border-color: #6366f1;
  /* focus:border-accent-500 */
}

.input-minimal:not(.dark *)::placeholder {
  color: #cbd5e1;
  /* placeholder:text-slate-300 */
}
</style>
