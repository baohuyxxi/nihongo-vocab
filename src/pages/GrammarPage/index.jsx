import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import FilterGrammar from "./FilterGrammar"
import SearchGrammar from "./SearchGrammar"
import GrammarList from "./GrammarList"
import GrammarDetail from "./GrammarDetail"

import useGrammarCache from "../../hooks/useGrammarCache"
import { indexGrammar, normalizeGrammarSearch, searchGrammar } from "../../utils/grammarSearch"

export default function GrammarPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const lesson = Number(searchParams.get("lesson")) || 1
    const showAll = !searchParams.get("lesson")

    const [keyword, setKeyword] = useState("")
    const [selected, setSelected] = useState(null)
    const { grammars, loading, error, retry } = useGrammarCache()

    const index = useMemo(() => grammars.map(indexGrammar), [grammars])
    const results = useMemo(() => {
        const scope = showAll ? index : index.filter(item => Number(item.grammar.lesson) === lesson)
        return searchGrammar(scope, keyword)
    }, [index, keyword, lesson, showAll])

    const searching = Boolean(normalizeGrammarSearch(keyword))

    return (
        <div className="max-w-6xl px-3 sm:px-4 py-6 space-y-5">
            <SearchGrammar keyword={keyword} setKeyword={setKeyword} />

            <FilterGrammar
                lesson={lesson}
                showAll={showAll}
                setSearchParams={setSearchParams}
            />

            {error && (
                <div role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    {grammars.length ? "Không thể cập nhật. Đang hiển thị dữ liệu đã lưu." : "Không tải được dữ liệu ngữ pháp."}
                    <button type="button" onClick={retry} className="ml-3 font-semibold underline">
                        Thử lại
                    </button>
                </div>
            )}

            {(!error || grammars.length > 0) && (
                <GrammarList
                    grammars={results}
                    loading={loading}
                    searching={searching}
                    showAll={showAll}
                    onShowAll={() => setSearchParams({})}
                    onSelect={setSelected}
                />
            )}

            <GrammarDetail grammar={selected} onClose={() => setSelected(null)} />
        </div>
    )
}

