import {
    ChevronDown,
    ChevronRight,
} from "lucide-react"

import KanjiWordCard
    from "./KanjiWordCard"

export default function KanjiFrequencyItem({
    group,
    rank,
    isOpen,
    onToggle,
}) {

    const lessonCount =
        new Set(
            group.words.map(
                w => w.lesson
            )
        ).size

    return (
        <div
            className="
                bg-white
                border
                rounded-2xl
                shadow-sm
                overflow-hidden
            "
        >

            <button
                onClick={onToggle}
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
                        flex items-center
                        justify-center
                    ">
                        #{rank}
                    </div>

                    {isOpen
                        ? <ChevronDown size={18} />
                        : <ChevronRight size={18} />
                    }

                    <div className="text-left">

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
                            (
                                item,
                                idx
                            ) => (
                                <KanjiWordCard
                                    key={`${item.kanji}-${idx}`}
                                    item={item}
                                />
                            )
                        )}

                    </div>

                </div>
            )}

        </div>
    )
}