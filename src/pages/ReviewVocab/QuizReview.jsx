
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "quizReviewProgress_v2";
const FEEDBACK_DELAY = 950;

/* =========================================
   HELPERS
========================================= */

const normalizeText = (value) =>
  String(value ?? "").trim();

const capitalizeVietnamese = (value) => {
  if (typeof value !== "string") return value;

  return value.replace(
    /^(\s*)(\p{L})/u,
    (_, spaces, first) =>
      spaces + first.toLocaleUpperCase("vi-VN")
  );
};

const isVietnamese = (direction, isQuestion) => {
  if (direction === "vi_jp") {
    return isQuestion;
  }

  if (direction === "jp_vi") {
    return !isQuestion;
  }

  return false;
};

const formatText = (
  value,
  direction,
  isQuestion = false
) => {
  if (typeof value !== "string") return value;

  return isVietnamese(direction, isQuestion)
    ? capitalizeVietnamese(value)
    : value;
};

const getQuestionIdentity = (q, index) =>
  [
    String(q?.id ?? index),
    String(q?.direction ?? ""),
    JSON.stringify(q?.question ?? ""),
    String(q?.correct ?? ""),
    JSON.stringify(q?.choices ?? []),
  ].join("|");

const createSessionKey = (questions) =>
  JSON.stringify(
    questions.map((q, index) =>
      getQuestionIdentity(q, index)
    )
  );

const readSavedProgress = (sessionKey) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const saved = JSON.parse(raw);

    if (
      saved?.sessionKey !== sessionKey ||
      !Array.isArray(saved.history)
    ) {
      return null;
    }

    return saved;
  } catch {
    return null;
  }
};

const createInitialState = (
  questions,
  sessionKey
) => {
  const saved = readSavedProgress(sessionKey);

  if (!saved) {
    return {
      index: 0,
      history: [],
      correctCount: 0,
      selected: null,
      showResult: false,
      pending: false,
    };
  }

  const history = saved.history.slice(
    0,
    questions.length
  );

  const correctCount = history.filter(
    (item) => item.isCorrect
  ).length;

  const index = Math.min(
    Math.max(0, Number(saved.index) || 0),
    questions.length
  );

  return {
    index,
    history,
    correctCount,
    selected: null,
    showResult: false,
    pending: false,
  };
};

/* =========================================
   QUESTION CONTENT
========================================= */

function QuestionContent({
  value,
  direction,
  isQuestion = true,
}) {
  if (
    value &&
    typeof value === "object" &&
    value.type === "image"
  ) {
    return (
      <div className="flex justify-center">
        <img
          src={value.value}
          alt="Hình ảnh câu hỏi"
          className="
            block max-h-[220px] w-auto
            max-w-full rounded-2xl
            object-contain
            sm:max-h-[300px]
            lg:max-h-[340px]
          "
        />
      </div>
    );
  }

  const text = formatText(
    normalizeText(value),
    direction,
    isQuestion
  );

  return (
    <span className="whitespace-pre-wrap break-words">
      {text}
    </span>
  );
}

/* =========================================
   MAIN QUIZ
========================================= */

