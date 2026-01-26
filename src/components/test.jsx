import { useEffect, useRef } from "react"
import HanziWriter from "hanzi-writer"
import { RotateCcw } from "lucide-react"

function getFirstKanji(text) {
    if (!text) return null
    const match = text.match(/[\u4e00-\u9faf]/)
    return match ? match[0] : null
}

export default function KanjiStrokePlayer({
    kanji,
    size = 180,
    autoPlay = true,
}) {
    const containerRef = useRef(null)
    const writerRef = useRef(null)

    useEffect(() => {
        const k = getFirstKanji(kanji)
        if (!k || !containerRef.current) return

        containerRef.current.innerHTML = ""

        writerRef.current = HanziWriter.create(containerRef.current, k, {
            width: size,
            height: size,
            padding: 8,
            showOutline: true,
            showCharacter: false,
            strokeAnimationSpeed: 2,
            delayBetweenStrokes: 80,
        })

        if (autoPlay) {
            writerRef.current.animateCharacter()
        }
    }, [kanji, size, autoPlay])

    if (!getFirstKanji(kanji)) return null

    return (
        <div className="flex flex-col items-center gap-2">
            <div ref={containerRef} />

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    writerRef.current?.animateCharacter()
                }}
                className="
          flex items-center gap-2
          px-3 py-1.5
          rounded-full
          bg-gray-100 hover:bg-gray-200
          transition
          text-sm font-medium
        "
                aria-label="Viết lại Kanji"
            >
                <RotateCcw size={30} />
            </button>
        </div>
    )
}
