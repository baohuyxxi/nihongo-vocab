import { godanMap } from "./godanMap"

/* =====================
   GROUP 2
===================== */

function conjugateIchidan(verb) {

  const stem = verb.slice(0, -2)

  return {

    dictionary: stem + "る",

    masu: verb,

    te: stem + "て",

    ta: stem + "た",

    nai: stem + "ない",

    potential: stem + "られる",

    volitional: stem + "よう",

    imperative: stem + "ろ",

    /* NEW */

    conditionalBa: stem + "れば",

    conditionalTara: stem + "たら",

    prohibition: stem + "るな",

    passive: stem + "られる",

    causative: stem + "させる",
  }
}

/* =====================
   GROUP 3
===================== */

const SPECIAL_GROUP3_VERBS = [
  "きます",
]

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

    /* NEW */

    conditionalBa: "くれば",

    conditionalTara: "きたら",

    prohibition: "くるな",

    passive: "こられる",

    causative: "こさせる",
  }
}

function conjugateSuru(verb) {

  if (
    SPECIAL_GROUP3_VERBS.includes(verb)
  ) {

    return conjugateKuru()
  }

  const stem =
    verb.replace("します", "")

  return {

    dictionary: stem + "する",

    masu: verb,

    te: stem + "して",

    ta: stem + "した",

    nai: stem + "しない",

    potential: stem + "できる",

    volitional: stem + "しよう",

    imperative: stem + "しろ",

    /* NEW */

    conditionalBa: stem + "すれば",

    conditionalTara: stem + "したら",

    prohibition: stem + "するな",

    passive: stem + "される",

    causative: stem + "させる",
  }
}

/* =====================
   GROUP 1 (GODAN)
===================== */

// 行く exception

const IKU_SPECIAL = {

  dictionary: "いく",

  masu: "いきます",

  te: "いって",

  ta: "いった",

  nai: "いかない",

  potential: "いける",

  volitional: "いこう",

  imperative: "いけ",

  /* NEW */

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

  /* NEW */

  conditionalBa: "あれば",

  conditionalTara: "あったら",

  prohibition: "あるな",

  passive: "—",

  causative: "あらせる",
}

const SPECIAL_VERBS_GROUP1 = [
  "いきます",
  "あります",
]

function conjugateGodan(verb) {

  const ending =
    verb.slice(-3, -2)

  const stem =
    verb.slice(0, -3)

  if (
    SPECIAL_VERBS_GROUP1.includes(verb)
  ) {

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

    dictionary:
      stem + map.d,

    masu: verb,

    te:
      stem + map.te,

    ta:
      stem + map.ta,

    nai:
      stem + map.a + "ない",

    potential:
      stem + map.e + "る",

    volitional:
      stem + map.o + "う",

    imperative:
      stem + map.e,

    /* NEW */

    conditionalBa:
      stem + map.e + "ば",

    conditionalTara:
      stem + map.ta + "ら",

    prohibition:
      stem + map.d + "な",

    passive:
      stem + map.a + "れる",

    causative:
      stem + map.a + "せる",
  }
}

/* =====================
   MAIN
===================== */

export function conjugateVerb(
  hiragana,
  group,
) {

  if (!hiragana)
    return null

  const verb =
    hiragana.trim()

  /* GROUP 3 */

  if (group === 3) {

    return conjugateSuru(verb)
  }

  /* GROUP 2 */

  if (group === 2) {

    return conjugateIchidan(verb)
  }

  /* GROUP 1 */

  if (group === 1) {

    return conjugateGodan(verb)
  }

  return null
}