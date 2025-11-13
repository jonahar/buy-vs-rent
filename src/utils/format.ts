const integerFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const formatCurrency = (value: number, currencySymbol: string) => {
  const sign = value < 0 ? '-' : ''
  const formatted = integerFormatter.format(Math.round(Math.abs(value)))
  return `${sign}${currencySymbol}${formatted}`
}

export const formatNumber = (value: number) => integerFormatter.format(Math.round(value))

