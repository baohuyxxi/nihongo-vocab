import { useEffect, useMemo, useRef, useState } from "react"
import {
    Search,
    Volume2,
    BookOpen,
    Languages,
    Hash,
    BadgeJapaneseYen,
} from "lucide-react"

import JPTableInput from "../../components/JPTableInput"

import { getAllVocab } from "../../services/vocab.service"

import { speakJP } from "../../utils/speak"
import { partOfSpeechMap } from "../../utils/partOfSpeechMap"

export default function VocabStudied() {

    const [allVocab, setAllVocab] = useState([])

    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState(null)

    const [showDropdown, setShowDropdown] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const wrapperRef = useRef(null)

    /* ================= FETCH ================= */

    useEffect(() => {

        const fetchData = async () => {

            try {

                const res = await getAllVocab()

                setAllVocab(res.data || [])

            } catch (err) {

    

            }

        }

        fetchData()

    }, [])

    /* ================= CLICK OUTSIDE ================= */

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target)
            ) {
                setShowDropdown(false)
            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        )

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            )

    }, [])

    /* ================= FILTER ================= */

    const filtered = useMemo(() => {

        if (!search.trim()) return []

        const keyword = search.toLowerCase().trim()

        return allVocab
            .filter((item) => {

                return (
                    item.kanji
                        ?.toLowerCase()
                        .includes(keyword) ||

                    item.hiragana
                        ?.toLowerCase()
                        .includes(keyword) ||

                    item.katakana
                        ?.toLowerCase()
                        .includes(keyword) ||

                    item.meaning
                        ?.toLowerCase()
                        .includes(keyword) ||

                    item.romaji
                        ?.toLowerCase()
                        .includes(keyword) ||

                    item.hanViet
                        ?.toLowerCase()
                        .includes(keyword)
                )

            })
            .slice(0, 20)

    }, [search, allVocab])

    /* ================= SELECT ================= */

    const handleSelect = (item) => {

        setSelected(item)

        setSearch(
            item.kanji ||
            item.hiragana ||
            item.katakana ||
            ""
        )

        setShowDropdown(false)

    }

    /* ================= KEYBOARD ================= */

    useEffect(() => {

        const handleKey = (e) => {

            if (!showDropdown || !filtered.length) return

            // DOWN
            if (e.key === "ArrowDown") {

                e.preventDefault()

                setActiveIndex(prev =>
                    prev >= filtered.length - 1
                        ? 0
                        : prev + 1
                )

            }

            // UP
            if (e.key === "ArrowUp") {

                e.preventDefault()

                setActiveIndex(prev =>
                    prev <= 0
                        ? filtered.length - 1
                        : prev - 1
                )

            }

            // ENTER
            if (e.key === "Enter") {

                e.preventDefault()

                handleSelect(filtered[activeIndex])

            }

            // ESC
            if (e.key === "Escape") {

                setShowDropdown(false)

            }

        }

        window.addEventListener("keydown", handleKey)

        return () =>
            window.removeEventListener("keydown", handleKey)

    }, [filtered, activeIndex, showDropdown])

    /* ================= HIGHLIGHT ================= */

    const highlightText = (text, keyword) => {

        if (!text) return text

        const regex = new RegExp(`(${keyword})`, "gi")

        return text
            .split(regex)
            .map((part, i) =>

                part.toLowerCase() ===
                    keyword.toLowerCase()
                    ? (
                        <span
                            key={i}
                            className="bg-yellow-200 rounded px-0.5"
                        >
                            {part}
                        </span>
                    ) : (
                        part
                    )

            )

    }

    return (

        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}

            <div className="sticky top-0 z-40 bg-white border-b">

                <div className="max-w-5xl mx-auto px-5 py-5">

                    <div className="flex items-center gap-3 mb-4">

                        <BookOpen size={28} />

                        <div>

                            <h1 className="text-2xl font-bold">
                                Từ vựng đã học
                            </h1>

                            <div className="text-sm text-gray-500">
                                Tìm kiếm Nhật → Việt → Romaji
                            </div>

                        </div>

                    </div>

                    {/* SEARCH */}

                    <div
                        ref={wrapperRef}
                        className="relative"
                    >

                        <div
                            className="
                flex items-start gap-3
                bg-gray-50
                border
                rounded-2xl
                px-4 py-3
                focus-within:border-black
                transition
              "
                        >

                            <Search
                                size={20}
                                className="mt-1 text-gray-400"
                            />

                            <JPTableInput
                                value={search}
                                onChange={(v) => {

                                    setSearch(v)
                                    setShowDropdown(true)
                                    setActiveIndex(0)

                                }}
                                placeholder="食べる / たべる / eat "
                                className="
                  text-lg
                  bg-transparent
                "
                            />

                        </div>

                        {/* DROPDOWN */}

                        {showDropdown &&
                            search &&
                            filtered.length > 0 && (

                                <div
                                    className="
                    absolute
                    mt-2
                    w-full
                    bg-white
                    border
                    rounded-2xl
                    shadow-xl
                    overflow-hidden
                    z-50
                  "
                                >

                                    <div className="max-h-[450px] overflow-y-auto">

                                        {filtered.map((item, index) => (

                                            <button
                                                key={item._id}
                                                onClick={() =>
                                                    handleSelect(item)
                                                }
                                                className={`
                          w-full
                          text-left
                          px-5 py-4
                          border-b last:border-none
                          transition
                          ${activeIndex === index
                                                        ? "bg-blue-50"
                                                        : "hover:bg-gray-50"
                                                    }
                        `}
                                            >

                                                {/* TOP */}

                                                <div className="flex items-center gap-3">

                                                    <div className="text-2xl font-bold">

                                                        {highlightText(
                                                            item.kanji ||
                                                            item.hiragana ||
                                                            item.katakana,
                                                            search
                                                        )}

                                                    </div>

                                                    {item.hiragana &&
                                                        item.kanji && (

                                                            <div className="text-gray-500">

                                                                {highlightText(
                                                                    item.hiragana,
                                                                    search
                                                                )}

                                                            </div>

                                                        )}

                                                </div>

                                                {/* BOTTOM */}

                                                <div className="flex items-center gap-4 mt-2 text-sm">

                                                    {item.meaning && (
                                                        <div className="text-gray-700">
                                                            {highlightText(
                                                                item.meaning,
                                                                search
                                                            )}
                                                        </div>
                                                    )}

                                                    {item.romaji && (
                                                        <div className="text-gray-400">
                                                            {item.romaji}
                                                        </div>
                                                    )}

                                                </div>

                                            </button>

                                        ))}

                                    </div>

                                </div>

                            )}

                        {/* EMPTY */}

                        {showDropdown &&
                            search &&
                            filtered.length === 0 && (

                                <div
                                    className="
                    absolute
                    mt-2
                    w-full
                    bg-white
                    border
                    rounded-2xl
                    shadow-lg
                    p-5
                    text-gray-500
                  "
                                >
                                    Không tìm thấy từ phù hợp
                                </div>

                            )}

                    </div>

                </div>

            </div>

            {/* CONTENT */}

            <div className="max-w-5xl mx-auto p-5">

                {!selected ? (

                    <div
                        className="
              h-[60vh]
              flex
              items-center
              justify-center
              text-gray-400
            "
                    >
                        Chọn từ vựng để xem chi tiết
                    </div>

                ) : (

                    <div
                        className="
              bg-white
              rounded-3xl
              shadow-sm
              border
              overflow-hidden
            "
                    >

                        <div className="grid md:grid-cols-2">

                            {/* LEFT */}

                            <div className="p-8 border-r">

                                {/* IMAGE */}

                                <div
                                    className="
                    aspect-square
                    bg-gray-100
                    rounded-2xl
                    overflow-hidden
                    flex
                    items-center
                    justify-center
                  "
                                >

                                    {selected.image?.url ? (

                                        <img
                                            src={selected.image.url}
                                            alt=""
                                            className="
                        w-full
                        h-full
                        object-cover
                      "
                                        />

                                    ) : (

                                        <div className="text-gray-400">
                                            No Image
                                        </div>

                                    )}

                                </div>

                            </div>

                            {/* RIGHT */}

                            <div className="p-8 flex flex-col gap-5">

                                {/* WORD */}

                                <div>

                                    <div className="flex items-start gap-4">

                                        <div>

                                            <div
                                                onClick={() =>
                                                    speakJP(
                                                        selected.hiragana ||
                                                        selected.katakana,
                                                        1
                                                    )
                                                }
                                                className="
                          text-5xl
                          font-bold
                          cursor-pointer
                          hover:opacity-70
                          transition
                        "
                                            >
                                                {selected.hiragana ||
                                                    selected.katakana}
                                            </div>

                                            {selected.romaji && (
                                                <div className="text-gray-500 text-lg mt-1">
                                                    {selected.romaji}
                                                </div>
                                            )}

                                        </div>

                                        <button
                                            onClick={() =>
                                                speakJP(
                                                    selected.hiragana ||
                                                    selected.katakana,
                                                    1
                                                )
                                            }
                                            className="
                        p-3
                        rounded-full
                        border
                        hover:bg-gray-50
                      "
                                        >
                                            <Volume2 size={20} />
                                        </button>

                                    </div>

                                </div>

                                {/* INFO */}

                                <div className="flex flex-col gap-4">

                                    {/* KANJI */}

                                    {selected.kanji && (

                                        <div className="flex gap-3">

                                            <BadgeJapaneseYen
                                                size={20}
                                                className="mt-1 text-gray-400"
                                            />

                                            <div>

                                                <div className="text-sm text-gray-400">
                                                    Kanji
                                                </div>

                                                <div className="text-3xl font-semibold">
                                                    {selected.kanji}
                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* HANVIET */}

                                    {selected.hanViet && (

                                        <div className="flex gap-3">

                                            <Languages
                                                size={20}
                                                className="mt-1 text-gray-400"
                                            />

                                            <div>

                                                <div className="text-sm text-gray-400">
                                                    Hán Việt
                                                </div>

                                                <div className="text-lg capitalize">
                                                    {selected.hanViet}
                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* MEANING */}

                                    {selected.meaning && (

                                        <div className="flex gap-3">

                                            <BookOpen
                                                size={20}
                                                className="mt-1 text-gray-400"
                                            />

                                            <div>

                                                <div className="text-sm text-gray-400">
                                                    Nghĩa
                                                </div>

                                                <div className="text-xl capitalize">
                                                    {selected.meaning}
                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* POS */}

                                    {selected.partOfSpeech && (

                                        <div className="flex gap-3">

                                            <Hash
                                                size={20}
                                                className="mt-1 text-gray-400"
                                            />

                                            <div>

                                                <div className="text-sm text-gray-400">
                                                    Loại từ
                                                </div>

                                                <div
                                                    className="inline-flex
                                                    px-3 py-1
                                                    rounded-full
                                                    bg-blue-100
                                                    text-blue-700
                                                    text-sm
                                                    mt-1
                                                    "
                                                >
                                                    {partOfSpeechMap[selected.partOfSpeech] ||
                                                        selected.partOfSpeech}
                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* EXAMPLE */}

                                    {selected?.example?.jp && (

                                        <div
                                            className="
                        mt-3
                        p-5
                        rounded-2xl
                        bg-gray-50
                      "
                                        >

                                            <div className="text-sm text-gray-400 mb-3">
                                                Ví dụ
                                            </div>

                                            <div className="text-xl leading-10">
                                                {selected.example.jp}
                                            </div>

                                            {selected.example.vi && (

                                                <div className="text-gray-600 mt-3">
                                                    {selected.example.vi}
                                                </div>

                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    )

}