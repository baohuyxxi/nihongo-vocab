// FlashcardProgress.jsx

export default function FlashcardProgress({
  learned,
  total,
}) {
  const safeLearned = Math.max(0, learned)
  const percent = total ? Math.round((safeLearned / total) * 100) : 0

  return (
    <div className="w-full max-w-xl px-1">
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 sm:text-xs">
        <span>Tiến độ</span>
        <span>{percent}%</span>
      </div>

      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 shadow-inner sm:h-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-600 sm:text-sm">
        Đã nhớ {safeLearned}/{total}
      </p>
    </div>
  )
}