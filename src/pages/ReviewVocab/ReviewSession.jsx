import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import FlashcardReview from "./FlashcardReview"
import QuizReview from "./QuizReview"
import TypingReview from "./TypingReview"
import { getReviewSession } from "../../services/vocab.service"

export default function ReviewSession() {
  const navigate = useNavigate()

  const reviewConfig =
    JSON.parse(localStorage.getItem("reviewConfig")) || null

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!reviewConfig) return

    const { lessons, mode, directions } = reviewConfig

    setLoading(true)
    getReviewSession({
      lessons: lessons.join(","),
      mode,
      directions: directions.join(","),
    })
      .then((res) => {
        setSession(res.data)
      })
      .catch(() => {
        setError("Không tải được phiên ôn tập")
      })
      .finally(() => setLoading(false))
  }, [])

  /* ======================
      STATES
  ====================== */
  if (!reviewConfig) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <p className="mb-4">⚠️ Không có cấu hình ôn tập</p>
        <button
          onClick={() => navigate("/vocabulary")}
          className="text-blue-600 underline"
        >
          ← Quay lại chọn bài
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        ⏳ Đang tạo phiên ôn tập...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/vocabulary")}
          className="text-blue-600 underline"
        >
          ← Quay lại
        </button>
      </div>
    )
  }

  /* ======================
      UI
  ====================== */
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      {/* TOP BAR */}
      <div className="flex items-center justify-between border-b pb-3">
        <button
          onClick={() => navigate("/vocabulary")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Quay lại
        </button>

        <div className="text-sm text-gray-500">
          🧠 {session.mode} • 📚 {reviewConfig.lessons.length} bài • 🔁{" "}
          {reviewConfig.directions.join(", ")}
        </div>
      </div>

      {/* CONTENT */}
      {session.mode === "flashcard" && (
        <FlashcardReview cards={session.cards} />
      )}

      {session.mode === "quiz" && (
        <QuizReview questions={session.questions} />
      )}

      {session.mode === "typing" && (
        <TypingReview questions={session.questions} />
      )}
    </div>
  )
}
