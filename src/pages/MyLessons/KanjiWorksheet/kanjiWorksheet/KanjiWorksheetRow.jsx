import { formatHanViet } from "../../../../utils/kanjiWorksheet"
import KanjiPracticeGrid from "./KanjiPracticeGrid"

export default function KanjiWorksheetRow({ kanji, index, config, layout }) {
  const details = [
    config.showHanViet && [ "Hán Việt", formatHanViet(kanji.hanViet) ],
    config.showMeaning && [ "Nghĩa", kanji.meanings.join(", ") ],
    config.showOnyomi && [ "Onyomi", kanji.onyomi.join("、") ],
    config.showKunyomi && [ "Kunyomi", kanji.kunyomi.join("、") ],
    config.showHiragana && [ "Hiragana", kanji.hiragana.join("、") ],
    config.showStrokeCount && Number.isFinite(kanji.strokeCount) && [
      "Số nét",
      String(kanji.strokeCount),
    ],
    config.showRadical && [ "Bộ thủ", kanji.radicals.join("、") ],
    config.showMnemonic && [ "Gợi nhớ", kanji.mnemonic.join("、") ],
    config.showExamples && [ "Ví dụ", kanji.examples.slice(0, 2).join(" · ") ],
  ].filter((detail) => Array.isArray(detail) && detail[1])

  return (
    <section className="worksheet-kanji-row">
      <div className="worksheet-row-heading">
        <span className="shrink-0 text-[3.2mm] font-semibold text-slate-700">
          {index + 1}.
        </span>
        {config.showKanji && (
          <span className="shrink-0 text-[8mm] leading-none text-slate-900">
            {kanji.kanji}
          </span>
        )}
        {config.showHint && (
          <p className="ml-auto max-w-[46mm] text-right text-[2.4mm] leading-tight text-slate-500">
            Viết theo đúng thứ tự nét. Giữ chữ cân đối trong ô.
          </p>
        )}
      </div>

      {details.length > 0 && (
        <div className="worksheet-row-meta">
          {details.map(([label, value]) => (
            <span key={label} className="worksheet-meta-item">
              <strong>{label}:</strong> {value}
            </span>
          ))}
        </div>
      )}

      <KanjiPracticeGrid kanji={kanji} config={config} layout={layout} />
    </section>
  )
}
