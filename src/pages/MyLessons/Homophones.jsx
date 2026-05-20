import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { getDuplicateHiragana } from "../../services/lesson.service"
import { getPartOfSpeechLabel } from "../../utils/partOfSpeechMap"

export default function HomophonesPage() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [openGroups, setOpenGroups] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await getDuplicateHiragana()
            setData(res.data || [])
        } finally {
            setLoading(false)
        }
    }

    const toggleGroup = (key) => {
        setOpenGroups((p) => ({
            ...p,
            [key]: !p[key],
        }))
    }

    const filteredData = data.filter((g) =>
        g._id.includes(search.trim())
    )

    return (
        <div className="max-w-6xl mx-auto px-3 sm:px-5 md:px-8 py-4 space-y-6">

            {/* HEADER */}
            <div className="space-y-3">
                <h2 className="
                    text-xl sm:text-2xl md:text-3xl
                    font-bold
                ">
                    🔤 Từ đồng âm (Hiragana)
                </h2>

                <p className="text-gray-500 text-sm sm:text-base">
                    Các từ phát âm giống nhau nhưng khác nghĩa
                </p>

                <div className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm">
                    {data.length} nhóm
                </div>

                {/* SEARCH */}
                <div className="relative max-w-md">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm hiragana..."
                        className="
                            w-full
                            pl-9 pr-3 py-2
                            text-sm sm:text-base
                            border rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-blue-200
                        "
                    />
                </div>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-center py-10 text-gray-500">
                    Đang tải...
                </div>
            )}

            {/* LIST */}
            <div className="space-y-3">

                {filteredData.map((group) => {
                    const isOpen = openGroups[group._id]

                    return (
                        <div
                            key={group._id}
                            className="
                                border rounded-2xl
                                bg-white shadow-sm
                                overflow-hidden
                            "
                        >

                            {/* GROUP HEADER */}
                            <button
                                onClick={() => toggleGroup(group._id)}
                                className="
                                    w-full flex items-center justify-between
                                    px-3 sm:px-4 py-3
                                    hover:bg-gray-50
                                "
                            >
                                <div className="flex items-center gap-2 sm:gap-3">

                                    {isOpen ? (
                                        <ChevronDown size={18} />
                                    ) : (
                                        <ChevronRight size={18} />
                                    )}

                                    <span className="
                                        text-base sm:text-lg md:text-xl
                                        font-bold text-blue-600
                                    ">
                                        {group._id}
                                    </span>

                                    <span className="
                                        text-xs sm:text-sm text-gray-500
                                    ">
                                        {group.count} từ
                                    </span>
                                </div>
                            </button>

                            {/* ITEMS */}
                            {isOpen && (
                                <div className="border-t divide-y">

                                    {group.items.map((item) => (
                                        <div
                                            key={item._id}
                                            className="
                                                px-3 sm:px-4 py-3
                                                flex flex-col md:flex-row
                                                md:items-center md:justify-between
                                                gap-2
                                                hover:bg-gray-50
                                            "
                                        >

                                            {/* LEFT */}
                                            <div className="flex flex-wrap items-center gap-2">

                                                <span className="
                                                    font-semibold
                                                    text-base sm:text-lg
                                                    max-w-[120px] sm:max-w-none
                                                    break-words
                                                ">
                                                    {item.kanji?.trim()
                                                        ? item.kanji
                                                        : "—"}
                                                </span>

                                                <span className="
                                                    text-gray-600
                                                    text-sm sm:text-base
                                                ">
                                                    {item.meaning}
                                                </span>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="flex flex-wrap gap-2">

                                                {item.lesson && (
                                                    <span className="
                                                        text-[10px] sm:text-xs
                                                        bg-blue-100 text-blue-700
                                                        px-2 py-1 rounded-full
                                                    ">
                                                        Bài {item.lesson}
                                                    </span>
                                                )}

                                                {item.partOfSpeech && (
                                                    <span className="
                                                        text-[10px] sm:text-xs
                                                        bg-gray-100 text-gray-700
                                                        px-2 py-1 rounded-full
                                                    ">
                                                        {getPartOfSpeechLabel(item.partOfSpeech)}
                                                    </span>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    )
                })}
            </div>
        </div>
    )
}