export const WORKSHEET_CONFIG_KEY = "kanjiWorksheet.config.v1"
export const WORKSHEET_PRESETS_KEY = "kanjiWorksheet.presets.v1"

export const DEFAULT_WORKSHEET_CONFIG = {
  pageSize: "A4",
  orientation: "portrait",
  marginTop: 10,
  marginRight: 10,
  marginBottom: 10,
  marginLeft: 10,
  rowGapMm: 4,
  kanjiPerPage: 3,
  columns: 5,
  cellSizeMm: 24,
  sampleCount: 1,
  fadedCount: 5,
  blankCount: 4,
  gridStyle: "diagonal",
  sampleColor: "#111827",
  fadedOpacity: 20,
  showPageNumbers: true,
  showHeader: true,
  worksheetTitle: "Kanji Writing Practice",
  titleJapanese: "漢字 練習",
  studentName: "",
  className: "",
  teacherName: "",
  worksheetDate: "",
  notes: "",
  showKanji: true,
  showHanViet: true,
  showMeaning: true,
  showOnyomi: true,
  showKunyomi: true,
  showHiragana: true,
  showExamples: false,
  showStrokeCount: false,
  showRadical: false,
  showMnemonic: false,
  showHint: true,
  showStrokeNumber: false,
}

export const WORKSHEET_PRESETS = [
  { id: "basic", label: "Cơ bản", sampleCount: 1, fadedCount: 5, blankCount: 4 },
  { id: "easy", label: "Dễ", sampleCount: 1, fadedCount: 4, blankCount: 5 },
  { id: "medium", label: "Trung bình", sampleCount: 1, fadedCount: 3, blankCount: 6 },
  { id: "advanced", label: "Nâng cao", sampleCount: 1, fadedCount: 1, blankCount: 8 },
]

const PAGE_DIMENSIONS_MM = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  Letter: { width: 215.9, height: 279.4 },
}

const GRID_STYLES = new Set(["standard", "quadrants", "diagonal", "border"])
const ORIENTATIONS = new Set(["portrait", "landscape"])

function boundedNumber(value, fallback, min, max) {
  const parsed = Number(value)
  return Number.isFinite(parsed)
    ? Math.min(max, Math.max(min, parsed))
    : fallback
}

function textList(value) {
  const values = Array.isArray(value) ? value : [value]
  return values.flatMap((item) => {
    if (typeof item === "string" || typeof item === "number") {
      const text = String(item).trim()
      return text ? [text] : []
    }
    if (item && typeof item === "object") {
      return textList(item.text ?? item.value ?? item.name ?? item.meaning)
    }
    return []
  })
}

function unique(values) {
  return [...new Set(values)]
}

export function extractKanjiCharacters(value = "") {
  const matches = String(value).normalize("NFKC").match(/\p{Script=Han}/gu) || []
  return unique(matches)
}

export function getKanjiCharacter(value) {
  if (typeof value === "string") {
    return extractKanjiCharacters(value)[0] || ""
  }
  if (!value || typeof value !== "object") return ""
  return extractKanjiCharacters(value.kanji ?? value.character ?? "")[0] || ""
}

export function normalizeKanjiRecord(value) {
  const kanji = getKanjiCharacter(value)
  if (!kanji) return null
  if (!value || typeof value !== "object") {
    return { kanji, available: false, record: null }
  }
  if (value.available === false && value.record === null) {
    return { kanji, available: false, record: null }
  }

  const source = value.available && value.record && typeof value.record === "object"
    ? value.record
    : value
  const readings = source.readings && typeof source.readings === "object"
    ? source.readings
    : {}
  const words = Array.isArray(source.words) ? source.words : []
  const examples = [
    ...textList(source.examples),
    ...words.map((word) => {
      if (typeof word === "string") return word
      return [
        word?.word,
        word?.vocab,
        word?.kanji,
        word?.hiragana,
        word?.meaning,
      ].filter(Boolean).join(" — ")
    }).filter(Boolean),
  ]
  const strokes = source.strokeCount ?? source.strokeNumber ?? source.strokes
  const strokeCount = Array.isArray(strokes)
    ? strokes.length
    : Number.isFinite(Number(strokes)) && strokes !== null && strokes !== ""
      ? Number(strokes)
      : null

  return {
    kanji,
    available: true,
    hanViet: textList(source.hanViet),
    meanings: textList(source.meanings ?? source.meaning ?? source.meaningVi),
    onyomi: textList(source.onyomi ?? source.onYomi ?? readings.onyomi),
    kunyomi: textList(source.kunyomi ?? source.kunYomi ?? readings.kunyomi),
    hiragana: textList(source.hiragana ?? readings.hiragana),
    examples: unique(examples),
    radicals: textList(source.radicals ?? source.radical),
    mnemonic: textList(source.mnemonic ?? source.memoryHint),
    strokeCount,
    frequency: source.frequency ?? source.rank ?? null,
    jlpt: textList(source.jlpt ?? source.JLPT),
    record: source,
  }
}

