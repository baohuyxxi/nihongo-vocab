function display(value) {
  return typeof value === "string" ? value.trim() : ""
}

export default function KanjiWorksheetHeader({ config }) {
  const fields = [
    ["Học viên", config.studentName],
    ["Lớp", config.className],
    ["Ngày", config.worksheetDate],
    ["Giáo viên", config.teacherName],
  ].filter(([, value]) => display(value))

  if (!config.showHeader) return null

  return (
    <header className="worksheet-page-header">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {display(config.titleJapanese) && (
            <h1 className="text-[6mm] font-bold leading-tight">
              {display(config.titleJapanese)}
            </h1>
          )}
          {display(config.worksheetTitle) && (
            <p className="mt-[1mm] text-[2.8mm] text-slate-600">
              {display(config.worksheetTitle)}
            </p>
          )}
        </div>
      </div>

      {fields.length > 0 && (
        <div className="mt-[2mm] flex flex-wrap gap-x-[6mm] gap-y-[1mm] text-[2.5mm] text-slate-600">
          {fields.map(([label, value]) => (
            <span key={label}>
              {label}: {display(value)}
            </span>
          ))}
        </div>
      )}

      {display(config.notes) && (
        <p className="mt-[1mm] break-words text-[2.4mm] text-slate-600">
          {display(config.notes)}
        </p>
      )}
    </header>
  )
}
