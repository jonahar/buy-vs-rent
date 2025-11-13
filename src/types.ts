export type ScenarioType = 'rent' | 'buy'

export interface GlobalSettings {
  initialAssets: number
  housePrice: number
  liquidationRate: number
  investmentReturnRate: number
  simulationYears: number
  defaultMortgageIncreaseRate: number
  additionalMonthlyExpenses: number
  monthlyIncome: number
  currencySymbol: string
}

export interface BaseScenario {
  id: string
  name: string
  type: ScenarioType
}

export interface RentScenario extends BaseScenario {
  type: 'rent'
  monthlyRent: number
  rentIncreaseRate: number
}

export interface BuyScenario extends BaseScenario {
  type: 'buy'
  mortgageAmount: number
  initialMonthlyMortgage: number
  mortgageIncreaseRate: number
  mortgageDuration: number
}

export type Scenario = RentScenario | BuyScenario

export interface SimulationSeries {
  scenarioId: string
  values: number[]
}

export type SerializedState = {
  settings: GlobalSettings
  scenarios: Scenario[]
}

