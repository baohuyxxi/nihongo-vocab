import { useEffect, useRef } from "react"

import {
  TdAudio,
  TdCenter,
  TdInput,
  TdJPInput,
  TdImage,
} from "./cells"

import { PART_OF_SPEECH } from "../../constants/partOfSpeech"

export default function VocabRowDesktop({
  index,
  row,
  onChange,
  onKanaChange,
}) {
  const meaningRef = useRef(null)

  useEffect(() => {
    if (meaningRef.current) {
      meaningRef.current.style.height = "auto"

      meaningRef.current.style.height =
        meaningRef.current.scrollHeight + "px"
    }
  }, [row.meaning])

  return (
    <tr>
      {/* STT */}
      <TdCenter>
        {index + 1}
      </TdCenter>

      {/* HIRA / KATA */}
      <TdJPInput
        index={index}
        value={row.hiragana || row.katakana}
        placeholder="ひら / カタ"
        onChange={(v) => onKanaChange(index, v)}
      />

      {/* PHIÊN ÂM */}
      <TdInput
        value={row.phoneticVi || ""}
        onChange={(v) =>
          onChange(
            index,
            "phoneticVi",
            v
          )
        }
      />

      {/* KANJI */}
      <TdInput
        value={row.kanji || ""}
        onChange={(v) =>
          onChange(
            index,
            "kanji",
            v
          )
        }
      />

      {/* HÁN VIỆT */}
      <TdInput
        value={row.hanViet || ""}
        onChange={(v) =>
          onChange(
            index,
            "hanViet",
            v
          )
        }
      />

      {/* TỪ LOẠI */}
      <td
        className="
          border
          px-2
          py-2
          align-top
        "
      >
        <select
          value={row.partOfSpeech || ""}
          onChange={(e) =>
            onChange(
              index,
              "partOfSpeech",
              e.target.value
            )
          }
          className="
            w-full
            min-w-0
            bg-transparent
            outline-none
            text-sm
            cursor-pointer
            focus:bg-blue-50
          "
        >
          <option value="">
            Chọn
          </option>

          {PART_OF_SPEECH.map(
            (item) => (
              <option
                key={item.key}
                value={item.key}
              >
                {item.label}
              </option>
            )
          )}
        </select>
      </td>

      {/* TIẾNG ANH */}
      <TdInput
        value={row.english || ""}
        onChange={(v) =>
          onChange(
            index,
            "english",
            v
          )
        }
      />

      {/* NGHĨA */}
      <td
        className="
          border
          px-2
          py-2
          align-top
        "
      >
        <textarea
          ref={meaningRef}
          className="
            w-full
            resize-none
            bg-transparent
            outline-none
            whitespace-pre-wrap
            break-words
            text-lg
            leading-6
            focus:bg-blue-50
          "
          value={row.meaning || ""}
          onChange={(e) =>
            onChange(
              index,
              "meaning",
              e.target.value
            )
          }
        />
      </td>

      {/* HÌNH ẢNH */}
      <TdImage
        value={row.image}
        onChange={(v) =>
          onChange(
            index,
            "image",
            v
          )
        }
      />

      {/* AUDIO */}
      <TdAudio row={row} />
    </tr>
  )
}