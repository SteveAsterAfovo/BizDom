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
  ceo: { ...companyStore.company.ceo }
})

function saveSettings() {
  companyStore.company.name = form.companyName
  companyStore.company.ceo = { ...form.ceo }

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
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto space-y-10 animate-fade-in">
    <header>
      <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Paramètres <span
          class="text-accent-500">& Profil</span></h2>
      <p class="text-dark-400 font-bold uppercase tracking-widest text-xs mt-1">Gérez votre identité de dirigeant</p>
    </header>

    <div class="card p-8 bg-dark-900 border-white/5 space-y-8">
      <div>
        <label class="block text-[10px] font-black text-dark-500 uppercase tracking-widest mb-3">Nom de
          l'Entreprise</label>
        <input v-model="form.companyName" type="text" class="input-minimal" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-black text-dark-500 uppercase tracking-widest mb-2">Prénom du CEO</label>
          <input v-model="form.ceo.firstName" type="text" class="input-minimal" />
        </div>
        <div>
          <label class="block text-[10px] font-black text-dark-500 uppercase tracking-widest mb-2">Nom du CEO</label>
          <input v-model="form.ceo.lastName" type="text" class="input-minimal" />
        </div>
      </div>

      <div class="pt-6 border-t border-white/5 flex gap-4">
        <button @click="saveSettings" class="flex-1 btn-primary py-4 rounded-xl">Sauvegarder les modifications</button>
      </div>
    </div>

    <div class="p-8 rounded-3xl bg-loss-500/5 border border-loss-500/20">
      <h3 class="text-loss-500 font-black italic uppercase text-lg mb-2">Zone de Danger</h3>
      <p class="text-xs text-dark-500 mb-6 font-medium">Réinitialiser la partie supprimera toutes vos données locales et
        vous ramènera au garage.</p>
      <button @click="fullReset"
        class="w-full py-4 rounded-xl bg-loss-500/10 hover:bg-loss-500 text-loss-500 hover:text-white border border-loss-500/30 transition-all font-black text-xs uppercase tracking-widest">
        Réinitialiser la partie (Hard Reset)
      </button>
    </div>
  </div>
</template>

<style scoped>
.input-minimal {
  @apply w-full bg-dark-850 border-2 border-dark-700 rounded-2xl p-4 text-white font-bold focus:border-accent-500 outline-none transition-all;
}
</style>
