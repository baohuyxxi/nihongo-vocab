import { Turtle, Rabbit } from "lucide-react"
import { speakJP } from "../../utils/speak"

export function TdCenter({ children }) {
    return (
        <td className="border text-center font-semibold align-top px-1 text-sm align-middle">
            {children}
        </td>
    )
}

export function TdInput({ value, onChange, placeholder }) {
    return (
        <td className="border px-2 py-2 align-top">
            <input
                className="w-full bg-transparent outline-none text-xl focus:bg-blue-50"
                value={value || ""}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </td>
    )
}

export function TdAudio({ row }) {
    const text = row.hiragana || row.katakana || row.kanji || ""

    return (
        <td className="border align-top">
            <div className="flex justify-center gap-2 py-2">
                <button onClick={() => speakJP(text, 0.5)}>
                    <Turtle size={18} />
                </button>
                <button onClick={() => speakJP(text, 1)}>
                    <Rabbit size={18} />
                </button>
            </div>
        </td>
    )
}

export function TdInputM({
  value,
  onChange,
  placeholder,
  compact = false,
}) {
  return (
    <input
      className={`
        w-full
        bg-transparent
        outline-none
        border border-gray-200
        rounded
        ${compact ? "px-2 py-1.5 text-lg" : "px-2 py-2 text-xl"}
        focus:bg-blue-50
      `}
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function TdAudioM({ row }) {
  const text = row.hiragana || row.katakana || row.kanji || ""

  return (
    <div className="flex items-center gap-1 px-1">
      <button onClick={() => speakJP(text, 0.5)}>
        <Turtle size={18} />
      </button>
      <button onClick={() => speakJP(text, 1)}>
        <Rabbit size={18} />
      </button>
    </div>
  )
}