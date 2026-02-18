/**
 * ── Setup Middleware ──
 * Redirige vers /onboarding si l'entreprise n'est pas configurée
 */
import { useCompanyStore } from '~/stores/companyStore'

export default defineNuxtRouteMiddleware((to) => {
  // Éviter boucle infinie
  if (to.path === '/onboarding') return

  const companyStore = useCompanyStore()

  // Si non configuré, redirection forcée
  if (!companyStore.company.isConfigured) {
    return navigateTo('/onboarding')
  }
})
