import { useEffect, useState } from "react"

const FLASHCARD_PROGRESS_KEY =
  "flashcardProgress"

export default function FlashcardTimer({
  isFinished,
  onFinish,
}) {

  const [startTime, setStartTime] =
    useState(() => {

      try {

        const saved =
          JSON.parse(
            localStorage.getItem(
              FLASHCARD_PROGRESS_KEY
            ) || "null"
          )

        if (saved?.startTime) {
          return saved.startTime
        }

      } catch (error) {

        console.error(
          "Failed to load timer",
          error
        )

      }

      const now = Date.now()

      try {

        const saved =
          JSON.parse(
            localStorage.getItem(
              FLASHCARD_PROGRESS_KEY
            ) || "{}"
          )

        localStorage.setItem(
          FLASHCARD_PROGRESS_KEY,
          JSON.stringify({
            ...saved,
            startTime: now,
          })
        )

      } catch {}

      return now

    })

  const [now, setNow] =
    useState(Date.now())


  /* ======================
      TIMER
  ====================== */

  useEffect(() => {

    if (isFinished) {

      const elapsed =
        Date.now() - startTime

      onFinish(elapsed)

      return

    }


    const timer =
      setInterval(() => {

        setNow(Date.now())

      }, 1000)


    return () =>
      clearInterval(timer)

  }, [
    isFinished,
    startTime,
    onFinish,
  ])


  const seconds =
    Math.floor(
      (now - startTime) / 1000
    )


  return (

    <div
      className="
        text-xs
        sm:text-sm

        text-gray-500

        bg-gray-100

        px-3
        py-1.5

        rounded-full
      "
    >

      ⏱ {Math.max(0, seconds)}s

    </div>

  )
}