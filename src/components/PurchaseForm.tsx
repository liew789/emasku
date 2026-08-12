import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocale } from '../i18n/LocaleContext'
import { fetchBnmPriceForDate } from '../lib/goldApi'
import type { Holding } from '../types'

export type PurchaseInput = {
  grams: number
  purchaseDate: string
  pricePerGram: number
}

type PurchaseFormProps = {
  onAdd: (input: PurchaseInput) => void
  onUpdate: (id: string, input: PurchaseInput) => void
  onCancelEdit: () => void
  editingHolding: Holding | null
  suggestedPrice: number | null
}

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function PurchaseForm({
  onAdd,
  onUpdate,
  onCancelEdit,
  editingHolding,
  suggestedPrice,
}: PurchaseFormProps) {
  const { tr } = useLocale()
  const [grams, setGrams] = useState('')
  const [purchaseDate, setPurchaseDate] = useState(todayInputValue)
  const [pricePerGram, setPricePerGram] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [priceHint, setPriceHint] = useState<string | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const skipDateFetchRef = useRef(false)

  const isEditing = editingHolding != null

  useEffect(() => {
    if (editingHolding) {
      skipDateFetchRef.current = true
      setGrams(String(editingHolding.grams))
      setPurchaseDate(editingHolding.purchaseDate)
      setPricePerGram(String(editingHolding.pricePerGram))
      setError(null)
      setPriceHint(null)
      console.log('cwlog: purchase form entered edit mode', editingHolding.id)
      return
    }

    skipDateFetchRef.current = false
    setGrams('')
    setPricePerGram('')
    setPurchaseDate(todayInputValue())
    setError(null)
    setPriceHint(null)
  }, [editingHolding])

  useEffect(() => {
    if (!purchaseDate) return

    if (skipDateFetchRef.current) {
      skipDateFetchRef.current = false
      return
    }

    let cancelled = false

    async function fillPriceForDate() {
      setPriceLoading(true)
      setPriceHint(null)

      try {
        const result = await fetchBnmPriceForDate(purchaseDate)
        if (cancelled) return

        if (!result) {
          setPriceHint(tr('priceAutoMissing'))
          return
        }

        setPricePerGram(result.pricePerGram.toFixed(2))
        setPriceHint(
          result.exact
            ? tr('priceAutoExact', { date: result.matchedDate })
            : tr('priceAutoNearest', {
                requested: purchaseDate,
                date: result.matchedDate,
              }),
        )
      } catch (error) {
        if (cancelled) return
        console.log('cwlog: auto price fill failed', error)
        setPriceHint(tr('priceAutoMissing'))
      } finally {
        if (!cancelled) setPriceLoading(false)
      }
    }

    void fillPriceForDate()

    return () => {
      cancelled = true
    }
    // Only refetch when the chosen date changes, not when language switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseDate])

  function resetForm() {
    setGrams('')
    setPricePerGram('')
    setPurchaseDate(todayInputValue())
    setError(null)
    setPriceHint(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const gramsValue = Number(grams)
    const priceValue = Number(pricePerGram)

    if (!Number.isFinite(gramsValue) || gramsValue <= 0) {
      setError(tr('errGrams'))
      return
    }
    if (!purchaseDate) {
      setError(tr('errDate'))
      return
    }
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setError(tr('errPrice'))
      return
    }

    const input = {
      grams: gramsValue,
      purchaseDate,
      pricePerGram: priceValue,
    }

    if (editingHolding) {
      onUpdate(editingHolding.id, input)
      console.log('cwlog: purchase form updated holding', {
        id: editingHolding.id,
        ...input,
      })
    } else {
      onAdd(input)
      console.log('cwlog: purchase form submitted', input)
      resetForm()
    }
  }

  function useLivePrice() {
    if (suggestedPrice == null) return
    setPricePerGram(suggestedPrice.toFixed(2))
    setPriceHint(tr('priceAutoExact', { date: todayInputValue() }))
  }

  return (
    <section
      className={`form-panel ${isEditing ? 'form-panel--editing' : ''}`}
      aria-labelledby="purchase-heading"
    >
      <div className="section-head">
        <h2 id="purchase-heading">
          {isEditing ? tr('editPurchaseTitle') : tr('purchaseTitle')}
        </h2>
        <p>{isEditing ? tr('editPurchaseSubtitle') : tr('purchaseSubtitle')}</p>
      </div>

      <form className="purchase-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>{tr('gramsLabel')}</span>
          <input
            type="number"
            inputMode="decimal"
            min="0.001"
            step="0.001"
            placeholder={tr('gramsPlaceholder')}
            value={grams}
            onChange={(event) => setGrams(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>{tr('dateLabel')}</span>
          <input
            type="date"
            value={purchaseDate}
            max={todayInputValue()}
            onChange={(event) => setPurchaseDate(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>{tr('priceLabel')}</span>
          <input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder={priceLoading ? tr('priceAutoLoading') : tr('pricePlaceholder')}
            value={pricePerGram}
            onChange={(event) => {
              setPricePerGram(event.target.value)
              setPriceHint(tr('priceAutoEditable'))
            }}
            required
          />
          {priceLoading && <span className="field-hint">{tr('priceAutoLoading')}</span>}
          {!priceLoading && priceHint && <span className="field-hint">{priceHint}</span>}
        </label>

        {suggestedPrice != null && (
          <button type="button" className="btn btn--ghost" onClick={useLivePrice}>
            {tr('useLivePrice', { price: suggestedPrice.toFixed(2) })}
          </button>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          {isEditing && (
            <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
              {tr('cancelEdit')}
            </button>
          )}
          <button type="submit" className="btn btn--primary">
            {isEditing ? tr('savePurchase') : tr('addPurchase')}
          </button>
        </div>
      </form>
    </section>
  )
}
