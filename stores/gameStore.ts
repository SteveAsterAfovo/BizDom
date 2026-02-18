/**
 * ── Game Store ──
 * Gère l'état global du jeu : mois courant, rapports, événements
 */
import { defineStore } from 'pinia'
import type { GameEvent, MonthlyReport } from '~/types'

interface GameStoreState {
    currentMonth: number
    reports: MonthlyReport[]
    eventHistory: GameEvent[]
    currentEvent: GameEvent | null
    isSimulating: boolean
    gameOver: boolean
}

export const useGameStore = defineStore('game', {
    state: (): GameStoreState => ({
        currentMonth: 1,
        reports: [],
        eventHistory: [],
        currentEvent: null,
        isSimulating: false,
        gameOver: false,
    }),

    getters: {
        /** Mois formaté (ex: "Mois 3") */
        formattedMonth: (state): string => `Mois ${state.currentMonth}`,

        /** Dernier rapport mensuel */
        lastReport: (state): MonthlyReport | null =>
            state.reports.length > 0 ? state.reports[state.reports.length - 1] : null,

        /** Labels pour les graphiques (Mois 1, Mois 2, ...) */
        monthLabels: (state): string[] =>
            state.reports.map((r) => `Mois ${r.month}`),

        /** Historique du cash pour graphiques */
        cashHistory: (state): number[] =>
            state.reports.map((r) => r.cashAfter),

        /** Historique des revenus pour graphiques */
        revenueHistory: (state): number[] =>
            state.reports.map((r) => r.revenue),

        /** Historique du profit net pour graphiques */
        netProfitHistory: (state): number[] =>
            state.reports.map((r) => r.netProfit),
    },

    actions: {
        /** Ajouter un rapport mensuel à l'historique */
        addReport(report: MonthlyReport) {
            this.reports.push(report)
        },

        /** Déclencher un événement aléatoire */
        triggerEvent(event: GameEvent) {
            this.currentEvent = event
            this.eventHistory.push(event)
        },

        /** Fermer la modal d'événement */
        dismissEvent() {
            this.currentEvent = null
        },

        /** Incrémenter le mois */
        nextMonth() {
            this.currentMonth++
        },

        /** Activer/désactiver l'état de simulation */
        setSimulating(value: boolean) {
            this.isSimulating = value
        },

        /** Fin de partie */
        setGameOver() {
            this.gameOver = true
        },

        /** Réinitialiser le jeu */
        resetGame() {
            this.currentMonth = 1
            this.reports = []
            this.eventHistory = []
            this.currentEvent = null
            this.isSimulating = false
            this.gameOver = false
        },
    },
})
