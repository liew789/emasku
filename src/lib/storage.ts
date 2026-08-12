import type { Holding } from '../types'

const STORAGE_KEY = 'emasku.holdings.v1'

function canUseStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

export function loadHoldings(): Holding[] {
  if (!canUseStorage()) return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as Holding[]
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item) =>
        typeof item?.id === 'string' &&
        typeof item?.grams === 'number' &&
        typeof item?.purchaseDate === 'string' &&
        typeof item?.pricePerGram === 'number',
    )
  } catch (error) {
    console.log('cwlog: failed to load holdings from localStorage', error)
    return []
  }
}

export function saveHoldings(holdings: Holding[]): void {
  if (!canUseStorage()) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings))
  } catch (error) {
    console.log('cwlog: failed to save holdings to localStorage', error)
  }
}

export function createHolding(input: {
  grams: number
  purchaseDate: string
  pricePerGram: number
}): Holding {
  return {
    id: crypto.randomUUID(),
    grams: input.grams,
    purchaseDate: input.purchaseDate,
    pricePerGram: input.pricePerGram,
    createdAt: new Date().toISOString(),
  }
}

export function addHolding(holdings: Holding[], holding: Holding): Holding[] {
  const next = [holding, ...holdings]
  saveHoldings(next)
  return next
}

export function removeHolding(holdings: Holding[], id: string): Holding[] {
  const next = holdings.filter((holding) => holding.id !== id)
  saveHoldings(next)
  return next
}

export function updateHolding(
  holdings: Holding[],
  id: string,
  input: {
    grams: number
    purchaseDate: string
    pricePerGram: number
  },
): Holding[] {
  const next = holdings.map((holding) =>
    holding.id === id
      ? {
          ...holding,
          grams: input.grams,
          purchaseDate: input.purchaseDate,
          pricePerGram: input.pricePerGram,
        }
      : holding,
  )
  saveHoldings(next)
  return next
}
