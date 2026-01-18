import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
  const [selectedLesson, setSelectedLesson] = useState(null)
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

  const handleGoSection = (sectionIndex) => {
    if (!selectedLesson) {
      alert("Vui lòng chọn bài trước")
      return
    }

   
  }

  return (
    <div className="flex gap-6">
      {/* Nội dung trái */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">
          {selectedLesson
            ? `BÀI ${String(selectedLesson).padStart(2, "0")}`
            : "Chọn bài học"}
        </h2>

        <p className="text-gray-600 mb-4">
          Giới thiệu các mẫu câu cơ bản trong giao tiếp hằng ngày...
        </p>

        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-6">
          Bật/Tắt phiên âm Hán tự
        </button>

        {/* Các phần */}
        <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded shadow">
          {sections.map((item, index) => (
            <button
              key={index}
              disabled={!selectedLesson}
              onClick={() => handleGoSection(index)}
              className={`border rounded p-3 text-center transition
                ${
                  selectedLesson
                    ? "hover:bg-gray-100 cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                }`}
            >
              <div className="text-sm font-medium">Phần {index + 1}</div>
              <div className="text-xs text-gray-500">{item}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar phải */}
      <div className="w-64 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">50 bài Minna no Nihongo</h3>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 50 }, (_, i) => i + 1).map((lesson) => (
            <button
              key={lesson}
              onClick={() => setSelectedLesson(lesson)}
              className={`text-sm py-1 rounded text-center transition
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

export default Home
