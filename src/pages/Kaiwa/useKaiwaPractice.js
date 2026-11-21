import { useEffect, useRef, useState } from "react";
import {
  completePractice, createPractice, getPractice, isInvalidPractice, kaiwaError, kaiwaStatus, saveAssessment,
} from "../../services/kaiwaApi";
import { isExpired, practiceKey, readStored, writeStored } from "./kaiwaState";

const EXPIRED = "Phiên luyện tập đã hết hạn hoặc không còn hợp lệ. Bạn có thể bắt đầu phiên mới.";
const STORED_WARNING = "Không lưu được phiên trong tab này. Hãy hoàn thành trước khi tải lại.";

function initialIndex(session, savedIndex) {
  const index = savedIndex ?? session.currentIndex;
  return Math.min(Math.max(0, index), session.questions.length - 1);
}

export default function useKaiwaPractice(textbook, lesson) {
  const key = practiceKey(textbook, lesson);
  const [initial] = useState(() => readStored(sessionStorage, key));
  const record = useRef(initial);
  const mutation = useRef(null);
  const [session, setSession] = useState(null);
  const [drafts, setDrafts] = useState(initial?.drafts ?? {});
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [checking, setChecking] = useState(Boolean(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [retryCheck, setRetryCheck] = useState(0);

  useEffect(() => {
    const saved = record.current;
    if (!saved) return;
    const controller = new AbortController();

    async function lookup() {
      try {
        if (isExpired(saved)) {
          await Promise.resolve();
          if (controller.signal.aborted) return;
          record.current = null;
          writeStored(sessionStorage, key, null);
          setError(EXPIRED);
          return;
        }
        const restored = await getPractice(saved, controller.signal);
        if (controller.signal.aborted) return;
        setSession(restored);
        setIndex(initialIndex(restored, saved.index));
      } catch (failure) {
        if (controller.signal.aborted) return;
        if (isInvalidPractice(failure)) {
          record.current = null;
          writeStored(sessionStorage, key, null);
          setError(EXPIRED);
        } else {
          setError(kaiwaError(failure));
        }
      } finally {
        if (!controller.signal.aborted) setChecking(false);
      }
    }

    void lookup();
    return () => controller.abort();
  }, [key, retryCheck]);

  useEffect(() => () => mutation.current?.abort(), []);

  function persist(next) {
    record.current = next;
    setWarning(writeStored(sessionStorage, key, next) ? "" : STORED_WARNING);
  }

  function navigate(nextIndex) {
    setIndex(nextIndex);
    if (record.current) persist({ ...record.current, index: nextIndex });
  }

  function draft(questionId, value) {
    const next = { ...record.current.drafts, [questionId]: value };
    setDrafts(next);
    persist({ ...record.current, drafts: next });
  }

  async function run(operation) {
    if (mutation.current) return;
    const controller = new AbortController();
    mutation.current = controller;
    setSaving(true);
    setError("");
    try {
      await operation(controller.signal);
    } catch (failure) {
      if (controller.signal.aborted) return;
      if (record.current && isInvalidPractice(failure)) {
        persist(null);
        setSession(null);
        setActive(false);
        setError(EXPIRED);
      } else {
        setError(kaiwaError(failure));
      }
    } finally {
      mutation.current = null;
      if (!controller.signal.aborted) setSaving(false);
    }
  }

  function start() {
    return run(async (signal) => {
      // A failed creation must not invalidate a previously saved session.
      let created;
      try {
        created = await createPractice({ textbook, lessons: [lesson], source: "all", limit: 10 }, signal);
      } catch (failure) {
        if (!signal.aborted) setError(kaiwaError(failure));
        return;
      }
      if (signal.aborted) return;
      const { accessToken: token, ...data } = created;
      if (!data.sessionId || !token) throw new Error("Invalid practice response");
      persist({ sessionId: data.sessionId, token, startedAt: data.startedAt, drafts: {}, index: 0 });
      setSession(data);
      setDrafts({});
      setIndex(0);
      setActive(true);
    });
  }

  function assess(questionId, selfAssessment) {
    return run(async (signal) => {
      const saved = record.current;
      let updated;
      try {
        updated = await saveAssessment(saved, {
          questionId, selfAssessment, userAnswer: saved.drafts[questionId] ?? "",
        }, signal);
      } catch (failure) {
        if (signal.aborted || kaiwaStatus(failure) !== 409) throw failure;
        updated = await getPractice(saved, signal);
        if (signal.aborted) return;
        setError("Đã đồng bộ phiên với máy chủ.");
        if (!updated.answers.some((answer) => answer.questionId === questionId)) {
          setSession(updated);
          return;
        }
      }
      if (signal.aborted) return;
      setSession(updated);
      const answered = new Set(updated.answers.map((answer) => answer.questionId));
      const later = updated.questions.findIndex((question, i) => i > index && !answered.has(question._id));
      navigate(later >= 0 ? later : initialIndex(updated));
    });
  }

  function complete() {
    return run(async (signal) => {
      const saved = record.current;
      try {
        const updated = await completePractice(saved, signal);
        if (!signal.aborted) setSession(updated);
      } catch (failure) {
        if (signal.aborted || kaiwaStatus(failure) !== 409) throw failure;
        const updated = await getPractice(saved, signal);
        if (signal.aborted) return;
        setSession(updated);
        navigate(initialIndex(updated));
        if (updated.status !== "completed") setError("Đã đồng bộ phiên. Hãy tự đánh giá các câu còn lại.");
      }
    });
  }

  return {
    session, checking, saving, error, warning, active, index, drafts,
    canRetryLookup: Boolean(initial && !session && !checking && record.current),
    retryLookup() {
      setError("");
      setChecking(true);
      setRetryCheck((value) => value + 1);
    },
    start, assess, complete, navigate, draft,
    resume: () => {
      setError("");
      setActive(true);
    },
  };
}
