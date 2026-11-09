
import { useEffect, useState } from "react";

const REVIEW_MODES = [
  { key: "typing", label: "✍️ Điền từ" },
  { key: "quiz", label: "🧠 Trắc nghiệm" },
  { key: "flashcard", label: "🃏 Flashcard" },
];

const DIRECTIONS = [
  { key: "jp_vi", label: "Nhật → Việt" },
  { key: "vi_jp", label: "Việt → Nhật" },
  { key: "kanji", label: "Kanji" },
  { key: "image", label: "Hình ảnh" },
];

const LIMIT_OPTIONS = [10, 20, 30, 50, 100];

const readProgress = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem("reviewSessionData") || "null"
    );
    return saved?.progress || null;
  } catch {
    return null;
  }
};

export default function ReviewOptions({
  mode,
  setMode,
  directions = [],
  setDirections,
  reviewLimit,
  setReviewLimit,
}) {
  const [showLimitOptions, setShowLimitOptions] =
    useState(false);

  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    const validKeys = new Set(
      DIRECTIONS.map((item) => item.key)
    );

    setDirections((previous) => {
      const filtered = previous.filter((key) =>
        validKeys.has(key)
      );

      if (filtered.length === previous.length &&
          filtered.length > 0) {
        return previous;
      }

      return filtered.length ? filtered : ["jp_vi"];
    });
  }, [setDirections]);

  useEffect(() => {
    const update = () => setProgress(readProgress());

    window.addEventListener("storage", update);
    window.addEventListener("focus", update);

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  const toggleDirection = (key) => {
    setDirections((previous) => {
      if (previous.includes(key)) {
        return previous.length === 1
          ? previous
          : previous.filter((value) => value !== key);
      }

      return [...previous, key];
    });
  };

  const reviewedCount = Math.max(
    0,
    Number(progress?.reviewedVocabs || 0)
  );

  const reviewTotal = Math.max(
    0,
    Number(progress?.total || 0)
  );

  const percentage =
    reviewTotal > 0
      ? Math.min(100, (reviewedCount / reviewTotal) * 100)
      : 0;

  return (
    <div className="space-y-5 md:space-y-6 min-w-0 w-full">
      {/* MODE */}
      <section className="bg-white rounded-xl shadow p-4 sm:p-5">
        <h2 className="font-semibold mb-4 text-sm sm:text-base">
          🎮 Chế độ ôn
        </h2>

        <div className="space-y-3">
          {REVIEW_MODES.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 min-h-[44px] cursor-pointer"
            >
              <input
                type="radio"
                name="reviewMode"
                checked={mode === item.key}
                onChange={() => setMode(item.key)}
                className="scale-110"
              />
              <span className="text-sm sm:text-base">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="bg-white rounded-xl shadow p-4 sm:p-5">
        <h2 className="font-semibold mb-4 text-sm sm:text-base">
          🔁 Hướng ôn
        </h2>

        <div className="space-y-3">
          {DIRECTIONS.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 min-h-[44px] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={directions.includes(item.key)}
                onChange={() => toggleDirection(item.key)}
                className="scale-110"
              />
              <span className="text-sm sm:text-base">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* LIMIT */}
      <section className="bg-white rounded-xl shadow p-4 sm:p-5">
        <h2 className="font-semibold mb-4 text-sm sm:text-base">
          🔢 Số lượng từ mỗi phiên
        </h2>

        <div className="relative">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="number"
              min="1"
              value={reviewLimit ?? ""}
              placeholder="Tất cả"
              inputMode="numeric"
              onChange={(event) => {
                const value = event.target.value;

                if (value === "" || value === "0") {
                  setReviewLimit(null);
                  return;
                }

                const number = Number(value);

                if (
                  Number.isSafeInteger(number) &&
                  number > 0
                ) {
                  setReviewLimit(number);
                }
              }}
              className="flex-1 min-w-0 px-3 py-3 outline-none bg-transparent text-base"
            />

            <span className="text-sm text-gray-400 px-2">
              từ
            </span>

            <button
              type="button"
              aria-label="Chọn số lượng"
              aria-expanded={showLimitOptions}
              onClick={() =>
                setShowLimitOptions((previous) => !previous)
              }
              className="px-3 py-3 border-l border-gray-200 text-gray-500 min-w-[44px] min-h-[44px]"
            >
              {showLimitOptions ? "▲" : "▼"}
            </button>
          </div>

          {showLimitOptions && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {LIMIT_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setReviewLimit(value);
                    setShowLimitOptions(false);
                  }}
                  className={`block w-full px-3 py-2.5 text-left text-sm hover:bg-blue-50 ${
                    reviewLimit === value
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {value} từ
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setReviewLimit(null);
                  setShowLimitOptions(false);
                }}
                className={`block w-full px-3 py-2.5 text-left text-sm border-t hover:bg-blue-50 ${
                  reviewLimit == null
                    ? "text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                Tất cả
              </button>
            </div>
          )}
        </div>

        {/* PROGRESS */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">Tiến độ</span>
            <span className="font-semibold text-gray-800">
              {reviewedCount} / {reviewTotal}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {reviewTotal > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Còn{" "}
              {Math.max(0, reviewTotal - reviewedCount)}{" "}
              từ chưa ôn
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
