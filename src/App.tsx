import { useEffect, useMemo, useState } from 'react'
import GoldChart from './components/GoldChart'
import HeroPrice from './components/HeroPrice'
import HoldingsPanel from './components/HoldingsPanel'
import LanguageSwitcher from './components/LanguageSwitcher'
import PortfolioSummary from './components/PortfolioSummary'
import PurchaseForm, { type PurchaseInput } from './components/PurchaseForm'
import { useLocale } from './i18n/LocaleContext'
import {
  fetchGoldChartMyr,
  fetchKijangEmas,
  fetchLiveGoldPrice,
  filterChartPointsByRange,
} from './lib/goldApi'
import {
  addHolding,
  createHolding,
  loadHoldings,
  removeHolding,
  updateHolding,
} from './lib/storage'
import type { ChartPoint, ChartRange, Holding, KijangEmas, LiveGoldPrice } from './types'
import { DEFAULT_CHART_RANGE } from './types'

export default function App() {
  const { tr } = useLocale()
  const [holdings, setHoldings] = useState<Holding[]>(() => loadHoldings())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [live, setLive] = useState<LiveGoldPrice | null>(null)
  const [kijang, setKijang] = useState<KijangEmas | null>(null)
  const [allChartPoints, setAllChartPoints] = useState<ChartPoint[]>([])
  const [chartRange, setChartRange] = useState<ChartRange>(DEFAULT_CHART_RANGE)
  const [liveLoading, setLiveLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(true)
  const [liveError, setLiveError] = useState<string | null>(null)
  const [chartError, setChartError] = useState<string | null>(null)

  const chartPoints = useMemo(
    () => filterChartPointsByRange(allChartPoints, chartRange),
    [allChartPoints, chartRange],
  )

  useEffect(() => {
    let cancelled = false

    async function loadMarketData() {
      setLiveLoading(true)
      setChartLoading(true)
      setLiveError(null)
      setChartError(null)

      const [liveResult, chartResult, kijangResult] = await Promise.allSettled([
        fetchLiveGoldPrice(),
        fetchGoldChartMyr(),
        fetchKijangEmas(),
      ])

      if (cancelled) return

      if (liveResult.status === 'fulfilled') {
        setLive(liveResult.value)
      } else {
        console.log('cwlog: live price loads failed', liveResult.reason)
        setLiveError('live')
      }

      if (chartResult.status === 'fulfilled') {
        setAllChartPoints(chartResult.value)
      } else {
        console.log('cwlog: chart load failed', chartResult.reason)
        setChartError('chart')
      }

      if (kijangResult.status === 'fulfilled') {
        setKijang(kijangResult.value)
      }

      setLiveLoading(false)
      setChartLoading(false)
    }

    void loadMarketData()

    return () => {
      cancelled = true
    }
  }, [])

  const editingHolding = holdings.find((holding) => holding.id === editingId) ?? null

  function handleAdd(input: PurchaseInput) {
    const holding = createHolding(input)
    setHoldings((current) => addHolding(current, holding))
  }

  function handleUpdate(id: string, input: PurchaseInput) {
    setHoldings((current) => updateHolding(current, id, input))
    setEditingId(null)
  }

  function handleEdit(holding: Holding) {
    setEditingId(holding.id)
    console.log('cwlog: edit purchase selected', holding.id)
    document.getElementById('purchase-heading')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  function handleRemove(id: string) {
    if (editingId === id) {
      setEditingId(null)
    }
    setHoldings((current) => removeHolding(current, id))
  }

  return (
    <div className="app-shell">
      <div className="atmosphere" aria-hidden="true" />
      <main className="page">
        <div className="topbar">
          <LanguageSwitcher />
        </div>

        <HeroPrice
          live={live}
          kijang={kijang}
          loading={liveLoading}
          error={liveError ? tr('liveError') : null}
        />
        <GoldChart
          points={chartPoints}
          range={chartRange}
          onRangeChange={setChartRange}
          loading={chartLoading}
          error={chartError ? tr('chartError') : null}
        />

        <div className="track-grid">
          <PortfolioSummary
            holdings={holdings}
            livePricePerGram={live?.pricePerGram ?? null}
          />
          <PurchaseForm
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onCancelEdit={handleCancelEdit}
            editingHolding={editingHolding}
            suggestedPrice={live?.pricePerGram ?? null}
          />
          <HoldingsPanel
            holdings={holdings}
            livePricePerGram={live?.pricePerGram ?? null}
            editingId={editingId}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        </div>

        <footer className="footer">
          <p>{tr('footer')}</p>
        </footer>
      </main>
    </div>
  )
}
