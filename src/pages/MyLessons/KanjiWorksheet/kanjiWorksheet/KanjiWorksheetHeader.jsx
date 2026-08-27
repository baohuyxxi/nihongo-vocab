export default function KanjiWorksheetHeader() {
    return (
        <div
            className="
                border-b-2 border-slate-800
                px-[7mm] py-[5mm]
            "
        >
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1
                        className="
                            text-[20px]
                            font-black
                            tracking-wide
                        "
                    >
                        漢字 練習
                    </h1>

                    <p
                        className="
                            mt-1 text-[9px]
                            text-slate-500
                        "
                    >
                        Kanji Writing Practice
                    </p>
                </div>

                <div
                    className="
                        flex gap-6
                        text-[9px]
                        text-slate-500
                    "
                >
                    <span>
                        名前: __________________
                    </span>

                    <span>
                        日付: __________
                    </span>
                </div>
            </div>
        </div>
    )
}