import type { Holding, HoldingPnL, PortfolioSummary } from '../types'

export function formatRm(amount: number, fractionDigits = 2): string {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)
}

export function formatGrams(grams: number): string {
  return `${new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(grams)} g`
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function calcHoldingPnL(holding: Holding, livePricePerGram: number | null): HoldingPnL {
  const cost = holding.grams * holding.pricePerGram
  const currentValue = livePricePerGram == null ? cost : holding.grams * livePricePerGram
  const pnl = currentValue - cost
  const pnlPercent = cost === 0 ? 0 : (pnl / cost) * 100

  return {
    ...holding,
    cost,
    currentValue,
    pnl,
    pnlPercent,
  }
}

export function calcPortfolioSummary(
  holdings: Holding[],
  livePricePerGram: number | null,
): PortfolioSummary {
  const rows = holdings.map((holding) => calcHoldingPnL(holding, livePricePerGram))
  const totalGrams = rows.reduce((sum, row) => sum + row.grams, 0)
  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0)
  const totalValue = rows.reduce((sum, row) => sum + row.currentValue, 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPercent = totalCost === 0 ? 0 : (totalPnl / totalCost) * 100

  return {
    totalGrams,
    totalCost,
    totalValue,
    totalPnl,
    totalPnlPercent,
  }
}
