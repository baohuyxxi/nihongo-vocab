import {
  useNavigate,
} from "react-router-dom"

import FlashcardReview
  from "./FlashcardReview"

import QuizReview
  from "./QuizReview"

import TypingReview
  from "./TypingReview"

import useReviewSession
  from "../../hooks/useReviewSession"

import {
  completeKanjiQuestion,
} from "../../services/kanjiCurriculum.service"


export default function ReviewSession() {

  const navigate =
    useNavigate()


  const {
    reviewConfig,
    session,
    loading,
    error,
    continueReview,
  } = useReviewSession()

  const isN3KanjiSession = reviewConfig?.n3Source === "sou-matome-kanji"

  const handleFlashcardResult = async (card, isKnown) => {
    if (!isN3KanjiSession || !session?.reviewId || !card?.itemType || !card?.itemId) {
      return
    }

    if (!isKnown) {
      return
    }

    await completeKanjiQuestion({
      reviewId: session.reviewId,
      itemType: card.itemType,
      itemId: card.itemId,
    })
  }

  if (!reviewConfig) {

    return (

      <div
        className="
          bg-white
          p-6
          rounded
          shadow
          text-center
        "
      >

        <p className="mb-4">

          ⚠️ Không có cấu hình ôn tập

        </p>


        <button

          onClick={() =>
            navigate("/vocabulary")
          }

          className="
            text-blue-600
            underline
          "
        >

          ← Quay lại chọn bài

        </button>

      </div>

    )

  }


  if (loading) {

    return (

      <div
        className="
          bg-white
          p-6
          rounded
          shadow
          text-center
        "
      >

        ⏳ Đang tạo phiên ôn tập...

      </div>

    )

  }


  if (error) {

    return (

      <div
        className="
          bg-white
          p-6
          rounded
          shadow
          text-center
        "
      >

        <p className="text-red-600 mb-4">

          {error}

        </p>


        <button

          onClick={() =>
            navigate("/vocabulary")
          }

          className="
            text-blue-600
            underline
          "
        >

          ← Quay lại

        </button>

      </div>

    )

  }


  return (

    <div
      className="
        mx-auto
        flex
        w-full
        max-w-6xl
        flex-col
        gap-2
        rounded-xl
        bg-white
        p-3
        shadow-sm
        sm:gap-3
        sm:p-4
      "
    >

      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          gap-2
          border-b
          pb-2
          text-xs
          sm:text-sm
        "
      >

        <button

          onClick={() =>
            navigate("/vocabulary")
          }

          className="
            text-blue-600
            hover:underline
          "
        >

          ← Thoát phiên

        </button>


        <div className="truncate text-right text-gray-500">

          🧠 {session.mode}

          {" • "}

          📚 {
            reviewConfig
              .lessons
              .length
          } bài

          {" • "}

          🔁 {
            reviewConfig
              .directions
              .join(", ")
          }

        </div>

      </div>


      {session.mode ===
        "flashcard" && (

          <FlashcardReview
            cards={session.cards}
            onContinue={continueReview}
            onResult={handleFlashcardResult}
            progressKey={isN3KanjiSession ? "n3FlashcardProgress" : "flashcardProgress"}
            sessionStorageKey={isN3KanjiSession ? "n3ReviewSessionData" : "reviewSessionData"}
          />

        )}


      {session.mode ===
        "quiz" && (

          <QuizReview
            questions={
              session.questions
            }
          />

        )}


      {session.mode ===
        "typing" && (

          <TypingReview
            questions={
              session.questions
            }
          />

        )}

    </div>

  )
}