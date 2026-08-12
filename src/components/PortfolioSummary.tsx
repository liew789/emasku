import { useLocale } from '../i18n/LocaleContext'
import { calcPortfolioSummary, formatGrams, formatPercent, formatRm } from '../lib/calc'
import type { Holding } from '../types'

type PortfolioSummaryProps = {
  holdings: Holding[]
  livePricePerGram: number | null
}

function pnlClass(value: number): string {
  if (value > 0) return 'pnl pnl--gain'
  if (value < 0) return 'pnl pnl--loss'
  return 'pnl'
}

export default function PortfolioSummary({
  holdings,
  livePricePerGram,
}: PortfolioSummaryProps) {
  const { tr } = useLocale()
  const summary = calcPortfolioSummary(holdings, livePricePerGram)

  return (
    <section className="holdings-summary" aria-labelledby="holdings-heading">
      <div className="section-head">
        <h2 id="holdings-heading">{tr('holdingsTitle')}</h2>
        <p>{tr('holdingsSubtitle')}</p>
      </div>

      <div className={`summary ${pnlClass(summary.totalPnl)}`}>
        <div>
          <span className="summary__label">{tr('portfolioPnl')}</span>
          <strong className="summary__value">
            {livePricePerGram == null ? '—' : formatRm(summary.totalPnl)}
          </strong>
          <span className="summary__pct">
            {livePricePerGram == null || holdings.length === 0
              ? tr('addToTrack')
              : formatPercent(summary.totalPnlPercent)}
          </span>
        </div>
        <dl className="summary__stats">
          <div>
            <dt>{tr('totalGold')}</dt>
            <dd>{formatGrams(summary.totalGrams)}</dd>
          </div>
          <div>
            <dt>{tr('cost')}</dt>
            <dd>{formatRm(summary.totalCost)}</dd>
          </div>
          <div>
            <dt>{tr('valueNow')}</dt>
            <dd>{livePricePerGram == null ? '—' : formatRm(summary.totalValue)}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
