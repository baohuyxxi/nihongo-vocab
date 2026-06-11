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

      {/* HEADER */}

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

              onClick={() =>
                onSelect?.( item, false )
              }

              className="
                w-full

                px-3
                py-3

                hover:bg-gray-50
                transition

                text-left
              "
            >

              <div
                className="
                  grid
                  grid-cols-[70px_70px_100px_1fr]
                  gap-2

                  items-center

                  text-sm
                "
              >

                {/* KANJI */}

                <div
                  className="
                    font-bold
                    text-gray-900

                    truncate
                  "
                >
                  {item.kanji ||
                    item.hiragana ||
                    item.katakana ||
                    "ー"}
                </div>

                {/* HAN VIET */}

                <div
                  className="
                    text-xs
                    text-gray-400

                    truncate
                  "
                >
                  {item.hanViet || "—"}
                </div>

                {/* HIRAGANA */}

                <div
                  className="
                    text-gray-500

                    truncate
                  "
                >
                  {item.hiragana ||
                    item.katakana ||
                    "—"}
                </div>

                {/* MEANING */}

                <div
                  className="
                    text-gray-700

                    truncate
                  "
                >
                  {item.meaning || "—"}
                </div>

              </div>

            </button>

          ))}

        </div>

      )}

    </div>

  )

}