
import { partOfSpeechMap } from "../../../utils/partOfSpeechMap"

const inputClass = `
  w-full min-w-0
  rounded-lg border border-gray-200
  bg-white px-3 py-2
  text-sm sm:text-base text-gray-800
  outline-none transition-colors
  placeholder:text-gray-400
  focus:border-blue-500
  focus:ring-2 focus:ring-blue-100
  disabled:bg-gray-100
  disabled:text-gray-400
`

export default function EditableField({
  label,
  value,
  onChange,
  type = "text",
  options = [],
  placeholder = "",
  disabled = false,
  required = false,
  rows = 2,
}) {
  const currentValue = value ?? ""

  const handleChange = (e) => {
    onChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-0">

      {/* LABEL */}

      {label && (
        <label className="text-xs sm:text-sm font-medium text-gray-500">
          {label}

          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}

      {/* TEXT / NUMBER */}

      {(type === "text" || type === "number") && (
        <input
          type={type}
          value={currentValue}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={inputClass}
        />
      )}

      {/* TEXTAREA */}

      {type === "textarea" && (
        <textarea
          value={currentValue}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${inputClass} resize-y`}
        />
      )}

      {/* SELECT */}

      {type === "select" && (
        <select
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">
            Chọn
          </option>

          {options.map((item) => {
            const optionValue =
              typeof item === "string"
                ? item
                : item.value

            const optionLabel =
              typeof item === "string"
                ? partOfSpeechMap[item] || item
                : item.label ||
                  partOfSpeechMap[optionValue] ||
                  optionValue

            return (
              <option
                key={optionValue}
                value={optionValue}
              >
                {optionLabel}
              </option>
            )
          })}
        </select>
      )}

    </div>
  )
}
