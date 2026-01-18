export default function FlashcardSummary({
  cards,
  repeatMap,
  totalTime,
  onRestart,
}) {
  const repeatedWords = Object.entries(repeatMap)
    .map(([id, count]) => {
      const card = cards.find((c) => c.id === id)
      return {
        id,
        count,
        front: card?.front,
      }
    })
    .sort((a, b) => b.count - a.count)

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-center">
      <h1 className="text-3xl font-bold">🎉 Hoàn thành!</h1>

      <div className="text-lg">⏱ Thời gian: <b>{Math.round(totalTime / 1000)}s</b></div>
      <div className="text-lg">✅ Tổng số từ: <b>{cards.length}</b></div>
      <div className="text-lg">
        🔁 Từ cần ôn lại: <b>{repeatedWords.length}</b>
      </div>

      {repeatedWords.length > 0 && (
        <div className="text-left">
          <h2 className="text-xl font-semibold mb-3">
            📋 Từ cần ôn lại (nhiều → ít)
          </h2>

          <ul className="space-y-2">
            {repeatedWords.map((w) => (
              <li
                key={w.id}
                className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg"
              >
                <span>
                  {typeof w.front === "string" ? w.front : w.front?.jp}
                </span>
                <span className="font-bold text-red-600">
                  {w.count} lần
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onRestart}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        🔄 Ôn lại
      </button>
    </div>
  )
}
