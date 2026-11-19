import React, { useMemo } from "react";

const isKanji = (char) => /[\p{Script=Han}々〆ヶ]/u.test(char);
const toHiragana = (value = "") =>
  String(value).replace(/[\u30a1-\u30f6]/g, c =>
    String.fromCharCode(c.charCodeAt(0) - 0x60)
  );

function tokenize(text) {
  const result = [];
  for (const char of Array.from(text || "")) {
    const type = isKanji(char) ? "kanji" : "plain";
    const last = result[result.length - 1];
    if (last?.type === type) last.text += char;
    else result.push({ type, text: char });
  }
  return result;
}

/*
 * Aligns kana anchors around kanji blocks. If the reading is ambiguous,
 * falls back to plain written text rather than displaying misleading ruby.
 */
function alignRuby(written, reading) {
  const tokens = tokenize(written);
  const kana = toHiragana(reading);
  if (!tokens.some(t => t.type === "kanji") || !kana) return null;

  const solve = (i, offset) => {
    if (i === tokens.length) return offset === kana.length ? [] : null;
    const token = tokens[i];

    if (token.type === "plain") {
      const anchor = toHiragana(token.text);
      if (!kana.startsWith(anchor, offset)) return null;
      const rest = solve(i + 1, offset + anchor.length);
      return rest ? [{ ...token }, ...rest] : null;
    }

    let nextPlain = "";
    for (let j = i + 1; j < tokens.length; j++) {
      if (tokens[j].type === "plain") {
        nextPlain = toHiragana(tokens[j].text);
        break;
      }
    }

    const ends = [];
    if (!nextPlain) ends.push(kana.length);
    else {
      let at = kana.indexOf(nextPlain, offset + 1);
      while (at !== -1) {
        ends.push(at);
        at = kana.indexOf(nextPlain, at + 1);
      }
    }

    const solutions = [];
    for (const end of ends) {
      if (end <= offset) continue;
      const rest = solve(i + 1, end);
      if (rest) solutions.push([{ ...token, reading: kana.slice(offset, end) }, ...rest]);
      if (solutions.length > 1) break;
    }
    return solutions.length === 1 ? solutions[0] : null;
  };

  return solve(0, 0);
}

export default function JapaneseRubyText({
  kanji,
  hiragana,
  showFurigana = true,
  className = "",
}) {
  const clean = (value) => {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    return ["", "null", "undefined"].includes(trimmed.toLowerCase()) ? "" : trimmed;
  };

  const written = clean(kanji);
  const reading = clean(hiragana);
  const text = written || reading;
  const tokens = useMemo(
    () => showFurigana ? alignRuby(text, reading) : null,
    [text, reading, showFurigana]
  );

  if (!showFurigana || !tokens) {
    return (
      <span className={`text-[var(--flashcard-japanese)] ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <span
      className={`japanese-ruby ${className}`}
    >
      {tokens.map((token, index) =>
        token.type === "kanji" ? (
          <ruby key={index} className="japanese-ruby__item">
            {token.text}
            <rt className="japanese-ruby__reading">
              {token.reading}
            </rt>
          </ruby>
        ) : (
          <React.Fragment key={index}>
            {token.text}
          </React.Fragment>
        )
      )}
    </span>
  );
}
