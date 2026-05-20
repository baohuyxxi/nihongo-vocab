import { useEffect, useState } from "react"

import Flashcard from "../../components/flashcard/Flashcard"
import FlashcardProgress from "../../components/flashcard/FlashcardProgress"
import FlashcardControls from "../../components/flashcard/FlashcardControls"
import FlashcardNav from "../../components/flashcard/FlashcardNav"
import FlashcardSettings from "../../components/flashcard/FlashcardSettings"
import FlashcardTimer from "../../components/flashcard/FlashcardTimer"
import FlashcardSummary from "../../components/flashcard/FlashcardSummary"

import useFlashcardTouch
  from "../../components/flashcard/useFlashcardTouch"

import useFlashcardKeyboard
  from "../../components/flashcard/useFlashcardKeyboard"

const FLASHCARD_PROGRESS_KEY =
  "flashcardProgress"

export default function FlashcardReview({
  cards = [],
}) {

  /* ======================
      LOAD SAVED PROGRESS
  ====================== */

  const savedProgress = JSON.parse(
    localStorage.getItem(
      FLASHCARD_PROGRESS_KEY
    ) || "null"
  )

  /* ======================
      STATES
  ====================== */

  const [list, setList] = useState(
    savedProgress?.list || cards
  )

  const [index, setIndex] = useState(
    savedProgress?.index || 0
  )

  const [showAnswer, setShowAnswer]
    = useState(
      savedProgress?.showAnswer
      || false
    )

  const [autoFlip, setAutoFlip]
    = useState(false)

  const [flipDelay, setFlipDelay]
    = useState(4000)

  const [currentJP, setCurrentJP]
    = useState(null)

  const [repeatMap, setRepeatMap]
    = useState(
      savedProgress?.repeatMap || {}
    )

  const [totalTime, setTotalTime]
    = useState(null)

  /* ======================
      DERIVED
  ====================== */

  const card = list[index]

  const finished =
    list.length === 0

  /* ======================
      AUTO SAVE
  ====================== */

  useEffect(() => {

    localStorage.setItem(
      FLASHCARD_PROGRESS_KEY,

      JSON.stringify({
        list,
        index,
        repeatMap,
        showAnswer,
      })
    )

  }, [
    list,
    index,
    repeatMap,
    showAnswer,
  ])

  /* ======================
      CLEAR WHEN FINISHED
  ====================== */

  useEffect(() => {

    if (finished) {

      localStorage.removeItem(
        FLASHCARD_PROGRESS_KEY
      )
    }

  }, [finished])

  /* ======================
      NAVIGATION
  ====================== */

  const next = () => {

    setShowAnswer(false)

    setIndex((i) =>
      Math.min(
        i + 1,
        list.length - 1
      )
    )
  }

  const prev = () => {

    setShowAnswer(false)

    setIndex((i) =>
      Math.max(i - 1, 0)
    )
  }

  /* ======================
      SRS
  ====================== */

  const markKnown = () => {

    setList((l) =>
      l.filter((_, i) => i !== index)
    )

    setIndex((i) =>
      Math.min(
        i,
        list.length - 2
      )
    )

    setShowAnswer(false)
  }

  const markUnknown = () => {

    const id = list[index].id

    setRepeatMap((m) => ({
      ...m,

      [id]:
        (m[id] || 0) + 1,
    }))

    setList((l) => [

      ...l.filter(
        (_, i) => i !== index
      ),

      l[index],
    ])

    setShowAnswer(false)
  }

  /* ======================
      SPEAK
  ====================== */

  const speak = (text) => {

    const u =
      new SpeechSynthesisUtterance(
        text
      )

    u.lang = "ja-JP"

    speechSynthesis.cancel()

    speechSynthesis.speak(u)
  }

  /* ======================
      KEYBOARD
  ====================== */

  useFlashcardKeyboard({
    next,
    prev,

    flip: () =>
      setShowAnswer((s) => !s),

    markKnown,
    markUnknown,

    speak,
    currentJP,
  })

  /* ======================
      AUTO FLIP
  ====================== */

  useEffect(() => {

    if (
      !autoFlip ||
      showAnswer
    ) return

    const t = setTimeout(
      () => setShowAnswer(true),
      flipDelay
    )

    return () => clearTimeout(t)

  }, [
    index,
    autoFlip,
    flipDelay,
  ])

  /* ======================
      TOUCH
  ====================== */

  const touchHandlers =
    useFlashcardTouch({

      onNext: next,

      onPrev: prev,

      onFlip: () =>
        setShowAnswer((s) => !s),
    })

  /* ======================
      FINISHED
  ====================== */

  if (finished) {

    return (
      <FlashcardSummary
        cards={cards}
        repeatMap={repeatMap}
        totalTime={totalTime}

        onRestart={() => {

          localStorage.removeItem(
            FLASHCARD_PROGRESS_KEY
          )

          setList(cards)

          setIndex(0)

          setRepeatMap({})

          setShowAnswer(false)

          setTotalTime(null)
        }}
      />
    )
  }

  /* ======================
      SAFETY
  ====================== */

  if (!card) {

    return (
      <div className="text-center text-xl">
        🎉 Hoàn thành!
      </div>
    )
  }

  /* ======================
     UI
 ====================== */

  return (
    <div
      className="
      w-full
      max-w-6xl
      mx-auto

      flex flex-col
      items-center

      gap-2
      sm:gap-3
      md:gap-4

      px-2
      sm:px-4

      py-1
      sm:py-2
    "
    >

      {/* TIMER */}

      <div
        className="
        w-full
        flex
        justify-center
      "
      >
        <FlashcardTimer
          isFinished={finished}
          onFinish={setTotalTime}
        />
      </div>

      {/* PROGRESS */}

      <div
        className="
        w-full
        max-w-2xl
        flex
        justify-center
      "
      >
        <FlashcardProgress
          learned={
            Math.max(
              0,
              cards.length - list.length
            )
          }

          total={cards.length}
        />
      </div>

      {/* CARD */}

      <div
        className="
        w-full

        flex
        justify-center
        items-center

        min-h-[180px]
        sm:min-h-[240px]
        md:min-h-[300px]
      "
      >
        <Flashcard
          key={card.id}

          front={card.front}

          back={card.back}

          showAnswer={showAnswer}

          onFlip={() =>
            setShowAnswer((s) => !s)
          }

          onSpeak={speak}

          touchHandlers={touchHandlers}

          direction={card.direction}

          index={index}

          onExposeJP={setCurrentJP}
        />
      </div>

      {/* NAVIGATION */}

      <div
        className="
        w-full
        flex
        justify-center
      "
      >
        <FlashcardNav
          index={index}
          total={list.length}

          onPrev={prev}
          onNext={next}
        />
      </div>

      {/* CONTROLS */}

      <div
        className="
        w-full
        flex
        justify-center
      "
      >
        <FlashcardControls
          onKnown={markKnown}
          onUnknown={markUnknown}
        />
      </div>

      {/* SETTINGS */}

      <div
        className="
        w-full
        flex
        justify-center
      "
      >
        <FlashcardSettings
          autoFlip={autoFlip}
          setAutoFlip={setAutoFlip}

          flipDelay={flipDelay}
          setFlipDelay={setFlipDelay}
        />
      </div>

    </div>
  )
}