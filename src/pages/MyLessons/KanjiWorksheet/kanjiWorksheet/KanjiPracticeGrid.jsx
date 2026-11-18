export default function KanjiPracticeGrid({ kanji, config, layout }) {
  const cells = [
    ...Array.from({ length: config.sampleCount }, () => "sample"),
    ...Array.from({ length: config.fadedCount }, () => "faded"),
    ...Array.from({ length: config.blankCount }, () => "blank"),
  ]
  const style = {
    gridTemplateColumns: `repeat(${layout.columns}, ${layout.cellSizeMm}mm)`,
    "--worksheet-cell-size": `${layout.cellSizeMm}mm`,
    "--worksheet-kanji-font-size": `${layout.cellSizeMm * 0.68}mm`,
    "--worksheet-sample-color": config.sampleColor,
    "--worksheet-faded-opacity": String(config.fadedOpacity / 100),
  }

  return (
    <div
      className="worksheet-practice-grid"
      data-grid-style={config.gridStyle}
      style={style}
      aria-label={`Ô luyện viết cho ${kanji.kanji}`}
    >
      {cells.map((type, index) => (
        <div
          key={`${kanji.kanji}-${index}`}
          className="worksheet-practice-cell"
          aria-label={type === "sample" ? "Ô mẫu" : type === "faded" ? "Ô chữ mờ" : "Ô trống"}
        >
          <span className="worksheet-guide worksheet-guide-horizontal" aria-hidden="true" />
          <span className="worksheet-guide worksheet-guide-vertical" aria-hidden="true" />
          <span className="worksheet-guide worksheet-guide-diagonal worksheet-guide-diagonal-forward" aria-hidden="true" />
          <span className="worksheet-guide worksheet-guide-diagonal worksheet-guide-diagonal-backward" aria-hidden="true" />
          {type !== "blank" && config.showKanji && (
            <span className={`worksheet-kanji-character ${type === "faded" ? "is-faded" : "is-sample"}`}>
              {kanji.kanji}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
