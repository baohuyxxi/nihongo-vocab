import KanjiPracticeGrid from "./KanjiPracticeGrid"

export default function KanjiWorksheetRow({
    kanji,
    index,
    config,
}) {

    /*
     * Viết hoa chữ cái đầu Hán Việt
     *
     * Ví dụ:
     * "nhật"       -> "Nhật"
     * "nhật bản"   -> "Nhật bản"
     * "đản sinh nhật" -> "Đản sinh nhật"
     */
    const formatHanViet = (text = "") => {

        const value =
            String(text).trim()

        if (!value) {
            return ""
        }

        return (
            value.charAt(0).toUpperCase()
            +
            value.slice(1)
        )
    }


    return (
        <section
            className="
                kanji-worksheet-row
                mb-[4mm]
                break-inside-avoid
            "
        >

            {/* =========================================
                HEADER
            ========================================= */}

            <div
                className="
                    mb-[1.5mm]
                    flex
                    items-end
                    justify-between
                    gap-4
                "
            >

                {/* =====================================
                    STT + KANJI + HÁN VIỆT
                ===================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-baseline
                        gap-[3mm]
                    "
                >

                    {/* ================================
                        STT
                    ================================= */}

                    <span
                        className="
                            shrink-0
                            text-[15px]
                            font-semibold
                            leading-[1.3]
                            text-slate-700
                        "
                    >
                        {index + 1}.
                    </span>


                    {/* ================================
                        KANJI
                    ================================= */}

                    <span
                        className="
                            shrink-0
                            text-[34px]
                            font-normal
                            leading-[1]
                            text-slate-900
                        "
                    >
                        {kanji.kanji}
                    </span>


                    {/* ================================
                        HÁN VIỆT
                    ================================= */}

                    {config.showMeaning && (
                        <span
                            className="
                                max-w-[60mm]
                                truncate
                                text-[14px]
                                font-medium
                                leading-[1.35]
                                text-slate-600
                            "
                        >
                            {formatHanViet(
                                kanji.hanViet
                            )}
                        </span>
                    )}

                </div>


                {/* =====================================
                    HINT
                ===================================== */}

                {config.showHint && (
                    <div
                        className="
                            shrink-0
                            pb-[1px]
                            text-right
                            text-[8.5px]
                            leading-[1.4]
                            text-slate-500
                        "
                    >
                        Viết theo đúng thứ tự nét.
                        <br />
                        Giữ chữ cân đối trong ô.
                    </div>
                )}

            </div>


            {/* =========================================
                PRACTICE GRID
            ========================================= */}

            <KanjiPracticeGrid
                kanji={kanji}
                config={config}
            />

        </section>
    )
}