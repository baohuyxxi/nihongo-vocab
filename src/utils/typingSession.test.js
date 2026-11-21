import assert from "node:assert/strict";
import test from "node:test";
import {
  getTypingProgressKey,
  identifyTypingSession,
  migrateTypingSnapshot,
} from "./typingSession.js";

const questions = [
  { vocabId: "a", direction: "vi_jp", question: "ăn", answer: "たべる" },
  { vocabId: "a", direction: "kanji", question: "食べる", answer: "たべる" },
  { vocabId: "a", direction: "vi_jp", question: "ăn", answer: "たべる" },
  { vocabId: "b", direction: "vi_jp", question: "dùng bữa", answer: "たべる" },
];

const legacyIds = [
  '[0,"a","vi_jp","ăn","たべる"]',
  '[1,"a","kanji","食べる","たべる"]',
  '[2,"a","vi_jp","ăn","たべる"]',
  '[3,"b","vi_jp","dùng bữa","たべる"]',
];

test("isolates repeated vocabulary, repeated answers and fresh sessions", () => {
  const first = identifyTypingSession({ questions, sessionId: "api-id" });
  const second = identifyTypingSession({ questions, sessionId: "api-id" });
  const ids = first.questions.map(({ questionId }) => questionId);

  assert.equal(new Set(ids).size, questions.length);
  assert.notEqual(getTypingProgressKey(first.typingSessionId), getTypingProgressKey(second.typingSessionId));
  assert.ok(second.questions.every(({ questionId }) => !ids.includes(questionId)));
  assert.deepEqual(
    first.questions,
    questions.map((question, index) => ({ ...question, questionId: ids[index] }))
  );
});

test("migrates a saved Practice snapshot using its exact legacy key", () => {
  const config = { mode: "typing", typingMode: "exam", examDurationMinutes: 20 };
  const snapshot = { config, session: { mode: "typing", sessionId: "legacy-id", questions } };
  const legacyKey = `typingReviewProgress_v6:legacy-id:${JSON.stringify(legacyIds)}`;
  const entries = Object.fromEntries(legacyIds.map((id, index) => [
    id,
    { cells: [String(index), "", ""], hints: [0], lastAttempt: { isCorrect: false } },
  ]));
  const raw = JSON.stringify({ index: 2, completed: true, entries });
  const records = new Map([[legacyKey, raw]]);
  const storage = {
    getItem: (key) => records.get(key) ?? null,
    setItem: (key, value) => records.set(key, value),
  };
  const migrated = migrateTypingSnapshot(snapshot, config, storage);
  const key = getTypingProgressKey(migrated.session.typingSessionId);
  const progress = JSON.parse(records.get(key));

  assert.equal(migrated.config.typingMode, "practice");
  assert.equal(config.typingMode, "exam");
  assert.equal(progress.index, 2);
  assert.equal(progress.completed, true);
  assert.deepEqual(
    migrated.session.questions.map(({ questionId }) => progress.entries[questionId]),
    legacyIds.map((id) => entries[id])
  );
  assert.equal(records.get(legacyKey), raw);
  assert.equal(migrateTypingSnapshot(migrated, config, storage), migrated);
  assert.equal(records.size, 2);
});
