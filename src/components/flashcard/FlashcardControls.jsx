// FlashcardControls.jsx

export default function FlashcardControls({
  onKnown,
  onUnknown,
}) {

  return (

    <div
      className="
        w-full

        flex
        items-center
        justify-center

        gap-2
        sm:gap-4

        px-2
      "
    >

      <button
        onClick={onUnknown}

        className="
          flex-1
          sm:flex-none

          min-w-[140px]

          px-3
          sm:px-5

          py-3
          sm:py-4

          rounded-xl

          bg-red-200
          hover:bg-red-300

          transition

          text-sm
          sm:text-base
          md:text-lg

          font-medium
        "
      >
        ❌ Chưa nhớ

        <span
          className="
            hidden sm:inline
          "
        >
          {" "}
          (1)
        </span>
      </button>

      <button
        onClick={onKnown}

        className="
          flex-1
          sm:flex-none

          min-w-[140px]

          px-3
          sm:px-5

          py-3
          sm:py-4

          rounded-xl

          bg-green-200
          hover:bg-green-300

          transition

          text-sm
          sm:text-base
          md:text-lg

          font-medium
        "
      >
        ✅ Đã nhớ

        <span
          className="
            hidden sm:inline
          "
        >
          {" "}
          (2)
        </span>
      </button>

    </div>
  )
}