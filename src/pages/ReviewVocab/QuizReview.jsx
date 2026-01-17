import { useEffect, useState } from "react"

export default function QuizReview({ questions = [] }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const [correctCount, setCorrectCount] = useState(0)
  const [history, setHistory] = useState([])

  const q = questions[index]

  const choose = (value) => {
    if (showResult) return

    const isCorrect = value === q.correct

    setSelected(value)
    setShowResult(true)

    if (isCorrect) setCorrectCount((c) => c + 1)

    setHistory((prev) => [
      ...prev,
      {
        question: q.question,
        selected: value,
        correct: q.correct,
        isCorrect,
      },
    ])

    setTimeout(() => {
      setIndex((i) => i + 1)
      setSelected(null)
      setShowResult(false)
    }, 1000)
  }

  /* ================= FINISH ================= */

  if (!q) {
    return (
      <Summary
        total={questions.length}
        correct={correctCount}
        history={history}
      />
    )
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      <div className="text-center text-lg text-gray-600">
        Đúng {correctCount} / {questions.length}
      </div>

      <div className="text-center">
        <div className="text-gray-400 mb-2">
          Câu {index + 1} / {questions.length}
        </div>

        <div className="text-[60px] font-bold">
          {q.question}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {q.choices.map((c, i) => {
          let cls =
            "p-4 border rounded text-[26px] text-center cursor-pointer transition"

          if (showResult) {
            if (c === q.correct)
              cls += " bg-green-200 border-green-500"
            else if (c === selected)
              cls += " bg-red-200 border-red-500"
          } else {
            cls += " hover:bg-blue-50"
          }

          return (
            <div
              key={i}
              className={cls}
              onClick={() => choose(c)}
            >
              {c}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ================= SUMMARY ================= */

function Summary({ total, correct, history }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl font-bold mb-2">
          🎉 Hoàn thành
        </div>
        <div className="text-xl">
          Đúng {correct} / {total}
        </div>
      </div>

      <div className="space-y-3">
        {history.map((h, i) => (
          <div
            key={i}
            className={`p-4 rounded border ${
              h.isCorrect
                ? "bg-green-100 border-green-400"
                : "bg-red-100 border-red-400"
            }`}
          >
            <div className="font-bold">
              {i + 1}. {h.question}
            </div>

            <div>👉 Bạn chọn: {h.selected}</div>

            {!h.isCorrect && (
              <div>✅ Đúng: {h.correct}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
