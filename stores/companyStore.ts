/**
 * ── Company Store ──
 * Gère les données de l'entreprise : finances, employés, marché, marketing,
 * bureaux, avantages sociaux, prêts, concurrence et canaux marketing
 */
import { defineStore } from 'pinia'
import type { Company, Employee, MarketData, RecruitCandidate, Office, Perk, Loan, Competitor, MarketingChannel, EmployeeSpecialty } from '~/types'
import companyData from '~/mock/company.json'
import employeesData from '~/mock/employees.json'
import marketData from '~/mock/market.json'
import officesData from '~/mock/offices.json'
import perksData from '~/mock/perks.json'
import competitorsData from '~/mock/competitors.json'
import channelsData from '~/mock/channels.json'

/** Pool de candidats disponibles pour le recrutement */
const RECRUIT_POOL: RecruitCandidate[] = [
  { id: 100, name: 'Ibrahim Bah', role: 'Développeur Mobile', skillLevel: 3, salary: 7000, motivation: 80, fatigue: 0, monthsEmployed: 0, specialty: 'tech' },
  { id: 101, name: 'Marie Ndour', role: 'Data Analyst', skillLevel: 4, salary: 9000, motivation: 85, fatigue: 0, monthsEmployed: 0, specialty: 'tech' },
  { id: 102, name: 'Oumar Cissé', role: 'Community Manager', skillLevel: 2, salary: 4500, motivation: 90, fatigue: 0, monthsEmployed: 0, specialty: 'creative' },
  { id: 103, name: 'Adama Keita', role: 'Ingénieur DevOps', skillLevel: 5, salary: 11000, motivation: 75, fatigue: 0, monthsEmployed: 0, specialty: 'tech' },
  { id: 104, name: 'Ndeye Fall', role: 'Assistante RH', skillLevel: 3, salary: 5000, motivation: 85, fatigue: 0, monthsEmployed: 0, specialty: 'hr' },
  { id: 105, name: 'Seydou Diop', role: 'Technicien Support', skillLevel: 2, salary: 4000, motivation: 70, fatigue: 0, monthsEmployed: 0, specialty: 'tech' },
  { id: 106, name: 'Clarisse Ouédraogo', role: 'Designer Graphique', skillLevel: 4, salary: 7500, motivation: 80, fatigue: 0, monthsEmployed: 0, specialty: 'creative' },
  { id: 107, name: 'Jean-Paul Mbiké', role: 'Développeur Backend', skillLevel: 4, salary: 8500, motivation: 78, fatigue: 0, monthsEmployed: 0, specialty: 'tech' },
  { id: 108, name: 'Aïssatou Diallo', role: 'Responsable Ventes', skillLevel: 4, salary: 8000, motivation: 82, fatigue: 0, monthsEmployed: 0, specialty: 'sales' },
  { id: 109, name: 'Bakary Touré', role: 'Commercial Terrain', skillLevel: 3, salary: 5500, motivation: 75, fatigue: 0, monthsEmployed: 0, specialty: 'sales' },
  { id: 110, name: 'Mamadou Sy', role: 'Chef de Projet', skillLevel: 5, salary: 10000, motivation: 88, fatigue: 0, monthsEmployed: 0, specialty: 'management' },
]

interface CompanyStoreState {
  company: Company
  employees: Employee[]
  market: MarketData
  marketingBudget: number
  recruitPool: RecruitCandidate[]
  offices: Office[]
  availablePerks: Perk[]
  loans: Loan[]
  competitors: Competitor[]
  marketingChannels: MarketingChannel[]
  nextLoanId: number
}

