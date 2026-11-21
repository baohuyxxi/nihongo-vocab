import { toHiragana } from "wanakana";

export const getExpectedAnswer = (question) => question.answer || question.correct || "";
export const stripAnswerMarkers = (value) =>
  String(value).normalize("NFKC").replace(/[~〜～]/g, "");

export function getAnswerCells(question) {
  if (Array.isArray(question.answerCells) && question.answerCells.length) {
    return question.answerCells.filter((cell) => !/[~〜～]/.test(String(cell)));
  }

  return Array.from(
    stripAnswerMarkers(getExpectedAnswer(question)).trim()
  );
}

export const normalizeKana = (value = "") =>
  toHiragana(stripAnswerMarkers(value).replace(/\s+/g, "").trim());
