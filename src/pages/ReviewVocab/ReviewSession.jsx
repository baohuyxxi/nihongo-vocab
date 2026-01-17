import { useEffect, useState } from "react"
import FlashcardReview from "./FlashcardReview"
import { getReviewSession } from "../../services/vocab.service"
import QuizReview from "./QuizReview"
import TypingReview from "./TypingReview"
export default function ReviewSession() {
  const reviewConfig =
    JSON.parse(localStorage.getItem("reviewConfig")) || null

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!reviewConfig) return

    const { lessons, mode, directions } = reviewConfig

    getReviewSession({
      lessons: lessons.join(","),
      mode,
      directions: directions.join(","),
    })
      .then((res) => {
        setSession(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (!reviewConfig) {
    return <div>⚠️ Không có cấu hình ôn tập</div>
  }

  if (loading) {
    return <div>⏳ Đang tải...</div>
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <button className="mb-4 text-sm text-blue-600">
        ← Quay lại
      </button>

      {session?.mode === "flashcard" && (
        <FlashcardReview cards={session.cards} />
      )}

      {session?.mode === "quiz" && (
        <QuizReview questions={session.questions} />
      )}
      {session?.mode === "typing" && (
        <TypingReview questions={session.questions} />
      )}
    </div>
  )
}
