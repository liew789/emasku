import { useLocale } from '../i18n/LocaleContext'
import { LOCALES, type Locale } from '../i18n/translations'

export default function LanguageSwitcher() {
  const { locale, setLocale, tr } = useLocale()

  return (
    <div className="lang-switch" role="group" aria-label={tr('langAria')}>
      {LOCALES.map((item) => (
        <button
          key={item.code}
          type="button"
          className={`lang-switch__btn ${locale === item.code ? 'is-active' : ''}`}
          onClick={() => {
            setLocale(item.code as Locale)
            console.log('cwlog: locale changed', item.code)
          }}
          aria-pressed={locale === item.code}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
