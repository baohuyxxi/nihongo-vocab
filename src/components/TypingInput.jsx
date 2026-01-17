import { forwardRef, useState, useEffect } from "react"
import { toHiragana, toKatakana, isRomaji } from "wanakana"

const TypingInput = forwardRef(function TypingInput(
  { direction, onSubmit },
  ref
) {
  const [raw, setRaw] = useState("")       // romaji gốc
  const [display, setDisplay] = useState("") // chữ hiển thị
  const [kata, setKata] = useState(false)

  useEffect(() => {
    if (direction !== "vi_jp") {
      setDisplay(raw)
      return
    }

    if (isRomaji(raw)) {
      setDisplay(kata ? toKatakana(raw) : toHiragana(raw))
    } else {
      setDisplay(raw)
    }
  }, [raw, kata, direction])

  return (
    <div className="space-y-3">
      <input
        ref={ref}
        value={display}
        lang={direction === "vi_jp" ? "ja" : "vi"}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="w-full border p-4 text-[28px] text-center rounded"
        placeholder={
          direction === "vi_jp"
            ? "Romaji → ひらがな | Giữ Shift = カタカナ"
            : "Nhập nghĩa tiếng Việt"
        }
        onChange={(e) => {
          setRaw(e.target.value)
        }}
        onKeyDown={(e) => {
          if (direction === "vi_jp" && e.key === "Shift") {
            setKata(true)
          }

          if (e.key === "Enter") {
            e.preventDefault()
            onSubmit(display)
          }
        }}
        onKeyUp={(e) => {
          if (direction === "vi_jp" && e.key === "Shift") {
            setKata(false)
          }
        }}
      />

      {/* NÚT KIỂM TRA */}
      <button
        onClick={() => onSubmit(display)}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        Kiểm tra
      </button>
    </div>
  )
})

export default TypingInput
