
import {
  useEffect,
  useState,
} from "react"

import {
  getReviewConfig,
  saveReviewConfig,
} from "../utils/reviewStorage"


export default function useReviewConfig() {

  // ======================
  // MINNA
  // ======================

  const [selectedLessons, setSelectedLessons] =
    useState([])

  const [selectedTopics, setSelectedTopics] =
    useState([])


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


  // ======================
  // LOAD CONFIG
  // ======================

  useEffect(() => {

    const saved = getReviewConfig()

    if (!saved) return

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

    setMode(
      saved.mode || "flashcard"
    )

    setDirections(
      saved.directions || ["jp_vi"]
    )

    setReviewLimit(
      saved.limit ?? null
    )

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

    mode,

    directions,

    limit: reviewLimit,

  }


  // ======================
  // SAVE CONFIG
  // ======================

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
