export default function KanjiPracticeGrid({
    kanji,
    config,
}) {
    const total =
        Math.max(
            2,
            Number(config.practiceCount) || 10
        )

    // Số ô Kanji đậm
    const sampleCount =
        Math.min(
            total,
            Math.max(
                1,
                Number(config.sampleCount) || 1
            )
        )

    // Số ô Kanji mờ sau ô đậm
    const fadedCount =
        Math.min(
            Math.max(
                0,
                total - sampleCount
            ),
            Number(config.fadedCount) || 5
        )

    return (
        <div
            className="
                grid
                grid-cols-[repeat(auto-fit,minmax(0,1fr))]
                border-l
                border-t
                border-slate-300
            "
        >
            {Array.from({
                length: total,
            }).map((_, index) => {

                /*
                 * Ví dụ:
                 *
                 * total = 12
                 * sampleCount = 1
                 * fadedCount = 5
                 *
                 * index 0
                 *   → Kanji đậm
                 *
                 * index 1 -> 5
                 *   → Kanji mờ
                 *
                 * index 6 -> 11
                 *   → hoàn toàn trống
                 */

                const isSample =
                    index < sampleCount

                const isFaded =
                    index >= sampleCount &&
                    index <
                        sampleCount +
                        fadedCount

                const showKanji =
                    isSample ||
                    isFaded

                return (
                    <div
                        key={index}
                        className="
                            relative
                            aspect-square
                            min-w-0
                            border-b
                            border-r
                            border-slate-300
                            bg-white
                        "
                    >
                        {/* =========================
                            Horizontal guide
                        ========================= */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                left-0
                                right-0
                                top-1/2
                                border-t
                                border-dashed
                                border-slate-200
                            "
                        />


                        {/* =========================
                            Vertical guide
                        ========================= */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                bottom-0
                                left-1/2
                                top-0
                                border-l
                                border-dashed
                                border-slate-200
                            "
                        />


                        {/* =========================
                            Diagonal guides
                        ========================= */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                overflow-hidden
                            "
                        >
                            <div
                                className="
                                    absolute
                                    left-1/2
                                    top-1/2
                                    h-[141%]
                                    w-px
                                    origin-center
                                    -rotate-45
                                    border-l
                                    border-dashed
                                    border-slate-100
                                "
                            />

                            <div
                                className="
                                    absolute
                                    left-1/2
                                    top-1/2
                                    h-[141%]
                                    w-px
                                    origin-center
                                    rotate-45
                                    border-l
                                    border-dashed
                                    border-slate-100
                                "
                            />
                        </div>


                        {/* =========================
                            Kanji
                        ========================= */}

                        {showKanji && (
                            <div
                                className={`
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    flex
                                    items-center
                                    justify-center

                                    font-serif
                                    text-[clamp(28px,4vw,54px)]
                                    leading-none

                                    ${
                                        isSample
                                            ? "text-slate-900"
                                            : "text-slate-300"
                                    }
                                `}
                            >
                                {kanji.kanji}
                            </div>
                        )}


                        {/* =========================
                            Mẫu
                        ========================= */}

                        {config.showStrokeNumber &&
                            index === 0 && (
                                <span
                                    className="
                                        absolute
                                        right-1
                                        top-1
                                        text-[7px]
                                        text-slate-400
                                    "
                                >
                                    mẫu
                                </span>
                            )}
                    </div>
                )
            })}
        </div>
    )
}