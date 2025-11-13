import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Scenario } from '../types'
import type { TableRow } from './ResultsTable'
import { formatCurrency } from '../utils/format'

type Props = {
  scenarios: Scenario[]
  rows: TableRow[]
  currencySymbol: string
  scenarioColors: Record<string, string>
}

const ResultsChart = ({ scenarios, rows, currencySymbol, scenarioColors }: Props) => {
  if (scenarios.length === 0) {
    return <p className="empty-state">Add scenarios to see the chart.</p>
  }

  const data = rows.map((row) => {
    const entry: Record<string, number | string> = { year: row.year }
    scenarios.forEach((scenario) => {
      entry[scenario.id] = row.values[scenario.id]
    })
    return entry
  })

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => formatCurrency(Number(value), currencySymbol)} width={120} />
          <Tooltip
            formatter={(value, name) => [formatCurrency(Number(value), currencySymbol), name]}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              backgroundColor: '#1f2937',
              borderRadius: 12,
              border: 'none',
              color: '#ffffff',
            }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
          {scenarios.map((scenario) => (
            <Line
              key={scenario.id}
              type="monotone"
              dataKey={scenario.id}
              name={scenario.name}
              stroke={scenarioColors[scenario.id]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ResultsChart

