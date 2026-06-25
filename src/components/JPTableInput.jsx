import { useEffect, useRef, useState } from "react"
import { bind, unbind, isKana, isJapanese, isRomaji, isHiragana, toRomaji, toKana, isKatakana } from "wanakana"

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

  // useEffect(() => {
  //   if (autoFocus) {

  //     const timer = setTimeout(() => {
  //       ref.current?.focus()
  //       setAutoFocus(false)
  //     }, 1)

  //     return () => clearTimeout(timer)
  //   }
  // }, [autoFocus])

  const toRomajiKeepCase = (text) => {
    //console.log(text)
    const romaji = toRomaji(text)

    if (
      isKatakana(text[0]) ||
      /^[A-Z]$/.test(text[0])
    ) {
      return romaji.toUpperCase()
    }

    if (isHiragana(text[0])) {
      return romaji.toLowerCase()
    }

    return romaji
  }

  const [firstData, setFirstData] = useState('')
  const [onKeyInput, setOnKeyInput] = useState(false)
  const handleOnInput = (e) => {

    let v = e.target.value
    if (onKeyInput.keyCode === 8) {
      console.log("8: ", v, onKeyInput)
      // setFirstData(toRomajiKeepCase(v[0]))
    }

    if (
      v.length > 0
      && /^[a-zA-Z]$/.test(v[0])
    ) {
      // console.log("set chữ đầu", toRomajiKeepCase(v[0]))
      setFirstData(v[0])
    }
    if (onKeyInput.nativeEvent.keyCode == 231) {
      v = toRomajiKeepCase(firstData + v)
      lastValueRef.current = v
      onChange(v)
      // console.log("xóa chữ đầu")
      setFirstData("")
    }

    if (v.includes("'")) {
      v = v.replaceAll("'", "")
      v = toRomajiKeepCase(v)
      lastValueRef.current = toKana(v)
      onChange(toKana(v))
    }

    if (isJapanese(v)) {

      onChange(v)
      autoResize()
    }
    else {
      if (isRomaji(v) && ((v[0] !== "n" && v[0] !== "N") || v.length !== 1)) {

        lastValueRef.current = toKana(v)
        onChange(toKana(v))
        autoResize()
      }
      else {
        lastValueRef.current = v
        onChange(v)
        autoResize()
      }


    }
    setOnKeyInput(false)
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
      onKeyDown={(e) => setOnKeyInput(e)}

      onInput={handleOnInput}

    />
  )
}
