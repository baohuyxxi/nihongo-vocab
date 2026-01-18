export default function FlashcardNav({
  index,
  total,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex gap-10 items-center text-xl">
      <button
        onClick={onPrev}
        disabled={index === 0}
        className="px-6 py-4 bg-gray-200 rounded-xl
          disabled:opacity-40 text-3xl"
      >
        ⬅
      </button>

      <span className="text-lg font-medium">
        {index + 1} / {total}
      </span>

      <button
        onClick={onNext}
        disabled={index === total - 1}
        className="px-6 py-4 bg-gray-200 rounded-xl
          disabled:opacity-40 text-3xl"
      >
        ➡
      </button>
    </div>
  )
}
