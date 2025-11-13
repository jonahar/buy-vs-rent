import type { Scenario } from '../types'
import { formatCurrency } from '../utils/format'

export type TableRow = {
  year: number
  values: Record<string, number>
}

type Props = {
  scenarios: Scenario[]
  rows: TableRow[]
  currencySymbol: string
}

const ResultsTable = ({ scenarios, rows, currencySymbol }: Props) => (
  <div className="results-table">
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col" className="heading">
            Year
          </th>
          {scenarios.map((scenario) => (
            <th key={scenario.id} scope="col" className="heading">
              {scenario.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.year}>
            <th scope="row" className="heading">
              {row.year}
            </th>
            {scenarios.map((scenario) => (
              <td key={scenario.id} className="value">
                {formatCurrency(row.values[scenario.id], currencySymbol)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default ResultsTable

