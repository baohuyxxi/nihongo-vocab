// FlashcardProgress.jsx

export default function FlashcardProgress({
  learned,
  total,
}) {

  const safeLearned =
    Math.max(0, learned)

  const percent = total
    ? Math.round(
      (safeLearned / total) * 100
    )
    : 0

  return (

    <div
      className="
        w-full
        max-w-xl

        px-2
      "
    >

      <div
        className="
          h-2
          sm:h-3

          bg-gray-200
          rounded-full

          overflow-hidden
        "
      >

        <div
          className="
            h-full

            bg-green-500

            rounded-full

            transition-all
            duration-300
          "

          style={{
            width: `${percent}%`
          }}
        />

      </div>

      <p
        className="
          text-[11px]
          sm:text-sm

          text-center

          mt-1
          sm:mt-2

          text-gray-600
        "
      >
        Đã nhớ {safeLearned}/{total}
        {" "}
        ({percent}%)
      </p>

    </div>
  )
}