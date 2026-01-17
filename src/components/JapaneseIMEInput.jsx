import { forwardRef, useEffect, useRef } from "react"
import { bind, unbind } from "wanakana"

const JapaneseIMEInput = forwardRef(function JapaneseIMEInput(
  { direction, value, onChange, onSubmit, disabled },
  ref
) {
  const boundRef = useRef(false)

  useEffect(() => {
    const el = ref?.current
    if (!el) return

    if (direction === "vi_jp" && !boundRef.current) {
      bind(el, {
        IMEMode: true,
        useObsoleteKana: false,
        passRomaji: false,
      })
      boundRef.current = true
    }

    if (direction !== "vi_jp" && boundRef.current) {
      unbind(el)
      boundRef.current = false
    }

    return () => {
      if (boundRef.current && el) {
        unbind(el)
        boundRef.current = false
      }
    }
  }, [direction, ref])

  /* ===== vi → jp (UNCONTROLLED) ===== */
  if (direction === "vi_jp") {
    return (
      <div className="space-y-4">
        <input
          ref={ref}
          defaultValue={value}
          disabled={disabled}
          lang="ja"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="w-full border p-4 text-[28px] text-center rounded disabled:bg-gray-100"
          placeholder="ひらがな / カタカナ"
          onKeyDown={(e) => {
            if (e.isComposing) return
            if (e.key === "Enter") {
              e.preventDefault()
              onSubmit()
            }
          }}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className="block mx-auto px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
        >
          Kiểm tra
        </button>

      </div>
    )
  }

  /* ===== jp → vi (CONTROLLED) ===== */
  return (
    <div className="space-y-4">
      <input
        ref={ref}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        lang="vi"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="w-full border p-4 text-[28px] text-center rounded disabled:bg-gray-100"
        placeholder="Nhập nghĩa tiếng Việt"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            onSubmit()
          }
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className="block mx-auto px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
      >
        Kiểm tra
      </button>

    </div>
  )
})

export default JapaneseIMEInput
