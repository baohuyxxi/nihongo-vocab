import { getExpectedAnswer, normalizeKana, stripAnswerMarkers } from "./typingAnswers.js";

const KANA_ANSWER = /^[\u3040-\u309f\u30a0-\u30ff]+$/u;

export const isSouMatomeExam = ({ mode, typingMode, n3Source }) =>
  mode === "typing" && typingMode === "exam" && n3Source === "sou-matome-kanji";

export function resolveExamConfig(config) {
  if (!config || config.mode !== "typing" || config.typingMode !== "exam") return config;

  if (config.curriculumTab === "minna") return { ...config, n3Source: null };

  if (config.n3Source === "sou-matome-kanji" && config.n3KanjiPairs?.length) {
    return { ...config, directions: ["vi_jp"] };
  }

  return {
    ...config,
    n3Source: config.curriculumTab === "n3" || config.n3Source === "mimi-kara"
      ? "mimi-kara"
      : null,
  };
}

export function getExamInput(question) {
  const expected = stripAnswerMarkers(getExpectedAnswer(question)).replace(/\s+/gu, "");
  const isKana = KANA_ANSWER.test(expected);
  return { isKana, emptyCells: Array(isKana ? Array.from(expected).length : 1).fill("") };
}

export function createExamAttempt(examSessionId, durationMinutes, startedAt = Date.now()) {
  return {
    examSessionId,
    durationMinutes,
    startedAt,
    deadlineAt: startedAt + durationMinutes * 60_000,
    status: "in_progress",
    index: 0,
    answers: {},
    submittedAt: null,
    result: null,
  };
}

export const getExamKey = (id) => `typingExam:${id}`;
const getExamSnapshotKey = (id) => `typingExamSnapshot:${id}`;

export function saveExamSnapshot(snapshot, storage = localStorage) {
  const id = snapshot.session.exam.examSessionId;
  const key = getExamSnapshotKey(id);
  return withExamLock(key, () => {
    const current = readExamSnapshot(id, storage);
    if (current) return current;

    storage.setItem(key, JSON.stringify(snapshot));
    return snapshot;
  });
}

export function readExamSnapshot(examSessionId, storage = localStorage) {
  try {
    const snapshot = JSON.parse(storage.getItem(getExamSnapshotKey(examSessionId)));
    return snapshot?.session?.exam?.examSessionId === examSessionId ? snapshot : null;
  } catch {
    return null;
  }
}

export function readExam(attempt, storage = localStorage) {
  const raw = storage.getItem(getExamKey(attempt.examSessionId));
  if (raw === null) return attempt;

  const saved = JSON.parse(raw);
  if (
    saved?.examSessionId !== attempt.examSessionId ||
    !["in_progress", "submitted"].includes(saved.status) ||
    !Number.isSafeInteger(saved.index) ||
    saved.index < 0 ||
    !saved.answers ||
    (saved.status === "submitted" && !Array.isArray(saved.result?.items))
  ) {
    throw new Error("Invalid saved exam");
  }

  return {
    ...saved,
    durationMinutes: attempt.durationMinutes,
    startedAt: attempt.startedAt,
    deadlineAt: attempt.deadlineAt,
  };
}

const hasText = (cell) => Boolean(normalizeKana(cell));
const isComplete = (cells, question) =>
  cells?.length === getExamInput(question).emptyCells.length && cells.every(hasText);

export const countAnswered = (questions, answers) =>
  questions.filter((question) => isComplete(answers[question.questionId], question)).length;

function gradeExam(questions, answers) {
  let correctCount = 0;
  let blankCount = 0;
  const items = questions.map((question) => {
    const cells = answers[question.questionId] ?? [];
    const userAnswer = cells.join("");
    const expected = getExpectedAnswer(question);
    let status = "incorrect";
    if (!cells.some(hasText)) {
      blankCount++;
      status = "blank";
    } else if (isComplete(cells, question) && normalizeKana(userAnswer) === normalizeKana(expected)) {
      correctCount++;
      status = "correct";
    }
    return { questionId: question.questionId, userAnswer, expected, status };
  });

  const totalQuestions = questions.length;
  return {
    items,
    totalQuestions,
    correctCount,
    blankCount,
    incorrectCount: totalQuestions - correctCount - blankCount,
    scorePercent: totalQuestions ? (correctCount / totalQuestions) * 100 : 0,
  };
}

export function applyExamAction(attempt, questions, action, now) {
  if (attempt.status === "submitted") return attempt;

  if (now >= attempt.deadlineAt || action.type === "submit") {
    const submittedAt = Math.min(Math.max(now, attempt.startedAt), attempt.deadlineAt);
    return {
      ...attempt,
      status: "submitted",
      submittedAt,
      result: {
        ...gradeExam(questions, attempt.answers),
        elapsedMs: submittedAt - attempt.startedAt,
      },
    };
  }

  if (action.type === "navigate") {
    const index = Math.max(0, Math.min(action.index, questions.length - 1));
    return { ...attempt, index };
  }

  if (action.type === "answer") {
    return { ...attempt, answers: { ...attempt.answers, [action.questionId]: action.cells } };
  }

  return attempt;
}

function withExamLock(key, commit) {
  return globalThis.navigator?.locks
    ? navigator.locks.request(key, commit)
    : Promise.resolve().then(commit);
}

export function commitExamAction(attempt, questions, action, storage = localStorage) {
  const key = getExamKey(attempt.examSessionId);
  return withExamLock(key, () => {
    const current = readExam(attempt, storage);
    const next = applyExamAction(current, questions, action, Date.now());
    if (next !== current) storage.setItem(key, JSON.stringify(next));
    return next;
  });
}

export function formatExamTime(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
