import { formatExamTime } from "../../utils/typingExam";

const DIRECTIONS = {
  vi_jp: "Việt → Nhật",
  kanji: "Kanji → Nhật",
  kanji_meaning: "Kanji → Nghĩa",
  meaning_kanji: "Nghĩa → Kanji",
  onyomi: "Âm On",
  kunyomi: "Âm Kun",
  hanviet: "Hán Việt",
  kanji_reading: "Kanji → Cách đọc",
  reading_kanji: "Cách đọc → Kanji",
  vocab_meaning: "Từ vựng → Nghĩa",
  meaning_vocab: "Nghĩa → Từ vựng",
};

const STATUS = {
  correct: { label: "Đúng", className: "bg-green-50 text-green-700" },
  incorrect: { label: "Sai", className: "bg-red-50 text-red-700" },
  blank: { label: "Bỏ trống", className: "bg-gray-100 text-gray-700" },
};

export default function TypingExamResult({ attempt, questions, onBack }) {
  const { result } = attempt;
  const score = new Intl.NumberFormat("vi", { maximumFractionDigits: 1 }).format(result.scorePercent);
  const stats = [
    ["Tổng", result.totalQuestions],
    ["Đúng", result.correctCount],
    ["Sai", result.incorrectCount],
    ["Bỏ trống", result.blankCount],
    ["Đã dùng", formatExamTime(result.elapsedMs)],
    ["Được cấp", formatExamTime(attempt.durationMinutes * 60_000)],
  ];

  return (
    <section aria-labelledby="exam-result-title" className="min-w-0 space-y-4 p-1 text-gray-900 sm:p-3">
      <div>
        <h1 id="exam-result-title" className="text-2xl font-bold">Kết quả kiểm tra</h1>
        <p className="mt-2 text-xl font-semibold">Điểm: {score}%</p>
      </div>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-gray-100 p-3">
            <dt className="text-sm text-gray-600">{label}</dt>
            <dd className="font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <ol className="space-y-2">
        {result.items.map((item, index) => {
          const question = questions[index];
          const status = STATUS[item.status];
          const hanViet = Array.isArray(question.hanViet)
            ? question.hanViet.join(", ")
            : question.hanViet;
          return (
            <li key={item.questionId}>
              <details className="rounded-xl border border-gray-200 px-3">
                <summary className="min-h-11 cursor-pointer break-words py-3">
                  <span className="font-medium">{index + 1}. {question.question}</span>
                  <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${status.className}`}>
                    {status.label}
                  </span>
                </summary>
                <dl className="space-y-1 break-words pb-3 text-sm text-gray-700">
                  <div><dt className="inline font-semibold">Hướng kiểm tra: </dt><dd className="inline">{DIRECTIONS[question.direction] ?? (question.direction || "—")}</dd></div>
                  <div><dt className="inline font-semibold">Đáp án đã nhập: </dt><dd className="inline">{item.userAnswer || "—"}</dd></div>
                  <div><dt className="inline font-semibold">Đáp án chính xác: </dt><dd className="inline">{item.expected}</dd></div>
                  {hanViet && <div><dt className="inline font-semibold">Hán Việt: </dt><dd className="inline">{hanViet}</dd></div>}
                </dl>
              </details>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={onBack}
        className="theme-selector-option min-h-11 rounded-xl px-4 py-2 text-sm font-semibold"
      >
        Quay lại cấu hình
      </button>
    </section>
  );
}
