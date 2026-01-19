import { useEffect, useRef } from "react"
import { TdAudioM, TdInputM, TdJPInputM } from "./cells"

export default function VocabRowMobile({
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
    <>
      {/* ===== 1 WORD GROUP ===== */}
      <tr>
        <td colSpan={4} className="p-0">
          <div
            className="
              border border-gray-300
              rounded-lg
              p-2
              space-y-1
              bg-white
            "
          >
            {/* ===== ROW 1: KANA + PHONETIC + AUDIO ===== */}
            <div className="grid grid-cols-[1fr_1fr_auto] gap-1">
              <TdJPInputM
                value={row.hiragana || row.katakana}
                onChange={(v) => onKanaChange(index, v)}
                compact
              />

              <TdInputM
                value={row.phoneticVi}
                placeholder="Phiên âm"
                onChange={(v) => onChange(index, "phoneticVi", v)}
                compact
              />

              <TdAudioM row={row} />
            </div>

            {/* ===== ROW 2: KANJI + HÁN VIỆT ===== */}
            <div className="grid grid-cols-2 gap-1">
              <TdInputM
                value={row.kanji}
                placeholder="Kanji"
                onChange={(v) => onChange(index, "kanji", v)}
                compact
              />
              <TdInputM
                value={row.hanViet}
                placeholder="Hán Việt"
                onChange={(v) => onChange(index, "hanViet", v)}
                compact
              />
            </div>

            {/* ===== ROW 3: MEANING ===== */}
            <textarea
              ref={meaningRef}
              className="
                w-full
                resize-none
                overflow-hidden
                bg-transparent
                outline-none
                border border-gray-200
                rounded
                px-2 py-1.5
                text-xl
                leading-7
                whitespace-pre-wrap
                break-words
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
        </td>
      </tr>
    </>
  )
}
