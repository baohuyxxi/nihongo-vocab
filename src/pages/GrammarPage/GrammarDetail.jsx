import GrammarStructure from "./GrammarStructure"

export default function GrammarDetail({ grammar, onClose }) {
    if (!grammar) return null

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl border"
            >
                {/* HEADER */}
                <div className="border-b pb-4 flex justify-between items-start">
                    <div>
                        <div className="text-2xl font-bold text-gray-900 font-sans">
                            {grammar.key}
                        </div>
                        <div className="text-blue-600 font-semibold text-base mt-1">
                            {grammar.meaning}
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* VISUAL STRUCTURE */}
                {!!grammar.structure?.length && (
                    <div className="bg-slate-50/50 rounded-xl p-2 border border-slate-100">
                        <GrammarStructure structure={grammar.structure} />
                    </div>
                )}

                {/* EXPLANATION */}
                {grammar.explanation && (
                    <div className="space-y-1.5">
                        <div className="font-bold text-gray-800 flex items-center gap-1.5 text-sm uppercase tracking-wider text-slate-500">
                            <span>💡</span> Giải thích ý nghĩa
                        </div>
                        <p className="text-gray-700 leading-relaxed pl-5 font-sans">
                            {grammar.explanation}
                        </p>
                    </div>
                )}

                {/* SPECIAL CASES */}
                {!!grammar.specialCases?.length && (
                    <div className="space-y-2">
                        <div className="font-bold text-gray-800 flex items-center gap-1.5 text-sm uppercase tracking-wider text-slate-500">
                            <span>⚠️</span> Chú ý đặc biệt
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-5">
                            {grammar.specialCases.map((sc, i) => (
                                <div
                                    key={i}
                                    className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3.5 space-y-1"
                                >
                                    <div className="font-semibold text-gray-900 font-sans">
                                        {sc.original}
                                    </div>
                                    <div className="text-blue-700 font-medium font-sans">
                                        ➔ {sc.result}
                                    </div>
                                    {sc.note && (
                                        <div className="text-xs text-gray-600 font-normal pt-1 border-t border-amber-200/40 mt-1">
                                            {sc.note}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* EXAMPLES */}
                {!!grammar.examples?.length && (
                    <div className="space-y-3">
                        <div className="font-bold text-gray-800 flex items-center gap-1.5 text-sm uppercase tracking-wider text-slate-500">
                            <span>📝</span> Các câu ví dụ
                        </div>
                        <div className="space-y-2.5 pl-5">
                            {grammar.examples.map((ex, i) => (
                                <div
                                    key={i}
                                    className="bg-slate-50 hover:bg-slate-100/70 transition rounded-xl p-4 border border-slate-100 space-y-1"
                                >
                                    <div className="text-lg font-medium text-gray-900 font-sans tracking-wide">
                                        {i + 1}. {ex.jp}
                                    </div>
                                    {ex.hiragana && (
                                        <div className="text-xs text-gray-400 font-normal font-sans pl-4">
                                            {ex.hiragana}
                                        </div>
                                    )}
                                    <div className="text-sm text-blue-700 font-medium pt-1 pl-4">
                                        {ex.vi}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* NOTES */}
                {!!grammar.notes?.length && (
                    <div className="space-y-2">
                        <div className="font-bold text-gray-800 flex items-center gap-1.5 text-sm uppercase tracking-wider text-slate-500">
                            <span>📌</span> Ghi chú khác
                        </div>
                        <ul className="list-disc list-inside text-gray-700 space-y-1.5 pl-7 text-sm leading-relaxed">
                            {grammar.notes.map((n, i) => (
                                <li key={i} className="font-sans">{n}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* FOOTER CLOSE BUTTON */}
                <div className="flex justify-end pt-2 border-t">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition duration-150"
                    >
                        Đóng lại
                    </button>
                </div>
            </div>
        </div>
    )
}