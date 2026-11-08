import {
  useLayoutEffect,
  useRef,
  useState,
} from "react"

export default function VietnameseTextAutoFit({
  text,

  maxLines = 2,

  maxFont = 72,
  minFont = 18,

  mobileMaxFont = 34,
  tabletMaxFont = 48,

  step = 2,
}) {
  const ref = useRef(null)
  const wrapperRef = useRef(null)

  const [fontSize, setFontSize] = useState(maxFont)

  useLayoutEffect(() => {
    const el = ref.current
    const wrapper = wrapperRef.current

    if (!el || !wrapper) return

    const width = window.innerWidth

    let responsiveMax = maxFont
    if (width < 640) {
      responsiveMax = mobileMaxFont
    } else if (width < 1024) {
      responsiveMax = tabletMaxFont
    }

    let size = responsiveMax
    el.style.fontSize = `${size}px`
    el.style.lineHeight = "1.2"

    const fitText = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight || "24")
      const maxHeight = lineHeight * maxLines
      const availableWidth = wrapper.clientWidth || el.parentElement?.clientWidth || 1
      const availableHeight = wrapper.clientHeight || el.parentElement?.clientHeight || maxHeight

      while (
        (el.scrollHeight > maxHeight || el.scrollWidth > availableWidth || el.scrollHeight > availableHeight) &&
        size > minFont
      ) {
        size -= step
        el.style.fontSize = `${size}px`
      }

      setFontSize(size)
    }

    fitText()

    const resizeObserver = new ResizeObserver(() => {
      fitText()
    })

    resizeObserver.observe(wrapper)

    return () => resizeObserver.disconnect()
  }, [
    text,
    maxLines,
    maxFont,
    minFont,
    mobileMaxFont,
    tabletMaxFont,
    step,
  ])

  if (!text) return null

  return (
    <div
      ref={wrapperRef}
      className="flex h-full w-full items-center justify-center px-2 sm:px-4 md:px-6"
    >
      <span
        ref={ref}
        style={{
          fontSize,
          lineHeight: 1.2,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
        className="block w-full text-center font-bold leading-tight text-slate-800"
      >
        {text}
      </span>
    </div>
  )
}