import { useLocale } from '../i18n/LocaleContext'
import { formatRm } from '../lib/calc'
import type { KijangEmas, LiveGoldPrice } from '../types'

type HeroPriceProps = {
  live: LiveGoldPrice | null
  kijang: KijangEmas | null
  loading: boolean
  error: string | null
}

export default function HeroPrice({ live, kijang, loading, error }: HeroPriceProps) {
  const { tr, dateLocale } = useLocale()

  const updatedLabel = live?.computedAt
    ? new Date(live.computedAt).toLocaleString(dateLocale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  return (
    <header className="hero">
      <p className="hero__eyebrow">{tr('eyebrow')}</p>
      <h1 className="hero__brand">{tr('brandName')}</h1>
      <p className="hero__tagline">{tr('tagline')}</p>

      <div className={`hero__price ${loading ? 'is-loading' : 'is-ready'}`}>
        {error && !live ? (
          <p className="hero__error">{error}</p>
        ) : (
          <>
            <span className="hero__price-label">{tr('liveGold')}</span>
            <strong className="hero__price-value">
              {live ? formatRm(live.pricePerGram) : '—'}
              <span>/g</span>
            </strong>
            {updatedLabel && (
              <span className="hero__meta">
                {tr('updated')} {updatedLabel}
                {live?.isStale ? ` · ${tr('delayed')}` : ''}
              </span>
            )}
          </>
        )}
      </div>

      {kijang && (
        <p className="hero__bnm">
          {tr('bnmLine', {
            buy: formatRm(kijang.oneOzBuying, 0),
            sell: formatRm(kijang.oneOzSelling, 0),
            date: kijang.effectiveDate,
          })}
        </p>
      )}
    </header>
  )
}
