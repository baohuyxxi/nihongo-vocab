import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import KanaAnswerInput from "../../components/JPInput/KanaAnswerInput";
import {
  applyExamAction,
  commitExamAction,
  countAnswered,
  formatExamTime,
  getExamInput,
  getExamKey,
  readExam,
} from "../../utils/typingExam";
import TypingExamResult from "./TypingExamResult";

const BUTTON = "theme-selector-option min-h-11 rounded-xl px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50";
const PRIMARY_BUTTON = "min-h-11 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const SAVE_ERROR = "Không thể lưu bài kiểm tra. Vui lòng thử lại.";

function SubmitDialog({ answered, total, onCancel, onSubmit }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="exam-submit-title"
      onCancel={onCancel}
      className="m-auto w-[calc(100%_-_2rem)] max-w-sm rounded-xl border bg-white p-5 text-gray-900 shadow-xl backdrop:bg-[var(--color-overlay)]"
    >
      <h2 id="exam-submit-title" className="text-lg font-semibold">Nộp bài kiểm tra?</h2>
      <p className="mt-3 text-sm text-gray-700">
        Đã trả lời {answered} câu · Chưa trả lời {total - answered} câu
      </p>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" className={BUTTON} onClick={onCancel}>Hủy</button>
        <button type="button" className={PRIMARY_BUTTON} onClick={onSubmit}>Xác nhận nộp bài</button>
      </div>
    </dialog>
  );
}

export default function TypingExam({ session, onBack }) {
  const { exam, questions } = session;
  const [view, setView] = useState(() => {
    try {
      return { attempt: readExam(exam), error: "" };
    } catch {
      return { attempt: exam, error: SAVE_ERROR };
    }
  });
  const { attempt, error } = view;
  const answered = useMemo(() => countAnswered(questions, attempt.answers), [questions, attempt.answers]);
  const [now, setNow] = useState(Date.now);
  const [confirming, setConfirming] = useState(false);
  const pending = useRef(0);
  const timeoutRequested = useRef(false);

  const run = useCallback(async (action) => {
    pending.current++;
    const eventTime = Date.now();
    if (eventTime < exam.deadlineAt && (action.type === "answer" || action.type === "navigate")) {
      setView((previous) => ({
        ...previous,
        attempt: applyExamAction(previous.attempt, questions, action, eventTime),
      }));
    }

    try {
      const saved = await commitExamAction(exam, questions, action);
      if (pending.current === 1 || saved.status === "submitted") {
        setView({ attempt: saved, error: "" });
      }
    } catch {
      setView((previous) => ({ ...previous, error: SAVE_ERROR }));
    } finally {
      pending.current--;
    }
  }, [exam, questions]);

  useEffect(() => {
    if (attempt.status === "submitted") return;

    const tick = () => {
      const time = Date.now();
      setNow(time);
      if (time >= exam.deadlineAt && !timeoutRequested.current) {
        timeoutRequested.current = true;
        void run({ type: "timeout" });
      }
    };
    const refresh = (event) => {
      if (event.type === "storage" && event.key !== getExamKey(exam.examSessionId)) return;
      if (!pending.current) {
        try {
          setView({ attempt: readExam(exam), error: "" });
        } catch {
          setView((previous) => ({ ...previous, error: SAVE_ERROR }));
        }
      }
      tick();
    };

    const interval = window.setInterval(tick, 1000);
    const deadline = window.setTimeout(tick, Math.max(0, exam.deadlineAt - Date.now()));
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(deadline);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [attempt.status, exam, run]);

  if (attempt.status === "submitted") {
    return <TypingExamResult attempt={attempt} questions={questions} onBack={onBack} />;
  }

  const remaining = Math.max(0, exam.deadlineAt - now);
  const index = Math.min(attempt.index, questions.length - 1);
  const question = questions[index];
  const { isKana, emptyCells } = getExamInput(question);
  const cells = attempt.answers[question.questionId] ?? emptyCells;
  const changeAnswer = (nextCells) => {
    void run({ type: "answer", questionId: question.questionId, cells: nextCells });
  };
  const showDialog = confirming && remaining > 0;

  return (
    <section aria-label="Bài kiểm tra điền từ" className="min-w-0 space-y-4 p-1 sm:p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">Câu {index + 1}/{questions.length}</p>
          <p className="text-sm text-gray-600">Đã trả lời {answered}/{questions.length}</p>
        </div>
        <div className={`rounded-lg px-3 py-2 text-right ${remaining < 300_000
          ? "bg-amber-50 text-amber-700"
          : "bg-gray-100 text-gray-900"}`}>
          <p role="timer" aria-label="Thời gian còn lại" className="font-semibold tabular-nums">
            {formatExamTime(remaining)}
          </p>
          {remaining < 300_000 && (
            <p role="status" className="text-xs">
              {remaining === 0 ? "Đã hết giờ" : "Còn dưới 5 phút"}
            </p>
          )}
        </div>
      </div>
      <div className="min-w-0 rounded-xl border border-gray-200 p-3 text-center sm:p-5">
        <h2 className="mb-4 whitespace-pre-wrap break-words text-xl font-semibold text-gray-900 sm:text-2xl">
          {question.question}
        </h2>
        {isKana ? (
          <KanaAnswerInput
            key={question.questionId}
            cells={cells}
            onChange={changeAnswer}
            showActions={false}
            disabled={remaining === 0}
          />
        ) : (
          <input
            key={question.questionId}
            type="text"
            lang="ja"
            aria-label="Đáp án"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={remaining === 0}
            value={cells[0] ?? ""}
            onChange={(event) => changeAnswer([event.target.value])}
            className="min-h-11 w-full max-w-md rounded-xl border border-gray-300 bg-white px-3 py-2 text-center text-base text-gray-900"
          />
        )}
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={BUTTON}
            disabled={index === 0 || remaining === 0}
            onClick={() => void run({ type: "navigate", index: index - 1 })}
          >
            Trước
          </button>
          <button
            type="button"
            className={BUTTON}
            disabled={index === questions.length - 1 || remaining === 0}
            onClick={() => void run({ type: "navigate", index: index + 1 })}
          >
            Sau
          </button>
        </div>
        <button
          type="button"
          className={PRIMARY_BUTTON}
          disabled={remaining === 0 && !error}
          onClick={() => {
            if (remaining === 0) void run({ type: "timeout" });
            else setConfirming(true);
          }}
        >
          {remaining === 0 && error ? "Thử nộp lại" : "Nộp bài"}
        </button>
      </div>
      {showDialog && (
        <SubmitDialog
          answered={answered}
          total={questions.length}
          onCancel={() => setConfirming(false)}
          onSubmit={() => {
            setConfirming(false);
            void run({ type: "submit" });
          }}
        />
      )}
    </section>
  );
}
