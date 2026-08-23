import {
  useLayoutEffect,
  useRef,
  useState,
} from "react"

const MAX_SIZE = 82
const MIN_SIZE = 30
const STEP = 2
import JapaneseTextWithAudio from "../JapaneseTextWithAudio"

export default function FlashCardBackImage({
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
          KANJI
      ========================= */}

      {back.kanji && (

        <div
          className="
            w-full

            font-bold
            text-gray-900

            leading-[1.15]

            text-[2rem]
            sm:text-[2.8rem]
            md:text-[3.5rem]
            lg:text-[4rem]

            break-words
          "
        >
          {back.kanji}
        </div>

      )}


      {/* =========================
          JP / HIRAGANA
      ========================= */}

      <div
        className="
          relative

          w-full

          flex
          items-center
          justify-center

          min-h-[60px]
          sm:min-h-[80px]
          md:min-h-[100px]

          overflow-hidden
        "
      >

        <JapaneseTextWithAudio
          text={back.jp}
          autoPlay={false}
          onSpeak={onSpeak}
        />

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