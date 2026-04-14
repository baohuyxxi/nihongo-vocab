import { useEffect, useState } from "react"
import { getAllAdverbs } from "../../services/lesson.service"

export default function Adverbs() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllAdverbs()

        console.log("API:", res.data) // debug

        // ✅ FIX CHÍNH
        setData(res.data.other || [])
      } catch (err) {
        console.error("Lỗi API:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = data.filter((item) => {
    const keyword = search.toLowerCase()

    return (
      item.meaning?.toLowerCase().includes(keyword) ||
      item.hiragana?.includes(keyword) ||
      item.romaji?.toLowerCase().includes(keyword)
    )
  })

  if (loading) {
    return <div className="p-4">Đang tải phó từ...</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">📘 Học Phó Từ</h2>

      <p className="text-gray-600 mb-4">
        Tổng hợp tất cả phó từ
      </p>

      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-lg font-semibold">
              {item.hiragana}
            </div>

            {item.romaji && (
              <div className="text-sm text-gray-500">
                {item.romaji}
              </div>
            )}

            <div className="text-sm text-blue-600 mt-2">
              {item.meaning}
            </div>

            {item.example?.jp && (
              <div className="text-xs text-gray-500 mt-2">
                {item.example.jp}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-6">
          Không có dữ liệu
        </div>
      )}
    </div>
  )
}