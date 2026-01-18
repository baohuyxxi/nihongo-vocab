import { useEffect, useLayoutEffect, useRef, useState } from "react"

const MAX_SIZE = 72
const MIN_SIZE = 32
const STEP = 4

export default function JapaneseTextWithAudio({
  text,
  autoPlay = false,
  onSpeak,
}) {
  const hasPlayed = useRef(false)
  const textRef = useRef(null)
  const [fontSize, setFontSize] = useState(MAX_SIZE)

  /* ===== reset khi sang chữ mới ===== */
  useEffect(() => {
    hasPlayed.current = false
    setFontSize(MAX_SIZE)
  }, [text])

  /* ===== auto play 1 lần ===== */
  useEffect(() => {
    if (!autoPlay || hasPlayed.current || !text) return
    onSpeak(text)
    hasPlayed.current = true
  }, [autoPlay, text, onSpeak])

  /* ===== auto shrink font để luôn 1 hàng ===== */
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return

    let size = MAX_SIZE
    el.style.fontSize = `${size}px`

    // 🧠 shrink dần cho tới khi vừa 1 hàng
    while (
      size > MIN_SIZE &&
      el.scrollWidth > el.clientWidth
    ) {
      size -= STEP
      el.style.fontSize = `${size}px`
    }

    setFontSize(size)
  }, [text])

  if (!text) return null

  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <span
        ref={textRef}
        className="font-bold whitespace-nowrap overflow-hidden"
        style={{ fontSize }}
      >
        {text}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onSpeak(text)
        }}
        className="text-4xl hover:scale-110 transition"
        aria-label="Phát âm tiếng Nhật"
      >
        🔊
      </button>
    </div>
  )
}
