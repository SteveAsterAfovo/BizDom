/**
 * ── useSimulation ──
 * Composable contenant toute la logique de simulation mensuelle
 * Aucune logique métier dans les composants UI : tout passe par ici
 */
import { usePersistence } from '~/composables/usePersistence'
import { useQuestStore } from '~/stores/questStore'
import type { GameEvent, MonthlyReport } from '~/types'
import eventsData from '~/mock/events.json'

const allEvents: GameEvent[] = eventsData as GameEvent[]
let globalTickInterval: any = null

export function useSimulation() {
  const gameStore = useGameStore()
  const companyStore = useCompanyStore()
  const questStore = useQuestStore()
  const { saveGame } = usePersistence()

  /**
   * Simule un mois entier de l'entreprise
   * Pipeline complet : productivité → clients → revenus → charges → taxes → événement → cash → rapport
   */
  function simulateMonth(): MonthlyReport {
    gameStore.setSimulating(true)

    // ─── 1. Faire monter l'expérience des employés ───
    companyStore.gainExperience()

    // ─── 2. Appliquer la fatigue mensuelle ───
    companyStore.applyFatigue()

    // ─── 3. Appliquer les bonus de motivation des perks ───
    companyStore.applyPerkMotivation()

    // ─── 4. Calculer la productivité globale ───
    const productivity = companyStore.productivity

    // ─── 5. Calculer les nouveaux clients via marketing (avec bonus vendeurs) ───
    const newCustomers = companyStore.estimatedNewCustomers

    // ─── 6. Mettre à jour la base clients ───
    companyStore.updateCustomerBase(newCustomers)
    companyStore.applyMarketGrowth()

    // ─── 7. Appliquer le churn (perte de clients) ───
    const churnedCustomers = companyStore.applyChurn()

    // ─── 8. Mettre à jour la satisfaction ───
    companyStore.updateSatisfaction()

    // ─── 9. Avancer le cycle économique ───
    companyStore.advanceEconomicCycle()
    const cycleMultiplier = companyStore.getCycleMultiplier()

    // ─── 10. Calculer le revenu (avec multiplicateur de cycle) ───
    const revenue = companyStore.market.customerBase
      * companyStore.company.revenuePerCustomer
      * productivity
      * cycleMultiplier

    // ─── 11. Calculer les charges ───
    const totalSalaries = companyStore.totalSalaries
    const fixedCosts = companyStore.company.fixedCosts
    const variableCosts = companyStore.totalVariableCosts
    const marketingCost = companyStore.totalMarketingBudget
    const officeRent = companyStore.officeRent
    const perksCost = companyStore.totalPerkCosts
    const loanPayments = companyStore.processLoanPayments()
    const totalExpenses = totalSalaries + fixedCosts + variableCosts + marketingCost + officeRent + perksCost + loanPayments

    // ─── 12. Calculer profit et taxes ───
    const profit = revenue - totalExpenses
    const taxes = profit > 0 ? profit * companyStore.company.taxRate : 0
    const netProfit = profit - taxes

    // ─── 13. Déclencher un événement aléatoire ───
    const event = rollRandomEvent()
    let eventImpact = 0

    if (event) {
      gameStore.triggerEvent(event)

      switch (event.type) {
        case 'gain':
          eventImpact = event.impactValue
          break
        case 'loss':
          // Bonus tech réduit les pertes de cyberattaques
          const reduction = event.id === 7 ? companyStore.techBonus : 0
          eventImpact = -event.impactValue * (1 - reduction)
          break
        case 'employee_departure':
          const departed = companyStore.removeRandomEmployee()
          if (departed) {
            event.description += ` (${departed.name} est parti(e))`
          }
          break
        case 'boost':
          companyStore.boostAllSkills(event.impactValue)
          break
        case 'fixed_cost_increase':
          companyStore.company.fixedCosts += event.impactValue
          break
        case 'sabotage':
          // Perte de motivation + perte cash
          companyStore.employees.forEach(e => e.motivation -= 10)
          eventImpact = -event.impactValue
          break
      }
    }

    // ─── 14. Mettre à jour le cash ───
    const totalCashChange = netProfit + eventImpact
    companyStore.updateCash(totalCashChange)

    // ─── 15. Dégrader la motivation (usure mensuelle) ───
    companyStore.degradeMotivation()

    // ─── 16. Mettre à jour les concurrents IA ───
    companyStore.updateCompetitors()

    // ─── 16.5 Mettre à jour la finance stratégique ───
    companyStore.updateSharePrice()
    companyStore.applyDepreciation()
    companyStore.runAutonomousBoardDecisions()

    // ─── 17. Générer le rapport mensuel ───
    const report: MonthlyReport = {
      month: gameStore.currentMonth,
      revenue: Math.round(revenue),
      totalSalaries,
      fixedCosts,
      totalExpenses: Math.round(totalExpenses),
      profit: Math.round(profit),
      taxes: Math.round(taxes),
      netProfit: Math.round(netProfit),
      cashAfter: Math.round(companyStore.company.cash),
      customerBase: companyStore.market.customerBase,
      employeeCount: companyStore.employeeCount,
      productivity: Math.round(productivity * 100) / 100,
      newCustomers,
      marketingBudget: companyStore.totalMarketingBudget,
      event: event || null,
      loanPayments: Math.round(loanPayments),
      officeRent,
      churnedCustomers,
      satisfaction: companyStore.market.satisfaction,
      perksCost,
    }

    gameStore.addReport(report)

    // ─── 18. Vérifier les achievements ───
    gameStore.checkAchievements(
      companyStore.company.cash,
      companyStore.employeeCount,
      companyStore.market.customerBase,
      companyStore.company.currentOfficeId,
    )

    // ─── 19. Vérifier fatigue basse (achievement) ───
    if (companyStore.employees.length > 0 && companyStore.employees.every((e) => e.fatigue < 20)) {
      gameStore.unlockAchievement('low_fatigue')
    }

    // ─── 20. Incrémenter le mois ───
    gameStore.nextMonth()

    // ─── 21. Vérifier la faillite ───
    if (companyStore.company.cash <= 0) {
      gameStore.setGameOver()
    }

    // ─── 22. Sauvegarder automatiquement ───
    saveGame()

    gameStore.setSimulating(false)
    return report
  }

  /**
   * Tire un événement aléatoire basé sur les probabilités
   * Retourne null si aucun événement ne se déclenche
   */
  function rollRandomEvent(): GameEvent | null {
    const triggered = allEvents.filter(
      (e) => Math.random() < e.probability
    )

    if (triggered.length === 0) return null

    const selected = triggered[Math.floor(Math.random() * triggered.length)]
    return { ...selected }
  }

  /**
   * Réinitialise le jeu entièrement
   */
  function resetGame() {
    gameStore.resetGame()
    companyStore.resetCompany()
    // Effacer la sauvegarde
    if (import.meta.client) {
      localStorage.removeItem('bizdom_save')
    }
  }

  // ── Simulation Temps Réel ──
  // Note: tickInterval est déplacé en dehors de useSimulation pour garantir un Singleton global

  function startRealTimeSimulation() {
    if (globalTickInterval) return

    console.log("🚀 Simulation BIZDOM démarrée")

    // Un tick toutes les secondes pour une fluidité totale sur une heure
    const tickRate = 1000

    globalTickInterval = setInterval(() => {
      // Mettre à jour le timestamp systématiquement pour la réactivité UI (expireAt, etc)
      gameStore.now = Date.now()

      if (gameStore.isPaused || gameStore.gameOver) return

      // On avance d'une fraction de jour (1h = 30j, donc 1s = 30/3600 j = 1/120 j)
      // 1 mois = 3600 secondes. Donc 1 seconde = 1/3600 mois.

      // Appliquer le tick financier/fatigue (1/3600ème du mois)
      companyStore.applyTick(1 / 3600)

      // On avance le jour dans le store toutes les 120 secondes (3600 / 30)
      const secondsInMonth = gameStore.currentDay * 120
      // Note: C'est juste visuel
      if (Math.random() < (1 / 120)) {
        gameStore.advanceDay()
      }

      // Vérifier les quêtes
      questStore.checkQuests()

      // Chance de générer une quête
      if (Math.random() < 0.01) {
        questStore.generateQuest()
      }

      // Chance de crise en temps réel (0.5% par jour)
      if (Math.random() < 0.005) {
        const event = rollRandomEvent()
        if (event) {
          gameStore.triggerEvent(event)
        }
      }

      // Si mois fini
      if (gameStore.currentDay >= 30) {
        simulateMonth()
        gameStore.resetTimer()
      }
    }, tickRate / gameStore.gameSpeed)
  }

  function stopRealTimeSimulation() {
    if (globalTickInterval) {
      clearInterval(globalTickInterval)
      globalTickInterval = null
      console.log("🛑 Simulation BIZDOM arrêtée")
    }
  }

  // Surveiller le changement de vitesse pour redémarrer l'intervalle si besoin
  watch(() => gameStore.gameSpeed, () => {
    if (globalTickInterval) {
      stopRealTimeSimulation()
      startRealTimeSimulation()
    }
  })

  return {
    simulateMonth,
    resetGame,
    startRealTimeSimulation,
    stopRealTimeSimulation,
  }
}
