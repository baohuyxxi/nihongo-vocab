import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react"

import {
  formatHanViet,
  getKanjiCharacter,
  normalizeKanjiRecord,
  searchKanjiRecord,
  WORKSHEET_PRESETS,
  WORKSHEET_PRESETS_KEY,
} from "../../../utils/kanjiWorksheet"

function readSavedPresets() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(WORKSHEET_PRESETS_KEY) || "[]")
    return Array.isArray(saved)
      ? saved.filter((preset) => typeof preset?.name === "string")
      : []
  } catch (error) {
    console.warn("Unable to load saved worksheet presets.", error)
    return []
  }
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  )
}

function NumberField({ label, value, min = 0, max = 40, step = 1, onChange, unit = "" }) {
  return (
    <Field label={label}>
      <span className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800"
        />
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </span>
    </Field>
  )
}

function Toggle({ checked, onChange, label, disabled = false, hint = "" }) {
  return (
    <label className={`flex items-start gap-2 text-sm ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span>
        <span className="block text-slate-700">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
      </span>
    </label>
  )
}

export default function KanjiWorksheetConfig({
  tab = "all",
  catalog,
  catalogLoading,
  catalogError,
  selectedKanji,
  setSelectedKanji,
  config,
  onConfigChange,
  onSaveConfig,
  onResetConfig,
  onRemoveKanji,
  onClear,
  onReorder,
}) {
  const [search, setSearch] = useState("")
  const [kanjiInput, setKanjiInput] = useState("")
  const [inputError, setInputError] = useState("")
  const [presetName, setPresetName] = useState("")
  const [presetNotice, setPresetNotice] = useState("")
  const [savedPresets, setSavedPresets] = useState(readSavedPresets)

  const filteredKanji = useMemo(
    () => catalog.filter((item) => searchKanjiRecord(item, search)),
    [catalog, search],
  )
  const selectedCharacters = useMemo(
    () => new Set(selectedKanji.map((item) => item.kanji)),
    [selectedKanji],
  )
  const strokeDataAvailable = selectedKanji.some(
    (item) => item.strokeCount !== null && item.strokeCount !== undefined,
  )
  const showSelection = tab === "all" || tab === "select"
  const showConfiguration = tab === "all" || tab === "configure"

  const update = (key, value) => onConfigChange({ [key]: value })

  const toggleKanji = (record) => {
    const kanji = getKanjiCharacter(record)
    if (!kanji) return
    setSelectedKanji((current) => {
      if (current.some((item) => item.kanji === kanji)) {
        return current.filter((item) => item.kanji !== kanji)
      }
      return [...current, normalizeKanjiRecord(record)]
    })
  }

  const selectVisible = () => {
    setSelectedKanji((current) => {
      const currentChars = new Set(current.map((item) => item.kanji))
      return [
        ...current,
        ...filteredKanji
          .filter((record) => !currentChars.has(getKanjiCharacter(record)))
          .map(normalizeKanjiRecord)
          .filter(Boolean),
      ]
    })
  }

  const deselectVisible = () => {
    const visibleCharacters = new Set(filteredKanji.map(getKanjiCharacter))
    setSelectedKanji((current) =>
      current.filter((item) => !visibleCharacters.has(item.kanji)),
    )
  }

  const addPastedKanji = () => {
    const characters = [...new Set(kanjiInput.normalize("NFKC").match(/\p{Script=Han}/gu) || [])]
    if (!characters.length) {
      setInputError("Không tìm thấy ký tự Kanji trong nội dung đã nhập.")
      return
    }

    setSelectedKanji((current) => {
      const currentChars = new Set(current.map((item) => item.kanji))
      const additions = characters
        .filter((kanji) => !currentChars.has(kanji))
        .map((kanji) =>
          normalizeKanjiRecord(
            catalog.find((record) => getKanjiCharacter(record) === kanji) || kanji,
          ),
        )
        .filter(Boolean)
      return [...current, ...additions]
    })
    setKanjiInput("")
    setInputError("")
  }

  const savePreset = () => {
    const name = presetName.trim()
    if (!name) {
      setPresetNotice("Nhập tên preset trước khi lưu.")
      return
    }

    const preset = {
      id: `${Date.now()}-${name.toLocaleLowerCase()}`,
      name,
      settings: { ...config },
      sampleCount: config.sampleCount,
      fadedCount: config.fadedCount,
      blankCount: config.blankCount,
      gridStyle: config.gridStyle,
      columns: config.columns,
      cellSizeMm: config.cellSizeMm,
    }
    const nextPresets = [...savedPresets, preset]
    try {
      window.localStorage.setItem(WORKSHEET_PRESETS_KEY, JSON.stringify(nextPresets))
      setSavedPresets(nextPresets)
      setPresetName("")
      setPresetNotice("Đã lưu preset.")
    } catch (error) {
      console.error("Unable to save worksheet preset:", error)
      setPresetNotice("Không thể lưu preset vào trình duyệt này.")
    }
  }

  const removePreset = (id) => {
    const nextPresets = savedPresets.filter((preset) => preset.id !== id)
    try {
      window.localStorage.setItem(WORKSHEET_PRESETS_KEY, JSON.stringify(nextPresets))
      setSavedPresets(nextPresets)
      setPresetNotice("")
    } catch (error) {
      console.error("Unable to remove worksheet preset:", error)
      setPresetNotice("Không thể xóa preset.")
    }
  }

  const applyPreset = (preset) => {
    onConfigChange(preset.settings
      ? { ...preset.settings }
      : {
          sampleCount: preset.sampleCount,
          fadedCount: preset.fadedCount,
          blankCount: preset.blankCount,
          gridStyle: preset.gridStyle || config.gridStyle,
          columns: preset.columns ?? config.columns,
          cellSizeMm: preset.cellSizeMm ?? config.cellSizeMm,
        })
    setPresetNotice(`Đã áp dụng preset “${preset.name || preset.label}”.`)
  }

  const startDrag = (event, kanji) => {
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", kanji)
  }

  const selectionSection = showSelection && (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-bold text-slate-800">Chọn Kanji</h2>
          <p className="mt-1 text-xs text-slate-500">
            {catalogLoading ? "Đang tải danh sách Kanji…" : `${catalog.length} Kanji đã tải`}
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
          {selectedKanji.length} đã chọn
        </span>
      </div>

      {catalogError && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800" role="status">
          {catalogError} Bạn vẫn có thể nhập Kanji trực tiếp.
        </p>
      )}

      <Field label="Tìm Kanji, Hán Việt, âm đọc, nghĩa hoặc từ vựng">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Ví dụ: 日, nhật, にち..."
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400"
        />
      </Field>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={selectVisible} disabled={!filteredKanji.length} className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">
          Chọn kết quả ({filteredKanji.length})
        </button>
        <button type="button" onClick={deselectVisible} disabled={!filteredKanji.length} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
          Bỏ chọn kết quả
        </button>
        <button type="button" onClick={onClear} disabled={!selectedKanji.length} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
          Bỏ chọn tất cả
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200" aria-label="Kết quả Kanji">
        {catalogLoading && (
          <p className="p-4 text-center text-sm text-slate-500">Đang tải dữ liệu…</p>
        )}
        {!catalogLoading && filteredKanji.length === 0 && (
          <p className="p-4 text-center text-sm text-slate-500">Không tìm thấy Kanji phù hợp.</p>
        )}
        {filteredKanji.map((record) => {
          const kanji = getKanjiCharacter(record)
          const normalized = normalizeKanjiRecord(record)
          const checked = selectedCharacters.has(kanji)
          const readings = [...normalized.onyomi, ...normalized.kunyomi, ...normalized.hiragana]
          const words = Array.isArray(record.words) ? record.words : []
          const example = words[0]
          const exampleText = typeof example === "string"
            ? example
            : [example?.word, example?.vocab, example?.kanji, example?.meaning]
              .filter(Boolean)
              .join(" — ")

          return (
            <label key={kanji} className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-0 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleKanji(record)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="w-9 shrink-0 text-center text-2xl text-slate-800">{kanji}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-700">
                  {formatHanViet(normalized.hanViet) || "Chưa có Hán Việt"}
                </span>
                <span className="block truncate text-xs text-slate-500">
                  {readings.join("・") || exampleText || "Chưa có âm đọc"}
                </span>
              </span>
            </label>
          )
        })}
      </div>

      <div className="space-y-2">
        <Field label="Nhập hoặc dán danh sách Kanji">
          <textarea
            rows={2}
            value={kanjiInput}
            onChange={(event) => {
              setKanjiInput(event.target.value)
              setInputError("")
            }}
            onPaste={() => setInputError("")}
            placeholder="日, 月, 火, 水"
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          />
        </Field>
        <button type="button" onClick={addPastedKanji} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Thêm danh sách
        </button>
        {inputError && <p className="text-xs text-red-600" role="alert">{inputError}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-700">Thứ tự in</h3>
          <span className="text-xs text-slate-500">Kéo thả hoặc dùng nút lên/xuống</span>
        </div>
        {!selectedKanji.length ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
            Chưa chọn Kanji. Kanji lấy từ URL sẽ xuất hiện tại đây.
          </p>
        ) : (
          <ol className="max-h-80 space-y-2 overflow-y-auto">
            {selectedKanji.map((item, index) => (
              <li
                key={item.kanji}
                draggable
                onDragStart={(event) => startDrag(event, item.kanji)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  onReorder(event.dataTransfer.getData("text/plain"), item.kanji)
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2"
              >
                <GripVertical size={16} className="shrink-0 cursor-grab text-slate-400" aria-hidden="true" />
                <span className="w-5 text-xs text-slate-400">{index + 1}.</span>
                <span className="text-xl font-semibold text-slate-800">{item.kanji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-slate-600">
                    {formatHanViet(item.hanViet) || "Chưa có Hán Việt"}
                  </span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {[...item.onyomi, ...item.kunyomi, ...item.hiragana].join("・") || "Chưa có âm đọc"}
                    {!item.available &&
                      (catalogLoading
                        ? " · Đang xác minh"
                        : catalogError
                          ? " · Chưa xác minh (API lỗi)"
                          : " · Không tìm thấy trong API")}
                  </span>
                </span>
                <button type="button" onClick={() => onReorder(item.kanji, selectedKanji[index - 1]?.kanji)} disabled={index === 0} className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={`Đưa ${item.kanji} lên`}>
                  <ArrowUp size={15} />
                </button>
                <button type="button" onClick={() => onReorder(item.kanji, selectedKanji[index + 1]?.kanji)} disabled={index === selectedKanji.length - 1} className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={`Đưa ${item.kanji} xuống`}>
                  <ArrowDown size={15} />
                </button>
                <button type="button" onClick={() => onRemoveKanji(item.kanji)} className="rounded p-1 text-red-500 hover:bg-red-50" aria-label={`Xóa ${item.kanji}`}>
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )

  const configurationSection = showConfiguration && (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-slate-800">Cấu hình worksheet</h2>
        <p className="mt-1 text-xs text-slate-500">
          Tự động chia trang để không cắt hàng Kanji.
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 p-3">
        <h3 className="text-sm font-bold text-slate-700">Trang và phân trang</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Khổ giấy">
            <select value={config.pageSize} onChange={(event) => update("pageSize", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm">
              <option value="A4">A4</option>
              <option value="A5">A5</option>
              <option value="Letter">Letter</option>
            </select>
          </Field>
          <Field label="Chiều giấy">
            <select value={config.orientation} onChange={(event) => update("orientation", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm">
              <option value="portrait">Dọc</option>
              <option value="landscape">Ngang</option>
            </select>
          </Field>
          <NumberField label="Kanji tối đa / trang" value={config.kanjiPerPage} min={1} max={30} onChange={(value) => update("kanjiPerPage", value)} />
          <NumberField label="Khoảng cách hàng" value={config.rowGapMm} min={0} max={10} step={0.5} unit="mm" onChange={(value) => update("rowGapMm", value)} />
        </div>
        <fieldset>
          <legend className="mb-2 text-xs font-semibold text-slate-600">Lề trang (mm)</legend>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Trên" value={config.marginTop} min={0} max={30} onChange={(value) => update("marginTop", value)} />
            <NumberField label="Dưới" value={config.marginBottom} min={0} max={30} onChange={(value) => update("marginBottom", value)} />
            <NumberField label="Trái" value={config.marginLeft} min={0} max={30} onChange={(value) => update("marginLeft", value)} />
            <NumberField label="Phải" value={config.marginRight} min={0} max={30} onChange={(value) => update("marginRight", value)} />
          </div>
        </fieldset>
        <Toggle checked={config.showPageNumbers} onChange={(value) => update("showPageNumbers", value)} label="Hiển thị số trang" />
        <p className="text-xs text-slate-500">Tự chia trang luôn bật để tránh nội dung tràn hoặc bị cắt khi in.</p>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 p-3">
        <h3 className="text-sm font-bold text-slate-700">Ô luyện viết</h3>
        <div className="grid grid-cols-3 gap-2">
          <NumberField label="Ô mẫu" value={config.sampleCount} max={20} onChange={(value) => update("sampleCount", value)} />
          <NumberField label="Ô chữ mờ" value={config.fadedCount} max={20} onChange={(value) => update("fadedCount", value)} />
          <NumberField label="Ô trống" value={config.blankCount} max={20} onChange={(value) => update("blankCount", value)} />
        </div>
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
          Tổng số ô: {config.sampleCount} + {config.fadedCount} + {config.blankCount} = {config.totalCellCount}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Số cột" value={config.columns} min={1} max={10} onChange={(value) => update("columns", value)} />
          <NumberField label="Kích thước ô" value={config.cellSizeMm} min={8} max={50} unit="mm" onChange={(value) => update("cellSizeMm", value)} />
          <NumberField label="Độ đậm ô mờ" value={config.fadedOpacity} min={5} max={60} unit="%" onChange={(value) => update("fadedOpacity", value)} />
          <Field label="Màu Kanji mẫu">
            <input type="color" value={config.sampleColor} onChange={(event) => update("sampleColor", event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white p-1" />
          </Field>
        </div>
        <Field label="Đường hướng dẫn">
          <select value={config.gridStyle} onChange={(event) => update("gridStyle", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm">
            <option value="standard">Ô vuông</option>
            <option value="quadrants">Kẻ 4 phần</option>
            <option value="diagonal">Có đường chéo</option>
            <option value="border">Chỉ viền</option>
          </select>
        </Field>
        <div className="flex flex-wrap gap-2">
          {WORKSHEET_PRESETS.map((preset) => (
            <button key={preset.id} type="button" onClick={() => applyPreset(preset)} className="rounded-lg border border-indigo-200 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={presetName} onChange={(event) => setPresetName(event.target.value)} placeholder="Tên preset riêng" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" />
          <button type="button" onClick={savePreset} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">Lưu</button>
        </div>
        {savedPresets.map((preset) => (
          <div key={preset.id} className="flex items-center gap-2 text-xs">
            <button type="button" onClick={() => applyPreset(preset)} className="min-w-0 flex-1 truncate text-left font-semibold text-slate-700 hover:text-indigo-600">
              {preset.name} · {preset.sampleCount}/{preset.fadedCount}/{preset.blankCount}
            </button>
            <button type="button" onClick={() => removePreset(preset.id)} className="text-red-500" aria-label={`Xóa preset ${preset.name}`}>×</button>
          </div>
        ))}
        {presetNotice && <p className="text-xs text-slate-500" role="status">{presetNotice}</p>}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div>
          <h3 className="text-sm font-bold text-slate-700">Thông tin đầu trang</h3>
          <p className="mt-1 text-xs text-slate-500">Các trường để trống sẽ không in.</p>
        </div>
        <Toggle checked={config.showHeader} onChange={(value) => update("showHeader", value)} label="Hiển thị header" />
        {config.showHeader && (
          <div className="grid grid-cols-1 gap-3">
            <Field label="Tên worksheet">
              <input value={config.worksheetTitle} onChange={(event) => update("worksheetTitle", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" />
            </Field>
            <Field label="Tiêu đề tiếng Nhật">
              <input value={config.titleJapanese} onChange={(event) => update("titleJapanese", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" />
            </Field>
            <Field label="Học viên">
              <input value={config.studentName} onChange={(event) => update("studentName", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" />
            </Field>
            <Field label="Lớp">
              <input value={config.className} onChange={(event) => update("className", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" />
            </Field>
            <Field label="Ngày">
              <input type="date" value={config.worksheetDate} onChange={(event) => update("worksheetDate", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" />
            </Field>
            <Field label="Giáo viên">
              <input value={config.teacherName} onChange={(event) => update("teacherName", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" />
            </Field>
            <Field label="Ghi chú">
              <textarea rows={2} value={config.notes} onChange={(event) => update("notes", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm" />
            </Field>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 p-3">
        <h3 className="text-sm font-bold text-slate-700">Thông tin Kanji</h3>
        <div className="grid grid-cols-2 gap-3">
          <Toggle checked={config.showKanji} onChange={(value) => update("showKanji", value)} label="Kanji tiêu đề" />
          <Toggle checked={config.showHanViet} onChange={(value) => update("showHanViet", value)} label="Hán Việt" />
          <Toggle checked={config.showMeaning} onChange={(value) => update("showMeaning", value)} label="Nghĩa" />
          <Toggle checked={config.showOnyomi} onChange={(value) => update("showOnyomi", value)} label="Onyomi" />
          <Toggle checked={config.showKunyomi} onChange={(value) => update("showKunyomi", value)} label="Kunyomi" />
          <Toggle checked={config.showHiragana} onChange={(value) => update("showHiragana", value)} label="Hiragana" />
          <Toggle checked={config.showExamples} onChange={(value) => update("showExamples", value)} label="Ví dụ từ vựng" />
          <Toggle checked={config.showRadical} onChange={(value) => update("showRadical", value)} label="Bộ thủ" />
          <Toggle checked={config.showMnemonic} onChange={(value) => update("showMnemonic", value)} label="Gợi ý ghi nhớ" />
        </div>
        <Toggle
          checked={config.showStrokeCount}
          onChange={(value) => update("showStrokeCount", value)}
          label="Số nét"
          disabled={!strokeDataAvailable}
          hint={!strokeDataAvailable ? "API hiện không cung cấp số nét cho Kanji đang chọn." : ""}
        />
        <Toggle checked={config.showHint} onChange={(value) => update("showHint", value)} label="Hướng dẫn luyện viết" />
        <p className="text-xs text-slate-500">
          Animation thứ tự nét chỉ khả dụng khi nguồn dữ liệu cung cấp stroke data tương thích; hiện chưa có dữ liệu này trong API tần suất.
        </p>
      </section>

      <div className="flex gap-2">
        <button type="button" onClick={onSaveConfig} className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Lưu cấu hình
        </button>
        <button type="button" onClick={onResetConfig} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          Khôi phục mặc định
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {selectionSection}
      {tab === "all" && showSelection && showConfiguration && (
        <div className="border-t border-slate-200" aria-hidden="true" />
      )}
      {configurationSection}
    </div>
  )
}
