import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"

import FilterGrammar from "./FilterGrammar"
import SearchGrammar from "./SearchGrammar"
import GrammarList from "./GrammarList"

import {
    getAllGrammar,
    getGrammarByLesson,
} from "../../services/grammar.service"

export default function GrammarPage() {

    const [searchParams, setSearchParams] = useSearchParams()

    const lesson = Number(searchParams.get("lesson")) || 1
    const showAll = !searchParams.get("lesson")

    const [grammars, setGrammars] = useState([])
    const [loading, setLoading] = useState(false)

    const wrapperRef = useRef(null)

    /* =========================
       LOAD DATA
    ========================= */
    useEffect(() => {
        loadData()
    }, [lesson, showAll])

    const loadData = async () => {
        try {
            setLoading(true)

            let res

            if (showAll) {
                res = await getAllGrammar()
            } else {
                res = await getGrammarByLesson(lesson)
            }

            setGrammars(res.data || [])

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl px-3 sm:px-4 py-6 space-y-6">

            <FilterGrammar
                lesson={lesson}
                showAll={showAll}
                setSearchParams={setSearchParams}
            />

            <SearchGrammar
                wrapperRef={wrapperRef}
            />

            <GrammarList
                grammars={grammars}
                loading={loading}
            />

        </div>
    )
}