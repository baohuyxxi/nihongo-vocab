import { useEffect, useRef, useState } from "react"
import { toHiragana } from "wanakana"
import JapaneseIMEInput from "../../components/JapaneseIMEInput"
import SummaryTyping from "../../components/SummaryTyping"
import { removeKana } from "../../utils/japanese"

export default function TypingReview({ questions = [] }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [history, setHistory] = useState([])

  const answeredMap = useRef({})
  const inputRef = useRef(null)
  const currentIndexRef = useRef(0)

  const q = questions[index]
  const total = questions.length
  const wrongCount = history.length - correctCount

  useEffect(() => {
    currentIndexRef.current = index
  }, [index])

  useEffect(() => {
    inputRef.current?.focus()
  }, [index])

  if (!q) {
    return (
      <SummaryTyping
        total={total}
        correct={correctCount}
        history={history}
      />
    )
  }

  /* ================= utils ================= */
  const normalize = (s) =>
    s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim()

  const getInput = () =>
    q.direction === "vi_jp"
      ? inputRef.current?.value || ""
      : answer

  const isCorrectAnswer = (input) => {
    if (!input.trim()) return false

    if (q.direction === "vi_jp") {
      return toHiragana(input) === toHiragana(q.answer)
    }
    return normalize(input) === normalize(q.answer)
  }

  const check = () => {
    if (answeredMap.current[index]) return

    const input = getInput()
    const ok = isCorrectAnswer(input)

    answeredMap.current[index] = {
      input: input || "(bỏ trống)",
      isCorrect: ok,
    }

    if (ok) setCorrectCount((c) => c + 1)

    setHistory((h) => [
      ...h,
      {
        question: q.question,
        display: displayQuestion,
        input: input || "(bỏ trống)",
        answer: q.answer,
        isCorrect: ok,
      },
    ])

    setShowResult(true)

    setTimeout(() => {
      setShowResult(false)
      setAnswer("")
      if (inputRef.current) inputRef.current.value = ""

      if (currentIndexRef.current === index && index < total - 1) {
        setIndex((i) => i + 1)
      }
    }, 1000)
  }

  const saved = answeredMap.current[index]
  const isLocked = !!saved

  /* ================= DISPLAY ================= */
  const displayQuestion =
    q.direction === "kanji"
      ? removeKana(q.question) || q.question
      : q.question

  return (
    <div className="relative max-w-2xl mx-auto space-y-8 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <div className="font-semibold">
          Câu <span className="text-blue-600">{index + 1}</span> / {total}
        </div>

        <div className="flex gap-3 text-sm">
          <span className="text-green-600 font-medium">✔ {correctCount}</span>
          <span className="text-red-600 font-medium">✘ {wrongCount}</span>
          <span className="text-gray-500">
            ⏳ {total - correctCount - wrongCount}
          </span>
        </div>
      </div>

      {/* QUESTION – fixed height */}
      <div className="h-[160px] flex items-center justify-center">
        <div className="text-center text-[64px] font-bold tracking-wide leading-tight">
          {displayQuestion}
        </div>
      </div>


      {/* INPUT */}
      <JapaneseIMEInput
        key={index}
        ref={inputRef}
        direction={q.direction}
        value={saved ? saved.input : answer}
        onChange={setAnswer}
        onSubmit={check}
        disabled={isLocked}
      />

      {/* RESULT */}
      <div className="h-[56px] flex justify-center items-center">
        {isLocked && (
          <div
            className={`px-6 py-2 rounded-full text-lg font-semibold ${saved.isCorrect
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {saved.isCorrect ? (
              "✔ Chính xác"
            ) : (
              <>
                ✘ Sai — <span className="underline">{q.answer}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* NAV – floating left/right */}
      <button
        disabled={index === 0}
        onClick={() => setIndex((i) => i - 1)}
        className="absolute left-[-150px] top-1/2 -translate-y-1/2
                   px-3 py-2 rounded-full bg-gray-100
                   text-gray-500 hover:text-black hover:bg-gray-200
                   disabled:opacity-30"
      >
        ◀ Trước
      </button>

      <button
        disabled={!answeredMap.current[index] || index === total - 1}
        onClick={() => setIndex((i) => i + 1)}
        className="absolute right-[-150px] top-1/2 -translate-y-1/2
                   px-3 py-2 rounded-full bg-gray-100
                   text-gray-500 hover:text-black hover:bg-gray-200
                   disabled:opacity-30"
      >
        Sau ▶
      </button>
    </div>
  )
}
