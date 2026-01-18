// components/LessonPicker.jsx
export default function LessonPicker({
  open,
  onClose,
  selectedLesson,
  onSelect,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-t-2xl p-4
                   max-h-[70vh] overflow-y-auto
                   animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Chọn bài học</h3>
          <button
            onClick={onClose}
            className="text-gray-500 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 50 }, (_, i) => i + 1).map((lesson) => (
            <button
              key={lesson}
              onClick={() => {
                onSelect(lesson)
                onClose()
              }}
              className={`py-2 rounded text-sm transition
                ${
                  selectedLesson === lesson
                    ? "bg-teal-700 text-white"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
            >
              {lesson}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
