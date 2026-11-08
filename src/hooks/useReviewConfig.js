
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

export default function useReviewConfig() {

  // ======================
  // MINNA
  // ======================

  const [selectedLessons, setSelectedLessons] =
    useState([])

  const [selectedTopics, setSelectedTopics] =
    useState([])

  const [curriculumTab, setCurriculumTab] =
    useState("minna")


  // ======================
  // N3
  // ======================

  const [selectedUnits, setSelectedUnits] =
    useState([])

  const [selectedN3Topics, setSelectedN3Topics] =
    useState([])


  // ======================
  // COMMON
  // ======================

  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] =
    useState([])

  const [mode, setMode] =
    useState("flashcard")

  const [directions, setDirections] =
    useState(["jp_vi"])

  const [reviewLimit, setReviewLimit] =
    useState(null)

  const [isHydrated, setIsHydrated] =
    useState(false)


  // ======================
  // LOAD CONFIG
  // ======================

  useEffect(() => {

    const saved = getReviewConfig()

    const fallbackCurriculumTab = getSavedCurriculumTab()

    if (!saved) {
      setCurriculumTab(
        VALID_CURRICULUM_TABS.includes(fallbackCurriculumTab)
          ? fallbackCurriculumTab
          : "minna"
      )
      setIsHydrated(true)
      return
    }

    setSelectedLessons(
      saved.lessons || []
    )

    setSelectedTopics(
      saved.topics || []
    )

    setSelectedUnits(
      saved.units || []
    )

    setSelectedN3Topics(
      saved.n3Topics || []
    )

    setSelectedPartsOfSpeech(
      saved.partsOfSpeech || []
    )

    setCurriculumTab(
      VALID_CURRICULUM_TABS.includes(saved.curriculumTab)
        ? saved.curriculumTab
        : VALID_CURRICULUM_TABS.includes(fallbackCurriculumTab)
          ? fallbackCurriculumTab
          : "minna"
    )

    setMode(
      saved.mode || "flashcard"
    )

    setDirections(
      saved.directions || ["jp_vi"]
    )

    setReviewLimit(
      saved.limit ?? null
    )

    setIsHydrated(true)
  }, [])


  // ======================
  // CONFIG
  // ======================

  const config = {

    lessons: selectedLessons,

    topics: selectedTopics,

    units: selectedUnits,

    n3Topics: selectedN3Topics,

    partsOfSpeech: selectedPartsOfSpeech,

    curriculumTab,

    mode,

    directions,

    limit: reviewLimit,

  }


  // ======================
  // SAVE CONFIG
  // ======================

  useEffect(() => {

    if (!isHydrated) return

    saveReviewConfig(config)

  }, [
    selectedLessons,
    selectedTopics,
    selectedUnits,
    selectedN3Topics,
    selectedPartsOfSpeech,
    curriculumTab,
    mode,
    directions,
    reviewLimit,
    isHydrated,
  ])

  const saveConfig = () => {

    saveReviewConfig(config)

  }


  // ======================
  // RETURN
  // ======================

  return {

    selectedLessons,
    setSelectedLessons,

    selectedTopics,
    setSelectedTopics,

    selectedUnits,
    setSelectedUnits,

    selectedN3Topics,
    setSelectedN3Topics,

    selectedPartsOfSpeech,
    setSelectedPartsOfSpeech,

    curriculumTab,
    setCurriculumTab,

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
