import { useEffect, useMemo, useState }
  from "react"

import KanjiItem
  from "./KanjiItem"

function extractChars(text) {

  if (!text) return []

  return [...text].map((c) => ({
    char: c,
    isKanji:
      /[\u4e00-\u9faf]/.test(c),
  }))
}

export default function KanjiStrokePlayer({
  kanji,
  size = 170,
}) {

  const list = useMemo(
    () => extractChars(kanji),
    [kanji]
  )

  const [activeIndex, setActiveIndex]
    = useState(0)

  const [dynamicSize, setDynamicSize]
    = useState(size)

  /* =========================
      RESET
  ========================= */

  useEffect(() => {

    setActiveIndex(0)

  }, [kanji])

  /* =========================
      AUTO SIZE
  ========================= */

  useEffect(() => {

    const calculate = () => {

      const width =
        window.innerWidth

      const length =
        list.length

      let nextSize = size

      /* =========================
          MOBILE
      ========================= */

      if (width < 640) {

        if (length === 1) {
          nextSize = 120
        }

        else if (length === 2) {
          nextSize = 95
        }

        else if (length <= 4) {
          nextSize = 74
        }

        else if (length <= 6) {
          nextSize = 58
        }

        else if (length <= 8) {
          nextSize = 48
        }

        else {
          nextSize = 40
        }
      }

      /* =========================
          TABLET
      ========================= */

      else if (width < 1024) {

        if (length === 1) {
          nextSize = 145
        }

        else if (length === 2) {
          nextSize = 120
        }

        else if (length <= 4) {
          nextSize = 95
        }

        else if (length <= 6) {
          nextSize = 76
        }

        else {
          nextSize = 62
        }
      }

      /* =========================
          DESKTOP
      ========================= */

      else {

        if (length === 1) {
          nextSize = 180
        }

        else if (length === 2) {
          nextSize = 155
        }

        else if (length <= 4) {
          nextSize = 125
        }

        else if (length <= 6) {
          nextSize = 100
        }

        else {
          nextSize = 80
        }
      }

      /* =========================
          HARD WIDTH FIX
      ========================= */

      const availableWidth =
        width - 12

      const estimatedWidth =
        nextSize * length

      if (
        estimatedWidth >
        availableWidth
      ) {

        nextSize =
          availableWidth / length
      }

      /* =========================
          SAFE MIN
      ========================= */

      nextSize = Math.max(
        nextSize,
        width < 640 ? 32 : 42
      )

      setDynamicSize(nextSize)
    }

    calculate()

    window.addEventListener(
      "resize",
      calculate
    )

    return () => {

      window.removeEventListener(
        "resize",
        calculate
      )
    }

  }, [list, size])

  if (!list.length) {
    return null
  }

  const shouldWrap =
    list.length >= 8

  return (

    <div
      className="
        w-full
        h-full

        flex
        items-center
        justify-center
      "
    >

      <div
        className={`
          flex
          items-center
          justify-center

          max-w-full

          ${
            shouldWrap
              ? "flex-wrap"
              : "flex-nowrap"
          }
        `}
        style={{
          gap:
            dynamicSize < 50
              ? 2
              : 6,
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

                setActiveIndex(
                  (prev) => prev + 1
                )
              }
            }}
          />

        ))}

      </div>

    </div>
  )
}