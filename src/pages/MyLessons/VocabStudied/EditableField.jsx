import { partOfSpeechMap }
  from "../../../utils/partOfSpeechMap"

export default function EditableField({
  label,
  value,
  onChange,

  type = "text",

  options = [],

  placeholder = "",
}) {

  return (

    <div className="flex flex-col gap-2">

      <div className="text-sm text-gray-400">
        {label}
      </div>

      {/* INPUT */}

      {type === "text" && (

        <input
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            border
            rounded-xl
            px-4 py-3
            outline-none
          "
        />

      )}

      {/* TEXTAREA */}

      {type === "textarea" && (

        <textarea
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(e.target.value)
          }
          rows={4}
          className="
            border
            rounded-xl
            px-4 py-3
            outline-none
            resize-none
          "
        />

      )}

      {/* SELECT */}

      {type === "select" && (

        <select
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            border
            rounded-xl
            px-4 py-3
            outline-none
            bg-white
          "
        >

          <option value="">
            Chọn
          </option>

          {options.map((item) => (

            <option
              key={item}
              value={item}
            >
              {partOfSpeechMap[item] || item}
            </option>

          ))}

        </select>

      )}

    </div>

  )

}