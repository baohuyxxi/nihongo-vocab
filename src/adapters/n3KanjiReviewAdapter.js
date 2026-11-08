const makeStableId = (itemType, itemId, direction) => {
  if (!itemType || !itemId) {
    return `fallback-${direction || "kanji"}-${Date.now()}`;
  }

  return `${itemType}-${itemId}-${direction || "kanji"}`;
};

const normalizeCard = (item) => {
  const base = item || {};

  return {
    ...base,
    id: base.id || makeStableId(base.itemType, base.itemId, base.direction),
    itemType: base.itemType,
    itemId: base.itemId,
    direction: base.direction || "kanji",
  };
};

const normalizeQuestion = (item) => {
  const base = item || {};

  return {
    ...base,
    id: base.id || makeStableId(base.itemType, base.itemId, base.direction),
    itemType: base.itemType,
    itemId: base.itemId,
    direction: base.direction || "kanji",
  };
};

export const normalizeN3KanjiReviewSession = (payload = {}) => {
  const session = payload?.data ?? payload ?? {};
  const mode = session.mode || "flashcard";

  if (mode === "flashcard") {
    return {
      ...session,
      mode,
      cards: Array.isArray(session.cards)
        ? session.cards.map(normalizeCard)
        : [],
    };
  }

  return {
    ...session,
    mode,
    questions: Array.isArray(session.questions)
      ? session.questions.map(normalizeQuestion)
      : [],
  };
};

export const getN3KanjiSelectionPayload = (selectedPairs = []) => {
  if (!Array.isArray(selectedPairs) || selectedPairs.length === 0) {
    return { weeks: "", days: "" };
  }

  return {
    weeks: [...new Set(selectedPairs.map((pair) => Number(pair.week)).filter(Number.isFinite))]
      .sort((a, b) => a - b)
      .join(","),
    days: [...new Set(selectedPairs.map((pair) => Number(pair.day)).filter(Number.isFinite))]
      .sort((a, b) => a - b)
      .join(","),
  };
};
