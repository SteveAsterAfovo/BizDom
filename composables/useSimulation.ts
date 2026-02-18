/**
 * ── useSimulation ──
 * Composable contenant toute la logique de simulation mensuelle
 * Aucune logique métier dans les composants UI : tout passe par ici
 */
import { useGameStore } from '~/stores/gameStore'
import { useCompanyStore } from '~/stores/companyStore'
import type { GameEvent, MonthlyReport } from '~/types'
import eventsData from '~/mock/events.json'

const allEvents: GameEvent[] = eventsData as GameEvent[]

export function useSimulation() {
    const gameStore = useGameStore()
    const companyStore = useCompanyStore()

    /**
     * Simule un mois entier de l'entreprise
     * Étapes : productivité → clients → revenus → charges → taxes → événement → cash → rapport → mois suivant
     */
    function simulateMonth(): MonthlyReport {
        gameStore.setSimulating(true)

        // ─── 1. Calculer la productivité globale ───
        const productivity = companyStore.productivity

        // ─── 2. Calculer les nouveaux clients via marketing ───
        const newCustomers = companyStore.estimatedNewCustomers

        // ─── 3. Mettre à jour la base clients ───
        companyStore.updateCustomerBase(newCustomers)
        companyStore.applyMarketGrowth()

        // ─── 4. Calculer le revenu ───
        const revenue = companyStore.market.customerBase
            * companyStore.company.revenuePerCustomer
            * productivity

        // ─── 5. Calculer les charges ───
        const totalSalaries = companyStore.totalSalaries
        const fixedCosts = companyStore.company.fixedCosts
        const variableCosts = companyStore.totalVariableCosts
        const marketingCost = companyStore.marketingBudget
        const totalExpenses = totalSalaries + fixedCosts + variableCosts + marketingCost

        // ─── 6. Calculer profit et taxes ───
        const profit = revenue - totalExpenses
        const taxes = profit > 0 ? profit * companyStore.company.taxRate : 0
        const netProfit = profit - taxes

        // ─── 7. Déclencher un événement aléatoire ───
        const event = rollRandomEvent()
        let eventImpact = 0

        if (event) {
            gameStore.triggerEvent(event)

            switch (event.type) {
                case 'gain':
                    eventImpact = event.impactValue
                    break
                case 'loss':
                    eventImpact = -event.impactValue
                    break
                case 'employee_departure':
                    const departed = companyStore.removeRandomEmployee()
                    if (departed) {
                        event.description += ` (${departed.name} est parti(e))`
                    }
                    break
                case 'boost':
                    // impactValue = nombre de niveaux de skill à ajouter
                    companyStore.boostAllSkills(event.impactValue)
                    break
            }
        }

        // ─── 8. Mettre à jour le cash ───
        const totalCashChange = netProfit + eventImpact
        companyStore.updateCash(totalCashChange)

        // ─── 9. Dégrader la motivation (usure mensuelle) ───
        companyStore.degradeMotivation()

        // ─── 10. Générer le rapport mensuel ───
        const report: MonthlyReport = {
            month: gameStore.currentMonth,
            revenue: Math.round(revenue),
            totalSalaries,
            fixedCosts,
            totalExpenses: totalExpenses + marketingCost,
            profit: Math.round(profit),
            taxes: Math.round(taxes),
            netProfit: Math.round(netProfit),
            cashAfter: Math.round(companyStore.company.cash),
            customerBase: companyStore.market.customerBase,
            employeeCount: companyStore.employeeCount,
            productivity: Math.round(productivity * 100) / 100,
            newCustomers,
            marketingBudget: companyStore.marketingBudget,
            event: event || null,
        }

        gameStore.addReport(report)

        // ─── 11. Incrémenter le mois ───
        gameStore.nextMonth()

        // ─── 12. Vérifier la faillite ───
        if (companyStore.company.cash <= 0) {
            gameStore.setGameOver()
        }

        gameStore.setSimulating(false)
        return report
    }

    /**
     * Tire un événement aléatoire basé sur les probabilités
     * Retourne null si aucun événement ne se déclenche
     */
    function rollRandomEvent(): GameEvent | null {
        // Chaque événement a une probabilité indépendante de se déclencher
        const triggered = allEvents.filter(
            (e) => Math.random() < e.probability
        )

        if (triggered.length === 0) return null

        // Si plusieurs événements se déclenchent, on n'en prend qu'un au hasard
        const selected = triggered[Math.floor(Math.random() * triggered.length)]

        // Retourner une copie pour ne pas muter les données source
        return { ...selected }
    }

    /**
     * Réinitialise le jeu entièrement
     */
    function resetGame() {
        gameStore.resetGame()
        companyStore.resetCompany()
    }

    return {
        simulateMonth,
        resetGame,
    }
}
