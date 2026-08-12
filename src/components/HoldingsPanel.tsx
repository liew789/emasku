import { useLocale } from '../i18n/LocaleContext'
import { calcHoldingPnL, formatGrams, formatPercent, formatRm } from '../lib/calc'
import type { Holding } from '../types'

type HoldingsPanelProps = {
  holdings: Holding[]
  livePricePerGram: number | null
  editingId: string | null
  onEdit: (holding: Holding) => void
  onRemove: (id: string) => void
}

function pnlClass(value: number): string {
  if (value > 0) return 'pnl pnl--gain'
  if (value < 0) return 'pnl pnl--loss'
  return 'pnl'
}

export default function HoldingsPanel({
  holdings,
  livePricePerGram,
  editingId,
  onEdit,
  onRemove,
}: HoldingsPanelProps) {
  const { tr } = useLocale()
  const rows = holdings.map((holding) => calcHoldingPnL(holding, livePricePerGram))

  return (
    <section className="holdings-list-panel" aria-labelledby="purchases-heading">
      <div className="section-head">
        <h2 id="purchases-heading">{tr('purchasesListTitle')}</h2>
        <p>{tr('purchasesListSubtitle')}</p>
      </div>

      {rows.length === 0 ? (
        <div className="state-block">{tr('emptyHoldings')}</div>
      ) : (
        <ul className="holdings-list">
          {rows.map((row) => (
            <li
              key={row.id}
              className={`holding-row ${editingId === row.id ? 'is-editing' : ''}`}
            >
              <div className="holding-row__main">
                <strong>{formatGrams(row.grams)}</strong>
                <span>
                  {tr('boughtAt', {
                    date: row.purchaseDate,
                    price: formatRm(row.pricePerGram),
                  })}
                </span>
              </div>
              <div className={`holding-row__pnl ${pnlClass(row.pnl)}`}>
                <strong>{livePricePerGram == null ? '—' : formatRm(row.pnl)}</strong>
                <span>{livePricePerGram == null ? '' : formatPercent(row.pnlPercent)}</span>
              </div>
              <div className="holding-row__actions">
                <button
                  type="button"
                  className="btn btn--tiny"
                  onClick={() => onEdit(row)}
                  aria-label={tr('editAria', { grams: row.grams })}
                >
                  {tr('edit')}
                </button>
                <button
                  type="button"
                  className="btn btn--tiny"
                  onClick={() => onRemove(row.id)}
                  aria-label={tr('removeAria', { grams: row.grams })}
                >
                  {tr('remove')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
