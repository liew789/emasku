import type { ChartPoint, ChartRange, KijangEmas, LiveGoldPrice } from '../types'
import { CHART_RANGE_DAYS } from '../types'

const TROY_OUNCE_GRAMS = 31.1034768
const MAX_CHART_DAYS = CHART_RANGE_DAYS['2m']
const CHART_CACHE_KEY = 'emasku.chart.v1'
const LATEST_CACHE_MS = 60_000

type BnmOzPrices = {
  buying: number
  selling: number
}

type BnmKijangRow = {
  effective_date: string
  one_oz: BnmOzPrices
}

type BnmKijangResponse = {
  data: BnmKijangRow | BnmKijangRow[]
}

export type DateGoldPrice = {
  pricePerGram: number
  matchedDate: string
  exact: boolean
}

type LatestCache = {
  at: number
  row: BnmKijangRow
}

let latestCache: LatestCache | null = null
const monthCache = new Map<string, BnmKijangRow[]>()

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function rangeStartDate(days: number): string {
  const from = new Date()
  from.setUTCDate(from.getUTCDate() - days)
  return toDateInput(from)
}

function monthKeysBetween(fromStr: string, toStr: string): Array<{ year: number; month: number }> {
  const start = new Date(`${fromStr}T00:00:00Z`)
  const end = new Date(`${toStr}T00:00:00Z`)
  const keys: Array<{ year: number; month: number }> = []

  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1))
  const last = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1))

  while (cursor <= last) {
    keys.push({ year: cursor.getUTCFullYear(), month: cursor.getUTCMonth() + 1 })
    cursor.setUTCMonth(cursor.getUTCMonth() + 1)
  }

  return keys
}

function midOzPrice(oneOz: BnmOzPrices): number {
  return (oneOz.buying + oneOz.selling) / 2
}

function ozToGram(pricePerOz: number): number {
  return pricePerOz / TROY_OUNCE_GRAMS
}

function normalizeRows(data: BnmKijangResponse['data']): BnmKijangRow[] {
  return Array.isArray(data) ? data : [data]
}

async function fetchLatestBnmRow(): Promise<BnmKijangRow> {
  if (latestCache && Date.now() - latestCache.at < LATEST_CACHE_MS) {
    return latestCache.row
  }

  const response = await fetch('/api/bnm/kijang-emas')
  if (!response.ok) {
    throw new Error(`BNM kijang-emas failed (${response.status})`)
  }

  const json = (await response.json()) as BnmKijangResponse
  const row = normalizeRows(json.data)[0]
  if (!row?.one_oz || !row.effective_date) {
    throw new Error('BNM kijang-emas response was empty')
  }

  latestCache = { at: Date.now(), row }
  return row
}

async function fetchBnmMonth(year: number, month: number): Promise<BnmKijangRow[]> {
  const key = `${year}-${month}`
  const cached = monthCache.get(key)
  if (cached) return cached

  const response = await fetch(`/api/bnm/kijang-emas/year/${year}/month/${month}`)
  if (!response.ok) {
    throw new Error(`BNM chart month failed (${response.status})`)
  }

  const json = (await response.json()) as BnmKijangResponse
  const rows = normalizeRows(json.data)
  monthCache.set(key, rows)
  return rows
}

function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const date = new Date(Date.UTC(year, month - 1 + delta, 1))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 }
}

/** BNM mid MYR/g for a date; uses nearest earlier trading day if closed. */
export async function fetchBnmPriceForDate(dateStr: string): Promise<DateGoldPrice | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null

  const year = Number(dateStr.slice(0, 4))
  const month = Number(dateStr.slice(5, 7))

  let rows = await fetchBnmMonth(year, month)

  // Also pull previous month so weekends/holidays near month start can fall back.
  const prev = shiftMonth(year, month, -1)
  const prevRows = await fetchBnmMonth(prev.year, prev.month)
  rows = [...prevRows, ...rows].sort((a, b) =>
    a.effective_date.localeCompare(b.effective_date),
  )

  const exact = rows.find((row) => row.effective_date === dateStr)
  const nearest = [...rows].reverse().find((row) => row.effective_date <= dateStr)
  const chosen = exact ?? nearest

  if (!chosen?.one_oz) {
    console.log('cwlog: no BNM price found for date', dateStr)
    return null
  }

  const result = {
    pricePerGram: ozToGram(midOzPrice(chosen.one_oz)),
    matchedDate: chosen.effective_date,
    exact: chosen.effective_date === dateStr,
  }

  console.log('cwlog: fetched BNM price for date', { requested: dateStr, ...result })
  return result
}

