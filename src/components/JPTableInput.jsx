import { useEffect, useRef } from "react"
import { bind, unbind } from "wanakana"

export default function JPTableInput({
  value,
  onChange,
  className = "",
  placeholder = "ひら / カタ",
}) {
  const ref = useRef(null)
  const lastValueRef = useRef(value)

  /* ===== bind wanakana ===== */
  useEffect(() => {
    const el = ref.current
    if (!el) return

    bind(el, {
      IMEMode: true,
      passRomaji: false,
    })

    return () => unbind(el)
  }, [])

  /* ===== auto resize (FIX) ===== */
  const autoResize = () => {
    const el = ref.current
    if (!el) return

    el.style.height = "auto"

    // ⚠️ quan trọng: để DOM cập nhật xong rồi mới đo
    requestAnimationFrame(() => {
      el.style.height = el.scrollHeight + "px"
    })
  }

  /* ===== sync khi load bài / đổi layout ===== */
  useEffect(() => {
    if (value !== lastValueRef.current && ref.current) {
      ref.current.value = value || ""
      lastValueRef.current = value
      autoResize()
    }
  }, [value])

  /* ===== init height ===== */
  useEffect(() => {
    autoResize()
  }, [])

  return (
    <textarea
      ref={ref}
      rows={1}
      defaultValue={value}
      lang="ja"
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      placeholder={placeholder}

      className={`
        w-full
        resize-none
        overflow-hidden
        bg-transparent
        outline-none
        whitespace-pre-wrap
        break-words
        leading-7
        min-h-[1.75rem]   /* ✅ chống che chữ */
        ${className}
      `}

      onInput={(e) => {
        const v = e.target.value
        lastValueRef.current = v
        onChange(v)
        autoResize()
      }}
    />
  )
}
