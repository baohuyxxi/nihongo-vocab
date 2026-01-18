import { useEffect, useState } from "react"
import Flashcard from "../../components/flashcard/Flashcard"
import FlashcardProgress from "../../components/flashcard/FlashcardProgress"
import FlashcardControls from "../../components/flashcard/FlashcardControls"
import FlashcardNav from "../../components/flashcard/FlashcardNav"
import FlashcardSettings from "../../components/flashcard/FlashcardSettings"
import useFlashcardTouch from "../../components/flashcard/useFlashcardTouch"
import useFlashcardKeyboard from "../../components/flashcard/useFlashcardKeyboard"

export default function FlashcardReview({ cards = [] }) {
  const [list, setList] = useState(cards)
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [autoFlip, setAutoFlip] = useState(false)
  const [flipDelay, setFlipDelay] = useState(4000)
  const [currentJP, setCurrentJP] = useState(null)


  const card = list[index]

  /* ---------- navigation ---------- */
  const next = () => {
    setShowAnswer(false)
    setIndex((i) => Math.min(i + 1, list.length - 1))
  }

  const prev = () => {
    setShowAnswer(false)
    setIndex((i) => Math.max(i - 1, 0))
  }

  /* ---------- SRS ---------- */
  const markKnown = () => {
    setList((l) => l.filter((_, i) => i !== index))
    setIndex((i) => Math.min(i, list.length - 2))
    setShowAnswer(false)
  }

  const markUnknown = () => {
    setList((l) => [...l.filter((_, i) => i !== index), l[index]])
    setShowAnswer(false)
  }

  /* ---------- speak ---------- */
  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = "ja-JP"
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
  }


  /* ---------- keyboard ---------- */
  useFlashcardKeyboard({
    next,
    prev,
    flip: () => setShowAnswer((s) => !s),
    markKnown,
    markUnknown,
    speak,
    currentJP,
  })

  /* ---------- auto flip ---------- */
  useEffect(() => {
    if (!autoFlip || showAnswer) return
    const t = setTimeout(() => setShowAnswer(true), flipDelay)
    return () => clearTimeout(t)
  }, [index, autoFlip, flipDelay])

  /* ---------- touch ---------- */
  const touchHandlers = useFlashcardTouch({
    onNext: next,
    onPrev: prev,
    onFlip: () => setShowAnswer((s) => !s),
  })



  if (!card) {
    return <div className="text-center text-xl">🎉 Hoàn thành!</div>
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-10 px-3 sm:px-6">

      <FlashcardProgress
        learned={cards.length - list.length}
        total={cards.length}
      />

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

      <FlashcardNav
        index={index}
        total={list.length}
        onPrev={prev}
        onNext={next}
      />


      <FlashcardControls
        onKnown={markKnown}
        onUnknown={markUnknown}
      />


      <FlashcardSettings
        autoFlip={autoFlip}
        setAutoFlip={setAutoFlip}
        flipDelay={flipDelay}
        setFlipDelay={setFlipDelay}
      />
    </div>
  )
}
