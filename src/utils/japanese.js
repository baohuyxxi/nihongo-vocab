// src/utils/japanese.js

// Loại hiragana + katakana, chỉ giữ kanji
export const extractKanji = (text = "") => {
  return text.replace(/[ぁ-んァ-ンー]/g, "")
}


export function removeKana(text = "") {
  // Hiragana: \u3040-\u309F
  // Katakana: \u30A0-\u30FF
  return text.replace(/[\u3040-\u309F\u30A0-\u30FF]/g, "")
}
