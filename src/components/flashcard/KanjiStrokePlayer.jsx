import { useMemo, useState } from "react"
import KanjiItem from "./KanjiItem"

function extractKanji(text) {
  if (!text) return []
  return [...text].filter((c) => /[\u4e00-\u9faf]/.test(c))
}

export default function KanjiStrokePlayer({ kanji, size = 180 }) {
  const kanjiList = useMemo(() => extractKanji(kanji), [kanji])
  const [activeIndex, setActiveIndex] = useState(0)

  if (kanjiList.length === 0) return null

  return (
    <div className="flex gap-6">
      {kanjiList.map((k, i) => (
        <KanjiItem
          key={`${k}-${i}`}
          kanji={k}
          size={size}
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
