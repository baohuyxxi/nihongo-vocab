import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Printer, ZoomIn, ZoomOut } from "lucide-react"

import KanjiWorksheet from "./kanjiWorksheet/KanjiWorksheet"
import { paginateKanji } from "../../../utils/kanjiWorksheet"

const MIN_ZOOM = 0.45
const MAX_ZOOM = 1.15

export default function KanjiWorksheetPreview({ selectedKanji, config, onPrint }) {
  const [activePage, setActivePage] = useState(0)
  const [zoom, setZoom] = useState(0.65)
  const [viewMode, setViewMode] = useState("single")
  const { pages, layout } = useMemo(
    () => paginateKanji(selectedKanji, config),
    [selectedKanji, config],
  )
  const displayedPage = Math.min(activePage, Math.max(0, pages.length - 1))
  const pageKanjiCount = pages[displayedPage]?.length || 0

  const changeZoom = (value) => {
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)))
  }

  return (
    <div className="space-y-4">
      <section className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">Preview worksheet</h2>
            <p className="mt-1 text-xs text-slate-500">
              {selectedKanji.length} Kanji · {pages.length} trang · {config.pageSize} {config.orientation === "portrait" ? "dọc" : "ngang"}
            </p>
          </div>
          <button
            type="button"
            onClick={onPrint}
            disabled={!selectedKanji.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Printer size={17} aria-hidden="true" />
            In / Lưu PDF
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setActivePage(displayedPage - 1)} disabled={displayedPage === 0} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40" aria-label="Trang trước">
              <ChevronLeft size={17} />
            </button>
            <span className="min-w-[7rem] text-center text-sm font-semibold text-slate-700">
              Trang {pages.length ? displayedPage + 1 : 0} / {pages.length}
              {pages.length > 0 && <span className="block text-xs font-normal text-slate-500">{pageKanjiCount} Kanji</span>}
            </span>
            <button type="button" onClick={() => setActivePage(displayedPage + 1)} disabled={displayedPage >= pages.length - 1} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40" aria-label="Trang tiếp theo">
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button type="button" onClick={() => changeZoom(zoom - 0.1)} disabled={zoom <= MIN_ZOOM} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40" aria-label="Thu nhỏ">
              <ZoomOut size={17} />
            </button>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step="0.05"
              value={zoom}
              onChange={(event) => changeZoom(Number(event.target.value))}
              aria-label="Thu phóng bản xem trước"
              className="w-24 accent-indigo-600"
            />
            <span className="w-10 text-right text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => changeZoom(zoom + 0.1)} disabled={zoom >= MAX_ZOOM} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40" aria-label="Phóng to">
              <ZoomIn size={17} />
            </button>
          </div>

          <div className="flex rounded-lg border border-slate-200 p-1" role="group" aria-label="Chế độ xem">
            <button type="button" aria-pressed={viewMode === "single"} onClick={() => setViewMode("single")} className={`rounded px-2.5 py-1 text-xs font-semibold ${viewMode === "single" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}>
              Từng trang
            </button>
            <button type="button" aria-pressed={viewMode === "multi"} onClick={() => setViewMode("multi")} className={`rounded px-2.5 py-1 text-xs font-semibold ${viewMode === "multi" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}>
              Nhiều trang
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Nút in mở hộp thoại trình duyệt; chọn “Save as PDF” để lưu thành PDF.
        </p>
      </section>

      <div className="worksheet-preview-scroll rounded-2xl border border-slate-200 bg-slate-200 p-2 sm:p-4 lg:p-6">
        {!selectedKanji.length ? (
          <div className="flex min-h-72 items-center justify-center text-center text-sm text-slate-500">
            Chọn hoặc nhập ít nhất một Kanji để xem preview.
          </div>
        ) : (
          <div className="worksheet-preview-scale" style={{ "--worksheet-preview-zoom": zoom }}>
            <KanjiWorksheet
              pages={pages}
              config={config}
              layout={layout}
              activePage={displayedPage}
              viewMode={viewMode}
            />
          </div>
        )}
      </div>
    </div>
  )
}
