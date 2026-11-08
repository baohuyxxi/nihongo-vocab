// FlashCardBackKanji.jsx

import {
  useLayoutEffect,
  useRef,
  useState,
} from "react"

const MAX_SIZE = 82
const MIN_SIZE = 30
const STEP = 2

export default function FlashCardBackKanji({
  back,
  onSpeak,
}) {
  const jpRef = useRef(null)
  const [fontSize, setFontSize] = useState(MAX_SIZE)

  const japaneseText = typeof back?.hiragana === "string"
    ? back.hiragana
    : typeof back?.word === "string"
      ? back.word
      : typeof back?.jp === "string"
        ? back.jp
        : ""

  const hanVietText = typeof back?.hanViet === "string"
    ? back.hanViet
    : typeof back?.hanviet === "string"
      ? back.hanviet
      : ""

  const meaningText = typeof back?.meaning === "string"
    ? back.meaning
    : typeof back?.meaningText === "string"
      ? back.meaningText
      : ""

  useLayoutEffect(() => {
    const el = jpRef.current
    if (!el || !japaneseText) return

    let size = MAX_SIZE
    el.style.fontSize = `${size}px`

    const parent = el.parentElement
    if (!parent) return

    while (size > MIN_SIZE && el.scrollHeight > parent.clientHeight) {
      size -= STEP
      el.style.fontSize = `${size}px`
    }

    setFontSize(size)
  }, [japaneseText])

  if (!back) return null

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden px-3 py-3 text-center sm:gap-3 sm:px-5 md:gap-4 md:px-7">
      {hanVietText && (
        <div className="w-full break-words font-bold leading-[1.15] text-gray-800 text-[1.2rem] sm:text-[1.8rem] md:text-[2.4rem] lg:text-[3rem]">
          {hanVietText}
        </div>
      )}

      <div className="relative flex min-h-[58px] w-full items-center justify-center overflow-hidden sm:min-h-[72px] md:min-h-[90px]">
        <span
          ref={jpRef}
          className="whitespace-normal break-words px-8 text-center font-bold leading-[1.15] text-gray-900 sm:px-12"
          style={{
            fontSize,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {japaneseText}
        </span>

        {japaneseText && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSpeak?.(japaneseText)
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-xl transition hover:scale-110 active:scale-95 sm:text-2xl"
            aria-label="Đọc từ"
          >
            🔊
          </button>
        )}
      </div>

      {meaningText && (
        <div className="w-full break-words font-bold leading-[1.2] text-gray-700 text-[1rem] sm:text-[1.4rem] md:text-[1.8rem] lg:text-[2.2rem]">
          {meaningText}
        </div>
      )}
    </div>
  )
}