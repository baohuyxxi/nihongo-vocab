import { useEffect, useRef } from "react"
import HanziWriter from "hanzi-writer"
import { RotateCcw } from "lucide-react"

export default function KanjiItem({
  kanji,
  isKanji,
  size,
  active,
  onDone,
}) {

  const ref = useRef(null)

  const writerRef = useRef(null)

  const hasAnimatedRef = useRef(false)

  useEffect(() => {

    if (!ref.current || !kanji) return

    let cancelled = false

    ref.current.innerHTML = ""

    writerRef.current = null

    hasAnimatedRef.current = false

    /* ======================
        NOT KANJI
    ====================== */

    if (!isKanji) {

      ref.current.innerText = kanji

      ref.current.style.fontSize =
        `${size * 0.7}px`

      ref.current.style.display = "flex"

      ref.current.style.alignItems =
        "center"

      ref.current.style.justifyContent =
        "center"

      ref.current.style.width =
        `${size}px`

      ref.current.style.height =
        `${size}px`

      ref.current.style.fontWeight =
        "600"

      ref.current.style.lineHeight =
        "1"

      if (active) {

        onDone?.()
      }

      return
    }

    /* ======================
        LOAD KANJI
    ====================== */

    HanziWriter
      .loadCharacterData(kanji)

      .then(() => {

        if (cancelled) return

        writerRef.current =
          HanziWriter.create(
            ref.current,
            kanji,
            {
              width: size,
              height: size,

              padding:
                window.innerWidth < 640
                  ? 2
                  : 6,

              showOutline: true,
              showCharacter: true,

              strokeAnimationSpeed:
                window.innerWidth < 640
                  ? 1.8
                  : 2.2,

              delayBetweenStrokes:
                window.innerWidth < 640
                  ? 30
                  : 60,
            }
          )

        if (
          active &&
          !hasAnimatedRef.current
        ) {

          hasAnimatedRef.current = true

          writerRef.current
            .animateCharacter({

              onComplete: () => {

                writerRef.current
                  .setCharacter(kanji)

                onDone?.()
              },
            })
        }
      })

      .catch(() => {

        if (!ref.current) return

        ref.current.innerText = kanji

        ref.current.style.fontSize =
          `${size * 0.7}px`

        ref.current.style.fontWeight =
          "600"

        ref.current.style.lineHeight =
          "1"

        ref.current.style.display =
          "flex"

        ref.current.style.alignItems =
          "center"

        ref.current.style.justifyContent =
          "center"

        ref.current.style.width =
          `${size}px`

        ref.current.style.height =
          `${size}px`

        onDone?.()
      })

    return () => {

      cancelled = true
    }

  }, [
    kanji,
    size,
    active,
    onDone,
    isKanji,
  ])

  return (
    <div
      className="
        flex flex-col
        items-center

        gap-2
        sm:gap-3

        shrink-0
      "
    >

      <div
        ref={ref}

        className="
          flex
          items-center
          justify-center

          overflow-hidden
        "
      />

      {/* REPLAY */}

      {isKanji && (
        <button
          onClick={(e) => {

            e.stopPropagation()

            if (!writerRef.current)
              return

            writerRef.current
              .hideCharacter()

            writerRef.current
              .animateCharacter({

                onComplete: () => {

                  writerRef.current
                    .setCharacter(kanji)
                },
              })
          }}

          className="
            w-9 h-9
            sm:w-11 sm:h-11

            rounded-full

            bg-gray-200
            hover:bg-gray-300
            active:scale-95

            transition

            flex
            items-center
            justify-center

            shadow-sm
          "
        >
          <RotateCcw
            className="
              w-4 h-4
              sm:w-5 sm:h-5
            "
          />
        </button>
      )}

    </div>
  )
}