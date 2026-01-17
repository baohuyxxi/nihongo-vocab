import { useEffect, useState } from "react"

export default function FlashcardReview({ cards = [] }) {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const total = cards.length
  const card = cards[index]

  console.log("FlashcardReview cards:", cards)

  /* ======================
     NAVIGATION
  ====================== */

  const next = () => {
    setShowAnswer(false)
    setIndex((i) => Math.min(i + 1, total - 1))
  }

  const prev = () => {
    setShowAnswer(false)
    setIndex((i) => Math.max(i - 1, 0))
  }

  /* ======================
     KEYBOARD
  ====================== */

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        setShowAnswer((s) => !s)
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  /* ======================
     RESET
  ====================== */

  useEffect(() => {
    setIndex(0)
    setShowAnswer(false)
  }, [cards.length])

  /* ======================
     EMPTY
  ====================== */

  if (!total) {
    return (
      <div className="text-center text-xl text-gray-500">
        😅 Không có thẻ để ôn
      </div>
    )
  }

  if (!card) {
    return (
      <div className="text-center text-2xl font-semibold">
        🎉 Bạn đã ôn xong!
      </div>
    )
  }

  const { front, back, direction } = card

  /* ======================
     RENDER BACK
  ====================== */

  const renderBack = () => {
    if (typeof back === "string") return back

    return (
      <div className="text-center space-y-2">
        {back.hanViet && (
          <div className="text-gray-500">
            Hán Việt: {back.hanViet}
          </div>
        )}
        <div>{back.jp}</div>
        <div className="text-green-700 font-semibold">
          {back.meaning}
        </div>
      </div>
    )
  }

  /* ======================
     UI
  ====================== */

  return (
    <div className="flex flex-col items-center space-y-10">

      {/* MODE */}
      <div className="text-lg italic text-gray-500">
        Mode: <span className="font-semibold">{direction}</span>
      </div>

      {/* CARD */}
      <div
        key={`${index}-${direction}`}
        className="w-full max-w-4xl h-[26rem] perspective"
        onClick={() => setShowAnswer((s) => !s)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500
            transform-style-preserve-3d cursor-pointer
            ${showAnswer ? "rotate-x-180" : ""}`}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-2xl
              flex items-center justify-center
              backface-hidden
              text-[88px] font-bold text-center px-6"
          >
            {front}
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 bg-green-50 rounded-3xl shadow-2xl
              flex items-center justify-center
              rotate-x-180 backface-hidden
              text-[72px] font-semibold text-center px-6"
          >
            {renderBack()}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-10 items-center text-xl">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-8 py-4 bg-gray-200 rounded-xl
            disabled:opacity-40 text-3xl"
        >
          ⬅
        </button>

        <span className="text-2xl font-medium">
          {index + 1} / {total}
        </span>

        <button
          onClick={next}
          disabled={index === total - 1}
          className="px-8 py-4 bg-gray-200 rounded-xl
            disabled:opacity-40 text-3xl"
        >
          ➡
        </button>
      </div>

      {/* HINT */}
      <p className="text-base italic text-gray-500 text-center">
        ⬆ ⬇ lật thẻ · ⬅ ➡ chuyển thẻ · Click để lật
      </p>
    </div>
  )
}
