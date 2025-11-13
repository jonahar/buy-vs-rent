import { Copy, Home, Key, PencilLine, Trash2 } from 'lucide-react'
import type { BuyScenario, GlobalSettings, RentScenario, Scenario } from '../types'
import { calculateCapital } from '../utils/simulation'
import { formatCurrency } from '../utils/format'

type Props = {
  scenario: Scenario
  settings: GlobalSettings
  onEdit: (scenario: Scenario) => void
  onDuplicate: (scenario: Scenario) => void
  onDelete: (scenarioId: string) => void
}

const ScenarioCard = ({ scenario, settings, onEdit, onDuplicate, onDelete }: Props) => (
  <article className="scenario-card">
    <header className={`scenario-card-header ${scenario.type}`}>
      <div className="scenario-card-icon">
        {scenario.type === 'buy' ? <Home size={22} /> : <Key size={22} />}
      </div>
      <div className="scenario-card-heading">
        <span className="scenario-type-label">{scenario.type === 'buy' ? 'Buying Scenario' : 'Renting Scenario'}</span>
        <h2>{scenario.name}</h2>
      </div>
    </header>

    <dl>
      {scenario.type === 'rent' ? (
        <>
          <div>
            <dt>Monthly Rent</dt>
            <dd>{formatCurrency((scenario as RentScenario).monthlyRent, settings.currencySymbol)}</dd>
          </div>
          <div>
            <dt>Rent Increase</dt>
            <dd>{`${(scenario as RentScenario).rentIncreaseRate}% yearly`}</dd>
          </div>
        </>
      ) : (
        <>
          <div>
            <dt>Mortgage Amount</dt>
            <dd>{formatCurrency((scenario as BuyScenario).mortgageAmount, settings.currencySymbol)}</dd>
          </div>
          <div>
            <dt>Initial Monthly Mortgage</dt>
            <dd>{formatCurrency((scenario as BuyScenario).initialMonthlyMortgage, settings.currencySymbol)}</dd>
          </div>
          <div>
            <dt>Mortgage Increase</dt>
            <dd>{`${(scenario as BuyScenario).mortgageIncreaseRate}% yearly`}</dd>
          </div>
          <div>
            <dt>Mortgage Duration</dt>
            <dd>{`${(scenario as BuyScenario).mortgageDuration} years`}</dd>
          </div>
          <div>
            <dt>Capital</dt>
            <dd>{formatCurrency(calculateCapital(settings, scenario as BuyScenario), settings.currencySymbol)}</dd>
          </div>
        </>
      )}
    </dl>

    <footer className="scenario-card-actions">
      <button type="button" className="button button-outline" onClick={() => onEdit(scenario)}>
        <PencilLine size={16} />
        <span>Edit</span>
      </button>
      <button type="button" className="button button-outline" onClick={() => onDuplicate(scenario)}>
        <Copy size={16} />
        <span>Copy</span>
      </button>
      <button type="button" className="button button-destructive" onClick={() => onDelete(scenario.id)}>
        <Trash2 size={16} />
        <span>Delete</span>
      </button>
    </footer>
  </article>
)

export default ScenarioCard

