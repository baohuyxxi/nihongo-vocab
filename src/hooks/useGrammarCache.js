import { useEffect, useState } from "react"
import { getAllGrammar } from "../services/grammar.service"
import { normalize } from "../utils/normalize"

const STORAGE_KEY = "grammar_cache"

export default function useGrammarCache() {

    const [grammars, setGrammars] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        // load từ localStorage trước
        const cache = localStorage.getItem(STORAGE_KEY)

        if (cache) {
            setGrammars(JSON.parse(cache))
            setLoading(false)
        }

        fetchData()

    }, [])

    const fetchData = async () => {

        try {

            const res = await getAllGrammar()

            const indexed = (res.data || []).map(g => ({

                ...g,

                searchText: normalize(
                    [
                        g.key,
                        g.meaning,
                        g.explanation,

                        ...(g.notes || []),

                        ...(g.examples || []).map(
                            e =>
                                `${e.jp} ${e.hiragana} ${e.vi}`
                        )

                    ].join(" ")
                )

            }))

            setGrammars(indexed)

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(indexed)
            )

        } catch (err) {


        } finally {

            setLoading(false)

        }

    }

    return {
        grammars,
        loading
    }
}