export function mergeKanjiCatalog(selected, catalog) {
  const byCharacter = new Map(
    catalog.map((record) => [getKanjiCharacter(record), record]),
  )
  const seen = new Set()
  return selected.reduce((result, item) => {
    const kanji = getKanjiCharacter(item)
    if (!kanji || seen.has(kanji)) return result
    seen.add(kanji)
    result.push(normalizeKanjiRecord(byCharacter.get(kanji) ?? item))
    return result
  }, [])
}

export function searchKanjiRecord(record, keyword) {
  const query = keyword.trim().toLocaleLowerCase()
  if (!query) return true

  const selected = normalizeKanjiRecord(record)
  const raw = selected?.record
  const words = Array.isArray(raw?.words) ? raw.words : []
  const searchable = [
    selected?.kanji,
    ...(selected?.hanViet ?? []),
    ...(selected?.meanings ?? []),
    ...(selected?.onyomi ?? []),
    ...(selected?.kunyomi ?? []),
    ...(selected?.hiragana ?? []),
    ...(selected?.radicals ?? []),
    ...(selected?.mnemonic ?? []),
    ...words.flatMap((word) => [
      word?.word,
      word?.vocab,
      word?.kanji,
      word?.hiragana,
      word?.hanViet,
      word?.meaning,
    ]),
  ]

  return searchable.some(
    (value) => typeof value === "string" && value.toLocaleLowerCase().includes(query),
  )
}

export function normalizeWorksheetConfig(config = {}) {
  const input = { ...DEFAULT_WORKSHEET_CONFIG, ...config }
  const total = boundedNumber(input.practiceCount, 10, 0, 40)
  const sampleCount = boundedNumber(
    config.sampleCount,
    Math.min(1, total),
    0,
    20,
  )
  const remaining = Math.max(0, total - sampleCount)
  const fadedCount = boundedNumber(
    config.fadedCount,
    Math.min(5, remaining),
    0,
    20,
  )
  const blankCount = boundedNumber(
    config.blankCount,
    Math.max(0, remaining - fadedCount),
    0,
    20,
  )
  const pageSize = Object.prototype.hasOwnProperty.call(PAGE_DIMENSIONS_MM, input.pageSize)
    ? input.pageSize
    : DEFAULT_WORKSHEET_CONFIG.pageSize
  const orientation = ORIENTATIONS.has(input.orientation)
    ? input.orientation
    : DEFAULT_WORKSHEET_CONFIG.orientation
  const sampleColor = /^#[\da-f]{6}$/i.test(input.sampleColor)
    ? input.sampleColor
    : DEFAULT_WORKSHEET_CONFIG.sampleColor
  const legacyReadings = config.showReading ?? true

  return {
    ...input,
    pageSize,
    orientation,
    marginTop: boundedNumber(input.marginTop, 10, 0, 30),
    marginRight: boundedNumber(input.marginRight, 10, 0, 30),
    marginBottom: boundedNumber(input.marginBottom, 10, 0, 30),
    marginLeft: boundedNumber(input.marginLeft, 10, 0, 30),
    rowGapMm: boundedNumber(input.rowGapMm, 4, 0, 10),
    kanjiPerPage: boundedNumber(input.kanjiPerPage, 3, 1, 30),
    columns: boundedNumber(input.columns, 5, 1, 10),
    cellSizeMm: boundedNumber(input.cellSizeMm, 24, 8, 50),
    sampleCount,
    fadedCount,
    blankCount,
    totalCellCount: sampleCount + fadedCount + blankCount,
    practiceCount: sampleCount + fadedCount + blankCount,
    gridStyle: GRID_STYLES.has(input.gridStyle) ? input.gridStyle : "diagonal",
    sampleColor,
    fadedOpacity: boundedNumber(input.fadedOpacity, 20, 5, 60),
    showReading: Boolean(input.showReading ?? legacyReadings),
    showHanViet: Boolean(config.showHanViet ?? config.showMeaning ?? true),
    showMeaning: Boolean(config.showMeaning ?? true),
    showOnyomi: Boolean(config.showOnyomi ?? legacyReadings),
    showKunyomi: Boolean(config.showKunyomi ?? legacyReadings),
    showHiragana: Boolean(config.showHiragana ?? legacyReadings),
    showStrokeCount: Boolean(config.showStrokeCount ?? config.showStrokeNumber ?? false),
  }
}

