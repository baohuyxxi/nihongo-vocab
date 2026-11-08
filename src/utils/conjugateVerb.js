import { godanMap } from "./godanMap.js"

export const VERB_GROUP_MAP = {
  verb_g_1: 1,
  verb_g_2: 2,
  verb_g_3: 3,
}

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : ""
}

function conjugateIchidan(verb) {
  const normalized = toTrimmedString(verb)

  if (!normalized) return null

  if (normalized.endsWith("ます")) {
    const stem = normalized.slice(0, -2)

    return {
      dictionary: stem + "る",
      masu: normalized,
      te: stem + "て",
      ta: stem + "た",
      nai: stem + "ない",
      potential: stem + "られる",
      volitional: stem + "よう",
      imperative: stem + "ろ",
      conditionalBa: stem + "れば",
      conditionalTara: stem + "たら",
      prohibition: stem + "るな",
      passive: stem + "られる",
      causative: stem + "させる",
    }
  }

  if (normalized.endsWith("る")) {
    const stem = normalized.slice(0, -1)

    return {
      dictionary: normalized,
      masu: stem + "ます",
      te: stem + "て",
      ta: stem + "た",
      nai: stem + "ない",
      potential: stem + "られる",
      volitional: stem + "よう",
      imperative: stem + "ろ",
      conditionalBa: stem + "れば",
      conditionalTara: stem + "たら",
      prohibition: stem + "るな",
      passive: stem + "られる",
      causative: stem + "させる",
    }
  }

  return null
}

function conjugateKuru(verb, kanji = "") {
  const normalized = toTrimmedString(verb)

  if (!normalized) return null

  const isKuru =
    normalized === "くる" ||
    normalized === "来る" ||
    normalized === "きます" ||
    normalized === "来ます" ||
    (kanji && /来/.test(kanji))

  if (!isKuru) return null

  return {
    dictionary: "くる",
    masu: "きます",
    te: "きて",
    ta: "きた",
    nai: "こない",
    potential: "こられる",
    volitional: "こよう",
    imperative: "こい",
    conditionalBa: "くれば",
    conditionalTara: "きたら",
    prohibition: "くるな",
    passive: "こられる",
    causative: "こさせる",
  }
}

function conjugateSuru(verb, kanji = "") {
  const normalized = toTrimmedString(verb)

  if (!normalized) return null

  if (
    normalized === "きます" ||
    normalized === "来ます" ||
    normalized === "くる" ||
    normalized === "来る" ||
    (kanji && /来/.test(kanji))
  ) {
    return conjugateKuru(normalized, kanji)
  }

  if (normalized === "できます" || normalized === "できる") {
    return null
  }

  if (normalized.endsWith("ます")) {
    const stem = normalized.endsWith("します")
      ? normalized.slice(0, -3)
      : normalized.slice(0, -2)

    return {
      dictionary: stem + "する",
      masu: normalized,
      te: stem + "して",
      ta: stem + "した",
      nai: stem + "しない",
      potential: stem + "できる",
      volitional: stem + "しよう",
      imperative: stem + "しろ",
      conditionalBa: stem + "すれば",
      conditionalTara: stem + "したら",
      prohibition: stem + "するな",
      passive: stem + "される",
      causative: stem + "させる",
    }
  }

  if (normalized === "する" || normalized.endsWith("する")) {
    const stem = normalized.replace(/する$/, "")

    return {
      dictionary: normalized,
      masu: stem + "します",
      te: stem + "して",
      ta: stem + "した",
      nai: stem + "しない",
      potential: stem + "できる",
      volitional: stem + "しよう",
      imperative: stem + "しろ",
      conditionalBa: stem + "すれば",
      conditionalTara: stem + "したら",
      prohibition: stem + "するな",
      passive: stem + "される",
      causative: stem + "させる",
    }
  }

  return null
}

const IKU_SPECIAL = {
  dictionary: "いく",
  masu: "いきます",
  te: "いって",
  ta: "いった",
  nai: "いかない",
  potential: "いける",
  volitional: "いこう",
  imperative: "いけ",
  conditionalBa: "いけば",
  conditionalTara: "いったら",
  prohibition: "いくな",
  passive: "いかれる",
  causative: "いかせる",
}

const ARIMASU_SPECIAL = {
  dictionary: "ある",
  masu: "あります",
  te: "あって",
  ta: "あった",
  nai: "ない",
  potential: "ありえる",
  volitional: "あろう",
  imperative: "あれ",
  conditionalBa: "あれば",
  conditionalTara: "あったら",
  prohibition: "あるな",
  passive: "—",
  causative: "あらせる",
}

function conjugateGodan(verb) {
  const normalized = toTrimmedString(verb)

  if (!normalized) return null

  if (normalized === "いきます") return IKU_SPECIAL
  if (normalized === "あります") return ARIMASU_SPECIAL

  if (normalized.endsWith("ます")) {
    const stem = normalized.slice(0, -2)
    const base = stem.slice(0, -1)
    const ending = stem.slice(-1)
    const map = godanMap[ending]

    if (!map) return null

    return {
      dictionary: base + map.d,
      masu: normalized,
      te: base + map.te,
      ta: base + map.ta,
      nai: base + map.a + "ない",
      potential: base + map.e + "る",
      volitional: base + map.o + "う",
      imperative: base + map.e,
      conditionalBa: base + map.e + "ば",
      conditionalTara: base + map.ta + "ら",
      prohibition: base + map.d + "な",
      passive: base + map.a + "れる",
      causative: base + map.a + "せる",
    }
  }

  const ending = normalized.slice(-1)
  const map = godanMap[ending]

  if (!map) return null

  const stem = normalized.slice(0, -1)

  return {
    dictionary: normalized,
    masu: stem + map.i + "ます",
    te: stem + map.te,
    ta: stem + map.ta,
    nai: stem + map.a + "ない",
    potential: stem + map.e + "る",
    volitional: stem + map.o + "う",
    imperative: stem + map.e,
    conditionalBa: stem + map.e + "ば",
    conditionalTara: stem + map.ta + "ら",
    prohibition: stem + map.d + "な",
    passive: stem + map.a + "れる",
    causative: stem + map.a + "せる",
  }
}

export function conjugateVerb(vocabOrHiragana, maybeGroup) {
  if (typeof vocabOrHiragana === "string") {
    const verb = toTrimmedString(vocabOrHiragana)
    const group = maybeGroup

    if (!verb || ![1, 2, 3].includes(group)) return null

    if (group === 3) {
      return conjugateSuru(verb)
    }

    if (group === 2) {
      return conjugateIchidan(verb)
    }

    return conjugateGodan(verb)
  }

  const item = vocabOrHiragana || {}
  const verb = toTrimmedString(item.hiragana)

  if (!verb) return null

  const group = VERB_GROUP_MAP[item.partOfSpeech]

  if (!group) return null

  const kanji = toTrimmedString(item.kanji)

  if (group === 3) {
    return conjugateSuru(verb, kanji)
  }

  if (group === 2) {
    return conjugateIchidan(verb)
  }

  return conjugateGodan(verb)
}
