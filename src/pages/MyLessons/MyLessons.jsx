import { useNavigate } from "react-router-dom"

export default function MyLessons() {
  const navigate = useNavigate()

  const options = [
    {
      id: "mind-map",
      title: "Bản đồ tư duy",
      desc: "Xem mối liên hệ giữa các từ",
    },
    {
      id: "adverbs",
      title: "Học phó từ",
      desc: "Luyện các phó từ thường dùng",
    },
    {
      id: "verb-conjugation",
      title: "Chia động từ",
      desc: "Luyện chia các động từ ",
    }
  ]

  return (
    <div className="p-4">
      {/* Header */}
      <h2 className="text-xl font-bold mb-2">
        Chọn cách học
      </h2>

      <p className="text-gray-600 mb-4">
        Chọn một phương pháp học bạn muốn
      </p>

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {options.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/my-lessons/${item.id}`)}
            className="cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}