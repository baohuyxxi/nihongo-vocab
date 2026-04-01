import { useMemo, useState } from "react"
import KanjiItem from "./KanjiItem"

function extractChars(text) {
  if (!text) return []

  return [...text].map((c) => ({
    char: c,
    isKanji: /[\u4e00-\u9faf]/.test(c),
  }))
}

export default function KanjiStrokePlayer({ kanji, size = 180 }) {
  const list = useMemo(() => extractChars(kanji), [kanji])
  const [activeIndex, setActiveIndex] = useState(0)

  if (list.length === 0) return null

  const dynamicSize = useMemo(() => {
    const base = size
    const length = list.length

    if (length <= 3) return base
    if (length <= 5) return base * 0.8
    if (length <= 8) return base * 0.65
    return base * 0.5
  }, [list, size])

  return (
    <div className="flex gap-6">
      {list.map((item, i) => (
        <KanjiItem
          key={`${item.char}-${i}`}
          kanji={item.char}
          isKanji={item.isKanji} // 🔥 thêm dòng này
          size={dynamicSize}
          active={i === activeIndex}
          onDone={() => {
            if (i === activeIndex) {
              setActiveIndex((prev) => prev + 1)
            }
          }}
        />
      ))}
    </div>
  )
}