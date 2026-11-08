
import {
  useEffect,
  useState,
} from "react"

import {
  getReviewConfig,
  getSavedCurriculumTab,
  saveReviewConfig,
} from "../utils/reviewStorage"

const VALID_CURRICULUM_TABS = [
  "minna",
  "n3",
  "mixed",
]

const VALID_N3_SOURCES = ["mimi-kara", "sou-matome-kanji"]

const normalizeKanjiPairs = (pairs = []) => {
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

  normalized.sort((a, b) => a.week - b.week || a.day - b.day)
  return normalized
}

export default function useReviewConfig() {
  const [selectedLessons, setSelectedLessons] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [curriculumTab, setCurriculumTab] = useState("minna")

  const [selectedUnits, setSelectedUnits] = useState([])
  const [selectedN3Topics, setSelectedN3Topics] = useState([])
  const [selectedKanjiPairs, setSelectedKanjiPairs] = useState([])
  const [n3Source, setN3Source] = useState(null)

  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] = useState([])
  const [mode, setMode] = useState("flashcard")
  const [directions, setDirections] = useState(["jp_vi"])
  const [reviewLimit, setReviewLimit] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = getReviewConfig()
    const fallbackCurriculumTab = getSavedCurriculumTab()

    if (!saved) {
      const nextTab = VALID_CURRICULUM_TABS.includes(fallbackCurriculumTab)
        ? fallbackCurriculumTab
        : "minna"

      setCurriculumTab(nextTab)
      setN3Source(null)
      setIsHydrated(true)
      return
    }

    const safeUnits = Array.isArray(saved.units) ? saved.units : []
    const safeN3Topics = Array.isArray(saved.n3Topics) ? saved.n3Topics : []
    const safePairs = normalizeKanjiPairs(saved.n3KanjiPairs)

    setSelectedLessons(Array.isArray(saved.lessons) ? saved.lessons : [])
    setSelectedTopics(Array.isArray(saved.topics) ? saved.topics : [])
    setSelectedUnits(safeUnits)
    setSelectedN3Topics(safeN3Topics)
    setSelectedKanjiPairs(safePairs)
    setSelectedPartsOfSpeech(Array.isArray(saved.partsOfSpeech) ? saved.partsOfSpeech : [])

    const nextTab = VALID_CURRICULUM_TABS.includes(saved.curriculumTab)
      ? saved.curriculumTab
      : VALID_CURRICULUM_TABS.includes(fallbackCurriculumTab)
        ? fallbackCurriculumTab
        : "minna"

    setCurriculumTab(nextTab)
    setMode(saved.mode || "flashcard")
    setDirections(Array.isArray(saved.directions) && saved.directions.length > 0 ? saved.directions : ["jp_vi"])
    setReviewLimit(saved.limit ?? null)
    setN3Source(VALID_N3_SOURCES.includes(saved.n3Source) ? saved.n3Source : null)
    setIsHydrated(true)
  }, [])

  const config = {
    lessons: selectedLessons,
    topics: selectedTopics,
    units: selectedUnits,
    n3Topics: selectedN3Topics,
    n3KanjiPairs: selectedKanjiPairs,
    n3Source,
    partsOfSpeech: selectedPartsOfSpeech,
    curriculumTab,
    mode,
    directions,
    limit: reviewLimit,
  }

  useEffect(() => {
    if (!isHydrated) return

    saveReviewConfig(config)
  }, [
    selectedLessons,
    selectedTopics,
    selectedUnits,
    selectedN3Topics,
    selectedKanjiPairs,
    selectedPartsOfSpeech,
    curriculumTab,
    n3Source,
    mode,
    directions,
    reviewLimit,
    isHydrated,
  ])

  const saveConfig = () => {
    saveReviewConfig(config)
  }

  return {
    selectedLessons,
    setSelectedLessons,
    selectedTopics,
    setSelectedTopics,
    selectedUnits,
    setSelectedUnits,
    selectedN3Topics,
    setSelectedN3Topics,
    selectedKanjiPairs,
    setSelectedKanjiPairs,
    selectedPartsOfSpeech,
    setSelectedPartsOfSpeech,
    curriculumTab,
    setCurriculumTab,
    n3Source,
    setN3Source,
    mode,
    setMode,
    directions,
    setDirections,
    reviewLimit,
    setReviewLimit,
    config,
    saveConfig,
  }
}
