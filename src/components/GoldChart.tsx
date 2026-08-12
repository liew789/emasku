import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useLocale } from '../i18n/LocaleContext'
import { formatRm } from '../lib/calc'
import type { ChartPoint, ChartRange } from '../types'
import { CHART_RANGES } from '../types'

type GoldChartProps = {
  points: ChartPoint[]
  range: ChartRange
  onRangeChange: (range: ChartRange) => void
  loading: boolean
  error: string | null
}

const RANGE_LABEL_KEY = {
  '1d': 'range1d',
  '1w': 'range1w',
  '1m': 'range1m',
  '2m': 'range2m',
} as const

export default function GoldChart({
  points,
  range,
  onRangeChange,
  loading,
  error,
}: GoldChartProps) {
  const { tr, dateLocale } = useLocale()

  function formatAxisDate(value: string): string {
    const date = new Date(`${value}T00:00:00`)
    if (range === '1d' || range === '1w') {
      return date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })
    }
    return date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })
  }

  return (
    <section className="chart-panel" aria-labelledby="chart-heading">
      <div className="section-head section-head--chart">
        <div>
          <h2 id="chart-heading">{tr('chartTitle')}</h2>
          <p>{tr('chartSubtitle')}</p>
        </div>

        <div className="range-switch" role="group" aria-label={tr('chartRangeAria')}>
          {CHART_RANGES.map((item) => (
            <button
              key={item}
              type="button"
              className={`range-switch__btn ${range === item ? 'is-active' : ''}`}
              onClick={() => {
                onRangeChange(item)
                console.log('cwlog: chart range changed', item)
              }}
              aria-pressed={range === item}
            >
              {tr(RANGE_LABEL_KEY[item])}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-panel__body">
        {loading && <div className="state-block">{tr('chartLoading')}</div>}
        {!loading && error && <div className="state-block state-block--error">{error}</div>}
        {!loading && !error && points.length === 0 && (
          <div className="state-block">{tr('chartEmpty')}</div>
        )}
        {!loading && !error && points.length > 0 && (
          <div className="chart-panel__canvas">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7A2F" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#FF7A2F" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(232, 93, 28, 0.12)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatAxisDate}
                  tick={{ fill: '#8A5A3A', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={range === '2m' ? 36 : 24}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickFormatter={(value: number) => `RM${Math.round(value)}`}
                  tick={{ fill: '#8A5A3A', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fffaf4',
                    border: '1px solid rgba(255, 122, 47, 0.35)',
                    borderRadius: 12,
                    color: '#2b160c',
                    boxShadow: '0 12px 28px rgba(232, 93, 28, 0.12)',
                  }}
                  labelFormatter={(label) => formatAxisDate(String(label))}
                  formatter={(value) => [formatRm(Number(value)), 'RM/g']}
                />
                <Area
                  type="monotone"
                  dataKey="pricePerGram"
                  stroke="#E85D1C"
                  strokeWidth={2.5}
                  fill="url(#goldFill)"
                  animationDuration={900}
                  dot={points.length <= 3}
                  activeDot={{ r: 5, fill: '#FF9A4D', stroke: '#fffaf4' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  )
}
