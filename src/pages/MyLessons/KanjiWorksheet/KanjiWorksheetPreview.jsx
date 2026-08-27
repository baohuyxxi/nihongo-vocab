import KanjiWorksheet from "./kanjiWorksheet/KanjiWorksheet"

export default function KanjiWorksheetPreview({
    selectedKanji,
    config,
    onPrint,
}) {
    return (
        <div className="space-y-4">
            <div
                className="
                    flex flex-col gap-3
                    rounded-2xl border border-slate-200
                    bg-white p-4 shadow-sm
                    sm:flex-row sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h2 className="font-bold text-slate-800">
                        Preview
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Kiểm tra worksheet trước khi in.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onPrint}
                    disabled={!selectedKanji.length}
                    className="
                        rounded-xl
                        bg-indigo-600
                        px-4 py-2.5
                        text-sm font-bold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-indigo-700
                        disabled:cursor-not-allowed
                        disabled:bg-slate-300
                    "
                >
                    🖨 In / Lưu PDF
                </button>
            </div>

            <div
                className="
                    overflow-x-auto
                    rounded-2xl
                    border border-slate-200
                    bg-slate-200
                    p-2
                    sm:p-4
                    lg:p-6
                "
            >
                {selectedKanji.length === 0 ? (
                    <div
                        className="
                            flex min-h-[500px]
                            items-center justify-center
                            text-center text-sm
                            text-slate-500
                        "
                    >
                        Chọn ít nhất một Kanji để xem preview.
                    </div>
                ) : (
                    <KanjiWorksheet
                        selectedKanji={selectedKanji}
                        config={config}
                    />
                )}
            </div>
        </div>
    )
}