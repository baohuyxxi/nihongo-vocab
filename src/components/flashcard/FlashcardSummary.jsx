import {
  useEffect,
  useState,
} from "react"


const SESSION_STORAGE_KEY =
  "reviewSessionData"


export default function FlashcardSummary({
  cards,
  repeatMap,
  totalTime,
  onRestart,
  onContinue,
}) {

  const [progressData, setProgressData] =
    useState(null)


  /* ======================
      LOAD PROGRESS
  ====================== */

  useEffect(() => {

    try {

      const saved =
        localStorage.getItem(
          SESSION_STORAGE_KEY
        )


      if (!saved) {
        return
      }


      const parsed =
        JSON.parse(saved)


      setProgressData(
        parsed.progress
      )

    }
    catch (error) {

      console.error(
        "Failed to load review progress",
        error
      )

    }

  }, [])


  /* ======================
      REPEATED WORDS
  ====================== */

  const repeatedWords =
    Object.entries(
      repeatMap || {}
    )

      .map(
        ([id, count]) => {

          const card =
            cards.find(
              (c) =>
                c.id === id
            )


          return {

            id,

            count,

            front:
              card?.front,

          }

        }
      )

      .sort(
        (a, b) =>
          b.count -
          a.count
      )


  /* ======================
      PROGRESS
  ====================== */

  const hasProgress =
    progressData &&
    Number(
      progressData.reviewedVocabs
    ) <
    Number(
      progressData.total
    )


  const seconds =
    Math.round(
      Number(totalTime || 0) /
      1000
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

      {/* TITLE */}

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


      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3

          gap-3
        "
      >

        {/* TIME */}

        <div
          className="
            bg-white

            rounded-2xl

            shadow

            p-4

            text-center
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >

            Thời gian

          </div>


          <div
            className="
              text-xl
              font-bold
            "
          >

            {seconds}s

          </div>

        </div>


        {/* TOTAL */}

        <div
          className="
            bg-white

            rounded-2xl

            shadow

            p-4

            text-center
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >

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


        {/* REPEAT */}

        <div
          className="
            bg-white

            rounded-2xl

            shadow

            p-4

            text-center
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >

            Cần ôn lại

          </div>


          <div
            className="
              text-xl
              font-bold
              text-red-600
            "
          >

            {
              repeatedWords.length
            }

          </div>

        </div>

      </div>


      {/* PROGRESS */}

      {progressData && (

        <div
          className="
            bg-white
            rounded-2xl
            shadow
            p-4
          "
        >

          <div
            className="
              flex
              justify-between
              items-center

              text-sm

              mb-2
            "
          >

            <span
              className="
                text-gray-500
              "
            >

              Tiến độ

            </span>


            <span
              className="
                font-semibold
              "
            >

              {
                progressData.reviewedVocabs
              }

              {" / "}

              {
                progressData.total
              }

            </span>

          </div>


          <div
            className="
              w-full
              h-2

              bg-gray-200

              rounded-full

              overflow-hidden
            "
          >

            <div
              className="
                h-full
                bg-blue-600

                transition-all
              "
              style={{
                width:
                  progressData.total > 0
                    ? `${Math.min(
                        100,
                        (
                          progressData.reviewedVocabs /
                          progressData.total
                        ) * 100
                      )}%`
                    : "0%",
              }}
            />

          </div>


          {hasProgress && (

            <p
              className="
                text-xs
                text-gray-500
                mt-2
              "
            >

              Còn{" "}

              {
                Math.max(
                  0,
                  progressData.total -
                  progressData.reviewedVocabs
                )
              }

              {" "}từ chưa ôn

            </p>

          )}

        </div>

      )}


      {/* REPEATED WORDS */}

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

            {repeatedWords.map(
              (w) => (

                <li
                  key={
                    w.id
                  }

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
                      typeof w.front ===
                      "string"

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

              )
            )}

          </ul>

        </div>

      )}


      {/* ACTIONS */}

      <div
        className="
          flex

          justify-center

          gap-3

          flex-wrap
        "
      >

        {/* RESTART */}

        <button
          type="button"

          onClick={
            onRestart
          }

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


        {/* CONTINUE */}

        {hasProgress && (

          <button
            type="button"

            onClick={
              onContinue
            }

            className="
              px-6
              sm:px-8

              py-3

              rounded-2xl

              bg-gray-100

              hover:bg-gray-200

              border
              border-gray-300

              text-gray-700

              font-semibold

              transition
            "
          >

            ▶️ Tiếp tục ôn

          </button>

        )}

      </div>

    </div>

  )
}