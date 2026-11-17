
export default function SummaryTyping({
  total,
  correct,
  history = [],
}) {
  const wrong = total - correct;

  const hintTotal = history.reduce(
    (sum, item) => sum + (item.hints || 0),
    0
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-3 py-5">

      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="text-4xl">🎉</div>

        <h2 className="mt-3 text-2xl font-bold text-slate-800">
          Hoàn thành
        </h2>

        <div className="mt-5 grid grid-cols-3 gap-2">

          <div className="rounded-2xl bg-emerald-50 p-3">
            <div className="text-2xl font-bold text-emerald-700">
              {correct}
            </div>
            <div className="text-xs text-emerald-600">
              Chính xác
            </div>
          </div>

          <div className="rounded-2xl bg-red-50 p-3">
            <div className="text-2xl font-bold text-red-700">
              {wrong}
            </div>
            <div className="text-xs text-red-600">
              Chưa đúng
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-3">
            <div className="text-2xl font-bold text-amber-700">
              {hintTotal}
            </div>
            <div className="text-xs text-amber-600">
              Gợi ý
            </div>
          </div>

        </div>

        <div className="mt-5 text-lg font-bold text-slate-700">
          {total > 0
            ? Math.round((correct / total) * 100)
            : 0}% hoàn thành chính xác
        </div>
      </div>

      <div className="space-y-3">

        <h3 className="font-bold text-slate-700">
          Chi tiết kết quả
        </h3>

        {history.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border p-4 ${
              item.isCorrect
                ? "border-emerald-200 bg-emerald-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="font-semibold text-slate-800">
              {index + 1}. {item.display || item.question}
            </div>

            <div className="mt-2 text-sm text-slate-600">
              Bạn nhập: {item.input}
            </div>

            {!item.isCorrect && (
              <div className="mt-1 text-sm font-semibold text-emerald-700">
                Đáp án: {item.answer}
              </div>
            )}

            {item.hints > 0 && (
              <div className="mt-1 text-xs text-amber-700">
                Đã sử dụng {item.hints} gợi ý
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}
