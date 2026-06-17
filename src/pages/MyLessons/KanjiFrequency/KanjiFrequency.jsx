import { useEffect, useMemo, useState } from "react"

import {
    ChevronDown,
    ChevronRight,
    Search,
} from "lucide-react"

import {
    getKanjiFrequency
} from "../../../services/lesson.service"

import {
    getPartOfSpeechLabel
} from "../../../utils/partOfSpeechMap"

const PAGE_SIZE = 50

export default function KanjiFrequencyPage() {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")

    const [page, setPage] = useState(1)

    const [openGroups, setOpenGroups]
        = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {

        try {

            setLoading(true)

            const res =
                await getKanjiFrequency()

            setData(res.data || [])

        } finally {

            setLoading(false)
        }
    }

    const toggleGroup = (kanji) => {

        setOpenGroups(prev => ({
            ...prev,
            [kanji]: !prev[kanji],
        }))
    }

    const filteredData = useMemo(() => {

        const keyword =
            search
                .trim()
                .toLowerCase()

        return data.filter(item => {

            if (!keyword)
                return true

            return (
                item.kanji?.includes(keyword)
                ||
                item.hanViet
                    ?.toLowerCase()
                    .includes(keyword)
            )
        })

    }, [data, search])

    const totalPages =
        Math.ceil(
            filteredData.length
            / PAGE_SIZE
        )

    const paginatedData =
        filteredData.slice(
            (page - 1) * PAGE_SIZE,
            page * PAGE_SIZE
        )

    useEffect(() => {
        setPage(1)
    }, [search])

    return (
        <div className="
            max-w-6xl mx-auto
            px-3 sm:px-5 md:px-8
            py-4
            space-y-6
        ">

            {/* HEADER */}

            <div className="space-y-3">

                <h2 className="
                    text-2xl sm:text-3xl
                    font-bold
                ">
                    漢字 phổ biến
                </h2>

                <p className="
                    text-gray-500
                ">
                    Các Kanji xuất hiện nhiều nhất
                    trong từ vựng đã học
                </p>

                <div className="
                    inline-flex
                    px-3 py-1
                    rounded-full
                    bg-red-100
                    text-red-700
                    text-sm
                ">
                    {filteredData.length} Kanji
                </div>

                <div className="
                    relative
                    max-w-md
                ">
                    <Search
                        size={16}
                        className="
                            absolute
                            left-3 top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="
                        Tìm Kanji hoặc Hán Việt..."
                        className="
                            w-full
                            pl-9 pr-3 py-2
                            border rounded-xl
                            focus:outline-none
                            focus:ring-2
                            focus:ring-red-200
                        "
                    />
                </div>
            </div>

            {loading && (
                <div className="
                    text-center py-10
                    text-gray-500
                ">
                    Đang tải...
                </div>
            )}

            <div className="space-y-3">

                {paginatedData.map(
                    (group, index) => {

                        const rank =
                            (page - 1)
                            * PAGE_SIZE
                            + index
                            + 1

                        const isOpen =
                            openGroups[
                            group.kanji
                            ]

                        const lessonCount =
                            new Set(
                                group.words.map(
                                    w => w.lesson
                                )
                            ).size

                        return (
                            <div
                                key={group.kanji}
                                className="
                                    bg-white
                                    border
                                    rounded-2xl
                                    shadow-sm
                                    overflow-hidden
                                "
                            >

                                <button
                                    onClick={() =>
                                        toggleGroup(
                                            group.kanji
                                        )
                                    }
                                    className="
                                        w-full
                                        px-4 py-3
                                        flex items-center
                                        justify-between
                                        hover:bg-gray-50
                                    "
                                >

                                    <div className="
                                        flex items-center
                                        gap-3
                                    ">

                                        <div className="
                                            w-8 h-8
                                            rounded-full
                                            bg-red-100
                                            text-red-700
                                            text-sm
                                            font-bold
                                            flex
                                            items-center
                                            justify-center
                                        ">
                                            #{rank}
                                        </div>

                                        {isOpen
                                            ? <ChevronDown size={18} />
                                            : <ChevronRight size={18} />
                                        }

                                        <div className="
                                            text-left
                                        ">

                                            <div className="
                                                flex items-center
                                                gap-2
                                            ">

                                                <span className="
                                                    text-2xl
                                                    font-bold
                                                    text-red-600
                                                ">
                                                    {group.kanji}
                                                </span>

                                                {!!group.hanViet && (
                                                    <span className="
                                                        text-sm
                                                        font-semibold
                                                        text-orange-600
                                                    ">
                                                        {group.hanViet}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="
                                                text-xs
                                                text-gray-400
                                            ">
                                                VD:
                                                {" "}
                                                {group.words?.[0]?.kanji}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="
                                        flex flex-col
                                        items-end
                                        text-xs
                                    ">
                                        <span>
                                            {group.count} từ
                                        </span>

                                        <span className="
                                            text-purple-600
                                        ">
                                            {lessonCount} bài
                                        </span>
                                    </div>

                                </button>

                                {isOpen && (

                                    <div className="
        border-t
        p-4
        bg-gray-50/50
    ">

                                        <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-3
        ">

                                            {group.words.map(
                                                (item, idx) => (

                                                    <div
                                                        key={`${item.kanji}-${idx}`}
                                                        className="
                            bg-white
                            border
                            rounded-2xl
                            p-4
                            shadow-sm
                            hover:shadow-md
                            transition-all
                            duration-200
                        "
                                                    >

                                                        {/* TOP */}

                                                        <div className="
                            flex items-start
                            justify-between
                            gap-3
                        ">

                                                            <div>

                                                                <div className="
                                    text-xl
                                    font-bold
                                    text-gray-900
                                ">
                                                                    {item.kanji}
                                                                </div>

                                                                {item.hanViet && (
                                                                    <div className="
                                        text-xs
                                        font-semibold
                                        text-orange-600
                                        uppercase
                                        tracking-wide
                                    ">
                                                                        {item.hanViet}
                                                                    </div>
                                                                )}

                                                            </div>

                                                            {item.lesson && (
                                                                <span className="
                                    text-xs
                                    bg-blue-100
                                    text-blue-700
                                    px-2 py-1
                                    rounded-full
                                    shrink-0
                                ">
                                                                    Bài {item.lesson}
                                                                </span>
                                                            )}

                                                        </div>

                                                        {/* HIRAGANA */}

                                                        <div className="
                            mt-3
                            text-base
                            font-medium
                            text-indigo-600
                        ">
                                                            {item.hiragana}
                                                        </div>

                                                        {/* MEANING */}

                                                        <div className="
                            mt-2
                            text-gray-700
                            leading-relaxed
                        ">
                                                            {item.meaning}
                                                        </div>

                                                        {/* FOOTER */}

                                                        <div className="
                            mt-4
                            flex
                            flex-wrap
                            gap-2
                        ">

                                                            {item.partOfSpeech && (
                                                                <span className="
                                    text-xs
                                    bg-gray-100
                                    text-gray-700
                                    px-2 py-1
                                    rounded-full
                                ">
                                                                    {
                                                                        getPartOfSpeechLabel(
                                                                            item.partOfSpeech
                                                                        )
                                                                    }
                                                                </span>
                                                            )}

                                                        </div>

                                                    </div>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}

                            </div>
                        )
                    }
                )}
            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (

                <div className="
                    flex justify-center
                    gap-2
                    flex-wrap
                ">

                    <button
                        disabled={page === 1}
                        onClick={() =>
                            setPage(
                                p => p - 1
                            )
                        }
                        className="
                            px-3 py-2
                            border rounded-lg
                            disabled:opacity-40
                        "
                    >
                        ←
                    </button>

                    <span className="
                        px-4 py-2
                        text-sm
                    ">
                        {page}
                        /
                        {totalPages}
                    </span>

                    <button
                        disabled={
                            page === totalPages
                        }
                        onClick={() =>
                            setPage(
                                p => p + 1
                            )
                        }
                        className="
                            px-3 py-2
                            border rounded-lg
                            disabled:opacity-40
                        "
                    >
                        →
                    </button>

                </div>
            )}

        </div>
    )
}