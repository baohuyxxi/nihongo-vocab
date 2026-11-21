import { Search, X } from "lucide-react"

export default function SearchGrammar({ keyword, setKeyword }) {
    return (
        <div className="space-y-2">
            <label htmlFor="grammar-search" className="block text-xl font-bold text-gray-900">
                Tra cứu ngữ pháp
            </label>
            <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 focus-within:border-blue-500">
                <Search size={20} aria-hidden="true" className="shrink-0 text-gray-400" />
                <input
                    id="grammar-search"
                    type="search"
                    value={keyword}
                    onChange={event => setKeyword(event.target.value)}
                    placeholder="ている, teiru, đã từng..."
                    autoComplete="off"
                    className="w-full min-w-0 bg-transparent text-base outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                {keyword && (
                    <button
                        type="button"
                        aria-label="Xóa từ khóa"
                        onClick={() => setKeyword("")}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    )
}

