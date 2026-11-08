// FlashcardSettings.jsx

export default function FlashcardSettings({
  autoFlip,
  setAutoFlip,
  flipDelay,
  setFlipDelay,
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-2 text-xs sm:text-sm">
      <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 shadow-sm">
        <input
          type="checkbox"
          checked={autoFlip}
          onChange={(e) => setAutoFlip(e.target.checked)}
          className="h-4 w-4 accent-blue-600"
        />
        Tự động lật
      </label>

      <select
        value={flipDelay}
        onChange={(e) => setFlipDelay(+e.target.value)}
        className="min-h-[42px] rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm outline-none ring-0"
      >
        <option value={3000}>3 giây</option>
        <option value={4000}>4 giây</option>
        <option value={6000}>6 giây</option>
      </select>
    </div>
  )
}