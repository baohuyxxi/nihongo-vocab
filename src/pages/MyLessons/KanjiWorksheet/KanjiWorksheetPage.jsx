import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import KanjiWorksheetConfig from "./KanjiWorksheetConfig"
import KanjiWorksheetPreview from "./KanjiWorksheetPreview"

export default function KanjiWorksheetPage() {
    const [searchParams] = useSearchParams()

    const initialKanji = useMemo(() => {
        const value = searchParams.get("kanji")
        if (!value) return []
        return value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean)
    }, [searchParams])
    const [selectedKanji, setSelectedKanji] =
        useState(initialKanji)

    const [config, setConfig] = useState({
        practiceCount: 10,
        sampleCount: 1,
        showMeaning: true,
        showReading: true,
        showHint: true,
        showHeader: true,
        showStrokeNumber: false,
        pageSize: "A4",
        orientation: "portrait",
    })

    const [previewMode, setPreviewMode] =
        useState(false)

    const removeKanji = (kanji) => {
        setSelectedKanji(prev =>
            prev.filter(item => item !== kanji)
        )
    }

    const clearKanji = () => {
        setSelectedKanji([])
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div
                className="
                    mx-auto w-full max-w-[1600px]
                    px-3 py-4
                    sm:px-5 sm:py-5
                    lg:px-8 lg:py-6
                "
            >
                <div
                    className="
                        mb-5
                        flex flex-col gap-3
                        sm:flex-row sm:items-center
                        sm:justify-between
                    "
                >
                    <div>
                        <h1
                            className="
                                text-xl font-bold text-slate-800
                                sm:text-2xl lg:text-3xl
                            "
                        >
                            Tạo tập viết Kanji
                        </h1>

                        <p
                            className="
                                mt-1 text-sm text-slate-500
                                sm:text-base
                            "
                        >
                            Tạo worksheet Kanji để luyện viết và in ra giấy.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setPreviewMode(prev => !prev)}
                        className="
                            rounded-xl border border-slate-200
                            bg-white px-4 py-2.5
                            text-sm font-semibold text-slate-700
                            shadow-sm transition
                            hover:bg-slate-50
                            sm:hidden
                        "
                    >
                        {previewMode
                            ? "← Cấu hình"
                            : "Xem Preview"}
                    </button>
                </div>

                <div
                    className="
                        grid grid-cols-1 gap-5
                        lg:grid-cols-[360px_minmax(0,1fr)]
                        xl:grid-cols-[390px_minmax(0,1fr)]
                    "
                >
                    <aside
                        className={`
                            ${
                                previewMode
                                    ? "hidden sm:block"
                                    : "block"
                            }
                        `}
                    >
                        <KanjiWorksheetConfig
                            selectedKanji={selectedKanji}
                            setSelectedKanji={setSelectedKanji}
                            config={config}
                            setConfig={setConfig}
                            onRemoveKanji={removeKanji}
                            onClear={clearKanji}
                        />
                    </aside>

                    <main
                        className={`
                            ${
                                previewMode
                                    ? "block"
                                    : "hidden sm:block"
                            }
                        `}
                    >
                        <KanjiWorksheetPreview
                            selectedKanji={selectedKanji}
                            config={config}
                            onPrint={handlePrint}
                        />
                    </main>
                </div>
            </div>
        </div>
    )
}