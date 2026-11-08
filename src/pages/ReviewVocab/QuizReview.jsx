import { useEffect, useMemo, useState } from "react"

export default function QuizReview({
  questions = [],
  onResult,
}) {

  /* ======================
      STATES
  ====================== */

  const [index, setIndex]
    = useState(0)

  const [selected, setSelected]
    = useState(null)

  const [showResult, setShowResult]
    = useState(false)

  const [correctCount, setCorrectCount]
    = useState(0)

  const [history, setHistory]
    = useState([])

  const [showReviewPanel, setShowReviewPanel]
    = useState(false)

  // 🔥 xem lại câu cũ
  const [reviewIndex, setReviewIndex]
    = useState(null)

  /* ======================
      CURRENT QUESTION
  ====================== */

  const q = questions[index]

  /* ======================
      REVIEW MODE
  ====================== */

  const reviewing =
    reviewIndex !== null

  const reviewData = useMemo(() => {

    if (
      reviewIndex === null ||
      !history[reviewIndex]
    ) return null

    return history[reviewIndex]

  }, [reviewIndex, history])

  /* ======================
      CHOOSE ANSWER
  ====================== */

  const choose = async (value) => {

    if (showResult) return

    const isCorrect =
      value === q.correct

    if (onResult) { await onResult(q, isCorrect); return }

    setSelected(value)

    setShowResult(true)

    if (isCorrect) {

      setCorrectCount((c) => c + 1)
    }

    setHistory((prev) => [

      ...prev,

      {
        question: q.question,

        selected: value,

        correct: q.correct,

        choices: q.choices,

        isCorrect,
      },
    ])

    /* ======================
        NEXT QUESTION
    ====================== */

    setTimeout(() => {

      setSelected(null)

      setShowResult(false)

      setIndex((i) => i + 1)

    }, 900)
  }

  /* ======================
      RESET BUG
  ====================== */

  useEffect(() => {

    setSelected(null)

    setShowResult(false)

  }, [index])

  /* ======================
      FINISH
  ====================== */

  if (!q) {

    return (
      <Summary
        total={questions.length}
        correct={correctCount}
        history={history}
      />
    )
  }

  /* ======================
      UI
  ====================== */

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-2 py-3 sm:px-4 lg:gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-slate-500 sm:text-base">
            Câu <span className="font-bold text-blue-600">{index + 1}</span> / {questions.length}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <span>✅</span>
            <span>{correctCount} đúng</span>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
          Chọn đáp án đúng
        </div>

        <div className="text-center text-3xl font-bold leading-tight tracking-wide text-slate-800 sm:text-5xl md:text-6xl">
          {q.question}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        {q.choices.map((c, i) => {
          let cls = `
            rounded-2xl border-2 px-4 py-4 text-center font-semibold
            transition-all duration-200 select-none break-words
            text-lg sm:text-xl md:text-2xl
          `

          if (showResult) {
            if (c === q.correct) {
              cls += " bg-emerald-100 border-emerald-500 text-emerald-800 scale-[1.01]"
            } else if (c === selected) {
              cls += " bg-red-100 border-red-500 text-red-700"
            } else {
              cls += " bg-slate-50 border-slate-200 text-slate-500 opacity-70"
            }
          } else {
            cls += " bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 active:scale-[0.99]"
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(c)}
              className={cls}
            >
              {c}
            </button>
          )
        })}
      </div>

      {history.length > 0 && (
        <div className="rounded-[26px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <button
            type="button"
            onClick={() => setShowReviewPanel((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-base"
          >
            <span>📚 Xem lại câu cũ ({history.length})</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {showReviewPanel ? "Thu gọn" : "Mở"}
            </span>
          </button>

          {showReviewPanel && (
            <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setReviewIndex((prev) => {
                      if (prev === null) return history.length - 1
                      return Math.max(0, prev - 1)
                    })
                  }
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  ⬅ Câu trước
                </button>

                <button
                  type="button"
                  onClick={() => setReviewIndex(null)}
                  className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  📍 Hiện tại
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setReviewIndex((prev) => {
                      if (prev === null) return history.length - 1
                      return Math.min(history.length - 1, prev + 1)
                    })
                  }
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Câu sau ➡
                </button>
              </div>

              {reviewData && (
                <div
                  className={`rounded-2xl border-2 p-4 sm:p-5 ${
                    reviewData.isCorrect ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Câu {reviewIndex + 1}
                  </div>

                  <div className="mb-4 text-xl font-bold leading-relaxed text-slate-800 sm:text-2xl md:text-3xl">
                    {reviewData.question}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {reviewData.choices.map((choice, i) => {
                      const isCorrect = choice === reviewData.correct
                      const isSelected = choice === reviewData.selected

                      let cls = "rounded-xl border-2 px-3 py-3 text-center text-base font-medium break-words sm:text-lg"

                      if (isCorrect) {
                        cls += " border-emerald-500 bg-emerald-100 text-emerald-800"
                      } else if (isSelected && !reviewData.isCorrect) {
                        cls += " border-red-500 bg-red-100 text-red-700"
                      } else {
                        cls += " border-slate-200 bg-white text-slate-700"
                      }

                      return (
                        <div key={i} className={cls}>
                          {choice}
                        </div>
                      )
                    })}
                  </div>

                  <div className={`mt-4 text-base font-bold sm:text-lg ${reviewData.isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                    {reviewData.isCorrect ? "✅ Bạn làm đúng" : "❌ Bạn làm sai"}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ======================
    SUMMARY
====================== */

function Summary({
  total,
  correct,
  history,
}) {

  const percent = total
    ? Math.round(
        (correct / total) * 100
      )
    : 0

  return (
    <div
      className="
        max-w-5xl
        mx-auto

        space-y-6

        px-2
        sm:px-4
      "
    >

      {/* HEADER */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          border

          p-6
          sm:p-10

          text-center
        "
      >

        <div
          className="
            text-3xl
            sm:text-5xl

            font-bold
            mb-4
          "
        >
          🎉 Hoàn thành
        </div>

        <div
          className="
            text-xl
            sm:text-3xl

            font-semibold
          "
        >
          {correct} / {total}
        </div>

        <div
          className="
            mt-2

            text-gray-500

            text-base
            sm:text-lg
          "
        >
          Chính xác {percent}%
        </div>

      </div>

      {/* HISTORY */}

      <div className="space-y-4">

        {history.map((h, i) => (

          <div
            key={i}
            className={`
              rounded-2xl
              border-2

              p-4
              sm:p-6

              space-y-3

              ${
                h.isCorrect
                  ? `
                    bg-green-50
                    border-green-300
                  `
                  : `
                    bg-red-50
                    border-red-300
                  `
              }
            `}
          >

            <div
              className="
                font-bold
                leading-relaxed

                text-lg
                sm:text-2xl
              "
            >
              {i + 1}. {h.question}
            </div>

            <div
              className="
                text-base
                sm:text-lg
              "
            >
              👉 Bạn chọn:{" "}

              <span
                className={`
                  font-bold

                  ${
                    h.isCorrect
                      ? "text-green-700"
                      : "text-red-700"
                  }
                `}
              >
                {h.selected}
              </span>
            </div>

            {!h.isCorrect && (

              <div
                className="
                  text-base
                  sm:text-lg
                "
              >
                ✅ Đáp án đúng:{" "}

                <span
                  className="
                    font-bold
                    text-green-700
                  "
                >
                  {h.correct}
                </span>
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  )
}
