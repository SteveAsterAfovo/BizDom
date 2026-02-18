/**
 * ── Types principaux du jeu BIZDOM ──
 * Toutes les interfaces TypeScript pour le jeu de simulation entrepreneuriale
 */

/** Données de l'entreprise du joueur */
export interface Company {
    name: string
    cash: number
    revenuePerCustomer: number
    taxRate: number
    fixedCosts: number
    variableCostPerEmployee: number
}

/** Employé de l'entreprise */
export interface Employee {
    id: number
    name: string
    role: string
    skillLevel: number      // 1 à 5
    salary: number
    motivation: number      // 0 à 100
}

/** Données du marché */
export interface MarketData {
    customerBase: number
    acquisitionCoefficient: number
    marketGrowth: number
    inflation: number
}

/** Événement aléatoire du jeu */
export interface GameEvent {
    id: number
    name: string
    description: string
    probability: number     // 0 à 1
    type: 'loss' | 'gain' | 'employee_departure' | 'boost'
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
}
