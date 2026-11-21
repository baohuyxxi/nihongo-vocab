import { useEffect, useState } from "react"
import { getAllGrammar } from "../services/grammar.service"

const STORAGE_KEY = "grammar_cache"

function readCache() {
    try {
        const cache = JSON.parse(localStorage.getItem(STORAGE_KEY))
        return Array.isArray(cache) ? cache : null
    } catch {
        return null
    }
}

export default function useGrammarCache() {
    const [cached] = useState(readCache)
    const [grammars, setGrammars] = useState(cached ?? [])
    const [loading, setLoading] = useState(cached === null)
    const [error, setError] = useState(false)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        let cancelled = false

        getAllGrammar()
            .then(response => {
                if (!Array.isArray(response.data)) throw new Error("Invalid grammar data")
                if (cancelled) return

                setGrammars(response.data)
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data))
                } catch {
                    // The loaded results remain available if storage is disabled or full.
                }
            })
            .catch(() => {
                if (!cancelled) setError(true)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => { cancelled = true }
    }, [attempt])

    function retry() {
        setError(false)
        setLoading(true)
        setAttempt(value => value + 1)
    }

    return { grammars, loading, error, retry }
}

