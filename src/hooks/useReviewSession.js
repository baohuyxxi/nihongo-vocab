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
} from "../utils/reviewStorage"

import {
    getReviewSession,
} from "../services/vocab.service"


export default function useReviewSession() {

    const [session, setSession] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState(null)


    const reviewConfig =
        getReviewConfig()


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
                        lessons,
                        topics,
                        partsOfSpeech,
                        mode,
                        directions,
                        limit,
                    } = config


                    const res =
                        await getReviewSession({

                            lessons:
                                lessons.join(","),

                            topics:
                                topics.join(","),

                            partsOfSpeech:
                                partsOfSpeech.join(","),

                            mode,

                            directions:
                                directions.join(","),

                            limit,

                            reviewId,

                        })


                    const data =
                        res.data


                    setSession(
                        data
                    )


                    saveReviewSession({

                        config,

                        progress: {
                            ...res.progress,
                            completed: false,
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
            getSavedSession()


        /*
          Có session đang dang dở
        */

        if (saved?.session) {

            setSession(
                saved.session
            )

            setLoading(false)

            return

        }


        /*
          Chưa có session
          => tạo session mới
        */

        clearFlashcardProgress()


        loadSession({
            config:
                reviewConfig,
        })

    }, [])


    /* ======================
        CONTINUE REVIEW
    ====================== */

    const continueReview =
        async () => {

            const saved =
                getSavedSession()


            if (!saved?.reviewId) {

                setError(
                    "Không tìm thấy review session"
                )
                return

            }
            clearFlashcardProgress()
            clearReviewSession()
            await loadSession({

                config:
                    reviewConfig,

                reviewId:
                    saved.reviewId,

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