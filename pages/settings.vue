<script setup lang="ts">
/**
 * ── Settings Page ──
 * Permet de modifier les informations de l'onboarding et de réinitialiser la partie.
 */
import { useCompanyStore } from '~/stores/companyStore'
import { useGameStore } from '~/stores/gameStore'

const companyStore = useCompanyStore()
const gameStore = useGameStore()
const router = useRouter()

const form = reactive({
  companyName: companyStore.company.name,
  ceo: {
    firstName: companyStore.company.ceo?.firstName || '',
    lastName: companyStore.company.ceo?.lastName || '',
    gender: companyStore.company.ceo?.gender || 'M',
    appearance: companyStore.company.ceo?.appearance || 'suit-1',
    bankBalance: companyStore.company.ceo?.bankBalance || 0
  }
})

function saveSettings() {
  if (!companyStore.company.ceo) return

  companyStore.company.name = form.companyName
  companyStore.company.ceo.firstName = form.ceo.firstName
  companyStore.company.ceo.lastName = form.ceo.lastName

  // Mettre à jour localStorage
  localStorage.setItem('bizdom_save_v1', JSON.stringify({
    company: companyStore.company,
    employees: companyStore.employees
  }))

  alert('Paramètres sauvegardés !')
}

function fullReset() {
  if (confirm('Voulez-vous vraiment réinitialiser toute votre progression ? Cette action est irréversible.')) {
    localStorage.removeItem('bizdom_save_v1')
    window.location.reload()
  }
}

// SEO
useHead({
  title: 'Paramètres',
})
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-12 animate-fade-in p-4 sm:p-8">
    <header class="text-center sm:text-left">
      <h2 class="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase"
        :class="gameStore.darkMode ? 'text-white' : 'text-slate-900'">
        Paramètres <span class="text-accent-500">& Profil</span>
      </h2>
      <p class="text-[10px] font-black uppercase tracking-[0.3em] mt-2"
        :class="gameStore.darkMode ? 'text-dark-400' : 'text-slate-400'">
        Édition de votre identité de dirigeant
      </p>
    </header>

    <div class="card p-8 sm:p-10 border rounded-[2.5rem] shadow-xl space-y-10"
      :class="gameStore.darkMode ? 'bg-dark-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'">

      <div class="space-y-2">
        <label class="block text-[10px] font-black uppercase tracking-widest text-dark-500">Nom de l'Empire</label>
        <input v-model="form.companyName" type="text" class="input-minimal" placeholder="Ex: CyberDyne Systems" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-[10px] font-black uppercase tracking-widest text-dark-500">Prénom du
            Dirigeant</label>
          <input v-model="form.ceo.firstName" type="text" class="input-minimal" />
        </div>
        <div class="space-y-2">
          <label class="block text-[10px] font-black uppercase tracking-widest text-dark-500">Nom du Dirigeant</label>
          <input v-model="form.ceo.lastName" type="text" class="input-minimal" />
        </div>
      </div>

      <div class="pt-8 border-t" :class="gameStore.darkMode ? 'border-white/5' : 'border-slate-100'">
        <button @click="saveSettings"
          class="w-full btn-primary py-5 rounded-[1.5rem] font-black italic text-xs uppercase tracking-[0.2em] shadow-glow-accent/20">
          Enregistrer les Rectifications
        </button>
      </div>
    </div>

    <!-- Zone de Danger -->
    <div class="p-8 sm:p-10 rounded-[2.5rem] border transition-all"
      :class="gameStore.darkMode ? 'bg-loss-500/5 border-loss-500/20' : 'bg-rose-50 border-rose-100'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="text-center sm:text-left">
          <h3 class="text-loss-500 font-black italic uppercase text-xl mb-1">Protocole de Dissolution</h3>
          <p class="text-[10px] font-bold text-dark-500 uppercase tracking-tight">Réinitialisation complète de la
            progression</p>
        </div>
        <button @click="fullReset"
          class="px-8 py-4 rounded-2xl bg-loss-500/10 hover:bg-loss-500 text-loss-500 hover:text-white border border-loss-500/30 transition-all font-black text-[10px] uppercase tracking-widest">
          Lancer Hard Reset
        </button>
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
  font-weight: 700;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.dark .input-minimal {
  background-color: #1e293b;
  /* bg-dark-850 */
  border-color: #334155;
  /* border-dark-700 */
  color: white;
}

.dark .input-minimal:focus {
  border-color: #6366f1;
  /* focus:border-accent-500 */
}

/* Light mode defaults */
.input-minimal {
  background-color: #f8fafc;
  /* bg-slate-50 */
  border-color: #e2e8f0;
  /* border-slate-200 */
  color: #0f172a;
  /* text-slate-900 */
}

.input-minimal:focus {
  border-color: #6366f1;
  /* focus:border-accent-500 */
  background-color: white;
}
</style>
