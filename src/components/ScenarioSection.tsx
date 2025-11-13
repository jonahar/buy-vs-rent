import { Layers3, Plus, RotateCcw } from 'lucide-react'
import type { GlobalSettings, Scenario } from '../types'
import ScenarioCard from './ScenarioCard'

type Props = {
  scenarios: Scenario[]
  settings: GlobalSettings
  onAdd: () => void
  onEdit: (scenario: Scenario) => void
  onDuplicate: (scenario: Scenario) => void
  onDelete: (scenarioId: string) => void
  onReset: () => void
  maxScenarios: number
}

const ScenarioSection = ({ scenarios, settings, onAdd, onEdit, onDuplicate, onDelete, onReset, maxScenarios }: Props) => {
  const limitReached = scenarios.length >= maxScenarios

  return (
    <section className="panel panel-scenarios">
      <header className="panel-header gradient-scenarios">
        <div className="panel-header-icon">
          <Layers3 size={24} />
        </div>
        <div className="panel-header-copy">
          <h1>Scenarios</h1>
          <p>Experiment with different rent and mortgage strategies to see how your total assets respond over decades.</p>
        </div>
        <div className="actions">
          <button type="button" className="button button-primary" onClick={onAdd} disabled={limitReached}>
            <Plus size={18} />
            <span>Add Scenario</span>
          </button>
          <button type="button" className="button button-outline" onClick={onReset}>
            <RotateCcw size={18} />
            <span>Reset All</span>
          </button>
        </div>
      </header>

      {limitReached && (
        <p className="note info">You’ve reached the maximum of {maxScenarios} scenarios. Delete or edit existing scenarios to add more.</p>
      )}

      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            settings={settings}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
        {scenarios.length === 0 && <p className="empty-state">Add your first scenario to get started.</p>}
      </div>
    </section>
  )
}

export default ScenarioSection

