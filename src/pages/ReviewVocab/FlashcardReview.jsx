import {
  useEffect,
  useState,
  useCallback,
} from "react"

import Flashcard
  from "../../components/flashcard/Flashcard"

import FlashcardProgress
  from "../../components/flashcard/FlashcardProgress"

import FlashcardControls
  from "../../components/flashcard/FlashcardControls"

import FlashcardNav
  from "../../components/flashcard/FlashcardNav"

import FlashcardSettings
  from "../../components/flashcard/FlashcardSettings"

import FlashcardTimer
  from "../../components/flashcard/FlashcardTimer"

import FlashcardSummary
  from "../../components/flashcard/FlashcardSummary"

import useFlashcardTouch
  from "../../components/flashcard/useFlashcardTouch"

import useFlashcardKeyboard
  from "../../components/flashcard/useFlashcardKeyboard"


const FLASHCARD_PROGRESS_KEY =
  "flashcardProgress"


export default function FlashcardReview({
  cards = [],
  onContinue,
  onResult,
  progressKey = FLASHCARD_PROGRESS_KEY,
}) {
  const FLASHCARD_PROGRESS_KEY = progressKey

  /* ======================
      LOAD SAVED PROGRESS
  ====================== */

  const savedProgress = (() => {

    try {

      return JSON.parse(
        localStorage.getItem(
          FLASHCARD_PROGRESS_KEY
        ) || "null"
      )

    } catch {

      return null

    }

  })()


  const [list, setList] =
    useState(
      savedProgress?.list || cards
    )


  const [index, setIndex] =
    useState(
      savedProgress?.index || 0
    )


  const [showAnswer, setShowAnswer] =
    useState(
      savedProgress?.showAnswer || false
    )


  const [autoFlip, setAutoFlip] =
    useState(false)


  const [flipDelay, setFlipDelay] =
    useState(4000)


  const [currentJP, setCurrentJP] =
    useState(null)


  const [repeatMap, setRepeatMap] =
    useState(
      savedProgress?.repeatMap || {}
    )


  const [startTime, setStartTime] =
    useState(
      savedProgress?.startTime ||
      Date.now()
    )


  const [totalTime, setTotalTime] =
    useState(
      savedProgress?.totalTime || null
    )



  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem(
          FLASHCARD_PROGRESS_KEY
        ) || "null"
      )

    if (saved?.startTime) {

      setStartTime(
        saved.startTime
      )

      return

    }


    const now =
      Date.now()

    setStartTime(now)


    localStorage.setItem(

      FLASHCARD_PROGRESS_KEY,

      JSON.stringify({

        list,

        index,

        repeatMap,

        showAnswer,

        startTime: now,

        totalTime: null,

      })

    )

  }, [])


  /* ======================
      DERIVED
  ====================== */

  const card =
    list[index]


  const finished =
    list.length === 0


  /* ======================
      SAVE PROGRESS
  ====================== */

  useEffect(() => {

    /*
      Không lưu lại progress sau khi
      session đã hoàn thành.
    */

    if (finished) {
      return
    }


    localStorage.setItem(

      FLASHCARD_PROGRESS_KEY,

      JSON.stringify({

        list,

        index,

        repeatMap,

        showAnswer,

        startTime,

        totalTime,

      })

    )

  }, [
    list,
    index,
    repeatMap,
    showAnswer,
    startTime,
    totalTime,
    finished,
  ])


  /* ======================
      FINISH TIMER
  ====================== */

  const handleTimerFinish =
    useCallback(
      (elapsed) => {

        setTotalTime(
          (current) =>
            current ?? elapsed
        )

      },
      []
    )


  /* ======================
      FINISHED
  ====================== */

  useEffect(() => {

    if (!finished) {
      return
    }


    const elapsed =
      totalTime ??
      (
        Date.now() -
        startTime
      )


    setTotalTime(
      elapsed
    )

  }, [
    finished,
    startTime,
    totalTime,
  ])


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
      Math.max(
        i - 1,
        0
      )
    )

  }


  /* ======================
      SRS
  ====================== */

  const markKnown = async () => {
    if (onResult) { await onResult(card, true); return }

    setList((l) =>
      l.filter(
        (_, i) =>
          i !== index
      )
    )


    setIndex((i) =>
      Math.min(
        i,
        list.length - 2
      )
    )


    setShowAnswer(false)

  }


  const markUnknown = async () => {
    if (onResult) { await onResult(card, false); return }

    const current =
      list[index]


    if (!current) {
      return
    }


    const id =
      current.id


    setRepeatMap((m) => ({

      ...m,

      [id]:
        (m[id] || 0) + 1,

    }))


    setList((l) => [

      ...l.filter(
        (_, i) =>
          i !== index
      ),

      l[index],

    ])


    setShowAnswer(false)

  }


  /* ======================
      SPEAK
  ====================== */

  const speak = (text) => {

    if (!text) {
      return
    }


    const u =
      new SpeechSynthesisUtterance(
        text
      )


    u.lang =
      "ja-JP"


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
      setShowAnswer(
        (s) => !s
      ),

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
      showAnswer ||
      finished
    ) {

      return

    }


    const timer =
      setTimeout(
        () =>
          setShowAnswer(true),
        flipDelay
      )


    return () =>
      clearTimeout(timer)

  }, [
    index,
    autoFlip,
    flipDelay,
    showAnswer,
    finished,
  ])


  /* ======================
      TOUCH
  ====================== */

  const touchHandlers =
    useFlashcardTouch({

      onNext:
        next,

      onPrev:
        prev,

      onFlip:
        () =>
          setShowAnswer(
            (s) => !s
          ),

    })


  /* ======================
      FINISHED
  ====================== */

  if (finished) {

    return (

      <FlashcardSummary

        cards={cards}

        repeatMap={repeatMap}

        totalTime={
          totalTime ??
          (
            Date.now() -
            startTime
          )
        }

        onContinue={
          onContinue
        }

        onRestart={() => {

          const now =
            Date.now()


          setList(
            cards
          )


          setIndex(
            0
          )


          setRepeatMap(
            {}
          )


          setShowAnswer(
            false
          )


          setTotalTime(
            null
          )


          setStartTime(
            now
          )


          localStorage.removeItem(
            FLASHCARD_PROGRESS_KEY
          )


          /*
            Tạo progress mới ngay lập tức
            để timer bắt đầu từ now.
          */

          localStorage.setItem(

            FLASHCARD_PROGRESS_KEY,

            JSON.stringify({

              list:
                cards,

              index:
                0,

              repeatMap:
                {},

              showAnswer:
                false,

              startTime:
                now,

              totalTime:
                null,

            })

          )

        }}

      />

    )

  }


  /* ======================
      SAFETY
  ====================== */

  if (!card) {

    return (

      <div
        className="
          text-center
          text-xl
        "
      >

        🎉 Hoàn thành!

      </div>

    )

  }


  /* ======================
      UI
  ====================== */

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-1 py-1 sm:gap-3 sm:px-2">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur-sm sm:p-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <FlashcardTimer isFinished={finished} onFinish={handleTimerFinish} />
          <div className="w-full max-w-xl md:w-auto">
            <FlashcardProgress
              learned={Math.max(0, cards.length - list.length)}
              total={cards.length}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Flashcard
          key={card.id}
          front={card.front}
          back={card.back}
          showAnswer={showAnswer}
          onFlip={() => setShowAnswer((s) => !s)}
          onSpeak={speak}
          touchHandlers={touchHandlers}
          direction={card.direction}
          index={index}
          onExposeJP={setCurrentJP}
        />
      </div>

      <div className="flex shrink-0 justify-center">
        <FlashcardNav index={index} total={list.length} onPrev={prev} onNext={next} />
      </div>

      <div className="flex shrink-0 justify-center">
        <FlashcardControls onKnown={markKnown} onUnknown={markUnknown} />
      </div>

      <div className="flex shrink-0 justify-center">
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
