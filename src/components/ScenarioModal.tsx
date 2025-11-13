import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, PlusCircle, X, XCircle } from 'lucide-react'
import type { BuyScenario, GlobalSettings, Scenario, ScenarioType } from '../types'
import { calculateCapital } from '../utils/simulation'
import { formatCurrency } from '../utils/format'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (scenario: Scenario) => void
  settings: GlobalSettings
  scenario?: Scenario
  generateId: () => string
}

type ScenarioDraft = {
  id?: string
  name: string
  type: ScenarioType
  monthlyRent: string
  rentIncreaseRate: string
  mortgageAmount: string
  initialMonthlyMortgage: string
  mortgageIncreaseRate: string
  mortgageDuration: string
}

const defaultDraft: ScenarioDraft = {
  name: '',
  type: 'rent',
  monthlyRent: '0',
  rentIncreaseRate: '3',
  mortgageAmount: '0',
  initialMonthlyMortgage: '0',
  mortgageIncreaseRate: '3',
  mortgageDuration: '25',
}

const toNumber = (value: string) => (value === '' || value === '-' ? 0 : Number(value))

const ScenarioModal = ({ isOpen, onClose, onSubmit, scenario, settings, generateId }: Props) => {
  const [draft, setDraft] = useState<ScenarioDraft>(defaultDraft)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (scenario) {
      if (scenario.type === 'buy') {
        setDraft({
          id: scenario.id,
          name: scenario.name,
          type: scenario.type,
          monthlyRent: '0',
          rentIncreaseRate: '3',
          mortgageAmount: String(scenario.mortgageAmount),
          initialMonthlyMortgage: String(scenario.initialMonthlyMortgage),
          mortgageIncreaseRate: String(scenario.mortgageIncreaseRate),
          mortgageDuration: String(scenario.mortgageDuration),
        })
      } else {
        setDraft({
          id: scenario.id,
          name: scenario.name,
          type: scenario.type,
          monthlyRent: String(scenario.monthlyRent),
          rentIncreaseRate: String(scenario.rentIncreaseRate),
          mortgageAmount: '0',
          initialMonthlyMortgage: '0',
          mortgageIncreaseRate: String(settings.defaultMortgageIncreaseRate),
          mortgageDuration: '25',
        })
      }
    } else {
      setDraft({
        ...defaultDraft,
        rentIncreaseRate: '3',
        mortgageIncreaseRate: String(settings.defaultMortgageIncreaseRate),
      })
    }
  }, [isOpen, scenario, settings.defaultMortgageIncreaseRate])

  const capital = useMemo(() => {
    if (draft.type !== 'buy') {
      return 0
    }

    const buyDraft: BuyScenario = {
      id: draft.id ?? '',
      name: draft.name,
      type: 'buy',
      mortgageAmount: toNumber(draft.mortgageAmount),
      initialMonthlyMortgage: toNumber(draft.initialMonthlyMortgage),
      mortgageIncreaseRate: toNumber(draft.mortgageIncreaseRate),
      mortgageDuration: toNumber(draft.mortgageDuration),
    }

    return calculateCapital(settings, buyDraft)
  }, [draft, settings])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (draft.type === 'buy') {
      const nextScenario: BuyScenario = {
        id: draft.id ?? generateId(),
        name: draft.name || 'Buying Scenario',
        type: 'buy',
        mortgageAmount: toNumber(draft.mortgageAmount),
        initialMonthlyMortgage: toNumber(draft.initialMonthlyMortgage),
        mortgageIncreaseRate: toNumber(draft.mortgageIncreaseRate),
        mortgageDuration: Math.max(0, Math.floor(toNumber(draft.mortgageDuration))),
      }
      onSubmit(nextScenario)
    } else {
      onSubmit({
        id: draft.id ?? generateId(),
        name: draft.name || 'Renting Scenario',
        type: 'rent',
        monthlyRent: toNumber(draft.monthlyRent),
        rentIncreaseRate: toNumber(draft.rentIncreaseRate),
      })
    }

    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <header>
          <h2>{scenario ? 'Edit Scenario' : 'Add Scenario'}</h2>
          <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Scenario Name</span>
            <input value={draft.name} onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} />
          </label>

          <label className="field">
            <span>Scenario Type</span>
            <select
              value={draft.type}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  type: event.target.value as ScenarioType,
                }))
              }
            >
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
            </select>
          </label>

          {draft.type === 'rent' ? (
            <div className="field-group rent">
              <label className="field">
                <span>Monthly Rent</span>
                <input
                  type="number"
                  step="100"
                  value={draft.monthlyRent}
                  onChange={(event) => setDraft((prev) => ({ ...prev, monthlyRent: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Yearly Rent Increase (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={draft.rentIncreaseRate}
                  onChange={(event) => setDraft((prev) => ({ ...prev, rentIncreaseRate: event.target.value }))}
                />
              </label>
            </div>
          ) : (
            <div className="field-group buy">
              <label className="field">
                <span>Mortgage Amount</span>
                <input
                  type="number"
                  step="1000"
                  value={draft.mortgageAmount}
                  onChange={(event) => setDraft((prev) => ({ ...prev, mortgageAmount: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Initial Monthly Mortgage Payment</span>
                <input
                  type="number"
                  step="100"
                  value={draft.initialMonthlyMortgage}
                  onChange={(event) => setDraft((prev) => ({ ...prev, initialMonthlyMortgage: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Yearly Mortgage Increase (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={draft.mortgageIncreaseRate}
                  onChange={(event) => setDraft((prev) => ({ ...prev, mortgageIncreaseRate: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Mortgage Duration (years)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={draft.mortgageDuration}
                  onChange={(event) => setDraft((prev) => ({ ...prev, mortgageDuration: event.target.value }))}
                />
              </label>
              <p className="note subtle">
                Capital (your cash toward the purchase): {formatCurrency(capital, settings.currencySymbol)}
              </p>
            </div>
          )}

          <footer>
            <button type="button" className="button button-outline" onClick={onClose}>
              <XCircle size={16} />
              <span>Cancel</span>
            </button>
            <button type="submit" className="button button-primary">
              {scenario ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Add Scenario</span>
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default ScenarioModal

