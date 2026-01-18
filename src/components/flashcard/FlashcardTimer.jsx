import { useEffect, useState } from "react"

export default function FlashcardTimer({ isFinished, onFinish }) {
  const [startTime] = useState(Date.now())
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (isFinished) {
      onFinish(Date.now() - startTime)
      return
    }

    const t = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(t)
  }, [isFinished])

  const seconds = Math.floor((now - startTime) / 1000)

  return (
    <div className="text-sm text-gray-500">
      ⏱ {seconds}s
    </div>
  )
}
