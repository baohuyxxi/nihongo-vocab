import { useEffect, useRef, useState } from "react"
import { toHiragana } from "wanakana"
import JapaneseIMEInput from "../../components/JapaneseIMEInput"
import SummaryTyping from "../../components/SummaryTyping"
import { removeKana } from "../../utils/japanese"
import { acceptsKanjiAnswer } from "../../utils/kanjiAnswers"

export default function TypingReview({ questions = [], onResult }) {
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
    (q.inputDirection || q.direction) === "vi_jp"
      ? inputRef.current?.value || ""
      : answer

  const isCorrectAnswer = (input) => {
    if (!input.trim()) return false
    if (q.answers) return acceptsKanjiAnswer(input, q)

    if (q.direction === "vi_jp") {
      return toHiragana(input) === toHiragana(q.answer)
    }
    return normalize(input) === normalize(q.answer)
  }

  const check = async () => {
    if (answeredMap.current[index]) return

    const input = getInput()
    const ok = isCorrectAnswer(input)

    if (onResult) { await onResult(q, ok, input); return }

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
    <div className="mx-auto w-full max-w-4xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-4">
      <div className="rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur-sm sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-slate-600 sm:text-base">
            Câu <span className="text-blue-600">{index + 1}</span> / {total}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">✔ {correctCount}</span>
            <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700">✘ {wrongCount}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
              ⏳ {total - correctCount - wrongCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex min-h-[160px] items-center justify-center rounded-[28px] border border-slate-200 bg-white p-5 text-center shadow-sm sm:min-h-[200px] sm:p-8">
        <div className="text-4xl font-bold tracking-wide text-slate-800 sm:text-6xl md:text-7xl">
          {displayQuestion}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <JapaneseIMEInput
          key={index}
          ref={inputRef}
          direction={q.inputDirection || q.direction}
          value={saved ? saved.input : answer}
          onChange={setAnswer}
          onSubmit={check}
          disabled={isLocked}
        />
      </div>

      <div className="flex min-h-[56px] items-center justify-center">
        {isLocked && (
          <div
            className={`rounded-full px-5 py-2 text-base font-semibold sm:text-lg ${
              saved.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
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

      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          className="min-h-[44px] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
        >
          ◀ Trước
        </button>

        <button
          type="button"
          disabled={!answeredMap.current[index] || index === total - 1}
          onClick={() => setIndex((i) => i + 1)}
          className="min-h-[44px] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
        >
          Sau ▶
        </button>
      </div>
    </div>
  )
}
