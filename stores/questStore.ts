/**
 * ── Quest Store ──
 * Gère les objectifs temporaires et les récompenses
 */
import { defineStore } from 'pinia'
import type { Quest } from '~/types'
import { useCompanyStore } from './companyStore'
import { useGameStore } from './gameStore'

export const useQuestStore = defineStore('quests', {
  state: () => ({
    activeQuests: [] as Quest[],
    completedCount: 0,
  }),

  getters: {
    hasActiveQuests: (state) => state.activeQuests.length > 0,
  },

  actions: {
    /** Générer une nouvelle quête aléatoire */
    generateQuest() {
      const gameStore = useGameStore()
      const questPool: Quest[] = [
        {
          id: 'satisfaction_90',
          title: 'Service Client Or 🥇',
          description: 'Atteindre 90% de satisfaction client.',
          condition: 'satisfaction_90',
          rewardType: 'cash',
          rewardValue: 50000,
          completed: false,
          deadline: gameStore.currentDay + 5,
          pros: ['Gros bonus de trésorerie', 'Booste la réputation'],
          cons: ['Pression sur les équipes', 'Coût marketing élevé'],
          failurePenalty: 15000
        },
        {
          id: 'recruit_tech',
          title: 'Besoin de Talents 👨‍💻',
          description: 'Recruter au moins 3 spécialistes Tech.',
          condition: 'recruit_tech_3',
          rewardType: 'motivation',
          rewardValue: 20,
          completed: false,
          deadline: gameStore.currentDay + 10,
          pros: ['Vitesse de dev accrue', 'Moral d\'équipe'],
          cons: ['Masse salariale augmente', 'Risque de burnout'],
          failurePenalty: 5000
        },
        {
          id: 'cash_reserve',
          title: 'Écureuil Prudent 🐿️',
          description: 'Accumuler 500k de cash en réserve.',
          condition: 'cash_500k',
          rewardType: 'perk',
          rewardValue: 1, // Unlock un perk spécial
          completed: false,
          deadline: gameStore.currentDay + 15,
          pros: ['Sécurité financière', 'Confiance des investisseurs'],
          cons: ['Croissance ralentie', 'Manque d\'investissement'],
          failurePenalty: 25000
        }
      ]

      const randomQuest = questPool[Math.floor(Math.random() * questPool.length)]
      if (!this.activeQuests.some(q => q.id === randomQuest.id)) {
        this.activeQuests.push({ ...randomQuest })
      }
    },

    /** Vérifier si les conditions des quêtes sont remplies */
    checkQuests() {
      const companyStore = useCompanyStore()
      const gameStore = useGameStore()

      this.activeQuests.forEach(quest => {
        if (quest.completed) return

        let isFulfilled = false

        switch (quest.condition) {
          case 'satisfaction_90':
            if (companyStore.market.satisfaction >= 90) isFulfilled = true
            break
          case 'recruit_tech_3':
            const techs = companyStore.employees.filter(e => e.specialty === 'tech').length
            if (techs >= 3) isFulfilled = true
            break
          case 'cash_500k':
            if (companyStore.company.cash >= 500000) isFulfilled = true
            break
        }

        if (isFulfilled) {
          this.completeQuest(quest.id)
        }

        // Vérifier deadline et appliquer pénalité
        if (quest.deadline && gameStore.currentDay >= quest.deadline && !isFulfilled) {
          if (quest.failurePenalty > 0) {
            companyStore.company.cash -= quest.failurePenalty
            gameStore.triggerEvent({
              id: 300,
              name: "Objectif Échoué",
              description: `L'objectif "${quest.title}" a expiré. Pénalité de trésorerie appliquée.`,
              type: "loss",
              impactValue: quest.failurePenalty,
              icon: "📉",
              probability: 1
            })
          }
          this.removeQuest(quest.id)
        }
      })
    },

    /** Finaliser une quête et donner la récompense */
    completeQuest(questId: string) {
      const quest = this.activeQuests.find(q => q.id === questId)
      if (quest && !quest.completed) {
        const companyStore = useCompanyStore()

        quest.completed = true
        this.completedCount++

        // Donner récompense
        if (quest.rewardType === 'cash') {
          companyStore.company.cash += quest.rewardValue
        } else if (quest.rewardType === 'motivation') {
          companyStore.employees.forEach(e => {
            e.motivation = Math.min(100, e.motivation + quest.rewardValue)
          })
        }

        // Mettre à jour le timestamp de dernière action pour éviter le déclin organique
        companyStore.market.lastActionTime = Date.now()

        // Supprimer après 3 secondes (feedback visuel)
        setTimeout(() => {
          this.removeQuest(questId)
        }, 3000)
      }
    },

    removeQuest(questId: string) {
      const idx = this.activeQuests.findIndex(q => q.id === questId)
      if (idx !== -1) {
        this.activeQuests.splice(idx, 1)
      }
    }
  }
})
