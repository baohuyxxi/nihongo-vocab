import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

import FilterGrammar from "./FilterGrammar"
import SearchGrammar from "./SearchGrammar"
import GrammarList from "./GrammarList"
import GrammarDetail from "./GrammarDetail"

import useGrammarCache from "../../hooks/useGrammarCache"
import { normalize } from "../../utils/normalize"

export default function GrammarPage() {

    const [searchParams, setSearchParams] = useSearchParams()

    const lesson = Number(searchParams.get("lesson")) || 1
    const showAll = !searchParams.get("lesson")

    const wrapperRef = useRef(null)

    const [jpSearch, setJpSearch] = useState("")
    const [viSearch, setViSearch] = useState("")

    // dropdown state
    const [showDropdown, setShowDropdown] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    // detail modal
    const [selected, setSelected] = useState(null)

    const { grammars, loading } = useGrammarCache()

    // filter main list
    const filteredGrammars = useMemo(() => {

        let result = grammars

        if (!showAll) {
            result = result.filter(item => item.lesson === lesson)
        }

        const keyword = normalize(jpSearch || viSearch)

        if (!keyword) return result

        return result.filter(item =>
            item.searchText?.includes(keyword)
        )

    }, [grammars, jpSearch, viSearch, lesson, showAll])

    // suggestions dropdown
    const suggestions = useMemo(() => {

        const keyword = normalize(jpSearch || viSearch)

        if (!keyword) return []

        return grammars
            .filter(x => x.searchText?.includes(keyword))
            .slice(0, 10)

    }, [grammars, jpSearch, viSearch])

    // click outside to close dropdown
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (wrapperRef.current &&
                !wrapperRef.current.contains(e.target)
            ) {
                setShowDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () =>
            document.removeEventListener("mousedown", handleClickOutside)

    }, [])

    return (
        <div className="max-w-6xl px-3 sm:px-4 py-6 space-y-6">

            <FilterGrammar
                lesson={lesson}
                showAll={showAll}
                setSearchParams={setSearchParams}
            />

            <SearchGrammar
                wrapperRef={wrapperRef}

                jpSearch={jpSearch}
                setJpSearch={setJpSearch}

                viSearch={viSearch}
                setViSearch={setViSearch}

                suggestions={suggestions}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}

                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}

                setSelected={setSelected}
            />

            <GrammarList
                grammars={filteredGrammars}
                loading={loading}
                setSelected={setSelected}
            />

            <GrammarDetail
                grammar={selected}
                onClose={() => setSelected(null)}
            />

        </div>
    )
}