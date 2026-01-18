import { useEffect, useRef } from "react"

const LESSON_COUNT = 50

const REVIEW_MODES = [
  { key: "typing", label: "✍️ Điền từ" },
  { key: "quiz", label: "🧠 Trắc nghiệm" },
  { key: "flashcard", label: "🃏 Flashcard" },
]

const DIRECTIONS = [
  { key: "jp_vi", label: "Nhật → Việt" },
  { key: "vi_jp", label: "Việt → Nhật" },
  { key: "kanji", label: "Kanji" },
]

const STORAGE_KEY = "reviewConfig"

export default function ReviewConfig({
  selectedLessons,
  setSelectedLessons,
  mode,
  setMode,
  directions,
  setDirections,
  onStart,
  loading,
}) {
  const isDragging = useRef(false)
  const dragMode = useRef("add")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const { lessons, mode, directions } = JSON.parse(saved)

      if (lessons) {
        setSelectedLessons(lessons)
      }
      if (mode) {
        setMode(mode)
      }
      if (Array.isArray(directions)) {
        setDirections(directions)
      }
    } catch (e) {
      console.error("Failed to load review config", e)
    }
  }, [])


  const toggleLesson = (lesson, forceMode) => {
    setSelectedLessons((prev) => {
      const exists = prev.includes(lesson)
      if (forceMode === "add" && !exists) return [...prev, lesson]
      if (forceMode === "remove" && exists)
        return prev.filter((l) => l !== lesson)
      if (forceMode) return prev
      return exists
        ? prev.filter((l) => l !== lesson)
        : [...prev, lesson]
    })
  }

  const toggleDirection = (key) => {
    setDirections((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev
        return prev.filter((d) => d !== key)
      }
      return [...prev, key]
    })
  }

  return (
    <div className="space-y-8">
      {/* TOP CONFIG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          {/* MODE */}
          <section className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              🎮 <span>Chế độ ôn</span>
            </h2>
            <div className="space-y-3">
              {REVIEW_MODES.map((m) => (
                <label
                  key={m.key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    className="scale-110"
                    checked={mode === m.key}
                    onChange={() => setMode(m.key)}
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* DIRECTION */}
          <section className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              🔁 <span>Hướng ôn</span>
            </h2>
            <div className="space-y-3">
              {DIRECTIONS.map((d) => (
                <label
                  key={d.key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="scale-110"
                    checked={directions.includes(d.key)}
                    onChange={() => toggleDirection(d.key)}
                  />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT – LESSON GRID */}
        <section className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            📚 <span>Chọn bài học</span>
          </h2>

          <div
            className="
              grid gap-2 select-none
              grid-cols-4
              sm:grid-cols-6
              md:grid-cols-8
              lg:grid-cols-10
            "
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
          >
            {Array.from({ length: LESSON_COUNT }, (_, i) => i + 1).map(
              (lesson) => {
                const checked = selectedLessons.includes(lesson)

                return (
                  <div
                    key={lesson}
                    className={`
                      aspect-square flex items-center justify-center
                      rounded-lg border cursor-pointer text-sm font-medium
                      transition
                      ${checked
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 hover:bg-gray-200"
                      }
                    `}
                    onMouseDown={() => {
                      isDragging.current = true
                      dragMode.current = checked ? "remove" : "add"
                      toggleLesson(lesson, dragMode.current)
                    }}
                    onMouseEnter={() => {
                      if (isDragging.current) {
                        toggleLesson(lesson, dragMode.current)
                      }
                    }}
                  >
                    {lesson}
                  </div>
                )
              }
            )}
          </div>
        </section>
      </div>

      {/* START BUTTON */}
      <div className="text-center">
        <button
          onClick={onStart}
          disabled={loading}
          className="
            inline-flex items-center gap-2
            px-10 py-3 rounded-xl
            bg-blue-600 text-white text-lg font-semibold
            hover:bg-blue-700 transition
            disabled:opacity-50
          "
        >
          🚀 Bắt đầu ôn
        </button>
      </div>
    </div>
  )
}
