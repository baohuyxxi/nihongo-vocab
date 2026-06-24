import { useEffect, useRef, useState } from "react"
import { toKana } from "wanakana"

export default function JPTableInput({
  value,
  onChange,
  className = "",
  placeholder = "ひら / カタ",
  onFocus = () => {} 
}) {
  const ref = useRef(null)
  const timerRef = useRef(null)

  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const autoResize = () => {
    const el = ref.current
    if (!el) return

    el.style.height = "auto"

    requestAnimationFrame(() => {
      el.style.height = el.scrollHeight + "px"
    })
  }

  useEffect(() => {
    autoResize()
  }, [localValue])

  return (
    <textarea
      ref={ref}
      rows={1}
      value={localValue}
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
        min-h-[1.75rem]
        ${className}
      `}
      onChange={(e) => {
        const v = e.target.value

        setLocalValue(v)

        clearTimeout(timerRef.current)

        timerRef.current = setTimeout(() => {
          const kana = toKana(v, {
            IMEMode: true,
          })
          setLocalValue(kana)
          onChange(kana)
        }, 300)
      }}
      onFocus={onFocus}
    />
  )
}