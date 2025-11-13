import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChartLine } from 'lucide-react'
import GlobalSettingsPanel from './components/GlobalSettingsPanel'
import ScenarioSection from './components/ScenarioSection'
import ScenarioModal from './components/ScenarioModal'
import ResultsTable, { type TableRow } from './components/ResultsTable'
import ResultsChart from './components/ResultsChart'
import { simulateAllScenarios } from './utils/simulation'
import type { GlobalSettings, Scenario, SerializedState } from './types'
import './App.css'

const MAX_SCENARIOS = 5
const STORAGE_KEY = 'buy-vs-rent-state-v1'
const COLOR_PALETTE = ['#0b7285', '#1c7ed6', '#2b8a3e', '#e8590c', '#9c36b5', '#b5179e', '#577590']

const DEFAULT_SETTINGS: GlobalSettings = {
  initialAssets: 2_000_000,
  housePrice: 1_000_000,
  liquidationRate: 20,
  investmentReturnRate: 7,
  simulationYears: 40,
  defaultMortgageIncreaseRate: 3,
  additionalMonthlyExpenses: 0,
  monthlyIncome: 0,
  currencySymbol: '₪',
}

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `scenario-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const createDefaultScenarios = (): Scenario[] => [
  {
    id: createId(),
    name: 'Renting',
    type: 'rent',
    monthlyRent: 3000,
    rentIncreaseRate: 3,
  },
  {
    id: createId(),
    name: 'Buy: 50% Mortgage',
    type: 'buy',
    mortgageAmount: 500_000,
    initialMonthlyMortgage: 2500,
    mortgageIncreaseRate: DEFAULT_SETTINGS.defaultMortgageIncreaseRate,
    mortgageDuration: 25,
  },
  {
    id: createId(),
    name: 'Buy: 75% Mortgage',
    type: 'buy',
    mortgageAmount: 750_000,
    initialMonthlyMortgage: 3000,
    mortgageIncreaseRate: DEFAULT_SETTINGS.defaultMortgageIncreaseRate,
    mortgageDuration: 25,
  },
]

const loadState = (): SerializedState | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as SerializedState
    return parsed
  } catch {
    return null
  }
}

const App = () => {
  const persistedState = useMemo(() => loadState(), [])

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(persistedState?.settings ?? DEFAULT_SETTINGS)
  const [scenarios, setScenarios] = useState<Scenario[]>(persistedState?.scenarios ?? createDefaultScenarios())
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalScenario, setModalScenario] = useState<Scenario | undefined>()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const state: SerializedState = {
      settings: globalSettings,
      scenarios,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [globalSettings, scenarios])

  const handleSettingsChange = useCallback(
    <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => {
      setGlobalSettings((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const openModal = useCallback((scenario?: Scenario) => {
    setModalScenario(scenario)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setModalScenario(undefined)
  }, [])

  const generateScenarioId = useCallback(() => createId(), [])

  const handleScenarioSubmit = useCallback(
    (scenario: Scenario) => {
      setScenarios((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === scenario.id)

        if (existingIndex >= 0) {
          const next = [...prev]
          next[existingIndex] = scenario
          return next
        }

        if (prev.length >= MAX_SCENARIOS) {
          return prev
        }

        return [...prev, scenario]
      })
    },
    [],
  )

  const handleDuplicate = useCallback(
    (scenario: Scenario) => {
      setScenarios((prev) => {
        if (prev.length >= MAX_SCENARIOS) {
          return prev
        }

        const duplicate: Scenario = {
          ...scenario,
          id: generateScenarioId(),
          name: `${scenario.name} (copy)`,
        }

        return [...prev, duplicate]
      })
    },
    [generateScenarioId],
  )

  const handleDelete = useCallback((scenarioId: string) => {
    setScenarios((prev) => prev.filter((scenario) => scenario.id !== scenarioId))
  }, [])

  const handleReset = useCallback(() => {
    setGlobalSettings(DEFAULT_SETTINGS)
    setScenarios([])
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const simulationSeries = useMemo(() => simulateAllScenarios(globalSettings, scenarios), [globalSettings, scenarios])

  const tableRows: TableRow[] = useMemo(() => {
    const years = globalSettings.simulationYears
    return Array.from({ length: years + 1 }, (_, year) => {
      const values: Record<string, number> = {}
      simulationSeries.forEach((series) => {
        values[series.scenarioId] = series.values[year] ?? 0
      })
      return { year, values }
    })
  }, [globalSettings.simulationYears, simulationSeries])

  const scenarioColors = useMemo(() => {
    const colors: Record<string, string> = {}
    scenarios.forEach((scenario, index) => {
      const color = COLOR_PALETTE[index % COLOR_PALETTE.length]
      colors[scenario.id] = color
    })
    return colors
  }, [scenarios])

  return (
    <div className="app">
      <header className="app-hero">
        <h1>Buy vs Rent Comparison Tool</h1>
        <p>
          Compare renting and buying paths side by side, project how your total assets could evolve, and decide with clarity and
          confidence.
        </p>
      </header>

      <GlobalSettingsPanel settings={globalSettings} onChange={handleSettingsChange} />

      <ScenarioSection
        scenarios={scenarios}
        settings={globalSettings}
        onAdd={() => openModal()}
        onEdit={openModal}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onReset={handleReset}
        maxScenarios={MAX_SCENARIOS}
      />

      <section className="panel panel-results">
        <header className="panel-header gradient-results">
          <div className="panel-header-icon">
            <ChartLine size={24} />
          </div>
          <div>
            <h1>Results</h1>
            <p>Track how each scenario compounds over time and spot the path that builds the most wealth.</p>
          </div>
        </header>

        <div className="results-surface table-surface">
          <ResultsTable scenarios={scenarios} rows={tableRows} currencySymbol={globalSettings.currencySymbol} />
        </div>

        <div className="results-surface chart-surface">
          <ResultsChart
            scenarios={scenarios}
            rows={tableRows}
            currencySymbol={globalSettings.currencySymbol}
            scenarioColors={scenarioColors}
          />
        </div>
      </section>

      <ScenarioModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleScenarioSubmit}
        scenario={modalScenario}
        settings={globalSettings}
        generateId={generateScenarioId}
      />
    </div>
  )
}

export default App
