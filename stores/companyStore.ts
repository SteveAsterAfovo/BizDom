/**
 * ── Company Store ──
 * Gère les données de l'entreprise : finances, employés, marché, marketing,
 * bureaux, avantages sociaux, prêts, concurrence et canaux marketing
 */
import { defineStore } from 'pinia'
import { useGameStore } from './gameStore'
import type { Company, Employee, MarketData, RecruitCandidate, Office, Perk, Loan, Competitor, MarketingChannel, EmployeeSpecialty, BoardMember, InfrastructureItem, StrategicDecision, Project, MarketClaim, TemporaryBoost } from '~/types'
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
  activeProjects: Project[]
  marketClaims: MarketClaim[]
  temporaryBoosts: TemporaryBoost[]
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
      level: 1
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
    offices: officesData.map((o: any, idx: number) => ({ ...o, minBusinessLevel: idx * 2 })) as Office[],
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
    infrastructureCatalogue: (infrastructureData as InfrastructureItem[]).map(i => ({ ...i, condition: 100 })),
    pendingDecisions: [],
    activeProjects: [],
    marketClaims: [],
    temporaryBoosts: []
  }),

  getters: {
    /** Total des salaires mensuels */
    totalSalaries: (state: any): number =>
      state.employees.reduce((sum: number, e: any) => sum + e.salary, 0),

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
        // Bonus Temporaires (Fatigue)
        const fatigueReduction = state.temporaryBoosts
          .filter((b: TemporaryBoost) => b.type === 'fatigue')
          .reduce((sum: number, b: TemporaryBoost) => sum + b.value, 0)

        const effectiveFatigue = Math.max(0, e.fatigue - fatigueReduction)
        const fatiguePenalty = 1 - (effectiveFatigue / 200) // fatigue 100 = -50% productivité
        return sum + (e.skillLevel * (e.motivation / 100) * fatiguePenalty)
      }, 0)

      // Bonus Temporaires (Motivation)
      const motivationBoost = state.temporaryBoosts
        .filter((b: TemporaryBoost) => b.type === 'motivation')
        .reduce((sum: number, b: TemporaryBoost) => sum + b.value, 0)

      // Bonus de spécialité (Management)
      const managers = activeEmployees.filter((e) => e.specialty === 'management')
      const managementBonus = 1 + (managers.length * 0.05)

      return (total / activeEmployees.length) * managementBonus * (1 + (motivationBoost / 100))
    },

    /** Motivation globale pondérée (incluant boosts) */
    globalMotivation: (state: any): number => {
      if (state.employees.length === 0) return 100
      const baseAvg = state.employees.reduce((sum: number, e: any) => sum + e.motivation, 0) / state.employees.length
      const boost = state.temporaryBoosts
        .filter((b: any) => b.type === 'motivation')
        .reduce((sum: number, b: any) => sum + b.value, 0)
      return Math.min(100, baseAvg + boost)
    },

    /** Fatigue globale pondérée (incluant réductions) */
    globalFatigue: (state: any): number => {
      if (state.employees.length === 0) return 0
      const baseAvg = state.employees.reduce((sum: number, e: any) => sum + e.fatigue, 0) / state.employees.length
      const reduction = state.temporaryBoosts
        .filter((b: any) => b.type === 'fatigue')
        .reduce((sum: number, b: any) => sum + b.value, 0)
      return Math.max(0, baseAvg - reduction)
    },

    /** Bonus de motivation total pour UI */
    totalMotivationBoost: (state: any): number => {
      return state.temporaryBoosts
        .filter((b: any) => b.type === 'motivation')
        .reduce((sum: number, b: any) => sum + b.value, 0)
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
      const baseRisk = Math.min(100, fatigueFactor + perkFactor)
      // Bruit visuel pour le "temps réel" (±1%)
      const noise = (Math.random() - 0.5) * 2
      return Math.min(100, Math.max(0, baseRisk + noise))
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

    /** Part réelle du CEO (100% - part des membres du board) */
    ceoShare(state: CompanyStoreState): number {
      const boardShares = state.boardMembers.reduce((sum, m) => sum + m.sharePercent, 0)
      return Math.max(0, 100 - boardShares)
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
      const sharesValue = this.ceoShare * this.company.sharePrice
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

    /** Déménager vers un nouveau bureau (avec restriction de niveau) */
    upgradeOffice(officeId: number) {
      const office = this.offices.find((o) => o.id === officeId)
      if (!office) return

      // Restriction par niveau
      if (this.company.level < office.minBusinessLevel) {
        useGameStore().triggerEvent({
          id: 998,
          name: "Prestige Insuffisant",
          description: `Votre bureau actuel est insuffisant. Ce nouveau siège require le niveau de business ${office.minBusinessLevel}.`,
          type: "loss",
          impactValue: 0,
          icon: "🚫",
          probability: 1
        })
        return
      }

      const cost = office.rent * 5 // Frais d'installation augmentés
      if (this.company.cash >= cost) {
        this.company.cash -= cost
        this.company.currentOfficeId = officeId
      }
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

    /** Acheter un boost temporaire */
    buyBoost(perkId: number, duration: number) {
      const perk = this.availablePerks.find(p => p.id === perkId)
      if (!perk) return

      const totalCost = perk.cost * duration
      if (this.company.cash < totalCost) return

      this.company.cash -= totalCost

      const type = (perk.motivationBoost > 0) ? 'motivation' : 'fatigue'
      const value = type === 'motivation' ? perk.motivationBoost : perk.fatigueReduction

      this.temporaryBoosts.push({
        id: `boost-${perkId}-${Date.now()}`,
        type: type as 'motivation' | 'fatigue',
        value,
        remainingDays: duration,
        cost: totalCost
      })
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
      if (!this.market.demands) return
      const specialties: EmployeeSpecialty[] = ['tech', 'sales', 'creative', 'hr', 'management']
      specialties.forEach(s => {
        // Fluctuations plus organiques (±2 points par tick max)
        const current = this.market.demands[s] || 50
        const shift = Math.floor((Math.random() - 0.5) * 4)
        this.market.demands[s] = Math.min(100, Math.max(0, current + shift))
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

      // Gérer les appels d'offres (expiration/apparition)
      this.manageProjectTenders()

      // 1. Obsolescence et Usure (mensuelle)
      this.infrastructureCatalogue.forEach(item => {
        if (this.company.ownedInfrastructure.includes(item.id)) {
          // Usure naturelle (1% par mois environ)
          item.condition = Math.max(0, item.condition - (1 * dayFraction))
        }
      })

      // 2. Progression des Projets & Expiration
      this.activeProjects.forEach((project: Project, idx) => {
        // Expiration des appels d'offres (pending sans équipe assignée)
        if (project.status === 'pending' && project.assignedEmployees.length === 0 && project.expiresAt) {
          if (Date.now() > project.expiresAt) {
            // Supprimer le projet expiré
            this.activeProjects.splice(idx, 1)
            return
          }
        }

        if (project.status === 'active') {
          const assigned = this.employees.filter(e => project.assignedEmployees.includes(e.id))
          if (assigned.length > 0) {
            // Efficacité basée sur Skill (base) + Motivation (boost) - Fatigue (malus)
            // Normalisation : un skill moyen de 2.5 avec eff de 1.0 avance au rythme nominal (duration)
            const avgSkill = assigned.reduce((s, e) => s + e.skillLevel, 0) / assigned.length
            const avgMotivation = assigned.reduce((s, e) => s + e.motivation, 0) / assigned.length
            const avgFatigue = assigned.reduce((s, e) => s + e.fatigue, 0) / assigned.length

            // Calcul du multiplicateur d'efficacité (0.5 à 1.5)
            const motivationFactor = 0.5 + (avgMotivation / 100)
            const fatigueFactor = 1 - (avgFatigue / 200)
            const efficiency = motivationFactor * fatigueFactor

            // On multiplie par (avgSkill / 2.5) pour que Skill 5 = 2x speed, Skill 1 = 0.4x speed
            const skillMultiplier = avgSkill / 2.5
            const totalEff = efficiency * skillMultiplier

            // 1 mois = 30 jours. On veut que project.duration (en jours) soit respecté si totalEff = 1
            // progress total = 100. duration_en_mois = duration / 30.
            // On doit gagner 100 / (duration / 30) % par MOIS.
            // Par tick : (100 / (project.duration / 30)) * dayFraction * totalEff
            const progressStep = (3000 / project.duration) * dayFraction * totalEff
            project.progress = Math.min(100, project.progress + progressStep)

            if (project.progress >= 100) {
              project.status = 'completed'
              this.company.cash += project.reward
              this.boardMembers.forEach(m => m.satisfaction = Math.min(100, m.satisfaction + (project.shareholderOpinion || 0)))

              // Progression du niveau
              this.checkLevelUp()

              gameStore.triggerEvent({
                id: 600,
                name: "Projet Terminé !",
                description: `Le projet ${project.title} est un succès. Gains: ${project.reward} FCFA`,
                type: "gain",
                impactValue: project.reward,
                icon: "🚀",
                probability: 1
              })
            }
          }
          // Coût de fonctionnement
          this.company.cash -= (project.budget / 30) * dayFraction
        }
      })
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

        // Micro-fluctuations de motivation (Bruit émotionnel)
        const emotionalJitter = (Math.random() - 0.5) * 0.2
        // Dégradation progressive si fatigue élevée (> 60)
        const fatigueDecay = emp.fatigue > 60 ? (emp.fatigue - 60) * 0.01 : 0
        emp.motivation = Math.min(100, Math.max(0, emp.motivation + emotionalJitter - (fatigueDecay * dayFraction * 30)))

        // Logique de Grève (Check par seconde)
        // PROTECT: Un employé sur un projet actif ne peut pas partir/se mettre en grève bloquante
        const isOnActiveProject = this.activeProjects.some(p => p.status === 'active' && p.assignedEmployees.includes(emp.id))

        if (!emp.isOnStrike && emp.fatigue > 70 && !isOnActiveProject && Math.random() < (strikeRisk * 0.01)) {
          emp.isOnStrike = true
          this.generateEmployeeFeedback(emp.id) // "Je me mets en grève !"
        }

        if (emp.isOnStrike) {
          strikeCount++
          emp.strikeDuration += 1 // incrément par seconde (approximatif)
          emp.motivation = Math.max(0, emp.motivation - 0.5) // Désespoir

          // Démission après 2 minutes de grève (120s) - Sauf si sur projet critique
          if (emp.strikeDuration > 120 && !isOnActiveProject) {
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

      // 4. Volatilité du Marché (Fluctuations réelles)
      this.competitors.forEach(c => {
        // Variation aléatoire augmentée pour visibilité : entre -0.5% et +0.5% par tick
        const jitter = (Math.random() - 0.5) * 0.5 * (dayFraction * 3600) // dayFraction * 3600 est environ 1 si tick=1s
        c.marketShare = Math.max(1, Math.min(45, c.marketShare + jitter))
      })

      // 5. Volatilité Finance (Share Price évolue par seconde)
      const scoreTrend = (this.generalScore / 500) - 1 // -1 to 1 range approx
      const priceJitter = (Math.random() - 0.5) * 50 + (scoreTrend * 20)
      this.company.sharePrice = Math.max(1000, this.company.sharePrice + (priceJitter * dayFraction))

      // 6. Croissance Organique Fluctuante & Demandes
      const growthJitter = (Math.random() - 0.5) * 0.0005
      this.market.organicGrowth = Math.max(-0.01, Math.min(0.01, this.market.organicGrowth + growthJitter))
      this.updateMarketDemands()
      // Acquisition client
      const monthlyNew = this.estimatedNewCustomers
      if (monthlyNew > 0) {
        if (Math.random() < (monthlyNew / 3600)) { // recalibré pour 1h
          this.market.customerBase++
        }
      }

      // 4. Gestion des Boosts Temporaires
      this.temporaryBoosts = this.temporaryBoosts.filter((boost: TemporaryBoost) => {
        boost.remainingDays -= (dayFraction * 30)
        return boost.remainingDays > 0
      })

      // 5. Détérioration des Infrastructures
      this.infrastructureCatalogue.forEach(item => {
        if (this.company.ownedInfrastructure.includes(item.id)) {
          // Détérioration progressive : ~1% par mois (30 jours)
          const deterioration = (dayFraction * 30) * 0.033
          item.condition = Math.max(0, item.condition - deterioration)
        }
      })

      // 6. Appels d'offres dynamiques (Chance de nouveau projet si < 5 actifs)
      if (this.activeProjects.length < 5 && Math.random() < (dayFraction * 0.5)) {
        this.generateProject()
      }

      // 7. Décisions autonomes du Board
      this.runAutonomousBoardDecisions()
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
        level: 1
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
    // ─── GOUVERNANCE & CAPITAL ───

    /** Racheter des parts aux investisseurs */
    buybackShares(memberId: number) {
      const member = this.boardMembers.find(m => m.id === memberId)
      if (!member) return

      const cost = member.sharePercent * this.company.sharePrice * 0.8 // Prix avec décote rachat

      // Rejet si satisfaction trop basse
      if (member.satisfaction < 50) {
        const gameStore = useGameStore()
        gameStore.triggerEvent({
          id: 501,
          name: "Rachat Refusé",
          description: `${member.name} refuse catégoriquement de céder ses parts. Sa satisfaction est trop basse.`,
          type: "loss",
          impactValue: 0,
          icon: "🚫",
          probability: 1
        })
        return
      }

      if (this.company.cash >= cost) {
        this.company.cash -= cost
        // Supprimer du board s'il n'a plus de parts
        this.boardMembers = this.boardMembers.filter(m => m.id !== memberId)

        const gameStore = useGameStore()
        gameStore.triggerEvent({
          id: 500,
          name: "Rachat de parts",
          description: `Vous avez racheté les parts de ${member.name}. Vous reprenez le contrôle !`,
          type: "gain",
          impactValue: cost,
          icon: "🤝",
          probability: 1
        })
      }
    },

    // ─── PROJETS & PRODUCTION ───

    /** Générer un nouveau projet aléatoire */
    generateProject() {
      const ids = ['p-crm', 'p-ai', 'p-saas', 'p-mobile', 'p-blockchain']
      const titles = ['Refonte CRM 2.0', 'Module IA Prédictive', 'SaaS E-commerce', 'App Mobile Livreur', 'Smart Contract Tool']
      const idx = Math.floor(Math.random() * ids.length)

      const newProject: Project = {
        id: `${ids[idx]}-${Date.now()}`,
        title: titles[idx],
        description: "Un projet stratégique pour augmenter nos revenus. Attention aux délais !",
        duration: 20 + Math.floor(Math.random() * 30),
        progress: 0,
        cost: 10000 + Math.floor(Math.random() * 20000),
        budget: 5000 + Math.floor(Math.random() * 10000),
        teamSize: 3 + Math.floor(Math.random() * 4),
        requiredSkills: { tech: 2, sales: 0, creative: 0, hr: 0, management: 1 },
        requiredSpecialties: {
          tech: 2 + Math.floor(Math.random() * 2),
          creative: Math.random() > 0.5 ? 1 : 0,
          management: 1
        },
        reward: 150000 + Math.floor(Math.random() * 200000),
        penalty: 50000,
        status: 'pending',
        shareholderOpinion: 8,
        assignedEmployees: [],
        expiresAt: Date.now() + (Math.floor(Math.random() * 3) + 2) * 24 * 60 * 60 * 1000 // 2 à 5 jours
      }

      this.activeProjects.push(newProject)
    },

    assignEmployeesToProject(projectId: string, employeeIds: number[]) {
      const project = this.activeProjects.find((p: Project) => p.id === projectId)
      if (!project) return

      // Validation de l'exclusivité : un employé ne peut pas être sur deux projets à la fois
      const otherActiveProjects = this.activeProjects.filter(p => p.id !== projectId && p.status !== 'completed')
      const alreadyAssignedIds = otherActiveProjects.flatMap(p => p.assignedEmployees)

      const filteredEmployeeIds = employeeIds.filter(id => !alreadyAssignedIds.includes(id))
      project.assignedEmployees = filteredEmployeeIds

      // Validation de la composition de l'équipe
      const assigned = this.employees.filter(e => filteredEmployeeIds.includes(e.id))

      let isValid = true
      const reqSpecs = project.requiredSpecialties

      for (const [spec, count] of Object.entries(reqSpecs)) {
        const assignedCount = assigned.filter(e => e.specialty === spec).length
        if (assignedCount < (count as number)) {
          isValid = false
          break
        }
      }

      if (isValid && assigned.length >= project.teamSize) {
        // Le projet est prêt, mais on attend le clic manuel pour "active"
        project.status = 'pending'
      } else {
        project.status = 'pending'
      }
    },

    // ─── MAINTENANCE ───
    repairInfrastructure(itemId: string) {
      const item = this.infrastructureCatalogue.find(i => i.id === itemId)
      if (item && item.condition < 100) {
        // Coût dynamique : 10 FCFA par % de santé manquante, minimum 50
        const cost = Math.max(50, Math.round((100 - item.condition) * 10))
        if (this.company.cash >= cost) {
          this.company.cash -= cost
          item.condition = 100
        }
      }
    },

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
      const shareVal = 5 // 5%
      this.company.cash += amount
      this.company.investorShare += (shareVal / 100)

      const isNew = Math.random() < 0.6
      let stakeholderName = ""

      if (isNew || this.boardMembers.length === 0) {
        // Ajouter un nouvel actionnaire
        const newId = Math.max(0, ...this.boardMembers.map(m => m.id)) + 1
        stakeholderName = `Investisseur #${newId}`
        const personalities: ('conservative' | 'aggressive' | 'balanced')[] = ['conservative', 'aggressive', 'balanced']
        this.boardMembers.push({
          id: newId,
          name: stakeholderName,
          role: 'Capital Risqueur',
          influence: 0.1,
          satisfaction: 80,
          personality: personalities[Math.floor(Math.random() * personalities.length)],
          icon: '🏦',
          sharePercent: shareVal,
          lastVote: 'none'
        })
      } else {
        // Augmenter un existant
        const existing = this.boardMembers[Math.floor(Math.random() * this.boardMembers.length)]
        existing.sharePercent += shareVal
        existing.satisfaction = Math.min(100, existing.satisfaction + 15)
        stakeholderName = existing.name
      }

      // Impact sur le board : dilution = perte de contrôle (influence relative diminue)
      this.boardMembers.forEach(m => {
        if (m.name !== stakeholderName) {
          m.satisfaction = Math.min(100, m.satisfaction + 5)
          m.influence *= 0.95
        }
      })

      gameStore.triggerEvent({
        id: 112,
        name: "Levée de fonds réussie",
        description: `100k FCFA injectés. ${stakeholderName} a pris ou augmenté sa participation de 5%.`,
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
    buySharesFromMember(memberId: number, percent: number) {
      const member = this.boardMembers.find(m => m.id === memberId)
      if (!member || !this.company.ceo) return false

      const cost = percent * this.company.sharePrice
      if (this.company.ceo.bankBalance < cost) return false
      if (member.sharePercent < percent) return false

      // Refus si satisfaction basse ou si c'est un "agressif" qui veut garder son pouvoir
      let refusalProb = member.satisfaction < 40 ? 0.7 : 0.1
      if (member.personality === 'aggressive') refusalProb += 0.2

      if (Math.random() < refusalProb) {
        useGameStore().triggerEvent({
          id: 771,
          name: "Actionnaire Hostile",
          description: `${member.name} refuse de vous céder ses parts. "Je préfère garder mon influence".`,
          type: "loss",
          impactValue: 0,
          icon: "🚫",
          probability: 1
        })
        return false
      }

      this.company.ceo.bankBalance -= cost
      member.sharePercent -= percent
      member.satisfaction = Math.max(0, member.satisfaction - 5)
      return true
    },

    sellSharesToMember(memberId: number, percent: number) {
      const member = this.boardMembers.find(m => m.id === memberId)
      // LIMITE CEO : Toujours garder au moins 20%
      if (!member || this.ceoShare - percent < 20 || !this.company.ceo) return false

      const gain = percent * this.company.sharePrice * 0.9 // 10% frais
      this.company.ceo.bankBalance += gain
      member.sharePercent += percent
      member.satisfaction = Math.min(100, member.satisfaction + 10) // Plus d'influence = plus content

      return true
    },

    /** Vendre des parts au marché (général) */
    sellSharesToMarket(percent: number) {
      // LIMITE CEO : Toujours garder au moins 20%
      if (!this.company.ceo || this.ceoShare - percent < 20) return false

      const gain = percent * this.company.sharePrice * 0.85 // 15% frais pour appel public
      this.company.ceo.bankBalance += gain
      // Nouvel actionnaire aléatoire
      const newId = Math.max(0, ...this.boardMembers.map(m => m.id)) + 1
      this.boardMembers.push({
        id: newId,
        name: `Investisseur #${newId}`,
        role: 'Associé Passif',
        influence: 0.1,
        satisfaction: 70,
        personality: 'balanced',
        icon: '👥',
        sharePercent: percent,
        lastVote: 'none'
      })
      return true
    },

    /** Soumettre une décision stratégique avec résistance du Board */
    submitStrategicDecision(decision: StrategicDecision): boolean {
      let yesVotes = 0
      let totalShares = 0

      this.boardMembers.forEach(member => {
        totalShares += member.sharePercent

        // Logique de vote : Satisfaction + Personnalité vs Risque
        let baseProb = member.satisfaction / 100
        if (member.personality === 'conservative') baseProb -= (decision.risk * 0.6)
        if (member.personality === 'aggressive') baseProb += (decision.risk * 0.4)

        const roll = Math.random()
        if (roll < baseProb) {
          member.lastVote = 'yes'
          yesVotes += member.sharePercent
        } else if (roll < baseProb + 0.15) {
          member.lastVote = 'abstain'
        } else {
          member.lastVote = 'no'
        }
      })

      // Majorité relative des parts votantes (simplifié : % de parts favorables > % défavorables)
      const approved = yesVotes > (totalShares * 0.5)

      if (approved) {
        // Appliquer impacts
        if (decision.impacts.cash) this.company.cash += decision.impacts.cash
        if (decision.impacts.marketShare) {
          const take = decision.impacts.marketShare / this.competitors.length
          this.competitors.forEach(c => c.marketShare = Math.max(1, c.marketShare - take))
        }
        if (decision.impacts.motivation) {
          this.employees.forEach(e => e.motivation = Math.min(100, Math.max(0, e.motivation + (decision.impacts.motivation || 0))))
        }
        this.boardMembers.forEach(m => m.satisfaction = Math.min(100, m.satisfaction + 3))
      } else {
        this.boardMembers.forEach(m => m.satisfaction = Math.max(0, m.satisfaction - 5))
      }

      return approved
    },

    /** Annuler/Supprimer un projet */
    cancelProject(projectId: string) {
      const idx = this.activeProjects.findIndex(p => p.id === projectId)
      if (idx !== -1) {
        this.activeProjects.splice(idx, 1)
        return true
      }
      return false
    },

    /** Mettre à jour le cours de l'action (basé sur la performance) */
    updateSharePrice() {
      const baseValue = 10000
      const cashFactor = 1 + (this.company.cash / 1000000)
      const scoreFactor = this.company.generalScore / 100
      const marketFactor = 0.5 + (this.market.satisfaction / 100)
      const internalFactor = 0.5 + (this.productivity / 1)

      this.company.sharePrice = Math.round(baseValue * cashFactor * scoreFactor * marketFactor * internalFactor)

      // Ajout de micro-volatilité (jitter)
      const jitter = 1 + (Math.random() - 0.5) * 0.04
      this.company.sharePrice = Math.round(this.company.sharePrice * jitter)

      this.company.sharePriceHistory.push(this.company.sharePrice)
      if (this.company.sharePriceHistory.length > 24) this.company.sharePriceHistory.shift()
    },

    /** Appliquer la dépréciation du matériel et de l'infrastructure */
    applyDepreciation() {
      // Détérioration infrastructure
      this.company.ownedInfrastructure.forEach(itemId => {
        const item = this.infrastructureCatalogue.find(i => i.id === itemId)
        if (item) {
          // Perte de 1% à 3% par mois
          const wear = 1 + Math.random() * 2
          item.condition = Math.max(0, item.condition - wear)
        }
      })

      const monthsSinceUpgrade = useGameStore().currentMonth - this.company.lastUpgradeMonth
      if (monthsSinceUpgrade > 12) {
        // Matériel obsolète : fatigue accrue
        this.employees.forEach(e => {
          e.fatigue = Math.min(100, e.fatigue + 2)
        })
      }
    },

    /** Gérer les appels d'offres (expiration et apparition) */
    manageProjectTenders() {
      const now = Date.now()
      // Nettoyage des projets expirés (uniquement si pas encore commencés/assignés)
      this.activeProjects = this.activeProjects.filter(p => {
        if (p.status === 'pending' && p.assignedEmployees.length === 0 && p.expiresAt && p.expiresAt < now) return false
        return true
      })

      // Chance d'apparition d'un nouveau projet (si moins de 5 tenders/backlog)
      const backlogCount = this.activeProjects.filter(p => p.status === 'pending' && p.assignedEmployees.length === 0).length
      if (backlogCount < 5 && Math.random() < 0.1) {
        this.generateProject()
      }
    },

    /** Démarrer la production d'un projet */
    startProject(projectId: string) {
      const project = this.activeProjects.find(p => p.id === projectId)
      if (project && project.assignedEmployees.length === project.teamSize) {
        // Prélèvement des frais de dossier/lancement
        if (this.company.cash >= project.cost) {
          this.company.cash -= project.cost
          project.status = 'active'
          this.market.lastActionTime = Date.now()

          useGameStore().triggerEvent({
            id: 888,
            name: "Lancement de Projet",
            description: `Le projet ${project.title} est officiellement lancé. Frais de dossier déduits : ${project.cost} FCFA.`,
            type: "loss",
            impactValue: project.cost,
            icon: "🚀",
            probability: 1
          })
        } else {
          useGameStore().triggerEvent({
            id: 889,
            name: "Fonds Insuffisants",
            description: `Impossible de lancer ${project.title}. Il vous faut ${project.cost} FCFA pour les frais de dossier.`,
            type: "loss",
            impactValue: 0,
            icon: "🚫",
            probability: 1
          })
        }
      }
    },

    /** Mettre en pause la production d'un projet */
    stopProject(projectId: string) {
      const project = this.activeProjects.find(p => p.id === projectId)
      if (project && project.status === 'active') {
        project.status = 'pending'
      }
    },

    /** Logique de montée en niveau automatique */
    checkLevelUp() {
      const completedCount = this.activeProjects.filter(p => p.status === 'completed').length
      // Seuil : niveau = floor(projets/3) + 1
      const newLevel = Math.floor(completedCount / 3) + 1

      if (newLevel > this.company.level) {
        this.company.level = newLevel
        useGameStore().triggerEvent({
          id: 777,
          name: "Expansion Immobilière",
          description: `Votre entreprise est maintenant Niveau ${this.company.level} ! De nouveaux bureaux plus spacieux sont disponibles.`,
          type: "boost",
          impactValue: 0,
          icon: "⭐",
          probability: 1
        })
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

        // --- Volonté d'échange spontanée (v9.1) ---
        // S'il est riche et content, il veut acheter (offre de vente pour le CEO)
        if (member.satisfaction > 70 && member.sharePercent < 25 && Math.random() < 0.005) {
          useGameStore().triggerEvent({
            id: 400 + member.id,
            name: `Offre d'Acquisition`,
            description: `${member.name} souhaite vous racheter 1% de parts au prix fort.`,
            type: 'gain',
            impactValue: this.company.sharePrice * 1.1,
            icon: '💰',
            probability: 1
          })
        }
        // S'il est déçu, il veut vendre (offre d'achat pour le CEO)
        if (member.satisfaction < 40 && member.sharePercent > 5 && Math.random() < 0.005) {
          useGameStore().triggerEvent({
            id: 500 + member.id,
            name: `Avis de Cession`,
            description: `${member.name} cherche à liquider une partie de ses parts. Prix réduit (-10%).`,
            type: 'loss',
            impactValue: this.company.sharePrice * 0.9,
            icon: '📉',
            probability: 1
          })
        }
      })
    }
  },
})
