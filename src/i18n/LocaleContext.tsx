import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { localeTags, t, type Locale } from './translations'

const STORAGE_KEY = 'emasku.locale.v1'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  tr: (key: Parameters<typeof t>[1], vars?: Record<string, string | number>) => string
  dateLocale: string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function detectLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ms' || saved === 'zh') return saved
  } catch {
    /* ignore */
  }

  const lang = (navigator.language || 'en').toLowerCase()
  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('ms') || lang.startsWith('id')) return 'ms'
  return 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale())

  useEffect(() => {
    document.documentElement.lang = localeTags[locale]
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch (error) {
      console.log('cwlog: failed to persist locale', error)
    }
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      tr: (key, vars) => t(locale, key, vars),
      dateLocale: localeTags[locale],
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
