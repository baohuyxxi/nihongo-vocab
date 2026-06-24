import { useEffect, useRef, useState } from "react"
import { bind, unbind, isKana, isJapanese, isRomaji, isHiragana } from "wanakana"

export default function JPTableInput({
  value,
  onChange,
  className = "",
  placeholder = "ひら / カタ",
  onFocus = () => { }
}) {
  const ref = useRef(null)
  const lastValueRef = useRef(value)
  const [autoFocus, setAutoFocus] = useState(false)

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

  useEffect(() => {
    if (autoFocus) {

      const timer = setTimeout(() => {
        ref.current?.focus()
        setAutoFocus(false)
      }, 1)

      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  const handleOnInput = (e) => {
    let v = e.target.value

    if (isJapanese(v)) {
      console.log(v)
      onChange(v)
      autoResize()

      e.target.blur()
      setAutoFocus(true)
    }

    lastValueRef.current = v
    onChange(v)
    autoResize()
    setAutoFocus(true)
  }
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
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

      onFocus={onFocus}

      onInput={handleOnInput}

    />
  )
}
