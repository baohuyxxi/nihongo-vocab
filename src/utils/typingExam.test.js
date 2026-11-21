import assert from "node:assert/strict";
import test from "node:test";
import {
  applyExamAction,
  commitExamAction,
  countAnswered,
  createExamAttempt,
  formatExamTime,
  getExamInput,
  readExam,
  readExamSnapshot,
  resolveExamConfig,
  saveExamSnapshot,
} from "./typingExam.js";

const questions = [
  { questionId: "a", question: "ăn", answer: "～た べる〜" },
  { questionId: "b", question: "食べる", correct: "たべる" },
  { questionId: "c", question: "ăn", answer: "～た べる〜" },
  { questionId: "d", question: "kana", correct: "駐" },
  { questionId: "e", question: "nghe", correct: "きく" },
];

test("uses Sou Matome only when its lessons are selected in the active curriculum", () => {
  const config = {
    mode: "typing", typingMode: "exam", n3Source: "sou-matome-kanji",
    directions: ["kanji"], n3KanjiPairs: [{ week: 1, day: 2 }],
  };
  const minna = resolveExamConfig({ ...config, curriculumTab: "minna" });
  assert.equal(minna.n3Source, null);
  assert.deepEqual(minna.directions, ["kanji"]);

  const n3 = resolveExamConfig({ ...config, curriculumTab: "n3", n3KanjiPairs: [] });
  assert.equal(n3.n3Source, "mimi-kara");
  assert.deepEqual(n3.directions, ["kanji"]);

  const mixed = resolveExamConfig({ ...config, curriculumTab: "mixed", n3KanjiPairs: [] });
  assert.equal(mixed.n3Source, null);

  const sou = resolveExamConfig({ ...config, curriculumTab: "n3" });
  assert.equal(sou.n3Source, "sou-matome-kanji");
  assert.deepEqual(sou.directions, ["vi_jp"]);
  assert.deepEqual(config.directions, ["kanji"]);
});

const answer = (questionId, ...cells) => ({ type: "answer", questionId, cells });
const makeStorage = () => {
  const records = new Map();
  let writes = 0;
  return {
    getItem: (key) => records.get(key) ?? null,
    setItem: (key, value) => {
      records.set(key, value);
      writes++;
    },
    get writes() { return writes; },
  };
};

test("grades only on submit and handles normalization, partial answers and Japanese IME text", () => {
  const initial = createExamAttempt("one", 10, 1000);
  const actions = [
    answer("a", "ﾀ", "ベ", "ル"),
    answer("b", "た", "", ""),
    answer("d", " 駐 "),
    answer("e", "み", "る"),
  ];
  const attempt = actions.reduce((current, action) => applyExamAction(current, questions, action, 1500), initial);

  assert.equal(getExamInput(questions[0]).emptyCells.length, 3);
  assert.equal(getExamInput(questions[3]).isKana, false);
  assert.equal(attempt.result, null);
  assert.equal(countAnswered(questions, attempt.answers), 3);

  const submitted = applyExamAction(attempt, questions, { type: "submit" }, 2500);
  assert.equal(submitted.status, "submitted");
  assert.deepEqual(submitted.result.items.map(({ status }) => status), [
    "correct", "incorrect", "blank", "correct", "incorrect",
  ]);
  assert.equal(submitted.result.correctCount, 2);
  assert.equal(submitted.result.incorrectCount, 2);
  assert.equal(submitted.result.blankCount, 1);
  assert.equal(submitted.result.scorePercent, 40);
  assert.equal(submitted.result.elapsedMs, 1500);
});

test("restores the saved index, answers and original deadline while isolating another attempt", async (t) => {
  t.mock.method(Date, "now", () => 2000);
  const storage = makeStorage();
  const initial = createExamAttempt("original", 30, 1000);
  await commitExamAction(initial, questions, answer("a", "た", "べ", "る"), storage);
  await commitExamAction(initial, questions, { type: "navigate", index: 2 }, storage);

  const restored = readExam(initial, storage);
  assert.equal(restored.index, 2);
  assert.deepEqual(restored.answers, { a: ["た", "べ", "る"] });
  assert.equal(restored.startedAt, 1000);
  assert.equal(restored.deadlineAt, 1_801_000);
  assert.equal(formatExamTime(restored.deadlineAt - Date.now()), "29:59");
  assert.equal(formatExamTime(60 * 60_000), "60:00");
  assert.deepEqual(readExam(createExamAttempt("new", 20, 2000), storage).answers, {});
});

test("keeps each question snapshot, configuration and deadline fixed when another Exam starts", async () => {
  const storage = makeStorage();
  const first = { config: { mode: "typing", examDurationMinutes: 10 }, session: {
    exam: createExamAttempt("first", 10, 1000), questions,
  } };
  const next = { config: { mode: "typing", examDurationMinutes: 20 }, session: {
    exam: createExamAttempt("next", 20, 2000), questions: [...questions].reverse(),
  } };
  await saveExamSnapshot(first, storage);
  await saveExamSnapshot(next, storage);
  await saveExamSnapshot({ ...next, session: { ...next.session, questions } }, storage);

  assert.deepEqual(readExamSnapshot("first", storage), first);
  assert.deepEqual(readExamSnapshot("next", storage), next);
  assert.equal(storage.writes, 2);
});

test("submits an expired restored attempt once and ignores late edits or duplicate submissions", async (t) => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  const storage = makeStorage();
  const initial = createExamAttempt("expired", 10);
  await commitExamAction(initial, questions, answer("a", "た", "べ", "る"), storage);
  now = initial.deadlineAt + 2500;

  const [automatic, manual, lateEdit] = await Promise.all([
    commitExamAction(initial, questions, { type: "timeout" }, storage),
    commitExamAction(initial, questions, { type: "submit" }, storage),
    commitExamAction(initial, questions, answer("a", "ち", "か", "う"), storage),
  ]);

  assert.equal(storage.writes, 2);
  assert.equal(automatic.submittedAt, initial.deadlineAt);
  assert.equal(automatic.result.elapsedMs, 600_000);
  assert.equal(automatic.result.correctCount, 1);
  assert.deepEqual(manual, automatic);
  assert.deepEqual(lateEdit, automatic);
  assert.deepEqual(readExam(initial, storage), automatic);
});
