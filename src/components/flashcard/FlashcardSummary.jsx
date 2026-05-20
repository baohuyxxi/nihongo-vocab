// FlashcardSummary.jsx

export default function FlashcardSummary({
  cards,
  repeatMap,
  totalTime,
  onRestart,
}) {

  const repeatedWords =
    Object.entries(repeatMap)

      .map(([id, count]) => {

        const card =
          cards.find(
            (c) => c.id === id
          )

        return {
          id,
          count,
          front: card?.front,
        }
      })

      .sort(
        (a, b) =>
          b.count - a.count
      )

  return (

    <div
      className="
        w-full
        max-w-3xl

        mx-auto

        px-3
        sm:px-6

        py-4
        sm:py-6

        space-y-5
        sm:space-y-6
      "
    >

      <h1
        className="
          text-center

          text-2xl
          sm:text-3xl
          md:text-4xl

          font-bold
        "
      >
        🎉 Hoàn thành!
      </h1>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3

          gap-3
        "
      >

        <div
          className="
            bg-white
            rounded-2xl

            shadow

            p-4

            text-center
          "
        >
          <div className="text-sm text-gray-500">
            Thời gian
          </div>

          <div
            className="
              text-xl
              font-bold
            "
          >
            {Math.round(
              totalTime / 1000
            )}s
          </div>
        </div>

        <div
          className="
            bg-white
            rounded-2xl

            shadow

            p-4

            text-center
          "
        >
          <div className="text-sm text-gray-500">
            Tổng số từ
          </div>

          <div
            className="
              text-xl
              font-bold
            "
          >
            {cards.length}
          </div>
        </div>

        <div
          className="
            bg-white
            rounded-2xl

            shadow

            p-4

            text-center
          "
        >
          <div className="text-sm text-gray-500">
            Cần ôn lại
          </div>

          <div
            className="
              text-xl
              font-bold
              text-red-600
            "
          >
            {repeatedWords.length}
          </div>
        </div>

      </div>

      {repeatedWords.length > 0 && (

        <div>

          <h2
            className="
              text-lg
              sm:text-xl

              font-semibold

              mb-3
            "
          >
            📋 Từ cần ôn lại
          </h2>

          <ul
            className="
              space-y-2

              max-h-[320px]
              overflow-y-auto
            "
          >

            {repeatedWords.map((w) => (

              <li
                key={w.id}

                className="
                  flex
                  items-center
                  justify-between

                  gap-4

                  bg-gray-100

                  px-3
                  sm:px-4

                  py-3

                  rounded-xl
                "
              >

                <span
                  className="
                    text-sm
                    sm:text-lg

                    break-words
                  "
                >
                  {
                    typeof w.front
                      === "string"

                      ? w.front

                      : w.front?.jp
                  }
                </span>

                <span
                  className="
                    font-bold

                    text-red-600

                    text-sm
                    sm:text-base

                    whitespace-nowrap
                  "
                >
                  {w.count} lần
                </span>

              </li>

            ))}

          </ul>

        </div>

      )}

      <div className="text-center">

        <button
          onClick={onRestart}

          className="
            px-6
            sm:px-8

            py-3

            rounded-2xl

            bg-blue-600
            hover:bg-blue-700

            text-white

            font-semibold

            transition
          "
        >
          🔄 Ôn lại
        </button>

      </div>

    </div>
  )
}