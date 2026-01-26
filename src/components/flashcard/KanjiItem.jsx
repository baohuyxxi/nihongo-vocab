import { useEffect, useRef } from "react"
import HanziWriter from "hanzi-writer"
import { RotateCcw } from "lucide-react"

export default function KanjiItem({ kanji, size, active, onDone }) {
  const ref = useRef(null)
  const writerRef = useRef(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    if (!ref.current || !kanji) return
    let cancelled = false

    ref.current.innerHTML = ""
    writerRef.current = null
    hasAnimatedRef.current = false

    HanziWriter.loadCharacterData(kanji)
      .then(() => {
        if (cancelled) return

        writerRef.current = HanziWriter.create(ref.current, kanji, {
          width: size,
          height: size,
          padding: 6,
          showOutline: true,
          showCharacter: true,
          strokeAnimationSpeed: 2.2,
          delayBetweenStrokes: 60,
        })

        if (active && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true
          writerRef.current.animateCharacter({
            onComplete: () => {
              writerRef.current.setCharacter(kanji)
              onDone?.()
            },
          })
        }
      })
      .catch(() => {
        // ✅ FALLBACK: kanji không có data vẽ
        if (!ref.current) return

        ref.current.innerText = kanji
        ref.current.style.fontSize = `${size * 0.7}px`
        ref.current.style.fontWeight = "500"
        ref.current.style.lineHeight = "1"
        ref.current.style.display = "flex"
        ref.current.style.alignItems = "center"
        ref.current.style.justifyContent = "center"

        // ✅ QUAN TRỌNG: vẫn cho chạy tiếp sequence
        onDone?.()
      })

    return () => {
      cancelled = true
    }
  }, [kanji, size, active, onDone])

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={ref} />

      {/* 🔁 viết lại – chỉ hoạt động khi có writer */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (!writerRef.current) return

          writerRef.current.hideCharacter()
          writerRef.current.animateCharacter({
            onComplete: () => {
              writerRef.current.setCharacter(kanji)
            },
          })
        }}
        className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
      >
        <RotateCcw size={26} />
      </button>
    </div>
  )
}
