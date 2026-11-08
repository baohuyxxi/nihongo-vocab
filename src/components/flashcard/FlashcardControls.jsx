// FlashcardControls.jsx

export default function FlashcardControls({
  onKnown,
  onUnknown,
}) {
  return (
    <div className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 px-2">
      <button
        type="button"
        onClick={onUnknown}
        className="
          flex-1 min-h-[48px] rounded-2xl border border-red-200 bg-red-50
          px-4 py-3 text-sm sm:text-base font-semibold text-red-700
          shadow-sm transition hover:bg-red-100 active:scale-[0.99]
        "
      >
        ❌ Chưa nhớ
        <span className="hidden sm:inline"> (1)</span>
      </button>

      <button
        type="button"
        onClick={onKnown}
        className="
          flex-1 min-h-[48px] rounded-2xl border border-emerald-200 bg-emerald-50
          px-4 py-3 text-sm sm:text-base font-semibold text-emerald-700
          shadow-sm transition hover:bg-emerald-100 active:scale-[0.99]
        "
      >
        ✅ Đã nhớ
        <span className="hidden sm:inline"> (2)</span>
      </button>
    </div>
  )
}