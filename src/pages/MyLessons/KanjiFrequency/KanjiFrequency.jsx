import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import {
    getKanjiFrequency
} from "../../../services/lesson.service"

import KanjiFrequencyHeader
    from "./KanjiFrequencyHeader"

import KanjiFrequencyItem
    from "./KanjiFrequencyItem"

import Pagination
    from "./Pagination"

const PAGE_SIZE = 50

const getCacheKey = (page) =>
    `kanji-frequency-page-${page}`

export default function KanjiFrequencyPage() {

    const [searchParams, setSearchParams] =
        useSearchParams()

    const page = Math.max(
        1,
        Number(
            searchParams.get("page")
        ) || 1
    )

    const [data, setData] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [search, setSearch] =
        useState("")

    const [pagination, setPagination] =
        useState({
            total: 0,
            page: 1,
            totalPages: 1,
            limit: PAGE_SIZE,
        })

    const [openGroups, setOpenGroups] =
        useState({})

    useEffect(() => {

        const cache =
            localStorage.getItem(
                getCacheKey(page)
            )

        if (cache) {

            try {

                const parsed =
                    JSON.parse(cache)

                setData(
                    parsed.data || []
                )

                setPagination(
                    parsed.pagination || {
                        total: 0,
                        page: 1,
                        totalPages: 1,
                        limit: PAGE_SIZE,
                    }
                )

                setLoading(false)

            } catch {

                setLoading(true)

            }

        } else {

            setLoading(true)

        }

        fetchData(page)

    }, [page])

    const fetchData = async (
        currentPage = 1
    ) => {

        try {

            const res =
                await getKanjiFrequency({
                    page: currentPage,
                    limit: PAGE_SIZE,
                })

            const newData =
                res.data || []

            const newPagination = {
                total:
                    res?.total || 0,
                page:
                    res?.page || 1,
                totalPages:
                    res?.totalPages || 1,
                limit:
                    res?.limit || PAGE_SIZE,
            }

            setData(
                newData
            )

            setPagination(
                newPagination
            )

            localStorage.setItem(
                getCacheKey(currentPage),
                JSON.stringify({
                    data: newData,
                    pagination: newPagination,
                    updatedAt: Date.now(),
                })
            )

        } catch (err) {

            console.error(
                "Kanji Frequency Error:",
                err
            )

        } finally {

            setLoading(false)

        }

    }

    const filteredData =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase()

            if (!keyword)
                return data

            return data.filter(
                item =>
                    item.kanji?.includes(keyword)
                    ||
                    item.hanViet
                        ?.toLowerCase()
                        ?.includes(keyword)
            )

        }, [data, search])

    const toggleGroup =
        (kanji) => {

            setOpenGroups(prev => ({
                ...prev,
                [kanji]:
                    !prev[kanji],
            }))

        }

    const handlePageChange =
        (value) => {

            const nextPage =
                typeof value === "function"
                    ? value(page)
                    : value

            if (
                nextPage < 1
                ||
                nextPage >
                pagination.totalPages
            ) {
                return
            }

            setSearchParams({
                page: String(nextPage),
            })

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })

        }

    return (

        <div
            className="
                max-w-6xl
                mx-auto
                px-4
                py-4
                space-y-6
            "
        >

            <KanjiFrequencyHeader
                search={search}
                setSearch={setSearch}
                total={
                    pagination.total
                }
            />

            {loading && (

                <div
                    className="
                        text-center
                        py-10
                        text-gray-500
                    "
                >
                    Đang tải...
                </div>

            )}

            {!loading && (

                <div
                    className="
                        space-y-3
                    "
                >

                    {filteredData.map(
                        (
                            group,
                            index
                        ) => (

                            <KanjiFrequencyItem
                                key={
                                    group.kanji
                                }

                                group={group}

                                rank={
                                    (
                                        (page - 1)
                                        * PAGE_SIZE
                                    )
                                    +
                                    index
                                    +
                                    1
                                }

                                isOpen={
                                    openGroups[
                                        group.kanji
                                    ]
                                }

                                onToggle={() =>
                                    toggleGroup(
                                        group.kanji
                                    )
                                }
                            />

                        )
                    )}

                    {!filteredData.length && (

                        <div
                            className="
                                text-center
                                py-12
                                text-gray-500
                            "
                        >
                            Không tìm thấy Kanji
                        </div>

                    )}

                </div>

            )}

            <Pagination
                page={page}
                totalPages={
                    pagination.totalPages
                }
                setPage={
                    handlePageChange
                }
            />

        </div>

    )

}