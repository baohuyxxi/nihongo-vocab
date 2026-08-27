import KanjiWorksheetHeader from "./KanjiWorksheetHeader"
import KanjiWorksheetRow from "./KanjiWorksheetRow"

export default function KanjiWorksheet({
    selectedKanji,
    config,
}) {
    return (
        <div
            className={`
                kanji-worksheet
                mx-auto
                bg-white
                text-slate-900
                shadow-xl

                ${
                    config.orientation === "landscape"
                        ? "min-h-[210mm] w-[297mm]"
                        : "min-h-[297mm] w-[210mm]"
                }
            `}
        >
            <KanjiWorksheetHeader />

            <div
                className="
                    px-[7mm]
                    pb-[8mm]
                    pt-[2mm]
                "
            >
                {selectedKanji.map(
                    (item, index) => (
                        <KanjiWorksheetRow
                            key={`${item.kanji}-${index}`}
                            kanji={item}
                            index={index}
                            config={config}
                        />
                    )
                )}
            </div>
        </div>
    )
}