import { useNavigate }
  from "react-router-dom"

import ReviewConfig
  from "./ReviewConfig"

import useReviewConfig
  from "../../hooks/useReviewConfig"

import {
  clearReviewSession,
  clearN3ReviewSession,
  clearFlashcardProgress,
  clearN3FlashcardProgress,
  getReviewSession,
  getN3ReviewSession,
} from "../../utils/reviewStorage"


export default function ReviewVocabPage() {

  const navigate =
    useNavigate()

  const review =
    useReviewConfig()

  const activeN3Source = review.n3Source ?? null

  const hasReviewSession = activeN3Source === "sou-matome-kanji"
    ? Boolean(getN3ReviewSession())
    : Boolean(getReviewSession())

  /* ======================
      START NEW
  ====================== */

  const startReview = () => {
    if (review.curriculumTab === "n3" && !activeN3Source) {
      window.alert("Vui lòng chọn rõ nguồn ôn tập N3: Mimi kara Oboeru hoặc Sou Matome N3 Kanji.")
      return
    }

    review.saveConfig()

    if (activeN3Source === "sou-matome-kanji") {
      clearN3ReviewSession()
      clearN3FlashcardProgress()
    } else {
      clearReviewSession()
      clearFlashcardProgress()
    }

    navigate("/review-session")
  }


  /* ======================
      CONTINUE
  ====================== */

  const onContinue = () => {
    review.saveConfig()
    navigate("/review-session")
  }


  return (

    <ReviewConfig

      {...review}

      onStart={
        startReview
      }

      onContinue={
        onContinue
      }

      hasSession={hasReviewSession}

    />

  )
}