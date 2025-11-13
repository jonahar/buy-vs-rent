import { Settings2 } from 'lucide-react'
import type { GlobalSettings } from '../types'

type Props = {
  settings: GlobalSettings
  onChange: <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => void
}

const numberField = (value: number) => (Number.isFinite(value) ? value : '')

const GlobalSettingsPanel = ({ settings, onChange }: Props) => (
  <section className="panel panel-global">
    <header className="panel-header gradient-global">
      <div className="panel-header-icon">
        <Settings2 size={24} />
      </div>
      <div>
        <h1>Global Settings</h1>
        <p>Use these baseline assumptions to influence every scenario and model the long-term outcome you care about.</p>
      </div>
    </header>
    <div className="grid two-column">
      <label className="field">
        <span>Initial Total Assets</span>
        <input
          type="number"
          min="0"
          step="1000"
          value={numberField(settings.initialAssets)}
          onChange={(event) => onChange('initialAssets', Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>House Price</span>
        <input
          type="number"
          min="0"
          step="1000"
          value={numberField(settings.housePrice)}
          onChange={(event) => onChange('housePrice', Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Liquidation Price (%)</span>
        <input
          type="number"
          min="0"
          step="0.1"
          value={numberField(settings.liquidationRate)}
          onChange={(event) => onChange('liquidationRate', Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Investment Return Rate (%)</span>
        <input
          type="number"
          step="0.1"
          value={numberField(settings.investmentReturnRate)}
          onChange={(event) => onChange('investmentReturnRate', Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Simulation Duration (years)</span>
        <input
          type="number"
          min="1"
          step="1"
          value={numberField(settings.simulationYears)}
          onChange={(event) => onChange('simulationYears', Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Default Mortgage Increase Rate (%)</span>
        <input
          type="number"
          step="0.1"
          value={numberField(settings.defaultMortgageIncreaseRate)}
          onChange={(event) => onChange('defaultMortgageIncreaseRate', Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Additional Monthly Expenses</span>
        <input
          type="number"
          min="0"
          step="100"
          value={numberField(settings.additionalMonthlyExpenses)}
          onChange={(event) => onChange('additionalMonthlyExpenses', Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Monthly Income</span>
        <input
          type="number"
          min="0"
          step="100"
          value={numberField(settings.monthlyIncome)}
          onChange={(event) => onChange('monthlyIncome', Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Currency Symbol</span>
        <input
          type="text"
          value={settings.currencySymbol}
          onChange={(event) => onChange('currencySymbol', event.target.value || '₪')}
          maxLength={3}
        />
      </label>
    </div>
  </section>
)

export default GlobalSettingsPanel

