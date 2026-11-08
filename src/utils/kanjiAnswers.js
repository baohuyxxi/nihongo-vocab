import { toHiragana } from 'wanakana';
export function normalizeKanjiAnswer(value, kind) {
  const text = String(value).normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
  // Only remove okurigana separator dots. Never strip kana or accept a stem alone.
  return kind === 'kana' ? toHiragana(text.replace(/[.．]/g, ''), { passRomaji: true }) : text;
}
export function acceptsKanjiAnswer(input, q) {
  return !!input.trim() && q.answers.some(a => normalizeKanjiAnswer(a, q.answerKind) === normalizeKanjiAnswer(input, q.answerKind));
}
