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

  const [fontSize, setFontSize]
    = useState(MAX_SIZE)

  // =========================
  // AUTO FIT JP TEXT
  // =========================

  useLayoutEffect(() => {

    const el = jpRef.current

    if (!el || !back?.jp) return

    let size = MAX_SIZE

    el.style.fontSize = `${size}px`

    const parent = el.parentElement

    // ✅ chỉ check HEIGHT
    // cho phép xuống hàng
    while (
      size > MIN_SIZE &&
      el.scrollHeight > parent.clientHeight
    ) {

      size -= STEP

      el.style.fontSize = `${size}px`
    }

    setFontSize(size)

  }, [back?.jp])

  if (!back) return null

  return (

    <div
      className="
        w-full
        h-full

        flex
        flex-col
        items-center
        justify-center

        gap-3
        sm:gap-4
        md:gap-5

        px-3
        sm:px-5
        md:px-7

        py-4
        sm:py-5

        text-center
        overflow-hidden
      "
    >

      {/* =========================
          HÁN VIỆT
      ========================= */}

      {back.hanViet && (

        <div
          className="
            w-full

            font-bold
            text-gray-800

            leading-[1.15]

            text-[1.6rem]
            sm:text-[2.2rem]
            md:text-[3rem]
            lg:text-[3.5rem]

            break-words
          "
        >
          {back.hanViet}
        </div>

      )}

      {/* =========================
          JP
      ========================= */}

      <div
        className="
          relative

          w-full

          flex
          items-center
          justify-center

          min-h-[70px]
          sm:min-h-[90px]
          md:min-h-[110px]

          overflow-hidden
        "
      >

        <span
          ref={jpRef}
          className="
            font-bold
            text-gray-900

            leading-[1.15]

            break-words
            whitespace-normal

            text-center

            px-8
            sm:px-12
          "
          style={{
            fontSize,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {back.jp}
        </span>

        {/* SPEAK */}

        <button
          onClick={(e) => {

            e.stopPropagation()

            onSpeak?.(back.jp)
          }}
          className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2

            text-xl
            sm:text-2xl

            hover:scale-110
            active:scale-95

            transition
          "
        >
          🔊
        </button>

      </div>

      {/* =========================
          MEANING
      ========================= */}

      <div
        className="
          w-full

          font-bold
          text-gray-700

          leading-[1.2]

          text-[1.6rem]
          sm:text-[2.2rem]
          md:text-[3rem]
          lg:text-[3.5rem]

          break-words
        "
      >
        {back.meaning}
      </div>

    </div>
  )
}