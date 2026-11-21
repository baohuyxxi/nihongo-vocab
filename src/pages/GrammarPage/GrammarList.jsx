export default function GrammarList({ grammars, loading, searching, showAll, onShowAll, onSelect }) {
    if (loading && !grammars.length) {
        return <p role="status" className="py-10 text-center text-gray-600">Đang tải ngữ pháp…</p>
    }

    if (!grammars.length) {
        return (
            <div className="rounded-2xl border border-dashed bg-gray-50 py-10 text-center text-gray-600">
                <p role="status">{searching ? "Không tìm thấy mẫu ngữ pháp khớp từ khóa." : "Chưa có dữ liệu ngữ pháp trong mục này."}</p>
                {!showAll && (
                    <button type="button" onClick={onShowAll} className="mt-2 font-semibold text-blue-700 underline">
                        Xem tất cả bài
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {searching && <p role="status" className="text-sm text-gray-600">{grammars.length} mẫu ngữ pháp</p>}
            <ul className="space-y-3">
                {grammars.map(item => {
                    const example = item.examples?.find(entry => entry.jp)
                    return (
                        <li key={item._id}>
                            <button
                                type="button"
                                onClick={() => onSelect(item)}
                                className="block w-full space-y-2 rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-blue-400 focus-visible:outline-blue-500"
                            >
                                <span className="block text-xs font-semibold text-gray-600">
                                    Bài {item.lesson}{item.level && ` · ${item.level}`}
                                </span>
                                <span lang="ja" className="block text-lg font-bold text-gray-900">{item.key}</span>
                                <span className="block font-medium text-blue-700">{item.meaning}</span>
                                {item.explanation && <span className="block whitespace-pre-line text-sm text-gray-700">{item.explanation}</span>}
                                {example && (
                                    <span className="block border-t pt-2 text-sm text-gray-700">
                                        <span lang="ja" className="block">{example.jp}</span>
                                        {example.vi && <span className="block text-gray-600">{example.vi}</span>}
                                    </span>
                                )}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

