/**
 * ── usePersistence ──
 * Composable dédié à la sauvegarde/chargement via localStorage
 * Permet de reprendre une partie après un rafraîchissement de page
 */
import { useGameStore } from '~/stores/gameStore'
import { useCompanyStore } from '~/stores/companyStore'

const SAVE_KEY = 'bizdom_save'

export function usePersistence() {
    const gameStore = useGameStore()
    const companyStore = useCompanyStore()

    /**
     * Sauvegarde l'état complet du jeu dans localStorage
     */
    function saveGame() {
        if (!import.meta.client) return

        const saveData = {
            version: 2,
            savedAt: Date.now(),
            game: {
                currentMonth: gameStore.currentMonth,
                reports: gameStore.reports,
                eventHistory: gameStore.eventHistory,
                gameOver: gameStore.gameOver,
                achievements: gameStore.achievements,
                darkMode: gameStore.darkMode,
            },
            company: {
                company: companyStore.company,
                employees: companyStore.employees,
                market: companyStore.market,
                marketingBudget: companyStore.marketingBudget,
                recruitPool: companyStore.recruitPool,
                loans: companyStore.loans,
                marketingChannels: companyStore.marketingChannels,
                nextLoanId: companyStore.nextLoanId,
            },
        }

        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
        } catch (e) {
            console.warn('[BIZDOM] Erreur lors de la sauvegarde:', e)
        }
    }

    /**
     * Charge une partie sauvegardée depuis localStorage
     * Retourne true si une sauvegarde a été chargée avec succès
     */
    function loadGame(): boolean {
        if (!import.meta.client) return false

        try {
            const raw = localStorage.getItem(SAVE_KEY)
            if (!raw) return false

            const saveData = JSON.parse(raw)
            if (!saveData || !saveData.game || !saveData.company) return false

            // Restaurer le game store
            gameStore.currentMonth = saveData.game.currentMonth
            gameStore.reports = saveData.game.reports || []
            gameStore.eventHistory = saveData.game.eventHistory || []
            gameStore.gameOver = saveData.game.gameOver || false
            gameStore.achievements = saveData.game.achievements || []
            gameStore.darkMode = saveData.game.darkMode ?? true

            // Restaurer le company store
            companyStore.company = saveData.company.company
            companyStore.employees = saveData.company.employees || []
            companyStore.market = saveData.company.market
            companyStore.marketingBudget = saveData.company.marketingBudget || 5000
            companyStore.recruitPool = saveData.company.recruitPool || []
            companyStore.loans = saveData.company.loans || []
            companyStore.marketingChannels = saveData.company.marketingChannels || []
            companyStore.nextLoanId = saveData.company.nextLoanId || 1

            // Appliquer le mode sombre
            if (gameStore.darkMode) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }

            return true
        } catch (e) {
            console.warn('[BIZDOM] Erreur lors du chargement:', e)
            return false
        }
    }

    /**
     * Vérifie s'il existe une sauvegarde valide
     */
    function hasSavedGame(): boolean {
        if (!import.meta.client) return false
        try {
            const raw = localStorage.getItem(SAVE_KEY)
            if (!raw) return false
            const data = JSON.parse(raw)
            return !!(data && data.game && data.company)
        } catch {
            return false
        }
    }

    /**
     * Retourne les infos de la sauvegarde (pour le banner)
     */
    function getSaveInfo(): { month: number; cash: number; savedAt: number } | null {
        if (!import.meta.client) return null
        try {
            const raw = localStorage.getItem(SAVE_KEY)
            if (!raw) return null
            const data = JSON.parse(raw)
            if (!data || !data.game || !data.company) return null
            return {
                month: data.game.currentMonth,
                cash: data.company.company.cash,
                savedAt: data.savedAt,
            }
        } catch {
            return null
        }
    }

    /**
     * Efface la sauvegarde
     */
    function deleteSave() {
        if (!import.meta.client) return
        localStorage.removeItem(SAVE_KEY)
    }

    return {
        saveGame,
        loadGame,
        hasSavedGame,
        getSaveInfo,
        deleteSave,
    }
}
