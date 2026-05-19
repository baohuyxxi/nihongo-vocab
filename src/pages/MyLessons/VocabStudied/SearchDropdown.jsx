export default function SearchDropdown({
  search,
  filtered,
  activeIndex,
  showDropdown,
  handleSelect,
}) {

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

        <div className="p-5 text-gray-500">
          Không tìm thấy
        </div>

      ) : (

        filtered.map((item, index) => (

          <button
            key={item._id}
            onClick={() =>
              handleSelect(item)
            }
            className={`
              w-full
              text-left
              px-5 py-4
              border-b
              transition
              ${activeIndex === index
                ? "bg-blue-50"
                : "hover:bg-gray-50"
              }
            `}
          >

            <div className="text-xl font-bold">
              {item.kanji ||
                item.hiragana}
            </div>

            <div className="text-gray-500 text-sm">
              {item.meaning}
            </div>

          </button>

        ))

      )}

    </div>

  )

}