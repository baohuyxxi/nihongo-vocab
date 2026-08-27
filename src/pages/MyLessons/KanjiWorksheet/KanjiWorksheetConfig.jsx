import { useEffect, useState } from "react"

import {
    getKanjiFrequency
} from "../../../services/lesson.service"

export default function KanjiWorksheetConfig({
    selectedKanji,
    setSelectedKanji,
    config,
    setConfig,
    onRemoveKanji,
    onClear,
}) {
    const [search, setSearch] = useState("")
    const [kanjiData, setKanjiData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true

        const loadKanji = async () => {
            try {
                setLoading(true)

                const res = await getKanjiFrequency({
                    page: 1,
                    limit: 100,
                })

                if (!mounted) return

                setKanjiData(res?.data || [])
            } catch (error) {
                console.error(
                    "Kanji Worksheet Error:",
                    error
                )
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        loadKanji()

        return () => {
            mounted = false
        }
    }, [])

    const filteredKanji = kanjiData.filter(item => {
        const keyword = search
            .trim()
            .toLowerCase()

        if (!keyword) return true

        return (
            item.kanji?.includes(keyword) ||
            item.hanViet
                ?.toLowerCase()
                ?.includes(keyword)
        )
    })

    const toggleKanji = (x) => {

        setSelectedKanji(prev => {
        
            if (prev.includes(x)) {
                return prev.filter(
                    item => item !== x
                )
            }

            return [...prev, x]
        })
    }

    const updateConfig = (key, value) => {
        setConfig(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    return (
        <div
            className="
                rounded-2xl border border-slate-200
                bg-white shadow-sm
                lg:sticky lg:top-4
            "
        >
            <div className="border-b border-slate-100 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="font-bold text-slate-800">
                            Cấu hình
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Chọn Kanji và thiết lập worksheet.
                        </p>
                    </div>

                    <span
                        className="
                            rounded-full bg-indigo-50
                            px-2.5 py-1
                            text-xs font-bold text-indigo-600
                        "
                    >
                        {selectedKanji.length} chữ
                    </span>
                </div>
            </div>

            <div className="space-y-5 p-4 sm:p-5">
                {/* Selected */}
                <section>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700">
                            Kanji đã chọn
                        </label>

                        {selectedKanji.length > 0 && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="
                                    text-xs font-medium
                                    text-red-500
                                    hover:text-red-600
                                "
                            >
                                Xóa tất cả
                            </button>
                        )}
                    </div>

                    {selectedKanji.length === 0 ? (
                        <div
                            className="
                                rounded-xl border border-dashed
                                border-slate-300
                                bg-slate-50
                                px-3 py-5
                                text-center text-sm text-slate-400
                            "
                        >
                            Chưa chọn Kanji
                        </div>
                    ) : (
                        <div
                            className="
                                flex max-h-32 flex-wrap
                                gap-2 overflow-y-auto
                            "
                        >
                            {selectedKanji.map(item => (
                                <button
                                    key={item.kanji}
                                    type="button"
                                    onClick={() =>
                                        onRemoveKanji(item)
                                    }
                                    className="
                                        group flex items-center gap-1
                                        rounded-lg
                                        border border-indigo-100
                                        bg-indigo-50
                                        px-2 py-1
                                        text-lg text-indigo-700
                                    "
                                    title="Bỏ Kanji"
                                >
                                   

                                    <span
                                        className="
                                            text-xs text-indigo-400
                                            group-hover:text-red-500
                                        "
                                    >
                                        ×
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Search */}
                <section>
                    <label
                        className="
                            mb-2 block text-sm font-bold
                            text-slate-700
                        "
                    >
                        Chọn Kanji
                    </label>

                    <input
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                        placeholder="Tìm Kanji hoặc Hán Việt..."
                        className="
                            w-full rounded-xl
                            border border-slate-200
                            bg-slate-50
                            px-3 py-2.5
                            text-sm outline-none
                            transition
                            focus:border-indigo-400
                            focus:bg-white
                            focus:ring-2
                            focus:ring-indigo-100
                        "
                    />

                    <div
                        className="
                            mt-2 max-h-72 overflow-y-auto
                            rounded-xl border border-slate-200
                        "
                    >
                        {loading ? (
                            <div className="p-5 text-center text-sm text-slate-400">
                                Đang tải Kanji...
                            </div>
                        ) : filteredKanji.length === 0 ? (
                            <div className="p-5 text-center text-sm text-slate-400">
                                Không tìm thấy Kanji
                            </div>
                        ) : (
                            filteredKanji.map(item => {
                                const kanji = item.kanji
                                const checked =
                                    selectedKanji.includes(item)
                                
                                return (
                                    <label
                                        key={item.kanji}
                                        className="
                                            flex cursor-pointer
                                            items-center gap-3
                                            border-b border-slate-100
                                            px-3 py-2.5
                                            last:border-0
                                            hover:bg-slate-50
                                        "
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                toggleKanji(item)
                                            }
                                            className="
                                                h-4 w-4
                                                rounded
                                                border-slate-300
                                                text-indigo-600
                                                focus:ring-indigo-500
                                            "
                                        />

                                        <span
                                            className="
                                                w-9 text-center
                                                text-2xl
                                                text-slate-800
                                            "
                                        >
                                            {kanji}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-slate-700">
                                                {item.hanViet || ""}
                                            </span>

                                            {item.words?.length > 0 && (
                                                <span className="block truncate text-xs text-slate-400">
                                                    {item.words[0]?.word ||
                                                        item.words[0]?.vocab ||
                                                        ""}
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                )
                            })
                        )}
                    </div>
                </section>

                {/* Practice count */}
                <section>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Số ô luyện viết
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                        {[6, 8, 10, 12].map(value => (
                            <button
                                key={value}
                                type="button"
                                onClick={() =>
                                    updateConfig(
                                        "practiceCount",
                                        value
                                    )
                                }
                                className={`
                                    rounded-lg border px-2 py-2
                                    text-sm font-semibold
                                    transition
                                    ${config.practiceCount === value
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }
                                `}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Display */}
                <section>
                    <label className="mb-3 block text-sm font-bold text-slate-700">
                        Hiển thị
                    </label>

                    <div className="space-y-2">
                        <Checkbox
                            checked={config.showMeaning}
                            onChange={value =>
                                updateConfig(
                                    "showMeaning",
                                    value
                                )
                            }
                            label="Nghĩa / Hán Việt"
                        />

                        <Checkbox
                            checked={config.showReading}
                            onChange={value =>
                                updateConfig(
                                    "showReading",
                                    value
                                )
                            }
                            label="Âm đọc"
                        />

                        <Checkbox
                            checked={config.showHint}
                            onChange={value =>
                                updateConfig(
                                    "showHint",
                                    value
                                )
                            }
                            label="Gợi ý Kanji"
                        />

                        <Checkbox
                            checked={config.showStrokeNumber}
                            onChange={value =>
                                updateConfig(
                                    "showStrokeNumber",
                                    value
                                )
                            }
                            label="Hiển thị số nét"
                        />
                    </div>
                </section>

                {/* Page */}
                <section>
                    <label className="mb-3 block text-sm font-bold text-slate-700">
                        Khổ giấy
                    </label>

                    <select
                        value={config.pageSize}
                        onChange={e =>
                            updateConfig(
                                "pageSize",
                                e.target.value
                            )
                        }
                        className="
                            mb-2 w-full rounded-xl
                            border border-slate-200
                            bg-white px-3 py-2.5
                            text-sm outline-none
                        "
                    >
                        <option value="A4">
                            A4
                        </option>

                        <option value="A5">
                            A5
                        </option>
                    </select>

                    <select
                        value={config.orientation}
                        onChange={e =>
                            updateConfig(
                                "orientation",
                                e.target.value
                            )
                        }
                        className="
                            w-full rounded-xl
                            border border-slate-200
                            bg-white px-3 py-2.5
                            text-sm outline-none
                        "
                    >
                        <option value="portrait">
                            Dọc
                        </option>

                        <option value="landscape">
                            Ngang
                        </option>
                    </select>
                </section>
            </div>
        </div>
    )
}

function Checkbox({
    checked,
    onChange,
    label,
}) {
    return (
        <label className="flex cursor-pointer items-center gap-3">
            <input
                type="checkbox"
                checked={checked}
                onChange={e =>
                    onChange(e.target.checked)
                }
                className="
                    h-4 w-4 rounded
                    border-slate-300
                    text-indigo-600
                    focus:ring-indigo-500
                "
            />

            <span className="text-sm text-slate-600">
                {label}
            </span>
        </label>
    )
}