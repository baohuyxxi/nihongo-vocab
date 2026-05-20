// FlashcardSettings.jsx

export default function FlashcardSettings({
  autoFlip,
  setAutoFlip,
  flipDelay,
  setFlipDelay,
}) {

  return (

    <div
      className="
        flex
        flex-wrap

        items-center
        justify-center

        gap-3
        sm:gap-4

        text-xs
        sm:text-sm

        px-2
      "
    >

      <label
        className="
          flex
          items-center

          gap-2

          bg-gray-100

          px-3
          py-2

          rounded-xl
        "
      >

        <input
          type="checkbox"

          checked={autoFlip}

          onChange={(e) =>
            setAutoFlip(
              e.target.checked
            )
          }
        />

        Tự động lật

      </label>

      <select
        value={flipDelay}

        onChange={(e) =>
          setFlipDelay(
            +e.target.value
          )
        }

        className="
          border

          rounded-xl

          px-3
          py-2

          bg-white
        "
      >
        <option value={3000}>
          3 giây
        </option>

        <option value={4000}>
          4 giây
        </option>

        <option value={6000}>
          6 giây
        </option>
      </select>

    </div>
  )
}