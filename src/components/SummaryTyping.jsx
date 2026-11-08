export default function SummaryTyping({ total, correct, history }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-3 py-4">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="text-3xl font-bold text-slate-800 sm:text-4xl">🎉 Hoàn thành</div>
        <div className="mt-3 text-xl font-semibold text-slate-700 sm:text-2xl">
          Đúng {correct} / {total}
        </div>
      </div>

      <div className="space-y-3">
        {history.map((h, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 shadow-sm ${
              h.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
            }`}
          >
            <div className="text-base font-semibold text-slate-800 sm:text-lg">
              {i + 1}. {h.question}
            </div>
            <div className="mt-2 text-sm text-slate-600 sm:text-base">👉 Bạn nhập: {h.input}</div>
            {!h.isCorrect && (
              <div className="mt-1 text-sm font-medium text-emerald-700 sm:text-base">✅ Đáp án: {h.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
