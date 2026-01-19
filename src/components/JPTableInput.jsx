import { useEffect, useRef } from "react"

export default function JPTableInput({
  value,
  onChange,
  placeholder = "ひらがな / カタカナ",
  className = "",
}) {
  const ref = useRef(null)

  const autoResize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }

  useEffect(() => {
    autoResize()
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => {
        onChange(e.target.value)
        requestAnimationFrame(autoResize)
      }}
      className={`
        w-full
        resize-none
        bg-transparent
        outline-none
        whitespace-pre-wrap
        break-words
        leading-7
        focus:bg-blue-50
        ${className}
      `}
    />
  )
}
