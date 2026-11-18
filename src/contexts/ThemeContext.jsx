import { useCallback, useEffect, useMemo, useState } from "react"
import { ThemeContext } from "./theme-context"
const THEME_STORAGE_KEY = "nihongo-vocab-theme"
const THEME_MODES = ["light", "dark", "system"]

function resolveTheme(mode, systemPrefersDark) {
  return mode === "system" ? (systemPrefersDark ? "dark" : "light") : mode
}

function readStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return THEME_MODES.includes(storedTheme) ? storedTheme : "system"
  } catch (error) {
    console.warn("Unable to read the saved theme preference.", error)
    return "light"
  }
}

function applyTheme(mode, systemPrefersDark) {
  const resolvedTheme = resolveTheme(mode, systemPrefersDark)

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.style.colorScheme = resolvedTheme
  return resolvedTheme
}

export function ThemeProvider({ children }) {
  const [themeState, setThemeState] = useState(() => {
    const theme = readStoredTheme()
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return {
      theme,
      effectiveTheme: resolveTheme(theme, systemPrefersDark),
    }
  })
  const { theme, effectiveTheme } = themeState

  const setTheme = useCallback((nextTheme) => {
    if (!THEME_MODES.includes(nextTheme)) {
      throw new Error(`Unsupported theme mode: ${nextTheme}`)
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch (error) {
      console.error("Unable to save the theme preference.", error)
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setThemeState({
      theme: nextTheme,
      effectiveTheme: applyTheme(nextTheme, prefersDark),
    })
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateSystemTheme = () => {
      if (theme === "system") {
        setThemeState((previous) => ({
          ...previous,
          effectiveTheme: applyTheme(theme, mediaQuery.matches),
        }))
      }
    }

    applyTheme(theme, mediaQuery.matches)
    mediaQuery.addEventListener("change", updateSystemTheme)

    return () => mediaQuery.removeEventListener("change", updateSystemTheme)
  }, [theme])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== THEME_STORAGE_KEY) return

      const nextTheme = THEME_MODES.includes(event.newValue)
        ? event.newValue
        : "light"
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setThemeState({
        theme: nextTheme,
        effectiveTheme: applyTheme(nextTheme, prefersDark),
      })
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, effectiveTheme }),
    [theme, setTheme, effectiveTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
