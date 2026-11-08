// utils/reviewStorage.js

export const REVIEW_CONFIG_KEY = "reviewConfig"
export const REVIEW_CURRICULUM_TAB_KEY = "reviewCurriculumTab"
export const REVIEW_SESSION_KEY = "reviewSessionData"
export const FLASHCARD_PROGRESS_KEY = "flashcardProgress"

export const N3_REVIEW_CONFIG_KEY = "n3ReviewConfig"
export const N3_REVIEW_SESSION_KEY = "n3ReviewSessionData"
export const N3_FLASHCARD_PROGRESS_KEY = "n3FlashcardProgress"

const VALID_CURRICULUM_TABS = ["minna", "n3", "mixed"]
const VALID_N3_SOURCES = ["mimi-kara", "sou-matome-kanji"]

const parseLocalStorageValue = (value, fallback = null) => {
  if (value === null || value === undefined) return fallback

  try {
    const parsed = JSON.parse(value)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

const normalizeKanjiPairs = (pairs) => {
  if (!Array.isArray(pairs)) return []

  const seen = new Set()
  const normalized = []

  for (const pair of pairs) {
    const week = Number(pair?.week)
    const day = Number(pair?.day)

    if (!Number.isInteger(week) || week <= 0 || !Number.isInteger(day) || day <= 0) {
      continue
    }

    const key = `${week}-${day}`

    if (seen.has(key)) continue

    seen.add(key)
    normalized.push({ week, day })
  }

  return normalized.sort((a, b) => a.week - b.week || a.day - b.day)
}

const normalizeN3Source = (value) => {
  if (VALID_N3_SOURCES.includes(value)) {
    return value
  }

  return null
}

const normalizeDirections = (directions) => {
  if (!Array.isArray(directions) || directions.length === 0) {
    return ["jp_vi"]
  }

  const uniqueDirections = [...new Set(directions.filter(Boolean))]
  return uniqueDirections.length > 0 ? uniqueDirections : ["jp_vi"]
}

export const getSavedCurriculumTab = () => {
  try {
    const raw = localStorage.getItem(REVIEW_CURRICULUM_TAB_KEY)
    const parsed = parseLocalStorageValue(raw, null)

    return parsed && VALID_CURRICULUM_TABS.includes(parsed)
      ? parsed
      : null
  } catch {
    return null
  }
}

export const resolveReviewConfig = (config) => {
  if (!config || typeof config !== "object") {
    return null
  }

  const nextConfig = {
    ...config,
    lessons: Array.isArray(config.lessons) ? config.lessons : [],
    topics: Array.isArray(config.topics) ? config.topics : [],
    units: Array.isArray(config.units) ? config.units : [],
    n3Topics: Array.isArray(config.n3Topics) ? config.n3Topics : [],
    n3KanjiPairs: normalizeKanjiPairs(config.n3KanjiPairs),
    partsOfSpeech: Array.isArray(config.partsOfSpeech) ? config.partsOfSpeech : [],
    curriculumTab: VALID_CURRICULUM_TABS.includes(config.curriculumTab)
      ? config.curriculumTab
      : getSavedCurriculumTab() || "minna",
    n3Source: normalizeN3Source(config.n3Source),
    mode: config.mode || "flashcard",
    directions: normalizeDirections(config.directions),
    limit: config.limit ?? null,
  }

  return nextConfig
}

export const getReviewConfig = () => {
  try {
    const data = localStorage.getItem(REVIEW_CONFIG_KEY)

    if (!data) {
      const legacyTab = getSavedCurriculumTab()
      return legacyTab ? resolveReviewConfig({ curriculumTab: legacyTab }) : null
    }

    const parsed = parseLocalStorageValue(data, null)
    return parsed ? resolveReviewConfig(parsed) : null
  } catch {
    return null
  }
}

export const saveReviewConfig = (config) => {
  if (!config || typeof config !== "object") return

  const normalized = resolveReviewConfig(config)

  if (!normalized) return

  localStorage.setItem(REVIEW_CONFIG_KEY, JSON.stringify(normalized))

  if (normalized.curriculumTab) {
    localStorage.setItem(
      REVIEW_CURRICULUM_TAB_KEY,
      JSON.stringify(normalized.curriculumTab),
    )
  }
}

export const getReviewSession = () => {
  try {
    const data = localStorage.getItem(REVIEW_SESSION_KEY)
    return data ? parseLocalStorageValue(data, null) : null
  } catch {
    return null
  }
}

export const saveReviewSession = (session) => {
  localStorage.setItem(REVIEW_SESSION_KEY, JSON.stringify(session))
}

export const clearReviewSession = () => {
  localStorage.removeItem(REVIEW_SESSION_KEY)
}

export const getN3ReviewConfig = () => {
  try {
    const data = localStorage.getItem(N3_REVIEW_CONFIG_KEY)
    return data ? parseLocalStorageValue(data, null) : null
  } catch {
    return null
  }
}

export const saveN3ReviewConfig = (config) => {
  if (!config || typeof config !== "object") return

  const normalized = resolveReviewConfig(config)
  if (!normalized) return

  localStorage.setItem(N3_REVIEW_CONFIG_KEY, JSON.stringify(normalized))
}

export const getN3ReviewSession = () => {
  try {
    const data = localStorage.getItem(N3_REVIEW_SESSION_KEY)
    return data ? parseLocalStorageValue(data, null) : null
  } catch {
    return null
  }
}

export const saveN3ReviewSession = (session) => {
  localStorage.setItem(N3_REVIEW_SESSION_KEY, JSON.stringify(session))
}

export const clearN3ReviewSession = () => {
  localStorage.removeItem(N3_REVIEW_SESSION_KEY)
}

export const getFlashcardProgress = () => {
  try {
    const data = localStorage.getItem(FLASHCARD_PROGRESS_KEY)
    return data ? parseLocalStorageValue(data, null) : null
  } catch {
    return null
  }
}

export const saveFlashcardProgress = (progress) => {
  localStorage.setItem(FLASHCARD_PROGRESS_KEY, JSON.stringify(progress))
}

export const getN3FlashcardProgress = () => {
  try {
    const data = localStorage.getItem(N3_FLASHCARD_PROGRESS_KEY)
    return data ? parseLocalStorageValue(data, null) : null
  } catch {
    return null
  }
}

export const saveN3FlashcardProgress = (progress) => {
  localStorage.setItem(N3_FLASHCARD_PROGRESS_KEY, JSON.stringify(progress))
}

export const clearFlashcardProgress = () => {
  localStorage.removeItem(FLASHCARD_PROGRESS_KEY)
}

export const clearN3FlashcardProgress = () => {
  localStorage.removeItem(N3_FLASHCARD_PROGRESS_KEY)
}