import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import VocabTableDesktop from "./VocabTableDesktop"
import VocabTableMobile from "./VocabTableMobile"
import VocabTableTablet from "./VocabTableTablet" // 👈 sẽ tạo
import { isHiragana, isKatakana } from "../../utils/kana"

export default function VocabTable({ rows, onChange, onAddRow }) {
  const [layout, setLayout] = useState("desktop")

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w < 768) setLayout("mobile")
      else if (w <= 1024) setLayout("tablet")
      else setLayout("desktop")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleKanaChange = (index, value, meta = {}) => {
    if (meta.composing) return

    if (isHiragana(value)) {
      onChange(index, "hiragana", value)
      onChange(index, "katakana", "")
    } else if (isKatakana(value)) {
      onChange(index, "katakana", value)
      onChange(index, "hiragana", "")
    } else {
      onChange(index, "hiragana", value)
      onChange(index, "katakana", "")
    }
  }

  return (
    <div className="overflow-auto border bg-white rounded">
      {layout === "mobile" && (
        <VocabTableMobile
          rows={rows}
          onChange={onChange}
          onKanaChange={handleKanaChange}
        />
      )}

      {layout === "tablet" && (
        <VocabTableTablet
          rows={rows}
          onChange={onChange}
          onKanaChange={handleKanaChange}
        />
      )}

      {layout === "desktop" && (
        <VocabTableDesktop
          rows={rows}
          onChange={onChange}
          onKanaChange={handleKanaChange}
        />
      )}

      <div className="border-t bg-gray-50 p-4 text-center">
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 mx-auto text-blue-600"
        >
          <Plus size={20} />
          Thêm từ vựng
        </button>
      </div>
    </div>
  )
}
