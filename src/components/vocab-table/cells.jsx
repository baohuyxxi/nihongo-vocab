import { Turtle, Rabbit } from "lucide-react"
import { speakJP } from "../../utils/speak"
import JPTableInput from "../JPTableInput"
import { useEffect, useState } from "react"
import { uploadMedia } from "../../services/upload.service"
import { ImagePlus } from "lucide-react"
export function TdJPInput({ value, onChange }) {
  return (
    <td className="border px-2 py-2 align-top">
      <JPTableInput
        value={value}
        onChange={onChange}
        className="
          w-full
          bg-transparent
          outline-none
          text-xl
          focus:bg-blue-50
        "
      />
    </td>
  )
}

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

export function TdJPInputM({ value, onChange, compact = false, index }) {
  return (

    <JPTableInput
      value={value}
      onChange={onChange}
      className={`
        w-full
        bg-transparent
        outline-none
        border border-gray-200
        rounded
        ${compact ? "px-2 py-1.5 text-lg" : "px-2 py-2 text-xl"}
        focus:bg-blue-50
      `}
    />

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

export function TdImage({ value, onChange }) {
  const [preview, setPreview] = useState(value || "")

  useEffect(() => {
    setPreview(value || "")
  }, [value])

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreview(url)

    uploadMedia(file).then((res) => {
      onChange(res.url)
    })
  }

  return (
    <td className="border px-2 py-2 text-center">
      <div className="flex justify-center">

        <label className="relative cursor-pointer group">

          {/* preview image */}
          {preview ? (
            <>
              <img
                src={preview}
                alt="preview"
                className="
                  w-14 h-14 object-cover rounded border
                  group-hover:opacity-70 transition
                "
              />

              {/* hover overlay */}
              <div
                className="
                  absolute inset-0
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  transition
                "
              >
                <ImagePlus size={18} className="text-white drop-shadow" />
              </div>
            </>
          ) : (
            <div
              className="
                w-14 h-14
                flex items-center justify-center
                border rounded
                text-gray-400
                hover:bg-gray-100
              "
            >
              <ImagePlus size={20} />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>

      </div>
    </td>
  )
}