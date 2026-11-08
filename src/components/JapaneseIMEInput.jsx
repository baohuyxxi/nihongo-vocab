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

  const sharedInputClass =
    "w-full min-h-[52px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-base font-medium text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 sm:text-lg md:text-[28px]"

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onSubmit?.()
    }
  }

  const handleChange = (e) => {
    onChange?.(e.target.value)
  }

  return (
    <div className="space-y-3">
      <input
        ref={ref}
        type="text"
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
        lang={direction === "vi_jp" ? "ja" : "vi"}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        inputMode={direction === "vi_jp" ? "text" : "text"}
        className={sharedInputClass}
        placeholder={direction === "vi_jp" ? "ひらがな / カタカナ" : "Nhập nghĩa tiếng Việt"}
        onKeyDown={(e) => {
          if (direction === "vi_jp" && e.isComposing) return
          handleKeyDown(e)
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className="mx-auto block min-h-[48px] rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
      >
        Kiểm tra
      </button>
    </div>
  )
})

export default JapaneseIMEInput
