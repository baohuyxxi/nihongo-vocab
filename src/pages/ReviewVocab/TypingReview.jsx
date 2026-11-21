
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import KanaAnswerInput from "../../components/JPInput/KanaAnswerInput";
import SummaryTyping from "../../components/SummaryTyping";
import { getTypingProgressKey } from "../../utils/typingSession";
import { getAnswerCells, getExpectedAnswer, normalizeKana } from "../../utils/typingAnswers";

/* =========================================
   CONFIG
========================================= */

const AUTO_NEXT_DELAY = 1500;

const capitalizeVietnamese = (value = "") => {
  const text = String(value).trim();

  if (!text) return "";

  return (
    text.charAt(0).toLocaleUpperCase("vi") +
    text.slice(1)
  );
};

const createEmptyEntry = (question) => ({
  cells: Array(getAnswerCells(question).length).fill(""),
  hints: [],
  submitted: false,
  isCorrect: false,
  userAnswer: "",
  lastAttempt: null,
});

/* =========================================
   STORAGE
========================================= */

const loadProgress = (key, questions) => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(key) || "null"
    );

    if (!saved) {
      return {
        index: 0,
        entries: {},
        completed: false,
      };
    }

    const entries = {};

    questions.forEach((question) => {
      const id = question.questionId;
      const oldEntry = saved.entries?.[id];

      if (!oldEntry) return;

      const empty = createEmptyEntry(question);
      const length = empty.cells.length;

      const maxHints = Math.floor(length / 2);

      entries[id] = {
        ...empty,
        ...oldEntry,

        cells: Array.from(
          { length },
          (_, i) => oldEntry.cells?.[i] || ""
        ),

        hints: (oldEntry.hints || [])
          .filter(
            (i) =>
              Number.isInteger(i) &&
              i >= 0 &&
              i < length
          )
          .slice(0, maxHints),

        lastAttempt: oldEntry.lastAttempt || null,
      };
    });

    return {
      index: Math.min(
        Math.max(0, Number(saved.index) || 0),
        Math.max(0, questions.length - 1)
      ),

      entries,

      completed: saved.completed === true,
    };

  } catch (error) {
    console.error("Load Typing progress:", error);

    return {
      index: 0,
      entries: {},
      completed: false,
    };
  }
};


/* =========================================
   MAIN COMPONENT
========================================= */

