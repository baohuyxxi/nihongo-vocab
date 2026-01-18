import { Plus } from "lucide-react"
import VocabTableDesktop from "./VocabTableDesktop"
import VocabTableMobile from "./VocabTableMobile"
import { isHiragana, isKatakana } from "../../utils/kana"

export default function VocabTable({ rows, onChange, onAddRow }) {
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
      <VocabTableDesktop
        rows={rows}
        onChange={onChange}
        onKanaChange={handleKanaChange}
      />

      <VocabTableMobile
        rows={rows}
        onChange={onChange}
        onKanaChange={handleKanaChange}
      />

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
