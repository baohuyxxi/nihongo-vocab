import { useEffect, useRef } from "react"
import { bind, unbind } from "wanakana"

export default function JPTableInput({
  value,
  onChange,
  className = "",
}) {
  const ref = useRef(null)
  const lastValueRef = useRef(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    bind(el, {
      IMEMode: true,
      passRomaji: false,
    })

    return () => unbind(el)
  }, [])

  // sync khi đổi bài / reload data
  useEffect(() => {
    if (value !== lastValueRef.current && ref.current) {
      ref.current.value = value || ""
      lastValueRef.current = value
    }
  }, [value])

  return (
    <input
      ref={ref}
      defaultValue={value}
      lang="ja"
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      placeholder="ひら / カタ"
      className={className}
      onBlur={(e) => {
        const v = e.target.value
        lastValueRef.current = v
        onChange(v)
      }}
    />
  )
}
