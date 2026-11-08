// hooks/useReviewSession.js

import {
    useEffect,
    useState,
    useCallback,
} from "react"

import {
    getReviewSession as getSavedSession,
    getReviewConfig,
    saveReviewSession,
    clearFlashcardProgress,
    clearReviewSession,
    clearN3ReviewSession,
    getN3ReviewSession,
    saveN3ReviewSession,
    clearN3FlashcardProgress,
    getN3ReviewConfig,
} from "../utils/reviewStorage"

import {
    getReviewSession,
} from "../services/vocab.service"

import {
    getKanjiSession,
} from "../services/kanjiCurriculum.service"

import {
    getN3KanjiSelectionPayload,
    normalizeN3KanjiReviewSession,
} from "../adapters/n3KanjiReviewAdapter"


export default function useReviewSession() {

    const [session, setSession] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState(null)


    const reviewConfig =
        getReviewConfig()

    const currentSource =
        reviewConfig?.n3Source ?? null

    const isN3Review =
        currentSource === "sou-matome-kanji" || currentSource === "mimi-kara"


    /* ======================
        LOAD FROM API
    ====================== */

    const loadSession =
        useCallback(
            async ({
                config,
                reviewId = "",
            }) => {

                try {

                    setLoading(true)

                    setError(null)


                    const {
                        lessons = [],
                        topics = [],

                        // N3
                        units = [],
                        n3Topics = [],
                        n3KanjiPairs = [],

                        partsOfSpeech = [],
                        mode = "flashcard",
                        directions = ["jp_vi"],
                        limit = null,
                    } = config

                    const resolvedSource =
                        config?.n3Source === "sou-matome-kanji"
                            ? "sou-matome-kanji"
                            : config?.n3Source === "mimi-kara"
                                ? "mimi-kara"
                                : "unknown"

                    const isN3KanjiFlow =
                        resolvedSource === "sou-matome-kanji" &&
                        Array.isArray(n3KanjiPairs) &&
                        n3KanjiPairs.length > 0

                    if (config?.curriculumTab === "n3" && resolvedSource === "unknown") {
                        throw new Error("Vui lòng chọn rõ nguồn ôn tập N3: Mimi kara Oboeru hoặc Sou Matome N3 Kanji.")
                    }

                    let res
                    let data

                    if (isN3KanjiFlow) {
                        const selection =
                            getN3KanjiSelectionPayload(n3KanjiPairs)

                        if (!selection.weeks || !selection.days) {
                            throw new Error("Chưa chọn bài Sou Matome N3 nào")
                        }

                        if (resolvedSource !== "sou-matome-kanji") {
                            throw new Error("Vui lòng chọn rõ nguồn ôn tập N3: Mimi kara hoặc Sou Matome Kanji.")
                        }

                        res = await getKanjiSession({
                            curriculum: "sou-matome-n3-kanji",
                            weeks: selection.weeks,
                            days: selection.days,
                            contentType: "both",
                            mode,
                            directions: Array.isArray(directions)
                                ? directions.filter((item) => ["kanji", "kanji_meaning", "meaning_kanji", "onyomi", "kunyomi", "hanviet", "kanji_reading", "reading_kanji", "vocab_meaning", "meaning_vocab"].includes(item)).join(",")
                                : directions,
                            limit: limit ?? null,
                            reviewId,
                        })

                        data = normalizeN3KanjiReviewSession(res)

                        setSession(data)

                        saveN3ReviewSession({
                            config,
                            progress: {
                                ...res.progress,
                                completed: res.progress?.completed ?? false,
                            },
                            reviewId: res.reviewId,
                            session: data,
                        })

                        return data
                    }

                    res = await getReviewSession({

                        lessons:
                            lessons.join(","),

                        topics:
                            topics.join(","),

                        // N3
                        units:
                            units.join(","),

                        n3Topics:
                            n3Topics.join(","),

                        partsOfSpeech:
                            partsOfSpeech.join(","),

                        mode,

                        directions:
                            directions.join(","),

                        limit:
                            limit ?? "",

                        reviewId,

                    })

                    data = res.data

                    setSession(
                        data
                    )

                    saveReviewSession({
                        config,
                        progress: {
                            ...res.progress,
                            completed:
                                res.progress?.completed ?? false,
                        },
                        reviewId:
                            res.reviewId,
                        session:
                            data,
                    })

                    return data

                }
                catch (err) {

                    console.error(
                        "loadReviewSession:",
                        err
                    )

                    setError(
                        "Không tải được phiên ôn tập"
                    )

                    throw err

                }
                finally {

                    setLoading(false)

                }

            },
            []
        )


    /* ======================
        INITIAL LOAD
    ====================== */

    useEffect(() => {

        if (!reviewConfig) {

            setLoading(false)

            return

        }


        const saved =
            currentSource === "sou-matome-kanji"
                ? getN3ReviewSession()
                : getSavedSession()

        if (saved?.session) {
            setSession(saved.session)
            setLoading(false)
            return
        }

        if (currentSource === "sou-matome-kanji") {
            clearN3FlashcardProgress()
        } else {
            clearFlashcardProgress()
        }

        loadSession({
            config: reviewConfig,
        }).catch(() => {})

    }, [])


    /* ======================
        CONTINUE REVIEW
    ====================== */

    const continueReview =
        async () => {

            const saved =
                currentSource === "sou-matome-kanji"
                    ? getN3ReviewSession()
                    : getSavedSession()

            if (!saved?.reviewId) {

                setError(
                    "Không tìm thấy review session"
                )

                return

            }


            const reviewId =
                saved.reviewId

            const config =
                saved.config || reviewConfig


            if (currentSource === "sou-matome-kanji") {
                clearN3FlashcardProgress()
                clearN3ReviewSession()
            } else {
                clearFlashcardProgress()
                clearReviewSession()
            }


            await loadSession({

                config,

                reviewId,

            })

        }


    return {

        reviewConfig,

        session,

        loading,

        error,

        continueReview,

    }

}