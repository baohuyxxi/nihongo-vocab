import {
  useLayoutEffect,
  useRef,
  useState,
} from "react"

export default function VietnameseTextAutoFit({
  text,

  maxLines = 2,

  maxFont = 72,
  minFont = 20,

  mobileMaxFont = 38,
  tabletMaxFont = 54,

  step = 2,
}) {

  const ref = useRef(null)

  const [fontSize, setFontSize]
    = useState(maxFont)

  useLayoutEffect(() => {

    const el = ref.current

    if (!el) return

    /* ======================
        RESPONSIVE MAX FONT
    ====================== */

    const width = window.innerWidth

    let responsiveMax = maxFont

    // 📱 mobile
    if (width < 640) {
      responsiveMax = mobileMaxFont
    }

    // 📲 tablet
    else if (width < 1024) {
      responsiveMax = tabletMaxFont
    }

    /* ======================
        RESET
    ====================== */

    let size = responsiveMax

    el.style.fontSize = `${size}px`

    /* ======================
        CALCULATE HEIGHT
    ====================== */

    const lineHeight =
      parseFloat(
        getComputedStyle(el).lineHeight
      )

    const maxHeight =
      lineHeight * maxLines

    /* ======================
        AUTO SHRINK
    ====================== */

    while (
      (
        el.scrollHeight > maxHeight ||
        el.scrollWidth > el.clientWidth
      ) &&
      size > minFont
    ) {

      size -= step

      el.style.fontSize =
        `${size}px`
    }

    setFontSize(size)

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
      className="
        w-full
        h-full

        flex
        items-center
        justify-center

        px-3
        sm:px-6
        md:px-8
      "
    >

      <span
        ref={ref}

        style={{
          fontSize,
          lineHeight: 1.25,
        }}

        className="
          block

          w-full

          font-bold
          text-center

          break-words
          overflow-hidden

          leading-tight
        "
      >
        {text}
      </span>

    </div>
  )
}