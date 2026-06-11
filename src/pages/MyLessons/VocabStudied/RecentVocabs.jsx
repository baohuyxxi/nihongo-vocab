export default function RecentVocabs({
  recentVocabs = [],
  onSelect,
}) {

  return (

    <div
      className="
        bg-white
        border
        rounded-2xl
        overflow-hidden
        h-fit
      "
    >

      <div
        className="
          px-4
          py-3
          border-b
          font-semibold
        "
      >
        Từ vừa xem
      </div>

      {!recentVocabs.length ? (

        <div
          className="
            p-4
            text-sm
            text-gray-400
          "
        >
          Chưa có dữ liệu
        </div>

      ) : (

        <div
          className="
            divide-y
            max-h-[700px]
            overflow-y-auto
          "
        >

          {recentVocabs.map((item) => (

            <button
              key={item._id}
              onClick={() => onSelect(item)}
              className="
                w-full
                px-3
                py-2

                hover:bg-gray-50

                text-left
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-sm
                "
              >

                <div
                  className="
                    font-bold
                    min-w-[70px]
                  "
                >
                  {item.kanji ||
                    item.hiragana ||
                    item.katakana}
                </div>

                <div
                  className="
                    text-gray-500
                    min-w-[90px]
                  "
                >
                  {item.hiragana ||
                    item.katakana}
                </div>

                <div
                  className="
                    flex-1
                    truncate
                    text-gray-700
                  "
                >
                  {item.meaning}
                </div>

              </div>

            </button>

          ))}

        </div>

      )}

    </div>

  )

}