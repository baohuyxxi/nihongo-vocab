// src/utils/normalizeVerb.js

const GROUP2_MASU = [
  "みます",
  "おります",
  "おきます",
  "たべます",
  "できます",
  "ねます",
  "あびます",
  "います",
]

const GROUP2_TE = [
  "みて",
  "おりて",
  "おきて",
  "たべて",
  "できて",
  "ねて",
]

const GROUP2_TA = [
  "みた",
  "おりた",
  "おきた",
  "たべた",
  "できた",
  "ねた",
]

const masuMap = {
  います: "う",
  きます: "く",
  ぎます: "ぐ",
  します: "す",
  ちます: "つ",
  にます: "ぬ",
  びます: "ぶ",
  みます: "む",
  ります: "る",
}

const teMap = {
  って: "う",
  いて: "く",
  いで: "ぐ",
  して: "す",
  んで: "む",
}

const taMap = {
  った: "う",
  いた: "く",
  いだ: "ぐ",
  した: "す",
  んだ: "む",
}

export function normalizeVerb(input) {
  if (!input) return ""

  input = input.trim()

  // =====================
  // IKU
  // =====================

  if (input === "いきます") return "いく"
  if (input === "いって") return "いく"
  if (input === "いった") return "いく"
  if (input === "いこう") return "いく"
  if (input === "いかない") return "いく"

  // =====================
  // KURU
  // =====================

  if (input === "きます") return "くる"
  if (input === "きて") return "くる"
  if (input === "きた") return "くる"
  if (input === "こない") return "くる"
  if (input === "こよう") return "くる"

  // =====================
  // SURU
  // =====================

  if (input === "します") return "する"
  if (input === "して") return "する"
  if (input === "した") return "する"
  if (input === "しない") return "する"
  if (input === "しよう") return "する"

  // =====================
  // GROUP 2 MASU
  // =====================

  if (GROUP2_MASU.includes(input)) {
    return input.slice(0, -2) + "る"
  }

  // =====================
  // GROUP 2 TE
  // =====================

  if (GROUP2_TE.includes(input)) {
    return input.slice(0, -1) + "る"
  }

  // =====================
  // GROUP 2 TA
  // =====================

  if (GROUP2_TA.includes(input)) {
    return input.slice(0, -1) + "る"
  }

  // =====================
  // MASU
  // =====================

  for (const key in masuMap) {
    if (input.endsWith(key)) {
      return (
        input.slice(0, -key.length) +
        masuMap[key]
      )
    }
  }

  // =====================
  // TE
  // =====================

  for (const key in teMap) {
    if (input.endsWith(key)) {
      return (
        input.slice(0, -key.length) +
        teMap[key]
      )
    }
  }

  // =====================
  // TA
  // =====================

  for (const key in taMap) {
    if (input.endsWith(key)) {
      return (
        input.slice(0, -key.length) +
        taMap[key]
      )
    }
  }

  // =====================
  // NAI
  // =====================

  if (input.endsWith("ない")) {
    const stem = input.slice(0, -2)

    const naiMap = {
      わ: "う",
      か: "く",
      が: "ぐ",
      さ: "す",
      た: "つ",
      な: "ぬ",
      ば: "ぶ",
      ま: "む",
      ら: "る",
    }

    const last = stem.slice(-1)

    if (naiMap[last]) {
      return (
        stem.slice(0, -1) +
        naiMap[last]
      )
    }

    return stem + "る"
  }

  // =====================
  // VOLITIONAL
  // =====================

  if (input.endsWith("よう")) {
    return input.slice(0, -2) + "る"
  }

  const volitionalMap = {
    おう: "う",
    こう: "く",
    ごう: "ぐ",
    そう: "す",
    とう: "つ",
    のう: "ぬ",
    ぼう: "ぶ",
    もう: "む",
    ろう: "る",
  }

  for (const key in volitionalMap) {
    if (input.endsWith(key)) {
      return (
        input.slice(0, -key.length) +
        volitionalMap[key]
      )
    }
  }

  // =====================
  // POTENTIAL
  // =====================

  if (input.endsWith("られる")) {
    return input.slice(0, -3) + "る"
  }

  if (input.endsWith("える")) {
    const stem = input.slice(0, -2)

    const last = stem.slice(-1)

    const reversePotential = {
      え: "う",
      け: "く",
      げ: "ぐ",
      せ: "す",
      て: "つ",
      ね: "ぬ",
      べ: "ぶ",
      め: "む",
      れ: "る",
    }

    if (reversePotential[last]) {
      return (
        stem.slice(0, -1) +
        reversePotential[last]
      )
    }
  }

  return input
}