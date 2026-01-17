export default function Summary({ total, correct, history }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl font-bold">🎉 Hoàn thành</div>
        <div className="text-xl">
          Đúng {correct} / {total}
        </div>
      </div>

      <div className="space-y-2 text-left">
        {history.map((h, i) => (
          <div
            key={i}
            className={`p-3 rounded border ${
              h.isCorrect
                ? "bg-green-100 border-green-400"
                : "bg-red-100 border-red-400"
            }`}
          >
            <div className="font-semibold">
              {i + 1}. {h.question}
            </div>
            <div>👉 Bạn nhập: {h.input}</div>
            {!h.isCorrect && (
              <div>✅ Đáp án: {h.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
