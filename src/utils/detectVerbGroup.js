// src/utils/japanese/detectVerbGroup.js

// =====================
// SPECIAL NHÓM 3
// =====================

const GROUP3_SPECIAL = [
  "来ます",
]

// =====================
// SPECIAL NHÓM 2
// =====================

const GROUP2_SPECIAL = [
  "います",
  "居ます",

  "おきます",
  "起きます",

  "降ります",
  "おります",

  "かります",
  "借ります",

  "おびます",
  "帯びます",

  "みます",
  "見ます",

  "たります",
  "足ります",

  "にます",
  "煮ます",
  "似ます",

  "できます",
]

// =====================
// ÂM E
// =====================

const E_SOUNDS = [
  "え",
  "け",
  "げ",
  "せ",
  "ぜ",
  "て",
  "で",
  "ね",
  "へ",
  "べ",
  "ぺ",
  "め",
  "れ",
]
const I_SOUNDS = [
  "い",
  "き",
  "ぎ",
  "し",
  "じ",
  "ち",
  "ぢ",
  "に",
  "ひ",
  "び",
  "ぴ",
  "み",
  "り",
]

// =====================
// ĐẾM KANJI
// =====================

function countKanji(text) {
  const matches = text.match(/[\u4E00-\u9FFF]/g)
  return matches ? matches.length : 0
}

// =====================
// MAIN
// =====================

export function detectVerbGroup(input) {
  const verb = input.hiragana.trim()
  const kanji = input.kanji ? input.kanji.trim() : null
  if (!verb) return null

  // chỉ xử lý masu
  if (!verb.endsWith("ます")) {
    return null
  }

  // =====================
  // NHÓM 3
  // =====================

  // 来ます
  if (kanji && GROUP3_SPECIAL.includes(kanji)) {
    return 3
  }

  // します
  if (verb === "します") {
    return 3
  }

  // 2 kanji + します
  //
  // 勉強します
  // 結婚します
  // 運動します
  // 出発します
  //
  if (kanji &&
    kanji.endsWith("します") &&
    countKanji(kanji) >= 2
  ) {
    return 3
  }

  // =====================
  // NHÓM 2 ĐẶC BIỆT
  // =====================

  if (kanji && GROUP2_SPECIAL.includes(kanji) || !kanji && GROUP2_SPECIAL.includes(verb)) {
    return 2
  }

  // =====================
  // NHÓM 2
  // âm E trước ます
  // =====================

  const stem = verb.replace("ます", "")


  const lastKana = stem.slice(-1)


  if (E_SOUNDS.includes(lastKana)) {
    return 2
  }

  if (I_SOUNDS.includes(lastKana)) {
    return 1
  }
  return 4
}