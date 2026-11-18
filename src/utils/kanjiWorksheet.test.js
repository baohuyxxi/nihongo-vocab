import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  extractKanjiCharacters,
  mergeKanjiCatalog,
  normalizeKanjiRecord,
  normalizeWorksheetConfig,
  paginateKanji,
} from "./kanjiWorksheet.js"

describe("Kanji worksheet data", () => {
  it("extracts unique Kanji from pasted text and URL values", () => {
    assert.deepEqual(extractKanjiCharacters("日, 月 日 火 12"), ["日", "月", "火"])
  })

  it("deduplicates selections by Kanji character across different object references", () => {
    const firstFetch = { kanji: "日", hanViet: "nhật" }
    const secondFetch = { kanji: "日", hanViet: "NHẬT" }
    const selected = mergeKanjiCatalog([firstFetch, "月", secondFetch], [secondFetch])

    assert.deepEqual(selected.map((item) => item.kanji), ["日", "月"])
    assert.equal(selected[0].hanViet[0], "NHẬT")
    assert.equal(selected[1].available, false)
  })

  it("normalizes optional Kanji fields without inventing missing readings", () => {
    const kanji = normalizeKanjiRecord({
      kanji: "語",
      hanViet: "ngữ",
      onyomi: ["ゴ"],
      strokes: 14,
      words: [{ word: "日本語", hiragana: "にほんご", meaning: "tiếng Nhật" }],
    })

    assert.equal(kanji.kanji, "語")
    assert.equal(kanji.hanViet[0], "ngữ")
    assert.deepEqual(kanji.onyomi, ["ゴ"])
    assert.deepEqual(kanji.kunyomi, [])
    assert.equal(kanji.strokeCount, 14)
    assert.match(kanji.examples[0], /日本語/)
  })
})

describe("Kanji worksheet layout", () => {
  it("keeps the sample, faded, and blank cell total consistent", () => {
    const config = normalizeWorksheetConfig({
      sampleCount: 2,
      fadedCount: 7,
      blankCount: 3,
    })

    assert.equal(config.totalCellCount, 12)
    assert.equal(config.practiceCount, 12)
  })

  it("normalizes legacy practice counts without conflicting with cell counts", () => {
    const config = normalizeWorksheetConfig({
      practiceCount: 12,
      sampleCount: 1,
      showReading: false,
    })

    assert.equal(config.sampleCount + config.fadedCount + config.blankCount, 12)
    assert.equal(config.totalCellCount, 12)
    assert.equal(config.showOnyomi, false)
  })

  it("paginates 50 Kanji on A4 without splitting rows", () => {
    const config = normalizeWorksheetConfig()
    const selected = Array.from({ length: 50 }, (_, index) =>
      normalizeKanjiRecord(String.fromCodePoint(0x4e00 + index)),
    )
    const { pages, layout } = paginateKanji(selected, config)

    assert.equal(layout.page.width, 210)
    assert.equal(layout.page.height, 297)
    assert.equal(pages.length, 17)
    assert.equal(pages[pages.length - 1].length, 2)
    assert.equal(pages.flat().length, 50)
  })

  it("uses the requested page orientation and paper size", () => {
    const a5 = paginateKanji(
      [normalizeKanjiRecord("日")],
      normalizeWorksheetConfig({ pageSize: "A5", orientation: "landscape" }),
    )

    assert.equal(a5.layout.page.width, 210)
    assert.equal(a5.layout.page.height, 148)
  })
})
