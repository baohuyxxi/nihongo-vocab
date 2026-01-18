import { useEffect, useRef } from "react"

export default function JapaneseTextWithAudio({
  text,
  autoPlay = false,
  onSpeak,
}) {
  const hasPlayed = useRef(false)

  // ✅ reset khi sang chữ mới
  useEffect(() => {
    hasPlayed.current = false
  }, [text])

  // 🔊 auto play 1 lần / 1 chữ
  useEffect(() => {
    if (!autoPlay || hasPlayed.current) return
    onSpeak(text)
    hasPlayed.current = true
  }, [autoPlay, text, onSpeak])

  if (!text) return null

  return (
    <div className="flex items-center justify-center gap-4">
      <span className="text-3xl sm:text-5xl md:text-[72px] font-bold">
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
