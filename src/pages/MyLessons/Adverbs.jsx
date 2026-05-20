import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { getAllAdverbs } from "../../services/lesson.service"

export default function Adverbs() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllAdverbs()
        setData(res.data.other || [])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = data.filter((item) => {
    const k = search.toLowerCase()

    return (
      item.meaning?.toLowerCase().includes(k) ||
      item.hiragana?.includes(k) ||
      item.romaji?.toLowerCase().includes(k)
    )
  })

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Đang tải phó từ...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 md:px-8 py-4 space-y-6">

      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          📘 Phó từ tiếng Nhật
        </h2>

        <p className="text-gray-500 text-sm sm:text-base">
          Tổng hợp phó từ thường gặp
        </p>

        <div className="text-xs sm:text-sm text-gray-600">
          Tổng: <b>{data.length}</b> từ
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm hiragana, romaji, nghĩa..."
          className="
            w-full
            pl-9 pr-3 py-2
            text-sm sm:text-base
            border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-200
          "
        />
      </div>

      {/* LIST */}
      <div className="
        grid grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-3 sm:gap-4
      ">

        {filtered.map((item) => (
          <div
            key={item._id}
            className="
              bg-white border rounded-xl
              p-3 sm:p-4
              shadow-sm hover:shadow-md
              transition
              space-y-2
            "
          >

            {/* TOP */}
            <div className="flex items-center justify-between">

              <div className="text-base sm:text-lg font-bold text-blue-600">
                {item.hiragana}
              </div>

              {item.romaji && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {item.romaji}
                </span>
              )}
            </div>

            {/* MEANING */}
            <div className="text-sm sm:text-base text-gray-700 font-medium">
              {item.meaning}
            </div>

            {/* EXAMPLE */}
            {item.example?.jp && (
              <div className="text-xs sm:text-sm text-gray-500 border-t pt-2">
                📝 {item.example.jp}
              </div>
            )}

          </div>
        ))}

      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          Không có dữ liệu
        </div>
      )}
    </div>
  )
}