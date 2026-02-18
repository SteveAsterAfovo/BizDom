/**
 * ── Game Store ──
 * Gère l'état global du jeu : mois courant, rapports, événements,
 * achievements, mode sombre/clair et simulation temps réel
 */
import { defineStore } from 'pinia'
import type { GameEvent, MonthlyReport, Achievement } from '~/types'
import achievementsData from '~/mock/achievements.json'

interface GameStoreState {
  currentMonth: number
  isPaused: boolean
  currentDay: number
  gameSpeed: number
  timerDuration: number
  reports: MonthlyReport[]
  eventHistory: GameEvent[]
  currentEvent: GameEvent | null
  isSimulating: boolean
  gameOver: boolean
  achievements: Achievement[]
  recentAchievement: Achievement | null
  darkMode: boolean
}

export const useGameStore = defineStore('game', {
  state: (): GameStoreState => ({
    currentMonth: 1,
    isPaused: true,
    currentDay: 0,
    gameSpeed: 1,
    timerDuration: 600000, // 10 minutes = 1 mois
    reports: [],
    eventHistory: [],
    currentEvent: null,
    isSimulating: false,
    gameOver: false,
    achievements: achievementsData.map((a) => ({ ...a })) as Achievement[],
    recentAchievement: null,
    darkMode: true,
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

    /** Historique de la satisfaction */
    satisfactionHistory: (state): number[] =>
      state.reports.map((r) => r.satisfaction),

    /** Nombre d'achievements débloqués */
    unlockedCount: (state): number =>
      state.achievements.filter((a) => a.unlocked).length,

    /** Progression des achievements (0-100) */
    achievementProgress: (state): number => {
      if (state.achievements.length === 0) return 0
      return Math.round((state.achievements.filter((a) => a.unlocked).length / state.achievements.length) * 100)
    },

    /** Progression du mois (0-100) */
    monthProgress: (state): number => (state.currentDay / 30) * 100,
  },

  actions: {
    togglePause() {
      this.isPaused = !this.isPaused
    },

    setSpeed(speed: number) {
      this.gameSpeed = speed
    },

    advanceDay() {
      if (this.currentDay < 30) {
        this.currentDay++
      }
    },

    resetTimer() {
      this.currentDay = 0
    },

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

    /** Basculer le mode sombre/clair */
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    /** Débloquer un achievement */
    unlockAchievement(achievementId: string) {
      const achievement = this.achievements.find((a) => a.id === achievementId)
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        achievement.unlockedAt = this.currentMonth
        this.recentAchievement = achievement
        // Auto-dismiss après 4 secondes
        setTimeout(() => {
          this.recentAchievement = null
        }, 4000)
      }
    },

    /** Vérifier et débloquer les achievements */
    checkAchievements(cash: number, employeeCount: number, customerBase: number, officeId: number) {
      // Premier million
      if (cash >= 1000000) this.unlockAchievement('first_million')

      // 10 employés
      if (employeeCount >= 10) this.unlockAchievement('employees_10')

      // 25 employés
      if (employeeCount >= 25) this.unlockAchievement('employees_25')

      // Audit fiscal (vérifié via événement)
      const hasAudit = this.eventHistory.some((e) => e.id === 5)
      if (hasAudit && cash > 0) this.unlockAchievement('survived_audit')

      // 6 mois consécutifs de profit
      if (this.reports.length >= 6) {
        const lastSix = this.reports.slice(-6)
        if (lastSix.every((r) => r.netProfit > 0)) {
          this.unlockAchievement('six_months_profit')
        }
      }

      // Bureau premium
      if (officeId >= 5) this.unlockAchievement('premium_office')

      // 500 clients
      if (customerBase >= 500) this.unlockAchievement('customers_500')
    },

    /** Réinitialiser le jeu */
    resetGame() {
      this.currentMonth = 1
      this.isPaused = true
      this.currentDay = 0
      this.reports = []
      this.eventHistory = []
      this.currentEvent = null
      this.isSimulating = false
      this.gameOver = false
      this.achievements = achievementsData.map((a) => ({ ...a })) as Achievement[]
      this.recentAchievement = null
    },
  },
})
