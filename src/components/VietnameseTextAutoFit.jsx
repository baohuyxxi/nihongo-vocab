import { useLayoutEffect, useRef, useState } from "react"

export default function VietnameseTextAutoFit({
  text,
  maxLines = 2,
  maxFont = 72,
  minFont = 28,
  step = 2,
}) {
  const ref = useRef(null)
  const [fontSize, setFontSize] = useState(maxFont)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    let size = maxFont
    el.style.fontSize = size + "px"

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
    const maxHeight = lineHeight * maxLines

    while (el.scrollHeight > maxHeight && size > minFont) {
      size -= step
      el.style.fontSize = size + "px"
    }

    setFontSize(size)
  }, [text, maxLines, maxFont, minFont, step])

  if (!text) return null

  return (
    <span
      ref={ref}
      style={{
        fontSize,
        lineHeight: 1.25,
      }}
      className="
        block
        font-bold
        text-center
        overflow-hidden
      "
    >
      {text}
    </span>
  )
}
