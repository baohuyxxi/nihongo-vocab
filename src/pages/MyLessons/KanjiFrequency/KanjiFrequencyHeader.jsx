import { Search } from "lucide-react"

export default function KanjiFrequencyHeader({
    search,
    setSearch,
    total,
}) {

    return (
        <div className="space-y-3">

            <h2 className="
                text-2xl sm:text-3xl
                font-bold
            ">
                漢字 phổ biến
            </h2>

            <p className="text-gray-500">
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
                {total} Kanji
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
                    "
                />

            </div>

        </div>
    )
}