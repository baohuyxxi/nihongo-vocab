import { useNavigate }
  from "react-router-dom"

import ReviewConfig
  from "./ReviewConfig"

import useReviewConfig
  from "../../hooks/useReviewConfig"
import { createTypingSessionId } from "../../utils/typingSession"
import { resolveExamConfig } from "../../utils/typingExam"

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

  const sessionConfig = resolveExamConfig(review.config)
  const activeN3Source = sessionConfig.n3Source ?? null

  const savedSession = activeN3Source === "sou-matome-kanji"
    ? getN3ReviewSession()
    : getReviewSession()
  const hasReviewSession = Boolean(savedSession)

  /* ======================
      START NEW
  ====================== */

  const startReview = () => {
    if (review.curriculumTab === "n3" && !activeN3Source) {
      window.alert("Vui lòng chọn rõ nguồn ôn tập N3: Mimi kara Oboeru hoặc Sou Matome N3 Kanji.")
      return
    }

    review.saveConfig()

    if (review.mode === "typing" && review.typingMode === "exam") {
      navigate("/review-session", {
        state: { examStart: { id: createTypingSessionId(), config: sessionConfig } },
      })
      return
    }

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
    navigate("/review-session", {
      state: {
        resumeN3Kanji: activeN3Source === "sou-matome-kanji",
        resumeExamId: savedSession?.examSessionId,
      },
    })
  }


  return (

    <ReviewConfig

      {...review}
      sessionN3Source={activeN3Source}

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
