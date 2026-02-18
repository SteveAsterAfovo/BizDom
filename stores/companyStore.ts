/**
 * ── Company Store ──
 * Gère les données de l'entreprise : finances, employés, marché, marketing
 */
import { defineStore } from 'pinia'
import type { Company, Employee, MarketData, RecruitCandidate } from '~/types'
import companyData from '~/mock/company.json'
import employeesData from '~/mock/employees.json'
import marketData from '~/mock/market.json'

/** Pool de candidats disponibles pour le recrutement */
const RECRUIT_POOL: RecruitCandidate[] = [
    { id: 100, name: 'Ibrahim Bah', role: 'Développeur Mobile', skillLevel: 3, salary: 7000, motivation: 80 },
    { id: 101, name: 'Marie Ndour', role: 'Data Analyst', skillLevel: 4, salary: 9000, motivation: 85 },
    { id: 102, name: 'Oumar Cissé', role: 'Community Manager', skillLevel: 2, salary: 4500, motivation: 90 },
    { id: 103, name: 'Adama Keita', role: 'Ingénieur DevOps', skillLevel: 5, salary: 11000, motivation: 75 },
    { id: 104, name: 'Ndeye Fall', role: 'Assistante RH', skillLevel: 3, salary: 5000, motivation: 85 },
    { id: 105, name: 'Seydou Diop', role: 'Technicien Support', skillLevel: 2, salary: 4000, motivation: 70 },
    { id: 106, name: 'Clarisse Ouédraogo', role: 'Designer Graphique', skillLevel: 4, salary: 7500, motivation: 80 },
    { id: 107, name: 'Jean-Paul Mbiké', role: 'Développeur Backend', skillLevel: 4, salary: 8500, motivation: 78 },
]

interface CompanyStoreState {
    company: Company
    employees: Employee[]
    market: MarketData
    marketingBudget: number
    recruitPool: RecruitCandidate[]
}

export const useCompanyStore = defineStore('company', {
    state: (): CompanyStoreState => ({
        company: { ...companyData },
        employees: employeesData.map((e) => ({ ...e })) as Employee[],
        market: { ...marketData },
        marketingBudget: 5000,
        recruitPool: RECRUIT_POOL.map((c) => ({ ...c })),
    }),

    getters: {
        /** Total des salaires mensuels */
        totalSalaries: (state): number =>
            state.employees.reduce((sum, e) => sum + e.salary, 0),

        /** Nombre d'employés */
        employeeCount: (state): number =>
            state.employees.length,

        /** Productivité globale (moyenne de skillLevel × motivation%) */
        productivity: (state): number => {
            if (state.employees.length === 0) return 0
            const total = state.employees.reduce(
                (sum, e) => sum + (e.skillLevel * (e.motivation / 100)),
                0
            )
            return total / state.employees.length
        },

        /** Estimation des nouveaux clients via marketing */
        estimatedNewCustomers: (state): number =>
            Math.round(state.marketingBudget * state.market.acquisitionCoefficient),

        /** Cash actuel de l'entreprise */
        cash: (state): number => state.company.cash,

        /** Coûts variables totaux */
        totalVariableCosts: (state): number =>
            state.employees.length * state.company.variableCostPerEmployee,
    },

    actions: {
        /** Recruter un candidat du pool */
        hireEmployee(candidateId: number) {
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

        /** Définir le budget marketing */
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
            this.employees.forEach((e) => {
                e.motivation = Math.max(10, e.motivation - Math.floor(Math.random() * 5 + 1))
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

        /** Réinitialiser les données de l'entreprise */
        resetCompany() {
            this.company = { ...companyData }
            this.employees = employeesData.map((e) => ({ ...e })) as Employee[]
            this.market = { ...marketData }
            this.marketingBudget = 5000
            this.recruitPool = RECRUIT_POOL.map((c) => ({ ...c }))
        },
    },
})
