import type { BuyScenario, GlobalSettings, Scenario, SimulationSeries } from '../types'

const percentToMultiplier = (percent: number) => 1 + percent / 100

export const calculateCapital = (settings: GlobalSettings, scenario: BuyScenario) =>
  Math.max(settings.housePrice - scenario.mortgageAmount, 0)

export const simulateScenario = (settings: GlobalSettings, scenario: Scenario): number[] => {
  const years = settings.simulationYears
  const values: number[] = new Array(years + 1).fill(0)

  let assets = settings.initialAssets

  if (scenario.type === 'buy') {
    // const upfrontCost = scenario.mortgageAmount * percentToMultiplier(settings.liquidationRate)
    const upfrontCost = calculateCapital(settings, scenario)  * percentToMultiplier(settings.liquidationRate)
    assets -= upfrontCost
  }

  values[0] = assets

  for (let year = 1; year <= years; year += 1) {
    let annualOutflow = 0

    if (scenario.type === 'buy') {
      if (year <= scenario.mortgageDuration) {
        const paymentGrowth = Math.pow(percentToMultiplier(scenario.mortgageIncreaseRate), year - 1)
        const yearlyPayment = scenario.initialMonthlyMortgage * 12 * paymentGrowth
        annualOutflow += yearlyPayment
      }
    } else {
      const rentGrowth = Math.pow(percentToMultiplier(scenario.rentIncreaseRate), year - 1)
      const yearlyRent = scenario.monthlyRent * 12 * rentGrowth
      annualOutflow += yearlyRent
    }

    const annualIncome = settings.monthlyIncome * 12
    const annualAdditionalExpenses = settings.additionalMonthlyExpenses * 12

    assets = assets - annualOutflow - annualAdditionalExpenses + annualIncome
    assets *= percentToMultiplier(settings.investmentReturnRate)

    values[year] = assets
  }

  return values
}

export const simulateAllScenarios = (
  settings: GlobalSettings,
  scenarios: Scenario[],
): SimulationSeries[] => scenarios.map((scenario) => ({ scenarioId: scenario.id, values: simulateScenario(settings, scenario) }))

