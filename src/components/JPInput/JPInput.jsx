import { useEffect, useRef, useState } from "react"
import { bind, unbind, isKana, isJapanese, isRomaji, isHiragana, toRomaji, toKana, isKatakana } from "wanakana"

export default function JPInput({
  value,
  onChange,
  className = "",
  placeholder = "ひら / カタ",
  onFocus = () => { }
}) {
  const ref = useRef(null)
  const lastValueRef = useRef(value)
  const [autoFocus, setAutoFocus] = useState(false)

  const telexMap = {
    "á": "s",
    "à": "f",
    "ả": "r",
    "ã": "x",
    "ạ": "j",

    "ắ": "s",
    "ằ": "f",
    "ẳ": "r",
    "ẵ": "x",
    "ặ": "j",

    "ấ": "a",
    "ầ": "f",
    "ẩ": "r",
    "ẫ": "x",
    "ậ": "j",

    "é": "s",
    "è": "f",
    "ẻ": "r",
    "ẽ": "x",
    "ẹ": "j",

    "í": "s",
    "ì": "f",
    "ỉ": "r",
    "ĩ": "x",
    "ị": "j",

    "ó": "s",
    "ò": "f",
    "ỏ": "r",
    "õ": "x",
    "ọ": "j",

    "ú": "s",
    "ù": "f",
    "ủ": "r",
    "ũ": "x",
    "ụ": "j",

    "ý": "s",
    "ỳ": "f",
    "ỷ": "r",
    "ỹ": "x",
    "ỵ": "j",

    "â": "a",
    "ă": "w",
    "ê": "e",
    "ô": "o",
    "ơ": "w",
    "ư": "w"
  }
  const toRomajiKeepCase = (text) => {
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
  const [data, setData] = useState('')
  const [dataShow, setDataShow] = useState("")
  const [onKeyInput, setOnKeyInput] = useState(false)
  const lastInputTimeRef = useRef(Date.now())
  const handleOnInput = (e) => {
    const now = Date.now()
    const diff = now - lastInputTimeRef.current
    lastInputTimeRef.current = now


    let v = e.target.value

    if (diff < 10) {
      //lấy ký tự cuối cùng
      //nếu có dấu sắt thì là s dấu huyền là f ngã là x nặng là j ô thì o â thì a ư là w
      const lastChar = v.at(-1)
      const telexKey = telexMap[lastChar]
      if (telexKey) {
        setData(data + telexKey)
      }
      return
    }

    if (onKeyInput.keyCode == 231) {
      const lastChar = v.at(-1)
      const telexKey = telexMap[lastChar]

      if (telexKey === "w") {
         setData(data + telexKey)
      }
    }
    else if (onKeyInput.keyCode == 8) {
      setData(v)
    }
    else {
      setData(handleToRomaji(v))

    }
  }

  const handleToKana = (text) => {
    let result = ""
    let buffer = ""

    for (const char of text) {
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
  const handleToRomaji = (text) => {
    let result = ""

    for (const char of text) {
      if (isKatakana(char)) {
        result += toRomaji(char).toUpperCase()
      }
      else if (isHiragana(char)) {
        result += toRomaji(char).toLowerCase()
      }
      else {
        result += char
      }
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
