export const getTypingProgressKey = (sessionId) =>
  `typingReviewProgress_v7:${sessionId}`;

export function createTypingSessionId() {
  return crypto.randomUUID?.() ??
    Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
}

export function identifyTypingSession(session, sessionId = createTypingSessionId()) {
  return {
    ...session,
    mode: "typing",
    typingSessionId: sessionId,
    questions: (session.questions ?? []).map((question, index) => ({
      ...question,
      questionId: `${sessionId}:${index}`,
    })),
  };
}

function getLegacyQuestionId(question, index) {
  return JSON.stringify([
    index,
    String(question.vocabId || question.id || question._id || "unknown"),
    String(question.direction || "unknown"),
    String(question.question || ""),
    String(question.answer || question.correct || ""),
  ]);
}

export function migrateTypingSnapshot(snapshot, config, storage = localStorage) {
  const previous = snapshot.session;
  if (previous.typingSessionId) return snapshot;

  const session = identifyTypingSession(previous);
  const legacySessionKey =
    previous.reviewId || previous.sessionId || config.reviewId ||
    `typing-${config.n3Source || "minna"}-${JSON.stringify({
      lessons: config.lessons || [],
      topics: config.topics || [],
      units: config.units || [],
      n3Topics: config.n3Topics || [],
      directions: config.directions || [],
    })}`;
  const legacyIds = session.questions.map(getLegacyQuestionId);
  const legacyKey = `typingReviewProgress_v6:${legacySessionKey}:${JSON.stringify(legacyIds)}`;
  const raw = storage.getItem(legacyKey);
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    // An unreadable record is retained for manual recovery.
  }

  if (saved && typeof saved === "object") {
    const storageKey = getTypingProgressKey(session.typingSessionId);
    const entries = {};
    session.questions.forEach(({ questionId }, index) => {
      const entry = saved.entries?.[legacyIds[index]];
      if (entry) entries[questionId] = entry;
    });
    storage.setItem(storageKey, JSON.stringify({ ...saved, storageKey, entries }));
  }

  // Before Exam existed, all saved Typing sessions ran as Practice.
  return { ...snapshot, config: { ...config, typingMode: "practice" }, session };
}
