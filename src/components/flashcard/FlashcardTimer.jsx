// FlashcardTimer.jsx

import { useEffect, useState }
  from "react"

export default function FlashcardTimer({
  isFinished,
  onFinish,
}) {

  const [startTime]
    = useState(Date.now())

  const [now, setNow]
    = useState(Date.now())

  useEffect(() => {

    if (isFinished) {

      onFinish(
        Date.now() - startTime
      )

      return
    }

    const t = setInterval(() => {

      setNow(Date.now())

    }, 1000)

    return () => clearInterval(t)

  }, [isFinished])

  const seconds = Math.floor(
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
      ⏱ {seconds}s
    </div>
  )
}