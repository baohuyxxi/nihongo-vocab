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
  useEffect(() => {
    const el = ref.current
    if (!el) return

    bind(el, {
      IMEMode: true,
      passRomaji: false,
    })
    return () => unbind(el)
  }, [])
  const autoResize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    requestAnimationFrame(() => {
      el.style.height = el.scrollHeight + "px"
    })
  }

  useEffect(() => {
    if (value !== lastValueRef.current && ref.current) {
      ref.current.value = value || ""
      lastValueRef.current = value
      autoResize()
    }
  }, [value])
  useEffect(() => {
    autoResize()
  }, [])

  const [data, setData] = useState("")


  const handleOnInput = (e) => {
    const v = e.target.value
    lastValueRef.current = v

    setData(handleData(v))
    onChange(v)
    autoResize()
  }

  const handleData = (text) => {
    let result = ""
    for (const char of text) {
      if (isKatakana(char)) {
        result += toRomaji(char).toUpperCase()
        result += " "
      }
      else if (isHiragana(char)) {
        result += toRomaji(char).toLowerCase()
        result += " "
      }
      else {
        result += char
      }
    }
    return result
  }

  const handleToKana = (text) => {
    let result = ""
    let buffer = ""
    const t = text.trim()
    for (const char of t) {
      if (isJapanese(char)) {
        if (buffer) {
          const kana = toKana(buffer, {
            katakana: buffer === buffer.toUpperCase()
          })
          const convertedLength = toRomaji(kana).length

          result += kana
          buffer = ""
        }

        result += char
      } else {
        buffer += char
      }
    }

    if (buffer) {
      const isUpper = buffer === buffer.toUpperCase()

      const kana = toKana(buffer, {
        katakana: isUpper
      })
      result += [...kana]
        .map(ch => {
          if (/^[a-z]$/.test(ch) && isUpper) {
            return ch.toUpperCase()
          }
          return ch
        })
        .join("")
    }

    return result
  }

  useEffect(() => {
    if (data.length == 1 && (data[0] === "n" || data[0] === "N")) {
      onChange(data)
    } else {
      onChange(handleToKana(data))
    }

  }, [data])
  return (
    <div>
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

        onFocus={onFocus}
        onInput={handleOnInput}

      />

      <div>
        {data}
      </div>
    </div>

  )
}