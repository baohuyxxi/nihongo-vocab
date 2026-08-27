// hooks/useReviewConfig.js

import {
  useEffect,
  useState,
} from "react"

import {
  getReviewConfig,
  saveReviewConfig,
} from "../utils/reviewStorage"


export default function useReviewConfig() {

  const [selectedLessons,
    setSelectedLessons] =
    useState([])

  const [selectedTopics,
    setSelectedTopics] =
    useState([])

  const [selectedPartsOfSpeech,
    setSelectedPartsOfSpeech] =
    useState([])

  const [mode, setMode] =
    useState("flashcard")

  const [directions, setDirections] =
    useState(["jp_vi"])

  const [reviewLimit,
    setReviewLimit] =
    useState(null)


  /* ======================
      LOAD CONFIG
  ====================== */

  useEffect(() => {

    const saved =
      getReviewConfig()

    if (!saved) return


    setSelectedLessons(
      saved.lessons || []
    )

    setSelectedTopics(
      saved.topics || []
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


  /* ======================
      CONFIG
  ====================== */

  const config = {
    lessons:
      selectedLessons,

    topics:
      selectedTopics,

    partsOfSpeech:
      selectedPartsOfSpeech,

    mode,

    directions,

    limit:
      reviewLimit,
  }


  const saveConfig = () => {

    saveReviewConfig(
      config
    )

  }


  return {

    selectedLessons,
    setSelectedLessons,

    selectedTopics,
    setSelectedTopics,

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