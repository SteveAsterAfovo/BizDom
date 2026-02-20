/**
 * ── Types principaux du jeu BIZDOM ──
 * Toutes les interfaces TypeScript pour le jeu de simulation entrepreneuriale
 */

// ─── Spécialités des employés ───
export type EmployeeSpecialty = 'tech' | 'sales' | 'creative' | 'hr' | 'management'

// ─── CEO / Fondateur ───
export interface CEO {
    firstName: string
    lastName: string
    gender: 'M' | 'F' | 'NB'
    appearance: string
    bankBalance: number    // Fortune personnelle (cash)
}

// ─── Cycles économiques ───
export type EconomicCycle = 'growth' | 'stable' | 'recession'

// ─── Gouvernance ───
export type DecisionImpact = 'cash' | 'motivation' | 'reputation' | 'marketShare'

export interface BoardMember {
    id: number
    name: string
    role: string
    influence: number      // 0 à 1 (poids du vote)
    satisfaction: number   // 0 à 100
    personality: 'conservative' | 'aggressive' | 'balanced'
    icon: string
    sharePercent: number   // Part détenue (%)
    lastVote: 'yes' | 'no' | 'none' | 'abstain' // Position lors du dernier vote
}

export interface StrategicDecision {
    id: string
    title: string
    description: string
    cost: number
    impacts: Partial<Record<DecisionImpact, number>>
    risk: number           // 0 à 1 (chance d'échec)
    boardSupport?: number   // Support requis (0-100) pour être auto-validé
}

// ─── Infrastructure & Matériel ───
export type InfrastructureCategory = 'network' | 'power' | 'workstation' | 'software'

export interface InfrastructureItem {
    id: string
    name: string
    category: InfrastructureCategory
    cost: number
    monthlyCost: number
    quality: number        // 1 à 5
    dependencies: string[] // IDs des items requis
    description: string
    risky?: boolean        // Est-ce une proposition dangereuse ?
    failureRate?: number   // Risque de panne
    condition: number      // État de l'équipement (0 à 100)
    depreciationRate: number // Perte de condition par mois (%)
}

// ─── Bureaux / espace de travail ───
export interface Office {
    id: number
    name: string
    rent: number            // loyer mensuel
    maxEmployees: number    // capacité maximale
    prestige: number        // 1 à 5
    icon: string
    requiredScore?: number  // Score global requis
    requiredRevenue?: number // Revenu mensuel requis
    minBusinessLevel: number // Niveau d'entreprise requis
}

/** Avantage social proposé aux employés */
export interface Perk {
    id: number
    name: string
    cost: number            // coût mensuel
    motivationBoost: number // bonus motivation par mois
    fatigueReduction: number // réduction de fatigue par mois
    icon: string
    description: string
}

/** Prêt bancaire */
export interface Loan {
    id: number
    amount: number          // montant emprunté
    interestRate: number    // taux d'intérêt mensuel (ex: 0.03 = 3%)
    remainingMonths: number // mois restants
    monthlyPayment: number  // mensualité calculée
    totalPaid: number       // total déjà remboursé
}

/** Succès / Achievement */
export interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    condition: string       // clé de condition (évaluée dans le code)
    unlocked: boolean
    unlockedAt?: number     // mois de déverrouillage
}

/** Concurrent IA */
export interface Competitor {
    id: number
    name: string
    marketShare: number     // part de marché (0 à 100)
    strength: number        // 1 à 5
    growthRate: number      // croissance mensuelle
    icon: string
}

/** Canal marketing */
export interface MarketingChannel {
    id: number
    name: string
    costPerUnit: number     // coût par unité de budget
    efficiency: number      // efficacité (multiplicateur)
    icon: string
    description: string
    budget: number          // budget alloué par le joueur
}

/** Données de l'entreprise du joueur */
export interface Company {
    name: string
    cash: number
    revenuePerCustomer: number
    taxRate: number
    fixedCosts: number
    variableCostPerEmployee: number
    currentOfficeId: number
    activePerks: number[]    // IDs des perks activés
    investorShare: number    // part détenue par les investisseurs (0 à 1)
    equipmentLevel: number   // niveau d'équipement (réduit fatigue)
    lastUpgradeMonth: number // mois de la dernière amélioration matériel
    isConfigured: boolean    // l'entreprise est-elle initialisée ?
    ceo?: CEO                // profile du CEO
    boardSatisfaction: number // 0 à 100
    ownedInfrastructure: string[] // IDs des items possédés
    generalScore: number     // Score global (0-1000)
    level: number            // Niveau d'entreprise (Business Level)
    sharePrice: number       // Prix d'une part (1%)
    sharePriceHistory: number[]
}

