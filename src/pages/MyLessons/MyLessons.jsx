import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  Brain,
  Volume2,
  GitBranch,
  Languages,
  LanguagesIcon,
} from "lucide-react"

export default function MyLessons() {
  const navigate = useNavigate()

  const options = [
    {
      id: "vocab-studied",
      title: "Tổng hợp từ vựng",
      desc: "Tất cả từ vựng đã học",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "mind-map",
      title: "Bản đồ tư duy",
      desc: "Xem mối liên hệ giữa các từ",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "adverbs",
      title: "Học phó từ",
      desc: "Luyện các phó từ thường dùng",
      icon: Volume2,
      color: "from-green-500 to-green-600",
    },
    {
      id: "verb-conjugation",
      title: "Chia động từ",
      desc: "Luyện chia các động từ",
      icon: GitBranch,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "homophones",
      title: "Từ đồng âm",
      desc: "Phát âm giống nhau, nghĩa khác nhau",
      icon: Languages,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "topic-manager",
      title: "Quản lý chủ đề",
      desc: "Tạo và quản lý các chủ đề học tập",
      icon: BookOpen,
      color: "from-gray-500 to-gray-600",
    },
    {
      id: "kanji-frequency",
      title: "Kanji phổ biến",
      desc: "Các Kanji xuất hiện nhiều nhất trong từ vựng",
      icon: LanguagesIcon,
      color: "from-red-500 to-red-600",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 space-y-6">

      {/* HERO */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold">
          📚 Chọn cách học
        </h2>

        <p className="text-sm sm:text-base text-gray-500">
          Chọn phương pháp phù hợp để luyện tiếng Nhật mỗi ngày
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {options.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/my-lessons/${item.id}`)}
              className="
                group cursor-pointer
                bg-white rounded-2xl
                border border-gray-100
                shadow-sm hover:shadow-xl
                transition-all duration-300
                p-4 sm:p-5
                active:scale-[0.98]
              "
            >

              {/* ICON */}
              <div
                className={`
                  w-12 h-12 sm:w-14 sm:h-14
                  rounded-xl
                  bg-gradient-to-r ${item.color}
                  flex items-center justify-center
                  text-white
                  mb-3
                  group-hover:scale-110
                  transition
                `}
              >
                <Icon size={22} />
              </div>

              {/* TITLE */}
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {item.desc}
              </p>

              {/* CTA */}
              <div className="mt-4 text-xs sm:text-sm font-medium text-blue-500 group-hover:underline">
                Bắt đầu học →
              </div>

            </div>
          )
        })}

      </div>
    </div>
  )
}