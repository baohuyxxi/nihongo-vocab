import { TdAudioM, TdInputM, TdJPInputM } from "./cells"
import { useEffect, useRef } from "react"

export default function VocabRowTablet({
  index,
  row,
  onChange,
  onKanaChange,
}) {
  const meaningRef = useRef(null)

  const autoResize = () => {
    const el = meaningRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }

  useEffect(() => {
    autoResize()
  }, [row.meaning])

  return (
    <div className="border rounded-lg p-3 space-y-2 bg-white">
      {/* KANA + AUDIO */}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <TdJPInputM
          value={row.hiragana || row.katakana}
          onChange={(v) => onKanaChange(index, v)}
        />
        <TdAudioM row={row} />
      </div>

      {/* PHONETIC */}
      <TdInputM
        value={row.phoneticVi}
        placeholder="Phiên âm"
        onChange={(v) => onChange(index, "phoneticVi", v)}
      />

      {/* KANJI + HÁN VIỆT */}
      <div className="grid grid-cols-2 gap-2">
        <TdInputM
          value={row.kanji}
          placeholder="Kanji"
          onChange={(v) => onChange(index, "kanji", v)}
        />
        <TdInputM
          value={row.hanViet}
          placeholder="Hán Việt"
          onChange={(v) => onChange(index, "hanViet", v)}
        />
      </div>

      {/* MEANING */}
      <textarea
        ref={meaningRef}
        className="
          w-full resize-none bg-transparent outline-none
          border border-gray-200 rounded
          px-2 py-2 text-lg leading-6
          whitespace-pre-wrap break-words
          focus:bg-blue-50
        "
        placeholder="Nghĩa"
        value={row.meaning || ""}
        onChange={(e) => {
          onChange(index, "meaning", e.target.value)
          requestAnimationFrame(autoResize)
        }}
      />
    </div>
  )
}
