// FlashcardNav.jsx

export default function FlashcardNav({
  index,
  total,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 rounded-full border border-slate-200 bg-white/80 p-2 shadow-sm">
      <button
        type="button"
        onClick={onPrev}
        disabled={index === 0}
        className="
          flex h-11 w-11 items-center justify-center rounded-full
          bg-slate-100 text-lg text-slate-700 transition hover:bg-slate-200
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        ⬅
      </button>

      <span className="min-w-[88px] text-center text-sm font-semibold text-slate-700 sm:text-base">
        {index + 1} / {total}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={index === total - 1}
        className="
          flex h-11 w-11 items-center justify-center rounded-full
          bg-slate-100 text-lg text-slate-700 transition hover:bg-slate-200
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        ➡
      </button>
    </div>
  )
}