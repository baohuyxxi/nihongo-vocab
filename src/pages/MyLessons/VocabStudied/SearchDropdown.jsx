import { useEffect, useRef } from "react"

export default function SearchDropdown({
  search,
  filtered,
  activeIndex,
  showDropdown,
  handleSelect,
  setActiveIndex,
}) {

  const itemRefs = useRef([])

  // =====================
  // AUTO SCROLL ACTIVE ITEM
  // =====================

  useEffect(() => {

    const current =
      itemRefs.current[activeIndex]

    if (current) {

      current.scrollIntoView({
        block: "nearest",
      })

    }

  }, [activeIndex])

  // =====================
  // KEYBOARD
  // =====================

  useEffect(() => {

    if (!showDropdown) return

    const handleKeyDown = (e) => {

      if (!filtered.length) return

      // DOWN
      if (e.key === "ArrowDown") {

        e.preventDefault()

        setActiveIndex((prev) => (

          prev >= filtered.length - 1
            ? 0
            : prev + 1

        ))

      }

      // UP
      if (e.key === "ArrowUp") {

        e.preventDefault()

        setActiveIndex((prev) => (

          prev <= 0
            ? filtered.length - 1
            : prev - 1

        ))

      }

      // ENTER
      if (e.key === "Enter") {

        e.preventDefault()

        handleSelect(
          filtered[activeIndex]
        )

      }

    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () =>

      window.removeEventListener(
        "keydown",
        handleKeyDown
      )

  }, [
    filtered,
    activeIndex,
    showDropdown,
    handleSelect,
    setActiveIndex,
  ])

  // =====================
  // HIDE
  // =====================

  if (
    !showDropdown ||
    !search
  ) return null

  return (

    <div
      className="
        absolute
        mt-2
        w-full

        bg-white
        border
        rounded-2xl

        shadow-xl

        overflow-hidden

        z-50
      "
    >

      {filtered.length === 0 ? (

        <div
          className="
            p-5
            text-gray-500
          "
        >
          Không tìm thấy
        </div>

      ) : (

        <div
          className="
            max-h-[420px]
            overflow-y-auto
          "
        >

          {filtered.map((item, index) => (

            <button
              key={`${item._id}-${index}`}

              ref={(el) =>
                itemRefs.current[index] = el
              }

              onClick={() =>
                handleSelect(item)
              }

              onMouseEnter={() =>
                setActiveIndex(index)
              }

              className={`
                w-full
                text-left

                px-5
                py-4

                border-b
                last:border-b-0

                transition

                ${activeIndex === index
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
                }
              `}
            >

              {/* WORD */}

              <div
                className="
                  text-xl
                  font-bold
                "
              >
                {item.kanji ||
                  item.hiragana}
              </div>

              {/* HIRAGANA */}

              {item.kanji &&
                item.hiragana && (

                  <div
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    {item.hiragana}
                  </div>

                )}

              {/* MEANING */}

              <div
                className="
                  text-gray-500
                  text-sm
                  mt-1
                "
              >
                {item.meaning}
              </div>

            </button>

          ))}

        </div>

      )}

    </div>

  )

}