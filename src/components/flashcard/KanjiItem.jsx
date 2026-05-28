// KanjiItem.jsx

import { useEffect, useRef }
  from "react"

import HanziWriter
  from "hanzi-writer"

export default function KanjiItem({
  kanji,
  isKanji,
  size,
  active,
  onDone,
}) {

  const ref = useRef(null)

  const writerRef = useRef(null)

  const playedRef = useRef(false)

  useEffect(() => {

    if (!ref.current || !kanji) {
      return
    }

    let cancelled = false

    ref.current.innerHTML = ""

    playedRef.current = false

    /* =========================
        NON KANJI
    ========================= */

    if (!isKanji) {

      ref.current.innerText = kanji

      Object.assign(
        ref.current.style,
        {
          width: `${size}px`,
          height: `${size}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${size * 0.72}px`,
          fontWeight: "700",
          lineHeight: "1",
        }
      )

      if (active) {
        onDone?.()
      }

      return
    }

    /* =========================
        LOAD KANJI
    ========================= */

    HanziWriter
      .loadCharacterData(kanji)

      .then(() => {

        if (cancelled) {
          return
        }

        writerRef.current =
          HanziWriter.create(
            ref.current,
            kanji,
            {
              width: size,
              height: size,

              padding:
                size < 70
                  ? 1
                  : size < 110
                    ? 3
                    : 6,

              showOutline: true,
              showCharacter: true,

              strokeAnimationSpeed:
                window.innerWidth < 768
                  ? 1.6
                  : 2,

              delayBetweenStrokes:
                window.innerWidth < 768
                  ? 20
                  : 50,
            }
          )

        if (
          active &&
          !playedRef.current
        ) {

          playedRef.current = true

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

        if (!ref.current) {
          return
        }

        ref.current.innerText = kanji

        Object.assign(
          ref.current.style,
          {
            width: `${size}px`,
            height: `${size}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `${size * 0.72}px`,
            fontWeight: "700",
            lineHeight: "1",
          }
        )

        onDone?.()
      })

    return () => {
      cancelled = true
    }

  }, [
    kanji,
    size,
    active,
    isKanji,
    onDone,
  ])

  return (

    <div
      className="
        shrink-0

        flex
        items-center
        justify-center
      "
      style={{
        width: size,
        height: size,
      }}
    >

      <div
        ref={ref}

        className="
          flex
          items-center
          justify-center
        "
      />

    </div>
  )
}