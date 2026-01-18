import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LessonPicker from "../components/LessonPicker"

export default function Home() {
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showPicker, setShowPicker] = useState(false)
  const navigate = useNavigate()

  const sections = [
    "Từ vựng",
    "Ngữ pháp",
    "Luyện đọc",
    "Hội thoại",
    "Luyện nghe",
    "Bài tập",
    "Hán tự",
    "Kanji Renshu",
    "Đọc hiểu",
    "Kiểm tra",
    "Tham khảo",
  ]

  const handleGoSection = (index) => {
    if (!selectedLesson) {
      alert("Vui lòng chọn bài trước")
      return
    }

    if (index === 0) {
      navigate(`/vocab-table?lesson=${selectedLesson}`)
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Nội dung chính */}
        <div className="flex-1">
          {/* Mobile chọn bài */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowPicker(true)}
              className="w-full bg-teal-600 text-white py-2 rounded"
            >
              📘 {selectedLesson ? `Bài ${selectedLesson}` : "Chọn bài học"}
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {selectedLesson
              ? `BÀI ${String(selectedLesson).padStart(2, "0")}`
              : "Chọn bài học"}
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Giới thiệu các mẫu câu cơ bản trong giao tiếp hằng ngày...
          </p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded mb-5 w-full sm:w-auto">
            Bật/Tắt phiên âm Hán tự
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white p-4 rounded shadow">
            {sections.map((item, index) => (
              <button
                key={index}
                disabled={!selectedLesson}
                onClick={() => handleGoSection(index)}
                className={`border rounded p-4 text-sm text-center transition
                  ${
                    selectedLesson
                      ? "hover:bg-gray-100"
                      : "opacity-40 cursor-not-allowed"
                  }`}
              >
                <div className="font-medium">Phần {index + 1}</div>
                <div className="text-xs text-gray-500">{item}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar desktop */}
        <div className="hidden lg:block w-64 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">50 bài Minna no Nihongo</h3>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((lesson) => (
              <button
                key={lesson}
                onClick={() => setSelectedLesson(lesson)}
                className={`py-2 text-sm rounded
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

      {/* Lesson Picker Mobile */}
      <LessonPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        selectedLesson={selectedLesson}
        onSelect={setSelectedLesson}
      />
    </>
  )
}