export default function TypingReview({
  questions,
  onResult,
  sessionId,
}) {
  /* =========================================
     SESSION IDENTITY
  ========================================= */

  const storageKey = getTypingProgressKey(sessionId);

  /* =========================================
     STATE
  ========================================= */

  const [progress, setProgress] = useState({
    storageKey: "",
    index: 0,
    entries: {},
    completed: false,
  });

  const [ready, setReady] = useState(false);

  const [showSummary, setShowSummary] = useState(false);

  const timerRef = useRef(null);

  const progressRef = useRef(progress);

  const total = questions.length;

  const maxTotalHints = Math.floor(total / 2);

  /* =========================================
     KEEP LATEST PROGRESS
  ========================================= */

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  /* =========================================
     SAVE FUNCTION

     Ghi đồng bộ vào LocalStorage.
  ========================================= */

  const saveProgress = useCallback(
    (value = progressRef.current) => {
      if (
        !value ||
        value.storageKey !== storageKey ||
        !storageKey
      ) {
        return;
      }

      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            version: 6,
            index: value.index,
            entries: value.entries,
            completed: value.completed,
            updatedAt: Date.now(),
          })
        );

      } catch (error) {
        console.error("Save Typing progress:", error);
      }
    },
    [storageKey]
  );

  /* =========================================
     LOAD
  ========================================= */

  useEffect(() => {
    setReady(false);
    setShowSummary(false);

    const saved = loadProgress(
      storageKey,
      questions
    );

    const restored = {
      storageKey,
      ...saved,
    };

    progressRef.current = restored;

    setProgress(restored);

    setShowSummary(saved.completed);

    setReady(true);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

  }, [storageKey, questions]);

  /* =========================================
     AUTO SAVE AFTER EVERY CHANGE
  ========================================= */

  useEffect(() => {
    if (
      !ready ||
      progress.storageKey !== storageKey
    ) {
      return;
    }

    progressRef.current = progress;

    saveProgress(progress);

  }, [progress, storageKey, ready, saveProgress]);

  /* =========================================
     SAVE WHEN LEAVING PAGE

     Hỗ trợ F5 / đóng tab / Safari.
  ========================================= */

  useEffect(() => {
    if (!ready) return;

    const handlePageHide = () => {
      saveProgress(progressRef.current);
    };

    const handleBeforeUnload = () => {
      saveProgress(progressRef.current);
    };

    window.addEventListener(
      "pagehide",
      handlePageHide
    );

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      saveProgress(progressRef.current);

      window.removeEventListener(
        "pagehide",
        handlePageHide
      );

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };

  }, [ready, saveProgress]);

  /* =========================================
     TIMER CLEANUP
  ========================================= */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  /* =========================================
     CURRENT QUESTION
  ========================================= */

  const index = progress.index;

  const q = questions[index];

  const getEntry = useCallback(
    (question) => {
      if (!question) return null;

      const id = question.questionId;

      return (
        progress.entries[id] ||
        createEmptyEntry(question)
      );
    },
    [progress.entries]
  );

  const currentEntry = getEntry(q);

  const answerCells = useMemo(
    () => (q ? getAnswerCells(q) : []),
    [q]
  );

  /* =========================================
     STATISTICS
  ========================================= */

  const statistics = useMemo(() => {
    let correct = 0;
    let answered = 0;
    let hintsUsed = 0;

    questions.forEach((question) => {
      const entry = getEntry(question);

      if (!entry) return;

      hintsUsed += entry.hints.length;

      if (entry.submitted && entry.isCorrect) {
        correct++;
        answered++;
      }
    });

    return {
      correct,
      answered,
      wrong: 0,
      remaining: total - answered,
      hintsUsed,
    };

  }, [questions, getEntry, total]);

  const isLocked = !!currentEntry?.submitted;

  /* =========================================
     UPDATE ENTRY
  ========================================= */

  const updateEntry = useCallback(
    (questionIndex, updater) => {
      const question = questions[questionIndex];

      if (!question) return;

      const id = question.questionId;

      setProgress((previous) => {
        const oldEntry =
          previous.entries[id] ||
          createEmptyEntry(question);

        const newEntry =
          typeof updater === "function"
            ? updater(oldEntry)
            : updater;

        return {
          ...previous,

          entries: {
            ...previous.entries,
            [id]: newEntry,
          },
        };
      });
    },
    [questions]
  );

  /* =========================================
     DISPLAY QUESTION
  ========================================= */

  const displayQuestion = useMemo(() => {
    if (!q) return "";

    if (q.direction === "vi_jp") {
      return capitalizeVietnamese(q.question);
    }

    // Giữ nguyên đầy đủ Kanji + Kana.
    return q.question || "";

  }, [q]);

  /* =========================================
     UPDATE CELLS
  ========================================= */

  const handleCellsChange = useCallback(
    (nextCells) => {
      if (!q || isLocked) return;

      updateEntry(index, (old) => ({
        ...old,
        cells: nextCells,
        lastAttempt: null,
      }));
    },
    [q, index, isLocked, updateEntry]
  );

  /* =========================================
     HINT
  ========================================= */

  const handleHint = useCallback(
    (selectedIndex) => {
      if (!q || isLocked) return;

      if (
        !Number.isInteger(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= answerCells.length
      ) {
        return;
      }

      // Giới hạn gợi ý toàn phiên.
      if (statistics.hintsUsed >= maxTotalHints) {
        return;
      }

      // Giới hạn 50% số ô mỗi câu.
      const maxQuestionHints = Math.floor(
        answerCells.length / 2
      );

      if (
        currentEntry.hints.length >= maxQuestionHints
      ) {
        return;
      }

      if (currentEntry.hints.includes(selectedIndex)) {
        return;
      }

      updateEntry(index, (old) => ({
        ...old,

        cells: old.cells.map((cell, i) =>
          i === selectedIndex
            ? answerCells[selectedIndex]
            : cell
        ),

        hints: [...old.hints, selectedIndex],

        lastAttempt: null,
      }));
    },
    [
      q,
      isLocked,
      answerCells,
      statistics.hintsUsed,
      maxTotalHints,
      currentEntry,
      updateEntry,
      index,
    ]
  );

  /* =========================================
     NAVIGATION
  ========================================= */

  const goToQuestion = useCallback(
    (nextIndex) => {
      if (
        nextIndex < 0 ||
        nextIndex >= total
      ) {
        return;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setShowSummary(false);

      setProgress((previous) => ({
        ...previous,
        index: nextIndex,
        completed: false,
      }));
    },
    [total]
  );

  /* =========================================
     CHECK ANSWER
  ========================================= */

  const handleCheck = useCallback((latestCells) => {
    if (!q || isLocked) return;

    const input = (
      Array.isArray(latestCells)
        ? latestCells
        : currentEntry.cells
    ).join("");

    if (!input.trim()) return;

    if (!input.trim()) return;

    const expected = getExpectedAnswer(q);

    const isCorrect =
      normalizeKana(input) ===
      normalizeKana(expected);

    // Sai: cho phép sửa và nhập lại.
    if (!isCorrect) {
      updateEntry(index, (old) => ({
        ...old,

        lastAttempt: {
          input,
          isCorrect: false,
        },
      }));

      return;
    }

    // Đúng: hoàn thành câu.
    updateEntry(index, (old) => ({
      ...old,

      submitted: true,
      isCorrect: true,
      userAnswer: input,

      lastAttempt: {
        input,
        isCorrect: true,
      },
    }));

    if (onResult) {
      Promise.resolve(
        onResult(q, true, input)
      ).catch((error) => {
        console.error(
          "Lưu kết quả Typing:",
          error
        );
      });
    }

    // Đúng mới tự chuyển câu.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (index < total - 1) {
        setProgress((previous) => ({
          ...previous,
          index: index + 1,
        }));
      } else {
        setProgress((previous) => ({
          ...previous,
          completed: true,
        }));

        setShowSummary(true);
      }

      timerRef.current = null;

    }, AUTO_NEXT_DELAY);

  }, [
    q,
    isLocked,
    currentEntry,
    index,
    total,
    updateEntry,
    onResult,
  ]);

  /* =========================================
     HISTORY
  ========================================= */

  const history = useMemo(
    () =>
      questions
        .map((question) => {
          const entry = getEntry(question);

          if (
            !entry?.submitted ||
            !entry.isCorrect
          ) {
            return null;
          }

          const display =
            question.direction === "vi_jp"
              ? capitalizeVietnamese(question.question)
              : question.question;

          return {
            question: question.question,
            display,

            input: entry.userAnswer || "",

            answer:
              question.answer ||
              question.correct,

            isCorrect: true,

            hints: entry.hints.length,
          };
        })
        .filter(Boolean),

    [questions, getEntry]
  );

  /* =========================================
     LOADING
  ========================================= */

  if (!ready) {
    return (
      <div className="flex min-h-[160px] items-center justify-center text-sm text-slate-500">
        Đang khôi phục tiến độ...
      </div>
    );
  }

  if (!total) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border bg-white p-6 text-center">
        Không có câu hỏi phù hợp.
      </div>
    );
  }

  /* =========================================
     SUMMARY
  ========================================= */

  if (showSummary || progress.completed) {
    return (
      <SummaryTyping
        total={total}
        correct={statistics.correct}
        history={history}
      />
    );
  }

  if (!q || !currentEntry) return null;

  /* =========================================
     HINT LIMITS
  ========================================= */

  const maxQuestionHints = Math.floor(
    answerCells.length / 2
  );

  const canHint =
    !isLocked &&
    statistics.hintsUsed < maxTotalHints &&
    currentEntry.hints.length < maxQuestionHints;

  /* =========================================
     CHECK
  ========================================= */

  const canCheck =
    !isLocked &&
    currentEntry.cells.length === answerCells.length &&
    currentEntry.cells.every((cell) =>
      cell.trim()
    );

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="
      mx-auto w-full max-w-3xl
      space-y-3 px-3 py-2
      sm:space-y-4 sm:px-4
    ">

      {/* HEADER */}

      <section className="
        rounded-2xl border border-slate-200
        bg-white px-3 py-2.5 shadow-sm
        sm:px-4 sm:py-3
      ">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-400 sm:text-xs">
              ĐIỀN TỪ
            </div>

            <div className="mt-0.5 text-sm font-bold text-slate-700 sm:text-base">
              Câu{" "}
              <span className="text-blue-600">
                {index + 1}
              </span>
              {" / "}
              {total}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
              ✔ {statistics.correct}
            </span>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              {statistics.remaining} còn
            </span>
          </div>
        </div>

        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${(statistics.answered / total) * 100}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-slate-400">
          <span>
            Gợi ý: {statistics.hintsUsed}/{maxTotalHints}
          </span>

          <span>
            Câu này: {currentEntry.hints.length}/{maxQuestionHints}
          </span>
        </div>
      </section>

      {/* QUESTION */}

      {/* QUESTION */}

      <section className="
  flex min-h-[80px]
  items-center justify-center
  rounded-2xl border border-slate-200
  bg-white px-4 py-3
  text-center shadow-sm
  sm:min-h-[100px] sm:px-6 sm:py-4
