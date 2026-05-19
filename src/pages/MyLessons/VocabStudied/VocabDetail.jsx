import { useEffect, useState } from "react"

import {
    Volume2,
    Pencil,
    Save
} from "lucide-react"

import EditableField from "./EditableField"

import { speakJP } from "../../../utils/speak"

import { partOfSpeechMap }
    from "../../../utils/partOfSpeechMap"

export default function VocabDetail({
    selected,
    onSave,
}) {

    const [editMode, setEditMode]
        = useState(false)

    const [data, setData]
        = useState(null)

    useEffect(() => {

        setData(selected)

    }, [selected])

    if (!selected || !data) {

        return (
            <div className="text-center text-gray-400 py-20">
                Chọn từ vựng
            </div>
        )

    }

    const updateField = (key, value) => {

        setData(prev => ({
            ...prev,
            [key]: value
        }))

    }

    return (

        <div
            className="
        bg-white
        rounded-3xl
        border
        overflow-hidden
      "
        >

            <div className="grid md:grid-cols-2">

                {/* IMAGE */}

                <div className="p-8 border-r">

                    <div
                        className="
              aspect-square
              rounded-2xl
              overflow-hidden
              bg-gray-100
            "
                    >

                        <img
                            src={
                                data.image?.url ||
                                data.image ||
                                "https://placehold.co/600x600?text=No+Image"
                            }
                            alt=""
                            className="
                w-full
                h-full
                object-cover
              "
                        />

                    </div>

                </div>

                {/* RIGHT */}

                <div className="p-8 flex flex-col gap-5">

                    {/* ACTION */}

                    <div className="flex justify-end gap-3">

                        <button
                            onClick={() =>
                                setEditMode(!editMode)
                            }
                            className="
                p-3 rounded-full border
              "
                        >
                            <Pencil size={20} />
                        </button>

                        {editMode && (

                            <button
                                onClick={() => {

                                    onSave(data)
                                    setEditMode(false)

                                }}
                                className="
                  p-3 rounded-full border
                  bg-blue-500 text-white
                "
                            >
                                <Save size={20} />
                            </button>

                        )}

                    </div>

                    {/* WORD */}

                    <div
                        onClick={() =>
                            speakJP(
                                data.hiragana ||
                                data.katakana,
                                1
                            )
                        }
                        className="
              text-5xl
              font-bold
              cursor-pointer
            "
                    >
                        {data.hiragana ||
                            data.katakana}
                    </div>

                    {/* LESSON */}

                    <div
                        className="
              inline-flex
              px-3 py-1
              rounded-full
              bg-orange-100
              text-orange-700
              text-sm
              w-fit
            "
                    >
                        Bài {data.lesson || "?"}
                    </div>

                    {/* AUDIO */}

                    <button
                        onClick={() =>
                            speakJP(
                                data.hiragana ||
                                data.katakana,
                                1
                            )
                        }
                        className="
              w-fit
              p-3 rounded-full border
            "
                    >
                        <Volume2 size={20} />
                    </button>

                    {/* FIELDS */}

                    {editMode ? (

                        <>

                            <EditableField
                                label="Kanji"
                                value={data.kanji}
                                onChange={(v) =>
                                    updateField("kanji", v)
                                }
                            />

                            <EditableField
                                label="Hiragana"
                                value={data.hiragana}
                                onChange={(v) =>
                                    updateField("hiragana", v)
                                }
                            />

                            <EditableField
                                label="Romaji"
                                value={data.romaji}
                                onChange={(v) =>
                                    updateField("romaji", v)
                                }
                            />

                            <EditableField
                                label="Meaning"
                                value={data.meaning}
                                onChange={(v) =>
                                    updateField("meaning", v)
                                }
                            />
                            <EditableField
                                label="Loại từ"
                                type="select"
                                value={data.partOfSpeech}
                                options={[
                                    "noun",

                                    "verb_g_1",
                                    "verb_g_2",
                                    "verb_g_3",

                                    "adj_i",
                                    "adj_na",

                                    "adverb",
                                    "conjunction",

                                    "pronoun",
                                    "interjection",

                                    "expression",
                                    "counter",

                                    "prefix",
                                    "suffix",
                                ]}
                                onChange={(v) =>
                                    updateField(
                                        "partOfSpeech",
                                        v
                                    )
                                }
                            />
                        </>

                    ) : (

                        <>

                            {data.kanji && (
                                <div className="text-3xl">
                                    {data.kanji}
                                </div>
                            )}

                            {data.meaning && (
                                <div className="text-xl">
                                    {data.meaning}
                                </div>
                            )}

                            {data.partOfSpeech && (
                                <div
                                    className="
                    inline-flex
                    px-3 py-1
                    rounded-full
                    bg-blue-100
                    text-blue-700
                    text-sm
                    w-fit
                  "
                                >
                                    {
                                        partOfSpeechMap[
                                        data.partOfSpeech
                                        ]
                                    }
                                </div>
                            )}

                        </>

                    )}

                </div>

            </div>

        </div>

    )

}