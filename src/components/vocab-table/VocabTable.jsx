import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import VocabTableDesktop from "./VocabTableDesktop"
import VocabTableMobile from "./VocabTableMobile"
import { isHiragana, isKatakana } from "../../utils/kana"

export default function VocabTable({ rows, onChange, onAddRow }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleKanaChange = (index, value) => {
    if (isHiragana(value)) {
      onChange(index, "hiragana", value)
      onChange(index, "katakana", "")
    } else if (isKatakana(value)) {
      onChange(index, "katakana", value)
      onChange(index, "hiragana", "")
    } else {
      onChange(index, "hiragana", "")
      onChange(index, "katakana", "")
    }
  }

  return (
    <div className="overflow-auto border bg-white rounded">
      {isMobile ? (
        <VocabTableMobile
          rows={rows}
          onChange={onChange}
          onKanaChange={handleKanaChange}
        />
      ) : (
        <VocabTableDesktop
          rows={rows}
          onChange={onChange}
          onKanaChange={handleKanaChange}
        />
      )}

      {/* ADD ROW */}
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
