import { ChevronLeft, ChevronRight } from "lucide-react"

export default function FilterGrammar({
    lesson,
    showAll,
    setSearchParams,
}) {

    const changeLesson = (newLesson) => {
        const next = Math.min(50, Math.max(1, newLesson))

        setSearchParams({
            lesson: next
        })
    }

    const handleShowAll = () => {
        setSearchParams({})
    }

    return (
        <div className="flex items-center gap-3 flex-wrap">

            {/* TẤT CẢ */}
            <button
                onClick={handleShowAll}
                className={`
                    px-4 py-2 rounded-xl border transition
                    ${showAll
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white border-gray-200 hover:bg-blue-50"
                    }
                `}
            >
                Tất cả
            </button>

            {/* THEO BÀI */}
            <div className="flex items-center gap-2">

                <button
                    onClick={() => changeLesson(lesson - 1)}
                    className="border px-2 py-2 rounded-xl hover:bg-gray-50"
                >
                    <ChevronLeft size={18} />
                </button>

                <select
                    value={lesson}
                    onChange={(e) => changeLesson(Number(e.target.value))}
                    className="border px-3 py-2 rounded-xl font-medium outline-none"
                >
                    {Array.from({ length: 50 }, (_, i) => i + 1).map((l) => (
                        <option key={l} value={l}>
                            Bài {l}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => changeLesson(lesson + 1)}
                    className="border px-2 py-2 rounded-xl hover:bg-gray-50"
                >
                    <ChevronRight size={18} />
                </button>

            </div>

        </div>
    )
}