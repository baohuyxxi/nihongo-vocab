import {
    getPartOfSpeechLabel
} from "../../../utils/partOfSpeechMap"

export default function KanjiWordCard({
    item,
}) {

    return (

        <div
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

            {/* HEADER */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                {/* LEFT */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <div
                        className="
                            text-xl
                            font-bold
                            text-gray-900
                            break-words
                        "
                    >
                        {item.kanji}
                    </div>

                    <div
                        className="
                            mt-1
                            text-base
                            font-medium
                            text-indigo-600
                        "
                    >
                        {item.hiragana}
                    </div>

                </div>

                {/* RIGHT */}

                <div
                    className="
                        text-right
                        max-w-[50%]
                        shrink-0
                    "
                >
                    {item.hanViet && (

                        <div
                            className="
                                mt-1
                                text-xs
                                font-semibold
                                text-orange-600
                                uppercase
                                tracking-wide
                            "
                        >
                            {item.hanViet}
                        </div>

                    )}

                    <div
                        className="
                            text-gray-800
                            font-medium
                            break-words
                        "
                    >
                        {item.meaning}
                    </div>



                </div>

            </div>

            {/* FOOTER */}

            <div
                className="
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                "
            >

                {item.partOfSpeech && (

                    <span
                        className="
                            text-xs
                            bg-gray-100
                            text-gray-700
                            px-2 py-1
                            rounded-full
                        "
                    >
                        {
                            getPartOfSpeechLabel(
                                item.partOfSpeech
                            )
                        }
                    </span>

                )}

                {item.lesson && (

                    <span
                        className="
                            text-xs
                            bg-blue-100
                            text-blue-700
                            px-2 py-1
                            rounded-full
                        "
                    >
                        Bài {item.lesson}
                    </span>

                )}

            </div>

        </div>

    )
}