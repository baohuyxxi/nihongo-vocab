export const isHiragana = (text = "") =>
  /^[\u3040-\u309Fー。[ ] ～ ]+$/.test(text)

export const isKatakana = (text = "") =>
  /^[\u30A0-\u30FFー。[ ] ～ ]+$/.test(text)
  