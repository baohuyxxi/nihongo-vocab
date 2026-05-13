import { godanMap } from "./godanMap"

// =====================
// SPECIAL
// =====================



// =====================
// GROUP 2
// =====================

function conjugateIchidan(verb) {
  const stem = verb.slice(0, -2)

  return {
    dictionary: stem + "る",
    masu: verb,
    te: stem + "て",
    ta: stem + "た",
    nai: stem + "ない",
    potential: stem + "られます",
    volitional: stem + "よう",
    imperative: stem + "ろ",
  }
}

// =====================
// GROUP 3
// =====================
const SPECIAL_GROUP3_VERBS = ["きます"]
function conjugateKuru() {
  return {
    dictionary: "くる",
    masu: "きます",
    te: "きて",
    ta: "きた",
    nai: "こない",
    potential: "こられる",
    volitional: "こよう",
    imperative: "こい",
  }
}
function conjugateSuru(verb) {

  if (SPECIAL_GROUP3_VERBS.includes(verb)) {
    return conjugateKuru()
  }

  const stem = verb.replace("します", "")

  return {
    dictionary: stem + "する",
    masu: verb,
    te: stem + "して",
    ta: stem + "した",
    nai: stem + "しない",
    potential: stem + "でききます",
    volitional: stem + "しよう",
    imperative: stem + "しろ",
  }
}



// =====================
// GROUP 1 (GODAN)
// =====================
// いく (行く) exception
const IKU_SPECIAL = {
  dictionary: "いく",
  masu: "いきます",
  te: "いって",
  ta: "いった",
  nai: "いかない",
  potential: "いける",
  volitional: "いこう",
  imperative: "いけ",
}
const ARIMASU_SPECIAL = {
  dictionary: "ある",
  masu: "あります",
  te: "あって",
  ta: "あった",
  nai: "ない",
  potential: "あれる",
  volitional: "あろう",
  imperative: "あれ",
}

const SPECIAL_VERBS_GROUP1 = ["いきます", "あります"]

function conjugateGodan(verb) {
  const ending = verb.slice(-3, -2)
  const stem = verb.slice(0, -3)

  if (SPECIAL_VERBS_GROUP1.includes(verb)) {
    if (verb === "いきます") {
      return IKU_SPECIAL
    }
    if (verb === "あります") {
      return ARIMASU_SPECIAL
    }
  }

  const map = godanMap[ending]
  if (!map) return null

  return {
    dictionary: stem + map.d,
    masu: verb,
    te: stem + map.te,
    ta: stem + map.ta,
    nai: stem + map.a + "ない",
    potential: stem + map.e + "ます",
    volitional: stem + map.o + "ます",
    imperative: stem + map.e + "ます",
  }
}

// =====================
// MAIN
// =====================

export function conjugateVerb(hiragana, group) {
  if (!hiragana) return null

  const verb = hiragana.trim()

  if (group === 3) {

    return conjugateSuru(verb)
  }

  // =====================
  // GROUP 2 (ICHIDAN)
  // =====================
  if (group === 2) {
    return conjugateIchidan(verb)
  }

  // =====================
  // GROUP 1 (GODAN)
  // =====================
  if (group === 1) {
    return conjugateGodan(verb)
  }

  return null
}