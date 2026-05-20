// FlashcardNav.jsx

export default function FlashcardNav({
  index,
  total,
  onPrev,
  onNext,
}) {

  return (

    <div
      className="
        flex
        items-center

        gap-4
        sm:gap-8
      "
    >

      <button
        onClick={onPrev}

        disabled={index === 0}

        className="
          w-12 h-12
          sm:w-14 sm:h-14

          rounded-xl

          bg-gray-200
          hover:bg-gray-300

          disabled:opacity-40

          flex
          items-center
          justify-center

          text-xl
          sm:text-2xl
        "
      >
        ⬅
      </button>

      <span
        className="
          text-sm
          sm:text-lg

          font-medium

          min-w-[80px]
          text-center
        "
      >
        {index + 1} / {total}
      </span>

      <button
        onClick={onNext}

        disabled={index === total - 1}

        className="
          w-12 h-12
          sm:w-14 sm:h-14

          rounded-xl

          bg-gray-200
          hover:bg-gray-300

          disabled:opacity-40

          flex
          items-center
          justify-center

          text-xl
          sm:text-2xl
        "
      >
        ➡
      </button>

    </div>
  )
}