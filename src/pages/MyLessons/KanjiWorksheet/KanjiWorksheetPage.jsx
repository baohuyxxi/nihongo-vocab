import { createElement, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { BookOpen, Eye, Printer, Settings2 } from "lucide-react"

import "./kanji-worksheet.css"
import KanjiWorksheetConfig from "./KanjiWorksheetConfig"
import KanjiWorksheetPreview from "./KanjiWorksheetPreview"
import { fetchKanjiWorksheetCatalog } from "./kanjiWorksheetCatalog"
import {
  DEFAULT_WORKSHEET_CONFIG,
  extractKanjiCharacters,
  loadSavedWorksheetConfig,
  mergeKanjiCatalog,
  normalizeKanjiRecord,
  normalizeWorksheetConfig,
  WORKSHEET_CONFIG_KEY,
} from "../../../utils/kanjiWorksheet"

const TABS = [
  { id: "select", label: "Chọn Kanji", icon: BookOpen },
  { id: "configure", label: "Cấu hình", icon: Settings2 },
  { id: "preview", label: "Preview", icon: Eye },
]

function readUrlKanji(searchParams) {
  return searchParams
    .getAll("kanji")
    .flatMap((value) => extractKanjiCharacters(value))
}

export default function KanjiWorksheetPage() {
  const [searchParams] = useSearchParams()
  const urlKanji = useMemo(() => readUrlKanji(searchParams), [searchParams])
  const [selectedKanji, setSelectedKanji] = useState(() =>
    mergeKanjiCatalog(urlKanji.map((kanji) => normalizeKanjiRecord(kanji)), []),
  )
  const [catalog, setCatalog] = useState([])
  const [catalogError, setCatalogError] = useState("")
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [config, setConfig] = useState(loadSavedWorksheetConfig)
  const [pageNotice, setPageNotice] = useState("")
  const [activeTab, setActiveTab] = useState("select")

  useEffect(() => {
    let active = true

    fetchKanjiWorksheetCatalog()
      .then((records) => {
        if (!active) return
        setCatalog(records)
        setSelectedKanji((current) => mergeKanjiCatalog(current, records))
      })
      .catch((error) => {
        if (!active) return
        if (Array.isArray(error.partialCatalog)) {
          setCatalog(error.partialCatalog)
          setSelectedKanji((current) =>
            mergeKanjiCatalog(current, error.partialCatalog),
          )
        }
        setCatalogError(error.message || "Không thể tải dữ liệu Kanji.")
        console.error("Kanji worksheet catalog error:", error)
      })
      .finally(() => {
        if (active) setCatalogLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const updateConfig = (updates) => {
    const normalized = normalizeWorksheetConfig({ ...config, ...updates })
    setConfig(normalized)
    try {
      window.localStorage.setItem(WORKSHEET_CONFIG_KEY, JSON.stringify(normalized))
      setPageNotice("")
    } catch (error) {
      console.error("Unable to save Kanji worksheet settings:", error)
      setPageNotice("Không thể lưu cấu hình vào trình duyệt này.")
    }
  }

  const resetConfig = () => updateConfig(DEFAULT_WORKSHEET_CONFIG)

  const saveConfig = () => {
    try {
      window.localStorage.setItem(WORKSHEET_CONFIG_KEY, JSON.stringify(config))
      setPageNotice("Đã lưu cấu hình worksheet.")
    } catch (error) {
      console.error("Unable to save Kanji worksheet settings:", error)
      setPageNotice("Không thể lưu cấu hình vào trình duyệt này.")
    }
  }

  const removeKanji = (kanji) => {
    setSelectedKanji((current) =>
      current.filter((item) => item.kanji !== kanji),
    )
  }

  const clearKanji = () => setSelectedKanji([])

  const reorderKanji = (sourceKanji, targetKanji) => {
    if (!sourceKanji || !targetKanji || sourceKanji === targetKanji) return
    setSelectedKanji((current) => {
      const sourceIndex = current.findIndex((item) => item.kanji === sourceKanji)
      const targetIndex = current.findIndex((item) => item.kanji === targetKanji)
      if (sourceIndex < 0 || targetIndex < 0) return current
      const reordered = [...current]
      const [moved] = reordered.splice(sourceIndex, 1)
      reordered.splice(targetIndex, 0, moved)
      return reordered
    })
  }

  const handlePrint = () => {
    if (!selectedKanji.length) {
      setPageNotice("Hãy chọn ít nhất một Kanji trước khi in.")
      return
    }
    window.print()
  }

  const worksheetConfig = (
    <KanjiWorksheetConfig
      tab="all"
      catalog={catalog}
      catalogLoading={catalogLoading}
      catalogError={catalogError}
      selectedKanji={selectedKanji}
      setSelectedKanji={setSelectedKanji}
      config={config}
      onConfigChange={updateConfig}
      onSaveConfig={saveConfig}
      onResetConfig={resetConfig}
      onRemoveKanji={removeKanji}
      onClear={clearKanji}
      onReorder={reorderKanji}
    />
  )

  return (
    <div className="worksheet-page mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
      <header className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl lg:text-3xl">
            Tạo tập viết Kanji
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Tạo, xem trước và in phiếu luyện viết Kanji.
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          disabled={!selectedKanji.length}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Printer size={18} aria-hidden="true" />
          In / Lưu PDF
        </button>
      </header>

      <div className="no-print mb-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 lg:hidden">
        Trên điện thoại và iPad dọc, chuyển giữa các thẻ để chọn Kanji, cấu hình và xem trước.
      </div>

      {pageNotice && (
        <p className="no-print mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800" role="status">
          {pageNotice}
        </p>
      )}

      <nav className="no-print mb-4 grid grid-cols-3 gap-2 lg:hidden" aria-label="Các bước tạo worksheet">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-semibold sm:text-sm ${
              activeTab === id
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {createElement(icon, { size: 16, "aria-hidden": true })}
            {label}
          </button>
        ))}
      </nav>

      <div className="worksheet-editor-layout grid grid-cols-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)]">
        <aside className="worksheet-editor-sidebar no-print hidden min-w-0 lg:block">
          {worksheetConfig}
        </aside>

        <main className="worksheet-preview-panel hidden min-w-0 lg:block">
          <KanjiWorksheetPreview
            selectedKanji={selectedKanji}
            config={config}
            onPrint={handlePrint}
          />
        </main>
      </div>

      <div className="worksheet-mobile-panel lg:hidden">
        {activeTab === "select" && (
          <KanjiWorksheetConfig
            tab="select"
            catalog={catalog}
            catalogLoading={catalogLoading}
            catalogError={catalogError}
            selectedKanji={selectedKanji}
            setSelectedKanji={setSelectedKanji}
            config={config}
            onConfigChange={updateConfig}
            onSaveConfig={saveConfig}
            onResetConfig={resetConfig}
            onRemoveKanji={removeKanji}
            onClear={clearKanji}
            onReorder={reorderKanji}
          />
        )}
        {activeTab === "configure" && (
          <KanjiWorksheetConfig
            tab="configure"
            catalog={catalog}
            catalogLoading={catalogLoading}
            catalogError={catalogError}
            selectedKanji={selectedKanji}
            setSelectedKanji={setSelectedKanji}
            config={config}
            onConfigChange={updateConfig}
            onSaveConfig={saveConfig}
            onResetConfig={resetConfig}
            onRemoveKanji={removeKanji}
            onClear={clearKanji}
            onReorder={reorderKanji}
          />
        )}
        {activeTab === "preview" && (
          <KanjiWorksheetPreview
            selectedKanji={selectedKanji}
            config={config}
            onPrint={handlePrint}
          />
        )}
      </div>
    </div>
  )
}
