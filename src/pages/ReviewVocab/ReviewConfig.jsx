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

  /* ======================
      LOAD CONFIG
  ====================== */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setDirections(["jp_vi"])
      return
    }

    try {
      const cfg = JSON.parse(raw)
      if (Array.isArray(cfg.lessons)) setSelectedLessons(cfg.lessons)
      if (cfg.mode) setMode(cfg.mode)
      if (Array.isArray(cfg.directions) && cfg.directions.length) {
        setDirections(cfg.directions)
      } else {
        setDirections(["jp_vi"])
      }
    } catch {
      setDirections(["jp_vi"])
    }
  }, [])

  /* ======================
      TOGGLES
  ====================== */
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

  /* ======================
      UI
  ====================== */
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-1 space-y-6">
          {/* MODE */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">🎮 Chế độ</h2>
            <div className="space-y-2">
              {REVIEW_MODES.map((m) => (
                <label
                  key={m.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={mode === m.key}
                    onChange={() => setMode(m.key)}
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </section>

          {/* DIRECTION */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">🔁 Hướng ôn</h2>
            <div className="space-y-2">
              {DIRECTIONS.map((d) => (
                <label
                  key={d.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={directions.includes(d.key)}
                    onChange={() => toggleDirection(d.key)}
                  />
                  {d.label}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Phải chọn ít nhất 1 hướng
            </p>
          </section>
        </div>

        {/* RIGHT */}
        <section className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">
            📚 Chọn bài (kéo chuột để chọn nhanh)
          </h2>

          <div
            className="grid grid-cols-8 sm:grid-cols-10 gap-2 select-none"
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
          >
            {Array.from({ length: LESSON_COUNT }, (_, i) => i + 1).map(
              (lesson) => {
                const checked = selectedLessons.includes(lesson)

                return (
                  <div
                    key={lesson}
                    className={`cursor-pointer text-sm px-2 py-1 rounded
                      border text-center transition
                      ${
                        checked
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
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

      {/* START */}
      <div className="text-center">
        <button
          onClick={onStart}
          disabled={loading}
          className="px-10 py-3 bg-blue-600 text-white
                     rounded-lg text-lg font-semibold
                     disabled:opacity-50"
        >
          🚀 Bắt đầu ôn
        </button>
      </div>
    </div>
  )
}
