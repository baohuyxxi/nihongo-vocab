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
  sessionStorageKey = "reviewSessionData",
}) {
  const storageKey = progressKey || FLASHCARD_PROGRESS_KEY

  const savedProgress = (() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null")
    } catch {
      return null
    }
  })()

  const [list, setList] = useState(
    Array.isArray(savedProgress?.list) && savedProgress.list.length > 0
      ? savedProgress.list
      : cards,
  )

  const [index, setIndex] = useState(
    Number.isInteger(savedProgress?.index) ? savedProgress.index : 0,
  )

  const [showAnswer, setShowAnswer] = useState(Boolean(savedProgress?.showAnswer))
  const [autoFlip, setAutoFlip] = useState(false)
  const [flipDelay, setFlipDelay] = useState(4000)
  const [currentJP, setCurrentJP] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [repeatMap, setRepeatMap] = useState(savedProgress?.repeatMap || {})
  const [startTime, setStartTime] = useState(savedProgress?.startTime || Date.now())
  const [totalTime, setTotalTime] = useState(savedProgress?.totalTime ?? null)

  useEffect(() => {
    if (!Array.isArray(cards) || cards.length === 0) return

    const currentSaved = (() => {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "null")
      } catch {
        return null
      }
    })()

    if (currentSaved?.list && currentSaved.list.length > 0) {
      return
    }

    setList(cards)
    setIndex(0)
    setRepeatMap({})
    setShowAnswer(false)
    setTotalTime(null)
    setStartTime(Date.now())
  }, [cards, storageKey])

  const card = list[index] || null
  const finished = list.length === 0

  useEffect(() => {
    if (finished) return

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        list,
        index,
        repeatMap,
        showAnswer,
        startTime,
        totalTime,
      }),
    )
  }, [list, index, repeatMap, showAnswer, startTime, totalTime, finished, storageKey])


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
    const current = list[index]
    if (!current || processing) return

    setProcessing(true)

    try {
      if (onResult) {
        await onResult(current, true)
      }

      setList((prev) => prev.filter((_, i) => i !== index))
      setIndex((prev) => Math.min(prev, Math.max(list.length - 2, 0)))
      setShowAnswer(false)
    } catch (error) {
      console.error("Flashcard markKnown failed:", error)
    } finally {
      setProcessing(false)
    }
  }

  const markUnknown = async () => {
    const current = list[index]
    if (!current || processing) return

    setProcessing(true)

    try {
      if (onResult) {
        await onResult(current, false)
      }

      const id = current.id
      setRepeatMap((m) => ({
        ...m,
        [id]: (m[id] || 0) + 1,
      }))

      setList((prev) => {
        const next = prev.filter((_, i) => i !== index)
        return [...next, current]
      })
      setShowAnswer(false)
    } catch (error) {
      console.error("Flashcard markUnknown failed:", error)
    } finally {
      setProcessing(false)
    }
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
        sessionStorageKey={sessionStorageKey}

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
            storageKey
          )


          /*
            Tạo progress mới ngay lập tức
            để timer bắt đầu từ now.
          */

          localStorage.setItem(

            storageKey,

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
          <FlashcardTimer
            isFinished={finished}
            onFinish={handleTimerFinish}
            progressKey={storageKey}
          />
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