export default function QuizReview({
  questions = [],
  onResult,
}) {
  const sessionKey = useMemo(
    () => createSessionKey(questions),
    [questions]
  );

  const [state, setState] = useState(() =>
    createInitialState(questions, sessionKey)
  );

  const [activeSessionKey, setActiveSessionKey] =
    useState(sessionKey);

  const [showReviewPanel, setShowReviewPanel] =
    useState(false);

  const [reviewIndex, setReviewIndex] =
    useState(null);

  const [notification, setNotification] =
    useState("");

  const timerRef = useRef(null);
  const lockRef = useRef(false);
  const stateRef = useRef(state);
  const callbackRef = useRef(onResult);

  stateRef.current = state;
  callbackRef.current = onResult;

  const {
    index,
    history,
    correctCount,
    selected,
    showResult,
    pending,
  } = state;

  const q = questions[index];
  const finished = index >= questions.length;

  const percentage = questions.length
    ? Math.min(
      100,
      (index / questions.length) * 100
    )
    : 0;

  /* =========================================
     SESSION CHANGE
  ========================================= */

  useEffect(() => {
    if (activeSessionKey === sessionKey) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    lockRef.current = false;

    const restored = createInitialState(
      questions,
      sessionKey
    );

    stateRef.current = restored;
    setState(restored);
    setActiveSessionKey(sessionKey);
    setShowReviewPanel(false);
    setReviewIndex(null);
    setNotification("");
  }, [
    activeSessionKey,
    sessionKey,
    questions,
  ]);

  /* =========================================
     SAVE PROGRESS
  ========================================= */

  useEffect(() => {
    if (
      activeSessionKey !== sessionKey ||
      questions.length === 0
    ) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 2,
          sessionKey,
          index,
          history,
          correctCount,
          updatedAt: Date.now(),
        })
      );
    } catch (error) {
      console.warn(
        "Không thể lưu tiến độ Quiz:",
        error
      );
    }
  }, [
    activeSessionKey,
    sessionKey,
    questions.length,
    index,
    history,
    correctCount,
  ]);

  /* =========================================
     CLEANUP
  ========================================= */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /* =========================================
     NEXT QUESTION
  ========================================= */

  const nextQuestion = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const current = stateRef.current;

    const next = {
      ...current,
      index: Math.min(
        current.index + 1,
        questions.length
      ),
      selected: null,
      showResult: false,
      pending: false,
    };

    stateRef.current = next;
    setState(next);

    lockRef.current = false;

    // Bỏ focus để iPad/iPhone không giữ viền xanh
    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  }, [questions.length]);

  /* =========================================
     CHOOSE ANSWER
  ========================================= */

  const choose = async (value, event) => {
    if (
      !q ||
      lockRef.current ||
      stateRef.current.showResult
    ) {
      return;
    }

    lockRef.current = true;

    // Xóa focus ngay sau khi chạm đáp án
    event?.currentTarget?.blur();

    const isCorrect = value === q.correct;

    const answerRecord = {
      id: q.id,
      direction: q.direction,
      question: q.question,
      selected: value,
      correct: q.correct,
      choices: q.choices,
      isCorrect,
    };

    const current = stateRef.current;

    const next = {
      ...current,
      selected: value,
      showResult: true,
      pending: true,
      correctCount:
        current.correctCount +
        (isCorrect ? 1 : 0),
      history: [
        ...current.history,
        answerRecord,
      ],
    };

    stateRef.current = next;
    setState(next);

    // Lưu ngay, không đợi useEffect
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 2,
          sessionKey,
          index: next.index,
          history: next.history,
          correctCount: next.correctCount,
          updatedAt: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Quiz save error:", error);
    }

    setNotification(
      isCorrect ? "Chính xác!" : "Chưa chính xác"
    );

    // Callback từ component cha
    try {
      if (typeof callbackRef.current === "function") {
        await callbackRef.current(
          q,
          isCorrect
        );
      }
    } catch (error) {
      console.error(
        "Quiz onResult error:",
        error
      );
    }

    timerRef.current = setTimeout(() => {
      setNotification("");
      nextQuestion();
    }, FEEDBACK_DELAY);
  };

  /* =========================================
     REVIEW HISTORY
  ========================================= */

  const reviewData = useMemo(() => {
    if (reviewIndex === null) {
      return null;
    }

    return history[reviewIndex] || null;
  }, [reviewIndex, history]);

  const toggleReviewPanel = () => {
    setShowReviewPanel((previous) => !previous);
    setReviewIndex(null);
  };

  const moveReview = (direction) => {
    setReviewIndex((previous) => {
      if (!history.length) return null;

      if (previous === null) {
        return history.length - 1;
      }

      return Math.max(
        0,
        Math.min(
          history.length - 1,
          previous + direction
        )
      );
    });
  };

  /* =========================================
     FINISH
  ========================================= */

  if (finished) {
    return (
      <Summary
        total={questions.length}
        correct={correctCount}
        history={history}
      />
    );
  }

  if (!q) {
    return (
      <div className="p-6 text-center text-slate-500">
        Không có câu hỏi trắc nghiệm.
      </div>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <div
      className="
        mx-auto flex w-full max-w-5xl
        min-w-0 flex-col gap-3
        px-2 py-2
        sm:gap-4 sm:px-4 sm:py-4
        lg:gap-5
      "
    >
      {/* ================= HEADER ================= */}

      <div
        className="
          rounded-2xl border border-slate-200
          bg-white px-4 py-3 shadow-sm
          sm:rounded-3xl sm:px-5
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-slate-500">
              Câu
            </span>

            <span className="text-xl font-bold tabular-nums text-blue-600 sm:text-2xl">
              {index + 1}
            </span>

            <span className="text-sm text-slate-400">
              / {questions.length}
            </span>
          </div>

          <div
            className="
              flex items-center gap-2
              rounded-full bg-emerald-50
              px-3 py-1.5
              text-xs font-semibold
              text-emerald-700
              sm:text-sm
            "
          >
            <span>✓</span>
            <span>{correctCount} đúng</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="
              h-full rounded-full
              bg-gradient-to-r
              from-blue-500 to-indigo-500
              transition-[width] duration-500
              ease-out
            "
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* ================= QUESTION ================= */}

      <div
        key={`question-${index}`}
        className="
  relative flex
  h-[150px] sm:h-[190px] lg:h-[215px]
  flex-col items-center justify-center
  overflow-hidden rounded-[24px]
  border border-slate-200
  bg-white px-4 py-5
  text-center shadow-sm
  sm:rounded-[28px] sm:px-8
  motion-safe:animate-[quizFadeIn_0.3s_ease-out]
"
      >
        <div
          className="
            w-full text-[clamp(1.7rem,5vw,3.8rem)]
            font-bold leading-[1.4]
            tracking-wide text-slate-800
          "
        >
          <QuestionContent
            value={q.question}
            direction={q.direction}
            isQuestion
          />
        </div>

        {showResult && (
          <div
            role="status"
            aria-live="polite"
            className={`
      pointer-events-none
      absolute bottom-2 right-2
      z-10
      inline-flex items-center gap-1.5
      rounded-full
      px-3 py-1.5
      text-xs font-semibold
      shadow-sm
      sm:bottom-3 sm:right-3
      sm:px-4 sm:py-2 sm:text-sm
      motion-safe:animate-[quizPop_0.25s_ease-out]
      ${selected === q.correct
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
              }
    `}
          >
            {selected === q.correct
              ? "✓ Chính xác!"
              : "✕ Chưa chính xác"}
          </div>
        )}
      </div>

      {/* ================= ANSWERS ================= */}

      <div
        key={`answers-${index}`}
        className="
          grid min-w-0 grid-cols-1
          gap-2.5
          sm:grid-cols-2 sm:gap-3
          lg:gap-4
        "
      >
        {q.choices.map((choice, choiceIndex) => {
          const isCorrect =
            choice === q.correct;

          const isSelected =
            choice === selected;

          let appearance =
            "border-slate-200 bg-white text-slate-700";

          if (showResult) {
            if (isCorrect) {
              appearance =
                "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-emerald-100";
            } else if (isSelected) {
              appearance =
                "border-rose-500 bg-rose-50 text-rose-700";
            } else {
              appearance =
                "border-slate-100 bg-slate-50 text-slate-400 opacity-70";
            }
          }

          return (
            <button
              key={`${index}-${choiceIndex}`}
              type="button"
              disabled={showResult || pending}
              onClick={(event) =>
                choose(choice, event)
              }
              onPointerUp={(event) => {
                // Loại bỏ focus giữ lại trên thiết bị cảm ứng
                if (
                  event.pointerType === "touch" ||
                  event.pointerType === "pen"
                ) {
                  event.currentTarget.blur();
                }
              }}
              className={`
                group relative flex
                min-h-[68px] min-w-0
                items-center justify-center
                rounded-2xl border-2
                px-4 py-3
                text-center
                text-[clamp(1.05rem,2.3vw,1.5rem)]
                font-semibold leading-relaxed
                break-words
                shadow-sm
                transition-[background-color,border-color,transform,box-shadow]
                duration-200
                select-none touch-manipulation
                outline-none
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-400
                focus-visible:ring-offset-2
                enabled:active:scale-[0.985]
                disabled:cursor-default
                sm:min-h-[88px]
                sm:px-5 sm:py-4
                lg:min-h-[96px]
                ${!showResult
                  ? "hover:border-blue-300 hover:bg-blue-50"
                  : ""
                }
                ${appearance}
              `}
            >
              <span className="relative z-10">
                <QuestionContent
                  value={choice}
                  direction={q.direction}
                  isQuestion={false}
                />
              </span>

              {showResult && isCorrect && (
                <span
                  className="
                    absolute right-2 top-2
                    flex h-6 w-6 items-center
                    justify-center rounded-full
                    bg-emerald-500
                    text-xs text-white
                    sm:right-3 sm:top-3
                  "
                >
                  ✓
                </span>
              )}

              {showResult &&
                isSelected &&
                !isCorrect && (
                  <span
                    className="
                      absolute right-2 top-2
                      flex h-6 w-6 items-center
                      justify-center rounded-full
                      bg-rose-500
                      text-xs text-white
                      sm:right-3 sm:top-3
                    "
                  >
                    ✕
                  </span>
                )}
            </button>
          );
        })}
      </div>

      {/* ================= HISTORY ================= */}

      {history.length > 0 && (
        <div
          className="
            overflow-hidden rounded-2xl
            border border-slate-200
            bg-white shadow-sm
            sm:rounded-3xl
          "
        >
          <button
            type="button"
            onClick={toggleReviewPanel}
            className="
              flex min-h-[52px] w-full
              items-center justify-between
              gap-3 px-4 py-3
              text-left text-sm
              font-semibold text-slate-700
              hover:bg-slate-50
              sm:px-5 sm:text-base
            "
          >
            <span>
              📚 Xem lại câu cũ ({history.length})
            </span>

            <span
              className="
                rounded-full bg-slate-100
                px-3 py-1 text-xs
                text-slate-600
              "
            >
              {showReviewPanel ? "Thu gọn" : "Mở"}
            </span>
          </button>

          {showReviewPanel && (
            <div className="border-t border-slate-100 p-3 sm:p-5">
              <div className="mb-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => moveReview(-1)}
                  disabled={reviewIndex === 0}
                  className="
                    min-h-[42px] rounded-xl
                    bg-slate-100 px-3 py-2
                    text-xs font-semibold
                    text-slate-700
                    disabled:opacity-40
                    sm:text-sm
                  "
                >
                  ← Trước
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setReviewIndex(null)
                  }
                  className="
                    min-h-[42px] rounded-xl
                    bg-blue-600 px-3 py-2
                    text-xs font-semibold
                    text-white
                    sm:text-sm
                  "
                >
                  Hiện tại
                </button>

                <button
                  type="button"
                  onClick={() => moveReview(1)}
                  disabled={
                    reviewIndex ===
                    history.length - 1
                  }
                  className="
                    min-h-[42px] rounded-xl
                    bg-slate-100 px-3 py-2
                    text-xs font-semibold
                    text-slate-700
                    disabled:opacity-40
                    sm:text-sm
                  "
                >
                  Sau →
                </button>
              </div>

              {reviewData ? (
                <ReviewCard
                  data={reviewData}
                  number={reviewIndex + 1}
                />
              ) : (
                <p className="text-center text-xs text-slate-400">
                  Chọn Trước hoặc Sau để xem câu đã làm.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= ANIMATION CSS ================= */}

      <style>
        {`
          @keyframes quizFadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes quizPop {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================================
   REVIEW CARD
========================================= */

function ReviewCard({ data, number }) {
  return (
    <div
      className={`
        rounded-2xl border p-4
        sm:p-5
        ${data.isCorrect
          ? "border-emerald-200 bg-emerald-50"
          : "border-rose-200 bg-rose-50"
        }
      `}
    >
      <div className="mb-3 text-xs font-semibold text-slate-500">
        Câu {number}
      </div>

      <div className="mb-4 text-center text-xl font-bold leading-relaxed text-slate-800 sm:text-3xl">
        <QuestionContent
          value={data.question}
          direction={data.direction}
          isQuestion
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data.choices.map((choice, index) => {
          const isCorrect =
            choice === data.correct;

          const isSelected =
            choice === data.selected;

          const appearance = isCorrect
            ? "border-emerald-400 bg-emerald-100 text-emerald-800"
            : isSelected
              ? "border-rose-400 bg-rose-100 text-rose-700"
              : "border-slate-200 bg-white text-slate-600";

          return (
            <div
              key={index}
              className={`
                rounded-xl border-2
                px-3 py-3 text-center
                text-base font-medium
                break-words sm:text-lg
                ${appearance}
              `}
            >
              <QuestionContent
                value={choice}
                direction={data.direction}
                isQuestion={false}
              />
            </div>
          );
        })}
      </div>

      <div
        className={`
          mt-4 text-center text-sm
          font-bold sm:text-base
          ${data.isCorrect
            ? "text-emerald-700"
            : "text-rose-700"
          }
        `}
      >
        {data.isCorrect
          ? "✓ Bạn làm đúng"
          : "✕ Bạn làm sai"}
      </div>
    </div>
  );
}

/* =========================================
   SUMMARY
========================================= */

function Summary({
  total,
  correct,
  history,
}) {
  const percent = total
    ? Math.round((correct / total) * 100)
    : 0;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-2 py-4 sm:px-4">
      <div
        className="
          rounded-[28px] border
          border-slate-200 bg-white
          p-6 text-center shadow-sm
          sm:p-10
        "
      >
        <div className="mb-3 text-4xl">
          🎉
        </div>

        <h2 className="text-2xl font-bold text-slate-800 sm:text-4xl">
          Hoàn thành!
        </h2>

        <div className="mt-5 text-4xl font-extrabold text-blue-600 sm:text-5xl">
          {correct} / {total}
        </div>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Độ chính xác {percent}%
        </p>

        <div className="mx-auto mt-5 h-3 max-w-md overflow-hidden rounded-full bg-slate-100">
          <div
            className="
              h-full rounded-full
              bg-gradient-to-r
              from-blue-500 to-emerald-500
              transition-all duration-700
            "
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {history.map((item, index) => (
          <ReviewCard
            key={index}
            data={item}
            number={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
