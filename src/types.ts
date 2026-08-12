export type Holding = {
  id: string
  grams: number
  purchaseDate: string
  pricePerGram: number
  createdAt: string
}

export type ChartPoint = {
  date: string
  pricePerGram: number
}

export type ChartRange = '1d' | '1w' | '1m' | '2m'

export const CHART_RANGES: ChartRange[] = ['1d', '1w', '1m', '2m']

export const CHART_RANGE_DAYS: Record<ChartRange, number> = {
  '1d': 1,
  '1w': 7,
  '1m': 30,
  '2m': 60,
}

export const DEFAULT_CHART_RANGE: ChartRange = '2m'

export type LiveGoldPrice = {
  pricePerGram: number
  pricePerOunce: number
  computedAt: string | null
  isStale: boolean
}

export type KijangEmas = {
  effectiveDate: string
  oneOzBuying: number
  oneOzSelling: number
}

export type HoldingPnL = Holding & {
  cost: number
  currentValue: number
  pnl: number
  pnlPercent: number
}

export type PortfolioSummary = {
  totalGrams: number
  totalCost: number
  totalValue: number
  totalPnl: number
  totalPnlPercent: number
}
