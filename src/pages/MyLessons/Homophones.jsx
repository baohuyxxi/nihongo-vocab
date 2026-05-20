import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronDown, ChevronRight } from "lucide-react"
import { getDuplicateHiragana } from "../../services/lesson.service"
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
            setData(res.data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    const filteredData = data.filter((group) =>
        group._id.includes(search)
    )

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* HEADER */}
            <h2 className="text-2xl font-bold">
                Các từ đồng âm
            </h2>

            <p className="text-gray-600 mt-1">
                Những từ có cùng hiragana nhưng khác nghĩa
            </p>

            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                {data.length} từ đồng âm
            </div>


            {/* LOADING */}
            {loading && (
                <div className="text-center py-10 text-gray-500">
                    Đang tải dữ liệu...
                </div>
            )}

            {/* EMPTY */}
            {!loading && filteredData.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    Không có dữ liệu
                </div>
            )}

            {/* LIST */}
            <div className="space-y-4">
                {filteredData.map((group) => {
                    const isOpen = openGroups[group._id]

                    return (
                        <div
                            key={group._id}
                            className="border rounded-2xl bg-white shadow-sm overflow-hidden"
                        >
                            {/* HEADER */}
                            <button
                                onClick={() => toggleGroup(group._id)}
                                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    {isOpen ? (
                                        <ChevronDown size={18} />
                                    ) : (
                                        <ChevronRight size={18} />
                                    )}

                                    <h2 className="text-lg font-bold text-blue-600">
                                        {group._id}
                                    </h2>

                                    <span className="text-sm text-gray-500">
                                        {group.count} từ
                                    </span>
                                </div>
                            </button>

                            {/* CONTENT */}
                            {isOpen && (
                                <div className="border-t divide-y">
                                    {group.items.map((item) => (
                                        <div
                                            key={item._id}
                                            className="px-4 py-3 hover:bg-gray-50 transition"
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* KANJI */}
                                                <span className="font-semibold text-lg">
                                                    {item.kanji && item.kanji.trim() !== ""
                                                        ? item.kanji
                                                        : "Không có kanji"}
                                                </span>

                                                {/* MEANING */}
                                                <span className="text-gray-700">
                                                    — {item.meaning}
                                                </span>

                                                {/* LESSON */}
                                                {item.lesson && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                        Bài {item.lesson}
                                                    </span>
                                                )}

                                                {/* TYPE */}
                                                {item.partOfSpeech && (
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                        {item.partOfSpeech}
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