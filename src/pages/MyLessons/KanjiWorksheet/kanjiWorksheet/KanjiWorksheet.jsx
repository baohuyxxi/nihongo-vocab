import KanjiWorksheetHeader from "./KanjiWorksheetHeader"
import KanjiWorksheetRow from "./KanjiWorksheetRow"

export default function KanjiWorksheet({
  pages,
  config,
  layout,
  activePage = 0,
  viewMode = "multi",
}) {
  const pageStyle = {
    "--worksheet-page-width": `${layout.page.width}mm`,
    "--worksheet-page-height": `${layout.page.height}mm`,
    "--worksheet-margin-top": `${config.marginTop}mm`,
    "--worksheet-margin-right": `${config.marginRight}mm`,
    "--worksheet-margin-bottom": `${config.marginBottom}mm`,
    "--worksheet-margin-left": `${config.marginLeft}mm`,
    "--worksheet-row-gap": `${config.rowGapMm}mm`,
  }

  return (
    <div className="kanji-print-root" style={pageStyle}>
      <style className="no-print">
        {`@media print { @page { size: ${config.pageSize} ${config.orientation}; margin: 0; } }`}
      </style>
      {pages.map((page, pageIndex) => (
        <section
          key={`worksheet-page-${pageIndex}`}
          className={`worksheet-page-frame ${viewMode === "single" && pageIndex !== activePage ? "worksheet-page-hidden" : ""}`}
          aria-label={`Trang ${pageIndex + 1} trên ${pages.length}`}
        >
          <div className="kanji-worksheet-page">
            <KanjiWorksheetHeader config={config} />
            <div className="worksheet-page-content">
              {page.map((kanji, index) => (
                <KanjiWorksheetRow
                  key={kanji.kanji}
                  kanji={kanji}
                  index={pageIndex * layout.itemsPerPage + index}
                  config={config}
                  layout={layout}
                />
              ))}
            </div>
            {config.showPageNumbers && (
              <footer className="worksheet-page-number">
                Trang {pageIndex + 1} / {pages.length}
              </footer>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