/** Employé de l'entreprise */
export interface Employee {
    id: number
    name: string
    role: string
    skillLevel: number        // 1 à 5
    salary: number
    motivation: number        // 0 à 100
    fatigue: number           // 0 à 100 (0 = reposé, 100 = burn-out)
    monthsEmployed: number    // ancienneté en mois
    specialty: EmployeeSpecialty
    trainingDaysRemaining: number // jours restants de formation (0 = dispo)
    opinions: string[]            // avis/feedback récents
    isOnStrike: boolean           // en grève ?
    strikeDuration: number        // temps passé en grève (secondes)
}

/** Données du marché */
export interface MarketData {
    customerBase: number
    acquisitionCoefficient: number
    marketGrowth: number
    inflation: number
    satisfaction: number      // 0 à 100 (NPS score)
    churnRate: number         // taux de perte de clients (0 à 1)
    economicCycle: EconomicCycle
    cycleMonthsRemaining: number // mois avant changement de cycle
    demands: Record<EmployeeSpecialty, number> // index de besoin par spécialité (0-100)
    organicGrowth: number     // croissance/déclin organique (+/- % par seconde)
    lastActionTime: number    // timestamp de la dernière action majeure
}

/** Événement aléatoire du jeu */
export interface GameEvent {
    id: number
    name: string
    description: string
    probability: number       // 0 à 1
    type: 'loss' | 'gain' | 'employee_departure' | 'boost' | 'sabotage' | 'fixed_cost_increase'
    impactValue: number
    icon: string
}

/** Rapport mensuel généré après simulation */
export interface MonthlyReport {
    month: number
    revenue: number
    totalSalaries: number
    fixedCosts: number
    totalExpenses: number
    profit: number
    taxes: number
    netProfit: number
    cashAfter: number
    customerBase: number
    employeeCount: number
    productivity: number
    newCustomers: number
    marketingBudget: number
    event: GameEvent | null
    loanPayments: number
    officeRent: number
    churnedCustomers: number
    satisfaction: number
    perksCost: number
}

/** État global du jeu */
export interface GameState {
    currentMonth: number
    reports: MonthlyReport[]
    eventHistory: GameEvent[]
    currentEvent: GameEvent | null
    isSimulating: boolean
    gameOver: boolean
}

/** Pool de candidats pour le recrutement */
export interface RecruitCandidate {
    id: number
    name: string
    role: string
    skillLevel: number
    salary: number
    motivation: number
    fatigue: number
    monthsEmployed: number
    specialty: EmployeeSpecialty
}

/** Quête / Objectif temporaire */
export interface Quest {
    id: string
    title: string
    description: string
    condition: string
    rewardValue: number
    rewardType: 'cash' | 'motivation' | 'perk'
    completed: boolean
    deadline?: number // Jour de fin
    pros: string[]    // Avantages si réussi
    cons: string[]    // Inconvénients/Risques si ignoré/échoué
    failurePenalty: number // Impact cash si échoué
}

export interface TemporaryBoost {
    id: string
    type: 'motivation' | 'fatigue'
    value: number
    remainingDays: number
    cost: number
}

// ─── Projets & Production ───
export interface Project {
    id: string
    title: string
    description: string
    duration: number       // Durée en jours
    progress: number       // 0 à 100
    cost: number           // Coût de lancement
    budget: number         // Budget de fonctionnement
    teamSize: number       // Nombre d'employés requis
    requiredSkills: Record<EmployeeSpecialty, number> // Niveau mini requis
    requiredSpecialties: Partial<Record<EmployeeSpecialty, number>> // Nombre d'employés requis par spécialité
    reward: number         // Gain en cas de succès
    penalty: number        // Perte en cas d'échec
    status: 'pending' | 'active' | 'completed' | 'failed'
    shareholderOpinion: number // Influence sur la satisfaction du Board (-10 à +10)
    assignedEmployees: number[] // IDs des employés sur le projet
    expiresAt?: number // Timestamp ou jour d'expiration (pour les appels d'offres)
}

// ─── Réclamations Marché ───
export interface MarketClaim {
    id: string
    type: 'price' | 'quality' | 'support' | 'feature'
    description: string
    intensity: number      // Impact sur le churn (0-1)
    status: 'pending' | 'resolved'
    actionLabel: string
    actionCost: number
}