export const useCompanyStore = defineStore('company', {
  state: (): CompanyStoreState => ({
    company: {
      ...companyData,
      investorShare: 0,
      equipmentLevel: 1,
    } as Company,
    employees: employeesData.map((e) => ({ ...e, trainingDaysRemaining: 0, opinions: [] })) as Employee[],
    market: {
      ...marketData,
      demands: { tech: 50, sales: 50, creative: 50, hr: 50, management: 50 }
    } as MarketData,
    marketingBudget: 5000,
    recruitPool: RECRUIT_POOL.map((c) => ({ ...c })),
    offices: officesData.map((o) => ({ ...o })) as Office[],
    availablePerks: perksData.map((p) => ({ ...p })) as Perk[],
    loans: [],
    competitors: competitorsData.map((c) => ({ ...c })) as Competitor[],
    marketingChannels: channelsData.map((ch) => ({ ...ch })) as MarketingChannel[],
    nextLoanId: 1,
  }),

  getters: {
    /** Total des salaires mensuels */
    totalSalaries: (state): number =>
      state.employees.reduce((sum, e) => sum + e.salary, 0),

    /** Nombre d'employés */
    employeeCount: (state): number =>
      state.employees.length,

    /** Bureau actuel */
    currentOffice: (state): Office => {
      const office = state.offices.find((o) => o.id === state.company.currentOfficeId)
      return office || state.offices[0]
    },

    /** Peut encore recruter (capacité bureau) */
    canHireMore(): boolean {
      return this.employees.length < this.currentOffice.maxEmployees
    },

    /** Productivité globale (moyenne de skillLevel × motivation% × fatigue inverse) */
    productivity: (state): number => {
      if (state.employees.length === 0) return 0

      // Les employés en formation ne produisent rien
      const activeEmployees = state.employees.filter((e) => e.trainingDaysRemaining <= 0)
      if (activeEmployees.length === 0) return 0

      const total = activeEmployees.reduce((sum, e) => {
        const fatiguePenalty = 1 - (e.fatigue / 200) // fatigue 100 = -50% productivité
        return sum + (e.skillLevel * (e.motivation / 100) * fatiguePenalty)
      }, 0)

      // Bonus de spécialité (Management)
      const managers = activeEmployees.filter((e) => e.specialty === 'management')
      const managementBonus = 1 + (managers.length * 0.05)

      return (total / activeEmployees.length) * managementBonus
    },

    /** Bonus de spécialisation : vendeurs boostent l'acquisition */
    salesBonus: (state): number => {
      const salesCount = state.employees.filter((e) => e.specialty === 'sales').length
      return 1 + (salesCount * 0.1) // +10% par vendeur
    },

    /** Bonus tech : réduit risques de cyberattaque */
    techBonus: (state): number => {
      const techCount = state.employees.filter((e) => e.specialty === 'tech').length
      return Math.min(0.5, techCount * 0.08) // jusqu'à -50% risques
    },

    /** Bonus RH : booste la motivation naturellement */
    hrBonus: (state): number => {
      const hrCount = state.employees.filter((e) => e.specialty === 'hr').length
      return hrCount * 2 // +2 motivation par RH
    },

    /** Distribution des spécialités */
    specialtyDistribution: (state): Record<string, number> => {
      const dist: Record<string, number> = { tech: 0, sales: 0, creative: 0, hr: 0, management: 0 }
      state.employees.forEach((e) => { dist[e.specialty] = (dist[e.specialty] || 0) + 1 })
      return dist
    },

    /** Estimation des nouveaux clients via marketing (avec bonus vendeurs) */
    estimatedNewCustomers(): number {
      const channelCustomers = this.marketingChannels.reduce(
        (sum: number, ch: MarketingChannel) => sum + Math.round(ch.budget * ch.efficiency), 0
      )
      return Math.round(channelCustomers * this.salesBonus)
    },

    /** Budget marketing total (somme des canaux) */
    totalMarketingBudget: (state): number =>
      state.marketingChannels.reduce((sum, ch) => sum + ch.budget, 0),

    /** Cash actuel de l'entreprise */
    cash: (state): number => state.company.cash,

    /** Coûts variables totaux */
    totalVariableCosts: (state): number =>
      state.employees.length * state.company.variableCostPerEmployee,

    /** Loyer du bureau actuel */
    officeRent(): number {
      return this.currentOffice.rent
    },

    /** Total des remboursements de prêts ce mois */
    totalLoanPayments: (state): number =>
      state.loans.reduce((sum, l) => sum + l.monthlyPayment, 0),

    /** Coût total des perks actifs */
    totalPerkCosts: (state): number => {
      return state.company.activePerks.reduce((sum, perkId) => {
        const perk = state.availablePerks.find((p) => p.id === perkId)
        return sum + (perk ? perk.cost : 0)
      }, 0)
    },

    /** Score de satisfaction (NPS) basé sur le ratio employés/clients */
    satisfactionScore: (state): number => {
      if (state.market.customerBase === 0) return 100
      const ratio = state.employees.length / state.market.customerBase
      // ratio idéal ≈ 0.05 (1 employé pour 20 clients)
      const satisfaction = Math.min(100, Math.max(0, ratio * 2000))
      return Math.round(satisfaction)
    },

    /** Fatigue moyenne des employés */
    averageFatigue: (state): number => {
      if (state.employees.length === 0) return 0
      return Math.round(state.employees.reduce((s, e) => s + e.fatigue, 0) / state.employees.length)
    },

    /** Part de marché du joueur (100 - somme concurrents) */
    playerMarketShare: (state): number => {
      const competitorShares = state.competitors.reduce((sum, c) => sum + c.marketShare, 0)
      return Math.max(0, 100 - competitorShares)
    },
  },

  actions: {
    /** Recruter un candidat du pool */
    hireEmployee(candidateId: number) {
      if (!this.canHireMore) return // vérifier la capacité du bureau

      const idx = this.recruitPool.findIndex((c) => c.id === candidateId)
      if (idx === -1) return

      const candidate = this.recruitPool.splice(idx, 1)[0]
      this.employees.push({
        id: candidate.id,
        name: candidate.name,
        role: candidate.role,
        skillLevel: candidate.skillLevel,
        salary: candidate.salary,
        motivation: candidate.motivation,
        fatigue: 0,
        monthsEmployed: 0,
        specialty: candidate.specialty,
        trainingDaysRemaining: 0,
        opinions: [],
      })
    },

    /** Licencier un employé */
    fireEmployee(employeeId: number) {
      const idx = this.employees.findIndex((e) => e.id === employeeId)
      if (idx === -1) return
      this.employees.splice(idx, 1)
    },

    /** Augmenter le salaire d'un employé (boost motivation) */
    raiseSalary(employeeId: number, amount: number = 500) {
      const employee = this.employees.find((e) => e.id === employeeId)
      if (!employee) return
      employee.salary += amount
      employee.motivation = Math.min(100, employee.motivation + 10)
    },

    /** Définir le budget d'un canal marketing */
    setChannelBudget(channelId: number, budget: number) {
      const channel = this.marketingChannels.find((ch) => ch.id === channelId)
      if (!channel) return
      channel.budget = Math.max(0, budget)
      // Mise à jour du budget global
      this.marketingBudget = this.totalMarketingBudget
    },

    /** Définir le budget marketing (legacy, utilisé pour le calcul total) */
    setMarketingBudget(budget: number) {
      this.marketingBudget = Math.max(0, budget)
    },

    /** Mettre à jour le cash */
    updateCash(amount: number) {
      this.company.cash += amount
    },

    /** Mettre à jour la base clients */
    updateCustomerBase(newCustomers: number) {
      this.market.customerBase += newCustomers
    },

    /** Appliquer la croissance naturelle du marché */
    applyMarketGrowth() {
      this.market.customerBase = Math.round(
        this.market.customerBase * (1 + this.market.marketGrowth)
      )
    },

    /** Dégrader légèrement la motivation de tous les employés (usure mensuelle) */
    degradeMotivation() {
      // Bonus RH réduit la dégradation
      const hrProtection = this.hrBonus
      this.employees.forEach((e) => {
        const degradation = Math.floor(Math.random() * 5 + 1) - hrProtection
        e.motivation = Math.max(10, e.motivation - Math.max(0, degradation))
      })
    },

    /** Appliquer la fatigue mensuelle + effets des perks */
    applyFatigue() {
      const perkReduction = this.company.activePerks.reduce((total, perkId) => {
        const perk = this.availablePerks.find((p) => p.id === perkId)
        return total + (perk ? perk.fatigueReduction : 0)
      }, 0)

      this.employees.forEach((e) => {
        // La fatigue augmente naturellement
        const fatigueGain = Math.floor(Math.random() * 8 + 3) // +3 à +10
        e.fatigue = Math.min(100, e.fatigue + fatigueGain - perkReduction)
        e.fatigue = Math.max(0, e.fatigue)

        // Si fatigue > 80, perte de motivation supplémentaire
        if (e.fatigue > 80) {
          e.motivation = Math.max(10, e.motivation - 5)
        }
      })
    },

    /** Appliquer les bonus de motivation des perks */
    applyPerkMotivation() {
      const motivationBoost = this.company.activePerks.reduce((total, perkId) => {
        const perk = this.availablePerks.find((p) => p.id === perkId)
        return total + (perk ? perk.motivationBoost : 0)
      }, 0)

      if (motivationBoost > 0) {
        this.employees.forEach((e) => {
          e.motivation = Math.min(100, e.motivation + motivationBoost)
        })
      }
    },

    /** Faire monter l'expérience des employés */
    gainExperience() {
      this.employees.forEach((e) => {
        e.monthsEmployed++
        // Tous les 6 mois, chance de monter en compétence
        if (e.monthsEmployed > 0 && e.monthsEmployed % 6 === 0 && e.skillLevel < 5) {
          e.skillLevel = Math.min(5, e.skillLevel + 1)
        }
      })
    },

    /** Retirer un employé aléatoire (événement de départ) */
    removeRandomEmployee(): Employee | null {
      if (this.employees.length === 0) return null
      const idx = Math.floor(Math.random() * this.employees.length)
      return this.employees.splice(idx, 1)[0]
    },

    /** Booster les compétences de tous les employés (événement formation) */
    boostAllSkills(amount: number = 1) {
      this.employees.forEach((e) => {
        e.skillLevel = Math.min(5, e.skillLevel + amount)
      })
    },

    // ─── Bureaux ───

    /** Déménager vers un nouveau bureau */
    upgradeOffice(officeId: number) {
      const office = this.offices.find((o) => o.id === officeId)
      if (!office) return
      this.company.currentOfficeId = officeId
    },

    // ─── Avantages sociaux ───

    /** Activer un perk */
    addPerk(perkId: number) {
      if (!this.company.activePerks.includes(perkId)) {
        this.company.activePerks.push(perkId)
      }
    },

    /** Désactiver un perk */
    removePerk(perkId: number) {
      const idx = this.company.activePerks.indexOf(perkId)
      if (idx !== -1) {
        this.company.activePerks.splice(idx, 1)
      }
    },

    // ─── Prêts bancaires ───

    /** Emprunter de l'argent */
    takeLoan(amount: number, months: number = 12) {
      const interestRate = 0.03 // 3% mensuel
      const monthlyPayment = Math.round((amount * (1 + interestRate * months)) / months)
      this.loans.push({
        id: this.nextLoanId++,
        amount,
        interestRate,
        remainingMonths: months,
        monthlyPayment,
        totalPaid: 0,
      })
      this.company.cash += amount
    },

    /** Rembourser les prêts mensuellement (appelé dans la simulation) */
    processLoanPayments(): number {
      let totalPayment = 0
      this.loans = this.loans.filter((loan) => {
        if (loan.remainingMonths <= 0) return false
        loan.remainingMonths--
        loan.totalPaid += loan.monthlyPayment
        totalPayment += loan.monthlyPayment
        return loan.remainingMonths > 0
      })
      return totalPayment
    },

    /** Rembourser un prêt par anticipation */
    repayLoan(loanId: number) {
      const idx = this.loans.findIndex((l) => l.id === loanId)
      if (idx === -1) return
      const loan = this.loans[idx]
      const remainingAmount = loan.monthlyPayment * loan.remainingMonths
      if (this.company.cash >= remainingAmount) {
        this.company.cash -= remainingAmount
        this.loans.splice(idx, 1)
      }
    },

    // ─── Concurrence ───

    /** Mettre à jour les concurrents IA (ils grandissent chaque mois) */
    updateCompetitors() {
      this.competitors.forEach((c) => {
        c.marketShare = Math.min(40, c.marketShare * (1 + c.growthRate))
      })
      // Si la part totale des concurrents dépasse 95%, on les plafonne
      const totalCompetitor = this.competitors.reduce((s, c) => s + c.marketShare, 0)
      if (totalCompetitor > 95) {
        const factor = 95 / totalCompetitor
        this.competitors.forEach((c) => {
          c.marketShare = Math.round(c.marketShare * factor * 100) / 100
        })
      }
    },

    // ─── Satisfaction & Churn ───

    /** Appliquer le churn (perte de clients basée sur la satisfaction) */
    applyChurn(): number {
      const satisfaction = this.satisfactionScore
      // Plus la satisfaction est basse, plus le churn est élevé
      const churnMultiplier = satisfaction < 50 ? 2 : satisfaction < 70 ? 1.5 : 1
      const churned = Math.round(this.market.customerBase * this.market.churnRate * churnMultiplier)
      this.market.customerBase = Math.max(0, this.market.customerBase - churned)
      return churned
    },

    /** Mettre à jour la satisfaction */
    updateSatisfaction() {
      this.market.satisfaction = this.satisfactionScore
    },

    // ─── Cycles économiques ───

    /** Avancer le cycle économique */
    advanceEconomicCycle() {
      this.market.cycleMonthsRemaining--
      if (this.market.cycleMonthsRemaining <= 0) {
        // Changer de cycle
        const cycles: Array<'growth' | 'stable' | 'recession'> = ['growth', 'stable', 'recession']
        const currentIdx = cycles.indexOf(this.market.economicCycle)
        const roll = Math.random()
        if (roll < 0.4) {
          this.market.economicCycle = 'stable'
        } else if (roll < 0.7) {
          this.market.economicCycle = 'growth'
        } else {
          this.market.economicCycle = 'recession'
        }
        this.market.cycleMonthsRemaining = Math.floor(Math.random() * 6 + 6) // 6 à 12 mois

        // Mettre à jour les demandes du marché
        this.updateMarketDemands()
      }
    },

    /** Mettre à jour les besoins du marché */
    updateMarketDemands() {
      const specialties: EmployeeSpecialty[] = ['tech', 'sales', 'creative', 'hr', 'management']
      specialties.forEach(s => {
        if (this.market.demands) {
          this.market.demands[s] = Math.floor(Math.random() * 101)
        }
      })
    },

    /** Obtenir le multiplicateur du cycle économique */
    getCycleMultiplier(): number {
      switch (this.market.economicCycle) {
        case 'growth': return 1.2
        case 'recession': return 0.7
        default: return 1.0
      }
    },

    /** Réinitialiser les données de l'entreprise */
    /**
 * Applique un "tick" de simulation (fraction d'un mois)
 * @param dayFraction La portion de mois écoulée (ex: 1/30)
 */
    applyTick(dayFraction: number) {
      // 1. Mise à jour de la trésorerie (Revenus - Dépenses au prorata)
      const monthlyRevenue = this.market.customerBase * this.company.revenuePerCustomer * this.getCycleMultiplier()

      // Part investisseurs
      const investorShare = monthlyRevenue * this.company.investorShare
      const companyRevenue = monthlyRevenue - investorShare

      const monthlyExpenses = this.totalSalaries + this.company.fixedCosts + this.currentOffice.rent + this.totalPerkCosts + this.totalLoanPayments

      const tickProfit = (companyRevenue - monthlyExpenses) * dayFraction
      this.company.cash += tickProfit

      // 2. Fatigue granulaire
      this.employees.forEach(emp => {
        let fatigueGain = 3 // Base

        // Réduction via Equipement
        const equipReduction = (this.company.equipmentLevel - 1) * 0.5
        fatigueGain = Math.max(1, fatigueGain - equipReduction)

        const activePerks = this.availablePerks.filter(p => this.company.activePerks.includes(p.id))
        const reduction = activePerks.reduce((sum, p) => sum + p.fatigueReduction, 0)

        const finalGain = Math.max(0, (fatigueGain - reduction) * dayFraction)
        emp.fatigue = Math.min(100, emp.fatigue + finalGain)

        // Feedback aléatoire (1% de chance par seconde)
        if (Math.random() < 0.01) {
          this.generateEmployeeFeedback(emp.id)
        }

        // 3. Gestion de la formation
        if (emp.trainingDaysRemaining > 0) {
          // On réduit le temps restant (0.1 jour par tick environ si 30 jours/mois)
          // En fait dayFraction est 1/30 si on est au jour.
          emp.trainingDaysRemaining -= dayFraction * 30
          if (emp.trainingDaysRemaining <= 0) {
            emp.trainingDaysRemaining = 0
            emp.skillLevel = Math.min(5, emp.skillLevel + 1)
            emp.motivation = Math.min(100, emp.motivation + 10)
          }
        }
      })

      // 4. Acquisition client granulaire
      const monthlyNew = this.estimatedNewCustomers
      if (monthlyNew > 0) {
        if (Math.random() < (monthlyNew / 30)) {
          this.market.customerBase++
        }
      }
    },

    resetCompany() {
      this.company = {
        ...companyData,
        investorShare: 0,
        equipmentLevel: 1,
      } as Company
      this.employees = employeesData.map((e) => ({ ...e, trainingDaysRemaining: 0, opinions: [] })) as Employee[]
      this.market = {
        ...marketData,
        demands: { tech: 50, sales: 50, creative: 50, hr: 50, management: 50 }
      } as MarketData
      this.marketingBudget = 5000
      this.recruitPool = RECRUIT_POOL.map((c) => ({ ...c }))
      this.offices = officesData.map((o) => ({ ...o })) as Office[]
      this.availablePerks = perksData.map((p) => ({ ...p })) as Perk[]
      this.loans = []
      this.competitors = competitorsData.map((c) => ({ ...c })) as Competitor[]
      this.marketingChannels = channelsData.map((ch) => ({ ...ch })) as MarketingChannel[]
      this.nextLoanId = 1
    },

    /** Envoyer un employé en formation (3 jours) */
    sendToTraining(employeeId: number) {
      const emp = this.employees.find((e) => e.id === employeeId)
      if (emp && emp.trainingDaysRemaining <= 0) {
        const cost = 25000 * emp.skillLevel
        if (this.company.cash >= cost) {
          this.company.cash -= cost
          emp.trainingDaysRemaining = 3
        }
      }
    },

    /** Améliorer l'équipement de bureau */
    upgradeEquipment() {
      const cost = 50000 * this.company.equipmentLevel
      if (this.company.cash >= cost) {
        this.company.cash -= cost
        this.company.equipmentLevel++
      }
    },

    /** Lever des fonds (100k contre 5% d'equity) */
    raiseFunds() {
      const amount = 100000
      const share = 0.05
      this.company.cash += amount
      this.company.investorShare += share
    },

    /** Générer un avis d'employé */
    generateEmployeeFeedback(employeeId: number) {
      const emp = this.employees.find(e => e.id === employeeId)
      if (!emp) return

      const feedbacks = {
        high_fatigue: ["Je suis à bout de nerfs...", "On travaille trop ici.", "Besoin de repos..."],
        low_motivation: ["À quoi bon tout ça ?", "L'ambiance est morose.", "Je vais peut-être chercher ailleurs."],
        high_motivation: ["J'adore ce projet !", "On va conquérir le monde.", "Fier d'être dans l'équipe."],
        perks: ["Merci pour les avantages !", "Le café est super.", "Les bureaux sont cools."],
        training: ["Cette formation m'a ouvert les yeux.", "Je me sens plus fort !"],
        neutral: ["Journée normale au bureau.", "Tout roule.", "Concentré sur mes tâches."]
      }

      let category: keyof typeof feedbacks = 'neutral'
      if (emp.fatigue > 70) category = 'high_fatigue'
      else if (emp.motivation < 30) category = 'low_motivation'
      else if (emp.motivation > 85) category = 'high_motivation'
      else if (this.company.activePerks.length > 2 && Math.random() < 0.3) category = 'perks'
      else if (emp.trainingDaysRemaining > 0) category = 'training'

      const msg = feedbacks[category][Math.floor(Math.random() * feedbacks[category].length)]

      if (!emp.opinions) emp.opinions = []
      emp.opinions.unshift(`[J${Math.floor(Date.now() / 1000) % 30}] ${msg}`)
      if (emp.opinions.length > 5) emp.opinions.pop()
    }
  },
})
