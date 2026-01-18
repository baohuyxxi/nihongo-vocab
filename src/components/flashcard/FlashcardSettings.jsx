export default function FlashcardSettings({
  autoFlip,
  setAutoFlip,
  flipDelay,
  setFlipDelay,
}) {
  return (
    <div className="flex flex-wrap gap-4 justify-center text-sm">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={autoFlip}
          onChange={(e) => setAutoFlip(e.target.checked)}
        />
        Tự động
      </label>

      <select
        value={flipDelay}
        onChange={(e) => setFlipDelay(+e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value={3000}>3s</option>
        <option value={4000}>4s</option>
        <option value={6000}>6s</option>
      </select>
    </div>
  )
}
