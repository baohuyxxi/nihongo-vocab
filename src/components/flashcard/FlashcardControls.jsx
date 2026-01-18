export default function FlashcardControls({ onKnown, onUnknown }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onUnknown}
        className="px-5 py-3 bg-red-200 rounded-xl"
      >
        ❌ Chưa nhớ (Phím 1)
      </button>
      <button
        onClick={onKnown}
        className="px-5 py-3 bg-green-200 rounded-xl"
      >
        ✅ Đã nhớ (Phím 2)
      </button>
    </div>
  )
}
