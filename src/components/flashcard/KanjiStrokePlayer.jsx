import { useEffect, useMemo, useState } from "react"
import KanjiItem from "./KanjiItem"

function extractChars(text) {
  if (!text) return []
  return [...text].map((c) => ({
    char: c,
    isKanji: /[\u4e00-\u9faf]/.test(c),
  }))
}

export default function KanjiStrokePlayer({
  kanji,
  size = 160,
}) {
  const list = useMemo(() => extractChars(kanji), [kanji])

  const [activeIndex, setActiveIndex] = useState(0)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    setActiveIndex(0)
  }, [kanji])

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth

      let s = 1

      // theo số ký tự
      if (list.length <= 2) s = 1
      else if (list.length <= 3) s = 0.85
      else if (list.length <= 5) s = 0.7
      else if (list.length <= 8) s = 0.55
      else s = 0.45

      // mobile / ipad
      if (w < 1024) s *= 0.8
      if (w < 768) s *= 0.7
      if (w < 480) s *= 0.6

      // 🔥 FIX CHÍNH: chặn overflow cứng
      s = Math.min(s, 0.75)

      setScale(s)
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [list])

  if (!list.length) return null

  const dynamicSize = size * scale

  return (
    <div
      className="
        w-full
        h-full
        flex
        items-center
        justify-center
        gap-2
      "
      style={{
        alignItems: "center",
      }}
    >
      {list.map((item, i) => (
        <KanjiItem
          key={`${item.char}-${i}`}
          kanji={item.char}
          isKanji={item.isKanji}
          size={dynamicSize}
          active={i === activeIndex}
          onDone={() => {
            if (i === activeIndex) {
              setActiveIndex((p) => p + 1)
            }
          }}
        />
      ))}
    </div>
  )
}