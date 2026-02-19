/**
 * ── Company Store ──
 * Gère les données de l'entreprise : finances, employés, marché, marketing,
 * bureaux, avantages sociaux, prêts, concurrence et canaux marketing
 */
import { defineStore } from 'pinia'
import { useGameStore } from './gameStore'
import type { Company, Employee, MarketData, RecruitCandidate, Office, Perk, Loan, Competitor, MarketingChannel, EmployeeSpecialty, BoardMember, InfrastructureItem, StrategicDecision } from '~/types'
import infrastructureData from '~/mock/infrastructure.json'
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
  boardMembers: BoardMember[]
  infrastructureCatalogue: InfrastructureItem[]
  pendingDecisions: StrategicDecision[]
}

export const useCompanyStore = defineStore('company', {
  state: (): CompanyStoreState => ({
    company: {
      ...companyData,
      investorShare: 0,
      equipmentLevel: 1,
      lastUpgradeMonth: 1,
      isConfigured: false,
      boardSatisfaction: 75,
      ownedInfrastructure: ['pwr-standard', 'net-4g', 'ws-pc-eco'],
      generalScore: 100,
      ceo: {
        firstName: 'Steve',
        lastName: 'Aster',
        gender: 'M',
        appearance: 'casual-1',
        bankBalance: 5000,
      },
      sharePrice: 25000,
      sharePriceHistory: [25000],
    } as Company,
    employees: employeesData.slice(0, 2).map((e) => ({
      ...e,
      trainingDaysRemaining: 0,
      opinions: [],
      isOnStrike: false,
      strikeDuration: 0
    })) as Employee[],
    market: {
      ...marketData,
      demands: { tech: 50, sales: 50, creative: 50, hr: 50, management: 50 },
      organicGrowth: 0,
      lastActionTime: Date.now(),
    } as MarketData,
    marketingBudget: 5000,
    recruitPool: RECRUIT_POOL.map((c) => ({ ...c })),
    offices: officesData.map((o) => ({ ...o })) as Office[],
    availablePerks: perksData.map((p) => ({ ...p })) as Perk[],
    loans: [],
    competitors: competitorsData.map((c) => ({ ...c })) as Competitor[],
    marketingChannels: channelsData.map((ch) => ({ ...ch })) as MarketingChannel[],
    nextLoanId: 1,
    boardMembers: [
      { id: 1, name: 'Jean-Claude Invest', role: 'Investisseur VC', influence: 0.4, satisfaction: 80, personality: 'conservative', icon: '👴', sharePercent: 20, lastVote: 'none' },
      { id: 2, name: 'Fatou Business', role: 'Business Angel', influence: 0.3, satisfaction: 70, personality: 'balanced', icon: '👩‍💼', sharePercent: 10, lastVote: 'none' },
      { id: 3, name: 'Marc Innov', role: 'Expert Tech', influence: 0.3, satisfaction: 75, personality: 'aggressive', icon: '🧔', sharePercent: 5, lastVote: 'none' },
    ],
    infrastructureCatalogue: infrastructureData as InfrastructureItem[],
    pendingDecisions: []
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

    /** Risque de grève (0-100) basé sur fatigue moyenne et manque de perks */
    strikeRisk(): number {
      const fatigueFactor = Math.max(0, this.averageFatigue - 50) * 2 // Augmente après 50% fatigue
      const perkFactor = Math.max(0, 50 - (this.company.activePerks.length * 15)) // Moins de 3 perks = risque
      return Math.min(100, fatigueFactor + perkFactor)
    },

    /** Productivité ajustée par l'infrastructure (dépendances) */
    infrastructureMalus(state: CompanyStoreState): number {
      let malus = 1
      state.company.ownedInfrastructure.forEach(itemId => {
        const item = state.infrastructureCatalogue.find(i => i.id === itemId)
        if (!item) return

        // Vérifier les dépendances
        item.dependencies.forEach(depId => {
          if (!state.company.ownedInfrastructure.includes(depId)) {
            malus *= 0.85 // -15% par dépendance manquante
          }
        })
      })
      return malus
    },

    /** Part détenue par le CEO (1 - investorShare) */
    ceoShare(state: CompanyStoreState): number {
      return 1 - state.company.investorShare
    },

    /** Moyenne de satisfaction du Board */
    boardSatisfaction(state: CompanyStoreState): number {
      return Math.round(state.boardMembers.reduce((s, m) => s + m.satisfaction * m.influence, 0))
    },

    /** Score global de l'entreprise (0-1000) */
    generalScore(state: CompanyStoreState): number {
      const cashScore = Math.min(250, state.company.cash / 2000)
      const employeesScore = state.employees.length * 10
      const motivationScore = (state.employees.reduce((sum, e) => sum + e.motivation, 0) / (state.employees.length || 1)) * 2
      const equipmentScore = state.company.equipmentLevel * 30
      const boardScore = state.company.boardSatisfaction * 2

      return Math.min(1000, Math.round(cashScore + employeesScore + motivationScore + equipmentScore + boardScore))
    },

    /** Capacité de remboursement estimée (30% du revenu) */
    loanRepaymentCapacity(): number {
      const revenue = this.market.customerBase * this.company.revenuePerCustomer * this.productivity
      return revenue * 0.3
    },

    /** Fortune nette du CEO (Cash + Valeur des parts) */
    ceoNetWorth(): number {
      const sharesValue = (1 - this.company.investorShare) * 100 * this.company.sharePrice
      return (this.company.ceo?.bankBalance || 0) + sharesValue
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
        isOnStrike: false,
        strikeDuration: 0,
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

      // Logique de rejet de prêt
      if (this.totalLoanPayments + monthlyPayment > this.loanRepaymentCapacity) {
        return false
      }
      if (this.company.cash < -50000) return false

      this.loans.push({
        id: this.nextLoanId++,
        amount,
        interestRate,
        remainingMonths: months,
        monthlyPayment,
        totalPaid: 0,
      })
      this.company.cash += amount
      return true
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

    /** Appliquer un "tick" de simulation (fraction d'un mois) */
    applyTick(dayFraction: number) {
      const gameStore = useGameStore()
      const cycleMult = this.getCycleMultiplier()

      // Obsolescence & Infrastructure malus
      const monthsSinceUpgrade = gameStore.currentMonth - this.company.lastUpgradeMonth
      const obsolescenceMalus = Math.max(0.5, 1 - (monthsSinceUpgrade * 0.1))
      const infraMalus = this.infrastructureMalus

      const monthlyRevenue = this.market.customerBase
        * this.company.revenuePerCustomer
        * cycleMult
        * this.productivity
        * obsolescenceMalus
        * infraMalus

      // Part investisseurs (Calculé sur le CA avant tout)
      const investorShare = monthlyRevenue * this.company.investorShare
      const companyRevenue = monthlyRevenue - investorShare

      // Coûts fixes infra
      const monthlyInfraCosts = this.company.ownedInfrastructure.reduce((sum: number, id: string) => {
        const item = this.infrastructureCatalogue.find(i => i.id === id)
        return sum + (item?.monthlyCost || 0)
      }, 0)

      const monthlyExpenses = this.totalSalaries
        + this.company.fixedCosts
        + this.currentOffice.rent
        + this.totalPerkCosts
        + this.totalLoanPayments
        + monthlyInfraCosts

      const tickProfit = (companyRevenue - monthlyExpenses) * dayFraction
      this.company.cash += tickProfit

      // Si cash est négatif, le Board perd 1 point de satisfaction par seconde
      if (this.company.cash < 0) {
        this.boardMembers.forEach(m => m.satisfaction = Math.max(0, m.satisfaction - 0.1))
      }

      // 2. Gestion HR Hardcore : Grèves & Rebellion
      const strikeRisk = this.strikeRisk / 100 // 0.0 to 1.0
      let strikeCount = 0

      this.employees.forEach(emp => {
        // Progression de la fatigue
        let fatigueGain = 3
        const equipReduction = (this.company.equipmentLevel - 1) * 0.5
        fatigueGain = Math.max(1, fatigueGain - equipReduction)
        const activePerks = this.availablePerks.filter(p => this.company.activePerks.includes(p.id))
        const reduction = activePerks.reduce((sum, p) => sum + p.fatigueReduction, 0)
        const finalGain = Math.max(0, (fatigueGain - reduction) * dayFraction)
        emp.fatigue = Math.min(100, emp.fatigue + finalGain)

        // Logique de Grève (Check par seconde)
        if (!emp.isOnStrike && emp.fatigue > 70 && Math.random() < (strikeRisk * 0.01)) {
          emp.isOnStrike = true
          this.generateEmployeeFeedback(emp.id) // "Je me mets en grève !"
        }

        if (emp.isOnStrike) {
          strikeCount++
          emp.strikeDuration += 1 // incrément par seconde (approximatif)
          emp.motivation = Math.max(0, emp.motivation - 0.5) // Désespoir

          // Démission après 2 minutes de grève (120s)
          if (emp.strikeDuration > 120) {
            this.fireEmployee(emp.id)
            gameStore.triggerEvent({
              id: 99,
              name: "Démission Brutale",
              description: `${emp.name} a quitté le navire après une grève épuisante.`,
              type: "employee_departure",
              impactValue: 0,
              icon: "🚶",
              probability: 1
            })
          }
        }

        // Feedback aléatoire
        if (Math.random() < 0.01) {
          this.generateEmployeeFeedback(emp.id)
        }

        // Gestion de la formation
        if (emp.trainingDaysRemaining > 0) {
          emp.trainingDaysRemaining -= dayFraction * 30
          if (emp.trainingDaysRemaining <= 0) {
            emp.trainingDaysRemaining = 0
            emp.skillLevel = Math.min(5, emp.skillLevel + 1)
            emp.motivation = Math.min(100, emp.motivation + 10)
          }
        }
      })

      // Effet Domino : Les grévistes plombent le moral des autres
      if (strikeCount > 0) {
        this.employees.forEach(e => {
          if (!e.isOnStrike) e.motivation = Math.max(5, e.motivation - (strikeCount * 0.1))
        })
      }

      // 3. Volatilité du Marché & Inaction
      // Si aucune action majeure (quêtes complétées) depuis 10 min (600s)
      const secondsSinceAction = (Date.now() - this.market.lastActionTime) / 1000
      if (secondsSinceAction > 600) {
        // Déclin organique : -0.1% de clients par seconde
        const decline = Math.max(1, Math.round(this.market.customerBase * 0.001))
        this.market.customerBase -= decline
        this.market.organicGrowth = -0.01
      } else {
        this.market.organicGrowth = 0.001 // Croissance légère
      }

      // Acquisition client
      const monthlyNew = this.estimatedNewCustomers
      if (monthlyNew > 0) {
        if (Math.random() < (monthlyNew / 3600)) { // recalibré pour 1h
          this.market.customerBase++
        }
      }
    },

    /** Acheter une infrastructure / équipement */
    purchaseInfrastructure(itemId: string) {
      const item = this.infrastructureCatalogue.find(i => i.id === itemId)
      if (!item || this.company.ownedInfrastructure.includes(itemId)) return

      if (this.company.cash >= item.cost) {
        this.company.cash -= item.cost
        this.company.ownedInfrastructure.push(itemId)

        // Risque de panne immédiate si item risqué
        if (item.risky && Math.random() < (item.failureRate || 0)) {
          const gameStore = useGameStore()
          gameStore.triggerEvent({
            id: 110,
            name: "Panne Infrastructure",
            description: `Le matériel ${item.name} vient de griller. Installation défectueuse !`,
            type: "loss",
            impactValue: item.cost * 0.5,
            icon: "💥",
            probability: 1
          })
          // On retire l'item s'il est mort
          this.company.ownedInfrastructure = this.company.ownedInfrastructure.filter(id => id !== itemId)
        }
      }
    },

    /** Soumettre une décision au Board */
    submitStrategicDecision(decision: StrategicDecision) {
      // Calculer l'accord du Board et enregistrer les votes
      let totalApproval = 0
      this.boardMembers.forEach(m => {
        let memberScore = m.satisfaction
        if (decision.risk > 0.5 && m.personality === 'conservative') memberScore -= 20
        if (decision.risk > 0.5 && m.personality === 'aggressive') memberScore += 10

        const approved = memberScore >= 50
        m.lastVote = approved ? 'yes' : 'no'

        if (approved) totalApproval += m.influence
      })

      const approvalScore = (totalApproval / this.boardMembers.reduce((s, m) => s + m.influence, 0)) * 100

      if (approvalScore >= (decision.boardSupport || 50)) {
        // Appliquer impacts
        if (decision.impacts.cash) this.updateCash(decision.impacts.cash)
        if (decision.impacts.marketShare) {
          this.market.customerBase += Math.round(this.market.customerBase * (decision.impacts.marketShare / 100))
        }
        this.boardMembers.forEach(m => {
          if (m.lastVote === 'yes') m.satisfaction = Math.min(100, m.satisfaction + 5)
          else m.satisfaction = Math.max(0, m.satisfaction - 2)
        })
        return true
      } else {
        // Rejet
        this.boardMembers.forEach(m => {
          if (m.lastVote === 'no') m.satisfaction = Math.min(100, m.satisfaction + 2)
          else m.satisfaction = Math.max(0, m.satisfaction - 10)
        })
        return false
      }
    },

    resetCompany() {
      this.company = {
        ...companyData,
        investorShare: 0,
        equipmentLevel: 1,
        lastUpgradeMonth: 1,
        isConfigured: false,
        boardSatisfaction: 75,
        ownedInfrastructure: ['pwr-standard', 'net-4g', 'ws-pc-eco'],
        generalScore: 100,
        ceo: {
          firstName: 'Steve',
          lastName: 'Aster',
          gender: 'M',
          appearance: 'casual-1',
          bankBalance: 5000,
        },
        sharePrice: 25000,
        sharePriceHistory: [25000],
      } as Company
      this.employees = employeesData.slice(0, 2).map((e) => ({
        ...e,
        trainingDaysRemaining: 0,
        opinions: [],
        isOnStrike: false,
        strikeDuration: 0
      })) as Employee[]
      this.market = {
        ...marketData,
        demands: { tech: 50, sales: 50, creative: 50, hr: 50, management: 50 },
        organicGrowth: 0,
        lastActionTime: Date.now(),
      } as MarketData
      this.marketingBudget = 5000
      this.recruitPool = RECRUIT_POOL.map((c) => ({ ...c }))
      this.offices = officesData.map((o) => ({ ...o })) as Office[]
      this.availablePerks = perksData.map((p) => ({ ...p })) as Perk[]
      this.loans = []
      this.competitors = competitorsData.map((c) => ({ ...c })) as Competitor[]
      this.marketingChannels = channelsData.map((ch) => ({ ...ch })) as MarketingChannel[]
      this.nextLoanId = 1
      this.boardMembers = [
        { id: 1, name: 'Jean-Claude Invest', role: 'Investisseur VC', influence: 0.4, satisfaction: 80, personality: 'conservative', icon: '👴', sharePercent: 0, lastVote: 'none' },
        { id: 2, name: 'Fatou Business', role: 'Business Angel', influence: 0.3, satisfaction: 70, personality: 'balanced', icon: '👩‍💼', sharePercent: 0, lastVote: 'none' },
        { id: 3, name: 'Marc Innov', role: 'Expert Tech', influence: 0.3, satisfaction: 75, personality: 'aggressive', icon: '🧔', sharePercent: 0, lastVote: 'none' },
      ]
      this.company.ownedInfrastructure = ['pwr-standard', 'net-4g', 'ws-pc-eco']
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
      const gameStore = useGameStore()
      const cost = 50000 * this.company.equipmentLevel
      if (this.company.cash >= cost) {
        this.company.cash -= cost
        this.company.equipmentLevel++
        this.company.lastUpgradeMonth = gameStore.currentMonth
      }
    },

    /** Lever des fonds (100k contre 5% d'equity) */
    raiseFunds() {
      const gameStore = useGameStore()

      // Blocage Social
      if (this.strikeRisk > 40) {
        gameStore.triggerEvent({
          id: 98,
          name: "Investissement Refusé",
          description: "Les investisseurs s'inquiètent de la grève imminente et du climat social délétère.",
          type: "loss",
          impactValue: 0,
          icon: "🚫",
          probability: 1
        })
        return
      }

      // Blocage Gouvernance
      if (this.boardSatisfaction < 50) {
        gameStore.triggerEvent({
          id: 111,
          name: "Board en Colère",
          description: "Le Conseil refuse de diluer le capital tant que les résultats ne s'améliorent pas.",
          type: "loss",
          impactValue: 0,
          icon: "😤",
          probability: 1
        })
        return
      }

      const amount = 100000
      const share = 0.05
      this.company.cash += amount
      this.company.investorShare += share

      // Ajouter un nouvel actionnaire
      const newId = this.boardMembers.length + 1
      const personalities: ('conservative' | 'aggressive' | 'balanced')[] = ['conservative', 'aggressive', 'balanced']
      this.boardMembers.push({
        id: newId,
        name: `Investisseur #${newId}`,
        role: 'Capital Risqueur',
        influence: 0.1,
        satisfaction: 80,
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        icon: '🏦',
        sharePercent: 5,
        lastVote: 'none'
      })

      // Impact sur le board : soulagement ou méfiance
      this.boardMembers.forEach(m => {
        m.satisfaction = Math.min(100, m.satisfaction + 10)
        // Mais dilution = perte de contrôle (influence relative diminue)
        if (m.id !== newId) m.influence *= 0.95
      })

      gameStore.triggerEvent({
        id: 112,
        name: "Levée de fonds réussie",
        description: `100k FCFA injectés. Un nouvel investisseur rejoint le board (5%).`,
        type: "gain",
        impactValue: amount,
        icon: "💰",
        probability: 1
      })
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
        neutral: ["Journée normale au bureau.", "Tout roule.", "Concentré sur mes tâches."],
        threat: ["Menace : Si ça ne s'améliore pas, je propose un débrayage.", "Revendication : Mon salaire n'est plus compétitif."],
      }

      let category: keyof typeof feedbacks = 'neutral'
      if (emp.isOnStrike) category = 'high_fatigue'
      else if (emp.fatigue > 70) category = 'high_fatigue'
      else if (emp.motivation < 30) category = 'threat'
      else if (emp.motivation < 45) category = 'low_motivation'
      else if (emp.motivation > 85) category = 'high_motivation'
      else if (this.company.activePerks.length > 2 && Math.random() < 0.3) category = 'perks'
      else if (emp.trainingDaysRemaining > 0) category = 'training'

      const msg = feedbacks[category][Math.floor(Math.random() * feedbacks[category].length)]

      if (!emp.opinions) emp.opinions = []
      emp.opinions.unshift(`[Mois ${useGameStore().currentMonth}] ${msg}`)
      if (emp.opinions.length > 5) emp.opinions.pop()
    },

    // ── Actions d'Actionnariat ──

    /** Racheter les parts d'un actionnaire */
    buyShares(memberId: number, percent: number) {
      const member = this.boardMembers.find(m => m.id === memberId)
      if (!member || !this.company.ceo) return false

      const cost = percent * this.company.sharePrice
      if (this.company.ceo.bankBalance < cost) return false
      if (member.sharePercent < percent) return false

      this.company.ceo.bankBalance -= cost
      member.sharePercent -= percent
      this.company.investorShare -= (percent / 100)

      if (member.sharePercent <= 0) {
        this.boardMembers = this.boardMembers.filter(m => m.id !== memberId)
      }
      return true
    },

    /** Vendre des parts au Board (le CEO récupère du cash perso) */
    sellShares(percent: number) {
      if (!this.company.ceo) return false
      const currentCeoShare = (1 - this.company.investorShare) * 100
      if (currentCeoShare - percent < 10) return false // Le CEO doit garder 10%

      const gain = percent * this.company.sharePrice * 0.9 // 10% de frais de transaction
      this.company.ceo.bankBalance += gain
      this.company.investorShare += (percent / 100)

      // Dilution chez les investisseurs existants
      const major = this.boardMembers[0]
      if (major) {
        major.sharePercent += percent
      }
      return true
    },

    /** Mettre à jour le cours de l'action (basé sur la performance) */
    updateSharePrice() {
      const baseValue = 25000
      const performanceFactor = Math.max(0.5, 1 + (this.company.cash / 500000))
      const growthFactor = 0.5 + (this.market.satisfaction / 100)

      this.company.sharePrice = Math.round(baseValue * performanceFactor * growthFactor)
      this.company.sharePriceHistory.push(this.company.sharePrice)
      if (this.company.sharePriceHistory.length > 24) this.company.sharePriceHistory.shift()
    },

    /** Appliquer la dépréciation du matériel */
    applyDepreciation() {
      // Simule l'obsolescence après 12 mois sans upgrade majeur
      const monthsSinceUpgrade = useGameStore().currentMonth - this.company.lastUpgradeMonth
      if (monthsSinceUpgrade > 12) {
        // Impact direct sur la productivité (vision simplifiée)
      }
    },

    /** Actions autonomes des actionnaires (si insatisfaits ou opportunistes) */
    runAutonomousBoardDecisions() {
      this.boardMembers.forEach(member => {
        // Un actionnaire insatisfait (> 15% parts) peut tenter une pression
        if (member.satisfaction < 30 && member.sharePercent > 15 && Math.random() < 0.2) {
          useGameStore().triggerEvent({
            id: 200 + member.id,
            name: `Pression de ${member.name}`,
            description: `${member.name} exige une réduction immédiate des coûts opérationnels.`,
            probability: 1,
            type: 'loss',
            impactValue: 5000,
            icon: '👔'
          })
          member.satisfaction += 10 // Il se sent entendu
        }

        // Un actionnaire très content peut injecter un petit bonus
        if (member.satisfaction > 90 && Math.random() < 0.05) {
          useGameStore().triggerEvent({
            id: 300 + member.id,
            name: `Cadeau de ${member.name}`,
            description: `Ravi des performances, ${member.name} offre un bonus à la trésorerie.`,
            probability: 1,
            type: 'gain',
            impactValue: 10000,
            icon: '🎁'
          })
        }
      })
    },
  },
})
