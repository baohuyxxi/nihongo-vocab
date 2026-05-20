import { useEffect, useMemo, useState } from "react"

export default function QuizReview({
  questions = [],
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

  const choose = (value) => {

    if (showResult) return

    const isCorrect =
      value === q.correct

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
    <div
      className="
        w-full
        max-w-6xl
        mx-auto

        flex
        flex-col

        gap-5
        sm:gap-6
        md:gap-8

        px-2
        sm:px-4
      "
    >

      {/* ======================
          TOP BAR
      ====================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row

          items-center
          justify-between

          gap-3

          bg-white
          rounded-2xl

          px-4
          py-3

          shadow-sm
          border
        "
      >

        <div
          className="
            text-sm
            sm:text-base
            text-gray-500
          "
        >
          Câu {index + 1} / {questions.length}
        </div>

        <div
          className="
            text-base
            sm:text-lg
            font-bold
          "
        >
          ✅ {correctCount} đúng
        </div>

      </div>

      {/* ======================
          QUESTION
      ====================== */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          border

          px-4
          sm:px-8

          py-8
          sm:py-12

          text-center
        "
      >

        <div
          className="
            text-xs
            sm:text-sm

            text-gray-400
            mb-4
          "
        >
          Chọn đáp án đúng
        </div>

        <div
          className="
            font-bold
            leading-tight
            break-words

            text-3xl
            sm:text-5xl
            md:text-6xl
          "
        >
          {q.question}
        </div>

      </div>

      {/* ======================
          ANSWERS
      ====================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2

          gap-3
          sm:gap-5
        "
      >

        {q.choices.map((c, i) => {

          let cls = `
            rounded-2xl
            border-2

            px-4
            sm:px-6

            py-4
            sm:py-6

            text-center
            font-semibold

            transition-all
            duration-200

            cursor-pointer
            select-none

            break-words

            text-lg
            sm:text-2xl
            md:text-3xl
          `

          if (showResult) {

            if (c === q.correct) {

              cls += `
                bg-green-100
                border-green-500
                text-green-800
                scale-[1.02]
              `
            }

            else if (c === selected) {

              cls += `
                bg-red-100
                border-red-500
                text-red-700
              `
            }

            else {

              cls += `
                bg-gray-50
                border-gray-200
                opacity-70
              `
            }
          }

          else {

            cls += `
              bg-white
              border-gray-200

              hover:border-blue-400
              hover:bg-blue-50
              hover:scale-[1.01]

              active:scale-[0.98]
            `
          }

          return (
            <button
              key={i}
              onClick={() => choose(c)}
              className={cls}
            >
              {c}
            </button>
          )
        })}

      </div>

      {/* ======================
          REVIEW PANEL
      ====================== */}

      {history.length > 0 && (

        <div
          className="
            mt-4

            bg-white
            rounded-3xl
            border
            shadow-sm

            p-4
            sm:p-6

            space-y-5
          "
        >

          {/* TITLE */}

          <div
            className="
              text-center
              font-bold

              text-lg
              sm:text-xl
            "
          >
            📚 Xem lại câu cũ
          </div>

          {/* NAV */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              flex-wrap
            "
          >

            <button
              onClick={() =>
                setReviewIndex((prev) => {

                  if (prev === null) {
                    return history.length - 1
                  }

                  return Math.max(
                    0,
                    prev - 1
                  )
                })
              }
              className="
                px-4 py-2

                rounded-xl

                bg-gray-200
                hover:bg-gray-300

                text-sm
                sm:text-base
              "
            >
              ⬅ Câu trước
            </button>

            <button
              onClick={() =>
                setReviewIndex(null)
              }
              className="
                px-4 py-2

                rounded-xl

                bg-blue-500
                text-white

                hover:bg-blue-600

                text-sm
                sm:text-base
              "
            >
              📍 Hiện tại
            </button>

            <button
              onClick={() =>
                setReviewIndex((prev) => {

                  if (prev === null) {
                    return history.length - 1
                  }

                  return Math.min(
                    history.length - 1,
                    prev + 1
                  )
                })
              }
              className="
                px-4 py-2

                rounded-xl

                bg-gray-200
                hover:bg-gray-300

                text-sm
                sm:text-base
              "
            >
              Câu sau ➡
            </button>

          </div>

          {/* REVIEW CARD */}

          {reviewData && (

            <div
              className={`
                rounded-2xl
                border-2
                p-4
                sm:p-6

                space-y-4

                ${
                  reviewData.isCorrect
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
                  text-sm
                  text-gray-500
                "
              >
                Câu {reviewIndex + 1}
              </div>

              <div
                className="
                  font-bold
                  leading-relaxed

                  text-xl
                  sm:text-3xl
                "
              >
                {reviewData.question}
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2

                  gap-3
                "
              >

                {reviewData.choices.map((choice, i) => {

                  const isCorrect =
                    choice === reviewData.correct

                  const isSelected =
                    choice === reviewData.selected

                  let cls = `
                    rounded-xl
                    border-2

                    px-4
                    py-3

                    text-center
                    font-medium

                    break-words

                    text-base
                    sm:text-xl
                  `

                  if (isCorrect) {

                    cls += `
                      bg-green-100
                      border-green-500
                      text-green-800
                    `
                  }

                  else if (
                    isSelected &&
                    !reviewData.isCorrect
                  ) {

                    cls += `
                      bg-red-100
                      border-red-500
                      text-red-700
                    `
                  }

                  else {

                    cls += `
                      bg-white
                      border-gray-200
                    `
                  }

                  return (
                    <div
                      key={i}
                      className={cls}
                    >
                      {choice}
                    </div>
                  )
                })}

              </div>

              <div
                className={`
                  font-bold

                  text-lg
                  sm:text-xl

                  ${
                    reviewData.isCorrect
                      ? "text-green-700"
                      : "text-red-700"
                  }
                `}
              >

                {reviewData.isCorrect
                  ? "✅ Bạn làm đúng"
                  : "❌ Bạn làm sai"}

              </div>

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