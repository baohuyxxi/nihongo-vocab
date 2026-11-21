const TTL = 30 * 24 * 60 * 60 * 1000;

export function readStored(storage, key, fallback = null) {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(storage, key, value) {
  try {
    if (value === null) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const practiceKey = (textbook, lesson) => `kaiwa.practice.v1:${textbook}:${lesson}`;
export const isExpired = (record, now = Date.now()) =>
  !Number.isFinite(Date.parse(record?.startedAt)) || now - Date.parse(record.startedAt) >= TTL;

export function availableLessons(dialogues, questions) {
  return [...new Set([...dialogues, ...questions].map(({ lesson }) => lesson))]
    .filter((lesson) => Number.isSafeInteger(lesson) && lesson > 0)
    .sort((a, b) => a - b);
}

export function practiceCounts(answers) {
  const known = answers.filter(({ selfAssessment }) => selfAssessment === "known").length;
  return { known, retry: answers.length - known };
}
