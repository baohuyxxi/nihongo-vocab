import { useEffect, useState } from "react"

const DEFAULT_PROGRESS_KEY = "flashcardProgress"

export default function FlashcardTimer({
  isFinished,
  onFinish,
  progressKey = DEFAULT_PROGRESS_KEY,
}) {
  const storageKey = progressKey || DEFAULT_PROGRESS_KEY

  const [startTime] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(storageKey) || "null"
      )

      if (saved?.startTime) return saved.startTime

      const now = Date.now()

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...saved,
          startTime: now,
        })
      )

      return now
    } catch {
      return Date.now()
    }
  })

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (isFinished) {
      onFinish(Date.now() - startTime)
      return
    }

    const timer = setInterval(() => {
      setNow(Date.now())
    }, 60_000)

    return () => clearInterval(timer)
  }, [isFinished, startTime, onFinish])

  const minutes = Math.floor((now - startTime) / 60_000)

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm sm:text-sm">
      <span className="text-base">⏱</span>
      <span>{minutes} phút</span>
    </div>
  )
}