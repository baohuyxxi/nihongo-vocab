import { Search, Languages } from "lucide-react"
import JPTableInput from "../../components/JPTableInput"

export default function SearchGrammar({
    wrapperRef,

    jpSearch,
    setJpSearch,

    viSearch,
    setViSearch,

    suggestions,
    showDropdown,
    setShowDropdown,

    activeIndex,
    setActiveIndex,

    setSelected
}) {

    const handleSelect = (item) => {

        setJpSearch(item.key)
        setViSearch("")
        setShowDropdown(false)
        setSelected(item)
    }

    const handleKeyDown = (e) => {

        if (!showDropdown || suggestions.length === 0) return

        if (e.key === "ArrowDown") {

            e.preventDefault()

            setActiveIndex(prev =>
                Math.min(prev + 1, suggestions.length - 1)
            )
        }

        if (e.key === "ArrowUp") {

            e.preventDefault()

            setActiveIndex(prev =>
                Math.max(prev - 1, 0)
            )
        }

        if (e.key === "Enter") {

            e.preventDefault()

            const item = suggestions[activeIndex]

            if (item) handleSelect(item)
        }

        if (e.key === "Escape") {
            setShowDropdown(false)
        }
    }

    return (
        <div
            ref={wrapperRef}
            className="relative space-y-3"
        >

            {/* JP */}
            <div className="flex items-center gap-3 border rounded-2xl bg-gray-50 px-4 py-3">

                <Search size={20} className="text-gray-400 shrink-0" />

                <JPTableInput
                    value={jpSearch}
                    onChange={(v) => {

                        setJpSearch(v)
                        setViSearch("")
                        setShowDropdown(true)
                        setActiveIndex(0)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="～ている / ～ことがある / ～ように"
                    className="text-base sm:text-lg w-full"
                />
            </div>

            {/* VI */}
            <div className="flex items-center gap-3 border rounded-2xl bg-gray-50 px-4 py-3">

                <Languages size={20} className="text-gray-400 shrink-0" />

                <input
                    value={viSearch}
                    onChange={(e) => {

                        setViSearch(e.target.value)
                        setJpSearch("")
                        setShowDropdown(true)
                        setActiveIndex(0)
                    }}
                    placeholder="đã từng / đang làm / mục đích"
                    className="bg-transparent outline-none text-base sm:text-lg w-full"
                />
            </div>

            {/* DROPDOWN */}
            {
                showDropdown &&
                suggestions.length > 0 && (

                    <div className="absolute top-[110px] left-0 right-0 bg-white border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">

                        {
                            suggestions.map((item, index) => (

                                <div
                                    key={item._id}
                                    onClick={() => handleSelect(item)}
                                    className={`
                                        px-4 py-3 cursor-pointer
                                        border-b last:border-0
                                        ${index === activeIndex
                                            ? "bg-blue-50"
                                            : "hover:bg-gray-50"
                                        }
                                    `}
                                >

                                    <div className="font-semibold text-gray-900">
                                        {item.key}
                                    </div>

                                    <div className="text-sm text-blue-600">
                                        {item.meaning}
                                    </div>

                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>
    )
}