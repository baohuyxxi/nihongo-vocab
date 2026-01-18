import { useEffect, useRef } from "react"
import { TdAudio, TdCenter, TdInput } from "./cells"

export default function VocabRowDesktop({
  index,
  row,
  onChange,
  onKanaChange,
}) {
  const meaningRef = useRef(null)

  useEffect(() => {
    if (meaningRef.current) {
      meaningRef.current.style.height = "auto"
      meaningRef.current.style.height =
        meaningRef.current.scrollHeight + "px"
    }
  }, [row.meaning])

  return (
    <tr>
      <TdCenter >{index + 1}</TdCenter>

      <TdInput
        value={row.hiragana || row.katakana}
        placeholder="ひら / カタ"
        onChange={(v) => onKanaChange(index, v)}
      />

      <TdInput
        value={row.phoneticVi}
        onChange={(v) => onChange(index, "phoneticVi", v)}
      />

      <TdInput
        value={row.kanji}
        onChange={(v) => onChange(index, "kanji", v)}
      />

      <TdInput
        value={row.hanViet}
        onChange={(v) => onChange(index, "hanViet", v)}
      />

      <td className="border px-2 py-2 align-top">
        <textarea
          ref={meaningRef}
          className="
            w-full resize-none bg-transparent outline-none
            whitespace-pre-wrap break-words
            text-lg leading-6
            focus:bg-blue-50
          "
          value={row.meaning || ""}
          onChange={(e) => onChange(index, "meaning", e.target.value)}
        />
      </td>

      <TdAudio row={row} />
    </tr>
  )
}
