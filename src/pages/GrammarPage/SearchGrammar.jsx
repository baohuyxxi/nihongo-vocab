import { Search, Languages } from "lucide-react"

import JPTableInput from "../../components/JPTableInput"

export default function SearchGrammar({
    wrapperRef,

    jpSearch,
    setJpSearch,

    viSearch,
    setViSearch,

    setShowDropdown,
    setActiveIndex,
}) {

    return (

        <div
            ref={wrapperRef}
            className="
                relative
                space-y-3
            "
        >
            {/* JP */}
            <div
                className="
                    flex items-center
                    gap-3
                    border
                    rounded-2xl
                    bg-gray-50
                    px-4
                    py-3
                "
            >

                <Search
                    size={20}
                    className="
                        text-gray-400
                        shrink-0
                    "
                />

                <JPTableInput
                    value={jpSearch}
                    onChange={(v) => {
                        setJpSearch(v)
                        setViSearch("")

                        setShowDropdown(true)
                        setActiveIndex(0)
                    }}
                    placeholder="～ている / ～ことがある / ～ように"
                    className="
                    text-base
                    sm:text-lg
                    w-full"
                />

            </div>

            {/* VI */}

            <div
                className="
                    flex items-center
                    gap-3
                    border
                    rounded-2xl
                    bg-gray-50
                    px-4
                    py-3"
            >

                <Languages
                    size={20}
                    className="
                        text-gray-400
                        shrink-0
                    "
                />

                <input
                    value={viSearch}
                    onChange={(e) => {

                        setViSearch(
                            e.target.value
                        )
                        setJpSearch("")
                        setShowDropdown(true)
                        setActiveIndex(0)

                    }}
                    placeholder="đã từng / đang làm / mục đích"
                    className="
                        bg-transparent
                        outline-none
                        text-base
                        sm:text-lg
                        w-full
                    "
                />

            </div>

        </div>

    )

}