import { useRef } from "react"

export default function useFlashcardTouch({ onNext, onPrev, onFlip }) {
  const start = useRef(null)

  const onTouchStart = (e) => {
    start.current = e.touches[0]
  }

  const onTouchEnd = (e) => {
    if (!start.current) return
    const dx = e.changedTouches[0].clientX - start.current.clientX
    const dy = e.changedTouches[0].clientY - start.current.clientY

    if (Math.abs(dx) > 60) {
      dx < 0 ? onNext() : onPrev()
    } else if (Math.abs(dy) > 60) {
      onFlip()
    }

    start.current = null
  }

  return { onTouchStart, onTouchEnd }
}