">
        <div className="
  break-words
  text-3xl font-bold tracking-wide
  text-slate-800
  sm:text-4xl md:text-5xl
">
          {displayQuestion}
        </div>
      </section>

      {/* ANSWER */}

      <section className="
  rounded-2xl border border-slate-200
  bg-white px-3 py-2 shadow-sm
  sm:px-5 sm:py-3
">
        <KanaAnswerInput
          key={q.questionId}
          cells={currentEntry.cells}
          hints={currentEntry.hints}
          onChange={handleCellsChange}
          onHint={handleHint}
          onCheck={handleCheck}
          canCheck={canCheck}
          canHint={canHint}
          disabled={isLocked}
        />
      </section>

      {/* RESULT */}

      <div className="flex min-h-[42px] items-center justify-center">
        {currentEntry.lastAttempt && (
          <div
            className={`
              rounded-full px-4 py-2
              text-center text-sm font-semibold
              ${currentEntry.lastAttempt.isCorrect
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
              }
            `}
          >
            {currentEntry.lastAttempt.isCorrect
              ? "✔ Chính xác"
              : "✘ Chưa chính xác, hãy thử lại"}
          </div>
        )}
      </div>

      {/* NAVIGATION */}

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => goToQuestion(index - 1)}
          className="
            min-h-10 rounded-full
            border border-slate-200
            bg-white px-5 py-2
            text-sm font-semibold text-slate-700
            transition hover:bg-slate-50
            disabled:opacity-40
          "
        >
          ◀ Trước
        </button>

        <button
          type="button"
          disabled={index >= total - 1}
          onClick={() => goToQuestion(index + 1)}
          className="
            min-h-10 rounded-full
            bg-slate-800 px-5 py-2
            text-sm font-semibold text-white
            transition hover:bg-slate-700
            disabled:opacity-40
          "
        >
          Sau ▶
        </button>
      </div>

    </div>
  );
}