export function getWorksheetPageSize(config) {
  const dimensions = PAGE_DIMENSIONS_MM[config.pageSize] || PAGE_DIMENSIONS_MM.A4
  return config.orientation === "landscape"
    ? { width: dimensions.height, height: dimensions.width }
    : dimensions
}

export function getWorksheetLayout(config) {
  const page = getWorksheetPageSize(config)
  const contentWidth = Math.max(40, page.width - config.marginLeft - config.marginRight)
  const contentHeight = Math.max(50, page.height - config.marginTop - config.marginBottom)
  const cellCount = config.totalCellCount
  const headerHeight = config.showHeader ? 23 : 0
  const footerHeight = config.showPageNumbers ? 5 : 0
  const pageGapHeight =
    (Number(config.showHeader) + Number(config.showPageNumbers)) * 2
  const rowMetadataHeight = 24
  const minimumCellSize = 6
  const initialColumns = Math.max(1, Math.min(config.columns, cellCount || config.columns))
  const spaceForGrid = Math.max(
    minimumCellSize,
    contentHeight -
      headerHeight -
      footerHeight -
      pageGapHeight -
      rowMetadataHeight -
      config.rowGapMm,
  )
  const maxRowsAtRequestedSize = Math.max(
    1,
    Math.floor(spaceForGrid / config.cellSizeMm),
  )
  const desiredColumns = Math.max(
    initialColumns,
    Math.ceil(cellCount / maxRowsAtRequestedSize),
  )
  const columns = Math.max(
    1,
    Math.min(
      desiredColumns,
      Math.max(1, Math.floor(contentWidth / minimumCellSize)),
    ),
  )
  const gridRows = Math.max(1, Math.ceil(cellCount / columns))
  const requestedCellSize = Math.min(config.cellSizeMm, contentWidth / columns)
  const maxCellSizeForOneRow =
    (contentHeight -
      headerHeight -
      footerHeight -
      pageGapHeight -
      rowMetadataHeight -
      config.rowGapMm) / gridRows
  const cellSizeMm = Math.max(
    minimumCellSize,
    Math.min(requestedCellSize, maxCellSizeForOneRow),
  )
  const rowHeightMm = gridRows * cellSizeMm + rowMetadataHeight + config.rowGapMm
  const rowsPerPage = Math.max(
    1,
    Math.floor(
      (contentHeight - headerHeight - footerHeight - pageGapHeight) / rowHeightMm,
    ),
  )
  const itemsPerPage = Math.max(1, Math.min(config.kanjiPerPage, rowsPerPage))

  return {
    page,
    contentWidth,
    contentHeight,
    columns,
    gridRows,
    cellSizeMm,
    rowHeightMm,
    itemsPerPage,
  }
}

export function paginateKanji(selected, config) {
  const layout = getWorksheetLayout(config)
  const pages = []
  for (let index = 0; index < selected.length; index += layout.itemsPerPage) {
    pages.push(selected.slice(index, index + layout.itemsPerPage))
  }
  return { pages, layout }
}

export function loadSavedWorksheetConfig() {
  try {
    const stored = window.localStorage.getItem(WORKSHEET_CONFIG_KEY)
    return normalizeWorksheetConfig(stored ? JSON.parse(stored) : {})
  } catch (error) {
    console.warn("Unable to load the saved worksheet settings.", error)
    return normalizeWorksheetConfig()
  }
}

export function formatHanViet(value) {
  const text = Array.isArray(value) ? value[0] : value
  if (typeof text !== "string") return ""
  const trimmed = text.trim()
  return trimmed ? trimmed.charAt(0).toLocaleUpperCase("vi") + trimmed.slice(1) : ""
}
