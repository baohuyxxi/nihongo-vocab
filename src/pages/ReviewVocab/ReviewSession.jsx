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


export default function ReviewSession() {

  const navigate =
    useNavigate()


  const {

    reviewConfig,

    session,

    loading,

    error,

    continueReview,

  } =
    useReviewSession()


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
        bg-white
        p-6
        rounded
        shadow
        space-y-4
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          pb-3
        "
      >

        <button

          onClick={() =>
            navigate("/vocabulary")
          }

          className="
            text-sm
            text-blue-600
            hover:underline
          "
        >

          ← Thoát phiên

        </button>


        <div className="text-sm text-gray-500">

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