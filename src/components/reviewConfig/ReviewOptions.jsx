import { useState, useEffect } from "react"

const REVIEW_MODES = [
    { key: "typing", label: "✍️ Điền từ" },
    { key: "quiz", label: "🧠 Trắc nghiệm" },
    { key: "flashcard", label: "🃏 Flashcard" },
]

const DIRECTIONS = [
    { key: "jp_vi", label: "Nhật → Việt" },
    { key: "vi_jp", label: "Việt → Nhật" },
    { key: "kanji", label: "Kanji" },
    { key: "image", label: "Hình ảnh" },
]

const LIMIT_OPTIONS = [
    10,
    20,
    30,
    50,
    100,
]

export default function ReviewOptions({
    mode,
    setMode,
    directions,
    setDirections,
    reviewLimit,
    setReviewLimit,

}) {
    const [showLimitOptions, setShowLimitOptions] = useState(false)
    const [reviewedCount, setReviewedCount] = useState(0)
    const [reviewTotal, setReviewTotal] = useState(0)

    const toggleDirection = (key) => {
        setDirections((prev) => {
            if (prev.includes(key)) {
                // Không cho phép bỏ hết hướng ôn
                if (prev.length === 1) {
                    return prev
                }

                return prev.filter((d) => d !== key)
            }

            return [...prev, key]
        })
    }

    useEffect(() => {

        const reviewSessionData =
            JSON.parse(
                localStorage.getItem("reviewSessionData")
            )

        const progress =
            reviewSessionData?.progress

        const flashcardProgress =
            JSON.parse(
                localStorage.getItem("flashcardProgress")
            )?.list?.length || 0

        let count = 0

        if (
            progress &&
            reviewSessionData?.session?.total > 0
        ) {

            count =
                progress.reviewedVocabs
                - progress.selectedVocabs
                + Math.round(
                    flashcardProgress /
                    reviewSessionData.session.total
                )

        }

        setReviewedCount(count)

        setReviewTotal(
            progress?.total || 0
        )

    }, [])
    return (
        <div className="space-y-6">

            {/* MODE */}

            <section className="bg-white rounded-xl shadow p-5">

                <h2 className="font-semibold mb-4 flex items-center gap-2">
                    🎮 <span>Chế độ ôn</span>
                </h2>

                <div className="space-y-3">

                    {REVIEW_MODES.map((item) => (
                        <label
                            key={item.key}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <input
                                type="radio"
                                className="scale-110"
                                checked={mode === item.key}
                                onChange={() => setMode(item.key)}
                            />

                            <span>{item.label}</span>
                        </label>
                    ))}

                </div>

            </section>


            {/* DIRECTION */}

            <section className="bg-white rounded-xl shadow p-5">

                <h2 className="font-semibold mb-4 flex items-center gap-2">
                    🔁 <span>Hướng ôn</span>
                </h2>

                <div className="space-y-3">

                    {DIRECTIONS.map((item) => (
                        <label
                            key={item.key}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className="scale-110"
                                checked={directions.includes(item.key)}
                                onChange={() =>
                                    toggleDirection(item.key)
                                }
                            />

                            <span>{item.label}</span>
                        </label>
                    ))}

                </div>

            </section>


            {/* LIMIT */}

            <section className="bg-white rounded-xl shadow p-5">

                <h2 className="font-semibold mb-4 flex items-center gap-2">
                    🔢 <span>Số lượng từ mỗi phiên</span>
                </h2>

                <div className="relative">

                    <div
                        className="
              flex
              items-center
              border
              border-gray-300
              rounded-lg
              bg-white
              focus-within:ring-2
              focus-within:ring-blue-500
              focus-within:border-blue-500
              overflow-hidden
            "
                    >

                        <input
                        
                            value={reviewLimit ?? ""}
                            placeholder="Tất cả"
                            onChange={(e) => {
                                const value = e.target.value

                                if (value === "" || value === "0" || value === null) {
                                    setReviewLimit(null)
                                    return
                                }

                                const number = Number(value)

                                if (number > 0) {
                                    setReviewLimit(number)
                                }
                            }}
                            className="
                flex-1
                min-w-0
                px-3
                py-2
                text-sm
                outline-none
                bg-transparent
              "
                        />

                        <span
                            className="
                text-sm
                text-gray-400
                px-2
                select-none
              "
                        >
                            từ
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setShowLimitOptions((prev) => !prev)
                            }
                            className="
                px-3
                py-2
                border-l
                border-gray-200
                text-gray-500
                hover:bg-gray-50
                transition
                flex
                items-center
                justify-center
              "
                        >
                            <svg
                                className={`
                  w-4
                  h-4
                  transition-transform
                  ${showLimitOptions
                                        ? "rotate-180"
                                        : ""
                                    }
                `}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 9-7 7-7-7"
                                />
                            </svg>
                        </button>

                    </div>


                    {showLimitOptions && (
                        <div
                            className="
                absolute
                z-50
                left-0
                right-0
                mt-1
                bg-white
                border
                border-gray-200
                rounded-lg
                shadow-lg
                overflow-hidden
              "
                        >

                            {LIMIT_OPTIONS.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => {
                                        setReviewLimit(value)
                                        setShowLimitOptions(false)
                                    }}
                                    className={`
                    w-full
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    transition
                    hover:bg-blue-50

                    ${reviewLimit === value
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "text-gray-700"
                                        }
                  `}
                                >
                                    {value} từ
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    setReviewLimit(null)
                                    setShowLimitOptions(false)
                                }}
                                className={`
                  w-full
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  border-t
                  border-gray-100
                  transition
                  hover:bg-gray-50

                  ${reviewLimit === null
                                        ? "text-blue-600 font-medium"
                                        : "text-gray-700"
                                    }
                `}
                            >
                                Tất cả
                            </button>

                        </div>
                    )}

                </div>


                {/* PROGRESS */}

                <div className="mt-5">

                    <div className="flex justify-between items-center text-sm mb-2">

                        <span className="text-gray-600">
                            Tiến độ
                        </span>

                        <span className="font-semibold text-gray-800">
                            {reviewedCount} / {reviewTotal}
                        </span>

                    </div>

                    <div
                        className="
              w-full
              h-2
              bg-gray-200
              rounded-full
              overflow-hidden
            "
                    >
                        <div
                            className="
                h-full
                bg-blue-600
                transition-all
                duration-300
              "
                            style={{
                                width:
                                    reviewTotal > 0
                                        ? `${Math.min(
                                            100,
                                            (reviewedCount /
                                                reviewTotal) *
                                            100
                                        )}%`
                                        : "0%",
                            }}
                        />
                    </div>

                    {reviewTotal > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            Còn{" "}
                            {Math.max(
                                0,
                                reviewTotal - reviewedCount
                            )}{" "}
                            từ chưa ôn
                        </p>
                    )}

                </div>

            </section>

        </div>
    )
}