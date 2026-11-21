import { toHiragana } from "wanakana"
import { normalize } from "./normalize"

export function normalizeGrammarSearch(value) {
    const text = toHiragana(String(value ?? "").normalize("NFKC"), { passRomaji: true })
        .replace(/[~〜]/gu, "")
        .replace(/\s+/gu, " ")
    return text.replace(/[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+/gu, part => part.replace(/\p{Script=Latin}+/gu, word => normalize(word))).trim()
}

export function indexGrammar(grammar) {
    const nodes = grammar.structure ?? []
    const fields = [
        [grammar.key],
        nodes.flatMap(node => [node.label, node.kanji, node.hiragana]),
        [grammar.meaning],
        [grammar.explanation, ...(grammar.notes ?? []),
            ...(grammar.specialCases ?? []).flatMap(item => [item.original, item.result, item.note])],
        (grammar.examples ?? []).flatMap(example => [example.jp, example.hiragana, example.vi]),
    ]

    return {
        grammar,
        fields: fields.map(group => group.filter(Boolean).map(normalizeGrammarSearch)),
    }
}

export function searchGrammar(index, keyword) {
    const query = normalizeGrammarSearch(keyword)
    const queries = [query, toHiragana(query)]
    if (!query) return index.map(item => item.grammar)

    return index
        .flatMap(({ grammar, fields }) => {
            const rank = fields.findIndex(group => group.some(value => queries.some(candidate => value.includes(candidate))))
            if (rank === -1) return []
            return [{ grammar, rank: queries.some(candidate => fields[0].includes(candidate)) ? 0 : rank + 1 }]
        })
        .sort((a, b) => a.rank - b.rank)
        .map(item => item.grammar)
}