function saveChartCache(points: ChartPoint[]): void {
  try {
    window.localStorage.setItem(
      CHART_CACHE_KEY,
      JSON.stringify({ savedAt: new Date().toISOString(), points }),
    )
  } catch (error) {
    console.log('cwlog: failed to cache chart points', error)
  }
}

function loadChartCache(): ChartPoint[] | null {
  try {
    const raw = window.localStorage.getItem(CHART_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { points?: ChartPoint[] }
    if (!Array.isArray(parsed.points) || parsed.points.length === 0) return null
    return parsed.points
  } catch {
    return null
  }
}

/** Live MYR/g from BNM Kijang Emas mid (buy+sell)/2. */
export async function fetchLiveGoldPrice(): Promise<LiveGoldPrice> {
  const row = await fetchLatestBnmRow()
  const pricePerOunce = midOzPrice(row.one_oz)
  const pricePerGram = ozToGram(pricePerOunce)

  console.log('cwlog: fetched live MYR gold price from BNM', {
    pricePerGram,
    pricePerOunce,
    effectiveDate: row.effective_date,
  })

  return {
    pricePerGram,
    pricePerOunce,
    computedAt: `${row.effective_date}T00:00:00+08:00`,
    isStale: false,
  }
}

/** Official BNM Kijang Emas history as MYR/gram (mid buy/sell). */
async function fetchBnmChartMyr(fromStr: string, toStr: string): Promise<ChartPoint[]> {
  const months = monthKeysBetween(fromStr, toStr)
  const rows = (
    await Promise.all(months.map(({ year, month }) => fetchBnmMonth(year, month)))
  ).flat()

  const byDate = new Map<string, ChartPoint>()

  for (const row of rows) {
    const buying = row.one_oz?.buying
    const selling = row.one_oz?.selling
    if (!row.effective_date || !Number.isFinite(buying) || !Number.isFinite(selling)) {
      continue
    }
    if (row.effective_date < fromStr || row.effective_date > toStr) {
      continue
    }

    byDate.set(row.effective_date, {
      date: row.effective_date,
      pricePerGram: ozToGram(midOzPrice(row.one_oz)),
    })
  }

  const points = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
  console.log('cwlog: built MYR gold chart from BNM kijang-emas', { count: points.length })
  return points
}

/** Fetch up to 2 months of BNM daily gold prices. */
export async function fetchGoldChartMyr(): Promise<ChartPoint[]> {
  const toStr = toDateInput(new Date())
  const fromStr = rangeStartDate(MAX_CHART_DAYS)

  try {
    const points = await fetchBnmChartMyr(fromStr, toStr)
    if (points.length > 0) {
      saveChartCache(points)
      return points
    }
  } catch (error) {
    console.log('cwlog: BNM chart failed', error)
  }

  const cached = loadChartCache()
  if (cached) {
    console.log('cwlog: using cached chart points', { count: cached.length })
    return cached
  }

  throw new Error('Could not load gold chart from BNM')
}

export function filterChartPointsByRange(
  points: ChartPoint[],
  range: ChartRange,
): ChartPoint[] {
  const days = CHART_RANGE_DAYS[range]
  const cutoff = rangeStartDate(days)
  const filtered = points.filter((point) => point.date >= cutoff)

  if (filtered.length === 0 && points.length > 0) {
    return [points[points.length - 1]]
  }

  console.log('cwlog: filtered chart by range', { range, count: filtered.length })
  return filtered
}

export async function fetchKijangEmas(): Promise<KijangEmas | null> {
  try {
    const row = await fetchLatestBnmRow()
    return {
      effectiveDate: row.effective_date,
      oneOzBuying: row.one_oz.buying,
      oneOzSelling: row.one_oz.selling,
    }
  } catch (error) {
    console.log('cwlog: BNM kijang-emas request failed', error)
    return null
  }
}
