import { useNavigate }
  from "react-router-dom"

import ReviewConfig
  from "./ReviewConfig"

import useReviewConfig
  from "../../hooks/useReviewConfig"

import {
  clearReviewSession,
  getReviewSession,
} from "../../utils/reviewStorage"


export default function ReviewVocabPage() {

  const navigate =
    useNavigate()

  const review =
    useReviewConfig()


  /* ======================
      START NEW
  ====================== */

  const startReview = () => {

    review.saveConfig()

    clearReviewSession()

    navigate(
      "/review-session"
    )

  }


  /* ======================
      CONTINUE
  ====================== */

  const onContinue = () => {

    review.saveConfig()

    navigate(
      "/review-session"
    )

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

      hasSession={
        Boolean(
          getReviewSession()
        )
      }

    />

  )
}