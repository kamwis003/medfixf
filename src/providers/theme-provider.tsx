import { useEffect, useMemo, useState } from 'react'
import { ThemeProviderContext, initialState, type TThemeMode } from '@/contexts/theme-context'
import { getCookie, setCookie } from '@/utils/cookies'

type TThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: TThemeMode
  storageKey?: string
}

const isThemeMode = (value: string): value is TThemeMode =>
  value === 'light' || value === 'dark' || value === 'auto'

const readInitialTheme = (key: string, fallback: TThemeMode): TThemeMode => {
  const cookieValue = getCookie(key)
  if (cookieValue && isThemeMode(cookieValue)) return cookieValue
  if (cookieValue === 'system') return 'auto'

  const legacyLocalStorageValue = localStorage.getItem(key)
  if (legacyLocalStorageValue && isThemeMode(legacyLocalStorageValue))
    return legacyLocalStorageValue
  if (legacyLocalStorageValue === 'system') return 'auto'

  return fallback
}

export function ThemeProvider({
  children,
  defaultTheme = initialState.theme,
  storageKey = 'vite-ui-theme',
  ...props
}: TThemeProviderProps) {
  const [theme, setTheme] = useState(() => readInitialTheme(storageKey, defaultTheme))

  const stableSetTheme = useMemo(
    () => (nextTheme: TThemeMode) => {
      setCookie(storageKey, nextTheme)
      setTheme(nextTheme)
    },
    [storageKey]
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const applySystemTheme = () => {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.classList.remove('light', 'dark')
        root.classList.add(systemTheme)
      }

      applySystemTheme()

      mediaQuery.addEventListener('change', applySystemTheme)
      return () => {
        mediaQuery.removeEventListener('change', applySystemTheme)
      }
    }

    root.classList.add(theme)
    return () => undefined
  }, [theme])

  const value = {
    theme,
    setTheme: stableSetTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
