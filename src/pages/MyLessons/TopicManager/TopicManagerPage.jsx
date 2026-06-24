import {
    useEffect,
    useMemo,
    useState,
} from "react"

import {
    DndContext,
    closestCenter,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"

import TopicBoard from "./TopicBoard"
import TopicModal from "./TopicModal"
import TopicPreviewDrawer from "./TopicPreviewDrawer"
import UnassignedVocabulary from "./UnassignedVocabulary"
import TopicHeader from "./TopicHeader"

import {
    getAllVocab,
} from "../../../services/vocab.service"

const STORAGE_KEY
    = "topic-manager-vocabs"

export default function
TopicManagerPage() {

    const [topics, setTopics]
        = useState([])

    const [vocabs, setVocabs]
        = useState([])

    const [search, setSearch]
        = useState("")

    const [selectedTopic,
        setSelectedTopic]
        = useState(null)

    const [openModal, setOpenModal]
        = useState(false)

    const [editingTopic,
        setEditingTopic]
        = useState(null)

    const [loading, setLoading]
        = useState(false)

    const [activeVocab,
        setActiveVocab]
        = useState(null)

    /*
    ========================
    LOAD LOCAL STORAGE FIRST
    ========================
    */

    useEffect(() => {

        const cached
            = localStorage.getItem(
                STORAGE_KEY
            )

        if (!cached) return

        try {

            const parsed
                = JSON.parse(cached)

            setVocabs(parsed)

            /*
            AUTO CREATE TOPIC
            FROM VOCAB TOPIC
            */

            const topicMap
                = {}

            parsed.forEach(
                (item) => {

                    const name =
                        item.topicId ||
                        item.originalTopic

                    if (!name) return

                    if (
                        !topicMap[name]
                    ) {

                        topicMap[name]
                            = {

                                _id: name,

                                name:
                                    capitalize(
                                        name
                                    ),

                                description:
                                    `Chủ đề ${name}`,

                                image:
                                    item.image,

                                color:
                                    randomColor(),
                            }

                    }

                }
            )

            setTopics(
                Object.values(
                    topicMap
                )
            )

        } catch (error) {



        }

    }, [])

    /*
    ========================
    FETCH NEW DATA
    ========================
    */

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true)

                const res
                    = await getAllVocab()

                const vocabData
                    = res?.data || []

                const mappedVocabs
                    = vocabData.map(
                        (item) => ({

                            _id:
                                item._id,

                            kanji:
                                item.kanji,

                            hiragana:
                                item.hiragana,

                            meaning:
                                item.meaning,

                            image:
                                item.image ||
                                `https://placehold.co/600x400?text=${encodeURIComponent(
                                    item.kanji ||
                                    item.hiragana
                                )}`,

                            /*
                            topic gốc
                            */

                            originalTopic:
                                item.topic,

                            /*
                            topic hiện tại
                            */

                            topicId:
                                item.topic ||
                                null,

                            partOfSpeech:
                                item.partOfSpeech,

                        })
                    )

                setVocabs(
                    mappedVocabs
                )

                /*
                SAVE CACHE
                */

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        mappedVocabs
                    )
                )

                /*
                BUILD TOPICS
                */

                const topicMap
                    = {}

                mappedVocabs.forEach(
                    (item) => {

                        const name =
                            item.topicId

                        if (!name)
                            return

                        if (
                            !topicMap[name]
                        ) {

                            topicMap[name]
                                = {

                                    _id:
                                        name,

                                    name:
                                        capitalize(
                                            name
                                        ),

                                    description:
                                        `Chủ đề ${name}`,

                                    image:
                                        item.image,

                                    color:
                                        randomColor(),
                                }

                        }

                    }
                )

                setTopics(
                    Object.values(
                        topicMap
                    )
                )

            } catch (error) {
            } finally {

                setLoading(false)

            }

        }

        fetchData()

    }, [])

    /*
    ========================
    SAVE LOCAL STORAGE
    ========================
    */

    useEffect(() => {

        if (!vocabs.length)
            return

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(vocabs)
        )

    }, [vocabs])

    /*
    ========================
    DND SENSOR
    ========================
    */

    const sensors = useSensors(

        useSensor(
            PointerSensor,
            {
                activationConstraint: {
                    distance: 5,
                },
            }
        )

    )

    /*
    ========================
    MEMO
    ========================
    */

    const unassignedVocabs
        = useMemo(() => {

            return vocabs.filter(
                (item) =>
                    !item.topicId
            )

        }, [vocabs])

    const filteredTopics
        = useMemo(() => {

            return topics.filter(
                (item) =>
                    item.name
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            )

        }, [topics, search])

    /*
    ========================
    DND
    ========================
    */

    const handleDragStart = (
        event
    ) => {

        const vocab = vocabs.find(
            (item) =>
                item._id ===
                event.active.id
        )

        setActiveVocab(vocab)

    }

    const handleDragEnd = (
        event
    ) => {

        const { active, over }
            = event

        setActiveVocab(null)

        if (!over) return

        const vocabId
            = active.id

        const topicId
            = over.id

        setVocabs((prev) =>
            prev.map((item) => {

                if (
                    item._id !==
                    vocabId
                ) {
                    return item
                }

                return {
                    ...item,

                    topicId:
                        topicId ===
                            "unassigned"
                            ? null
                            : topicId,
                }

            })
        )

    }

    /*
    ========================
    TOPIC CRUD
    ========================
    */

    const handleSaveTopic = (
        data
    ) => {

        if (editingTopic) {

            setTopics((prev) =>
                prev.map((item) =>

                    item._id ===
                        editingTopic._id
                        ? {
                            ...item,
                            ...data,
                        }
                        : item
                )
            )

        } else {

            const newTopic = {

                _id:
                    Date.now()
                        .toString(),

                ...data,
            }

            setTopics((prev) => [
                ...prev,
                newTopic,
            ])

        }

        setOpenModal(false)

    }

    const handleDeleteTopic = (
        id
    ) => {

        setTopics((prev) =>
            prev.filter(
                (item) =>
                    item._id !== id
            )
        )

        setVocabs((prev) =>
            prev.map((item) => {

                if (
                    item.topicId !== id
                ) {
                    return item
                }

                return {
                    ...item,
                    topicId: null,
                }

            })
        )

    }

    return (

        <div
            className="
                min-h-screen
                bg-gray-50
            "
        >

            <div
                className="
                    max-w-[1800px]
                    mx-auto
                    px-3 sm:px-4 lg:px-6
                    py-4 sm:py-6
                    space-y-5
                "
            >

                {/* HEADER */}

                <TopicHeader
                    search={search}
                    setSearch={setSearch}
                    onCreateTopic={() => {

                        setEditingTopic(
                            null
                        )

                        setOpenModal(true)

                    }}
                    totalTopics={
                        topics.length
                    }
                    totalVocabs={
                        vocabs.length
                    }
                />

                {/* LOADING */}

                {loading && (

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            border border-gray-100
                            shadow-sm
                            p-10
                            text-center
                        "
                    >

                        <div
                            className="
                                w-12 h-12
                                border-4
                                border-blue-200
                                border-t-blue-600
                                rounded-full
                                animate-spin
                                mx-auto
                            "
                        />

                        <p
                            className="
                                mt-4
                                text-gray-500
                            "
                        >
                            Đang đồng bộ dữ liệu...
                        </p>

                    </div>

                )}

                {/* CONTENT */}

                <DndContext
                    sensors={sensors}
                    collisionDetection={
                        closestCenter
                    }
                    onDragStart={
                        handleDragStart
                    }
                    onDragEnd={
                        handleDragEnd
                    }
                >

                    <div
                        className="
                            grid
                            grid-cols-1
                            xl:grid-cols-[7fr_3fr]
                            gap-5
                            items-start
                        "
                    >

                        {/* LEFT */}

                        <div
                            className="
                                order-2
                                xl:order-1
                                min-w-0
                            "
                        >

                            <TopicBoard
                                topics={
                                    filteredTopics
                                }
                                vocabs={
                                    vocabs
                                }
                                onPreview={
                                    setSelectedTopic
                                }
                                onEditTopic={(
                                    topic
                                ) => {

                                    setEditingTopic(
                                        topic
                                    )

                                    setOpenModal(
                                        true
                                    )

                                }}
                                onDeleteTopic={
                                    handleDeleteTopic
                                }
                            />

                        </div>

                        {/* RIGHT */}

                        <div
                            className="
                                order-1
                                xl:order-2
                                xl:sticky
                                xl:top-5
                                min-w-0
                            "
                        >

                            <UnassignedVocabulary
                                vocabs={
                                    unassignedVocabs
                                }
                            />

                        </div>

                    </div>

                    {/* OVERLAY */}

                    <DragOverlay>

                        {activeVocab && (

                            <div
                                className="
                                    rotate-2
                                    scale-105
                                    shadow-2xl
                                    opacity-95
                                "
                            >

                                <div
                                    className="
                                        bg-white
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        overflow-hidden
                                        w-[260px]
                                    "
                                >

                                    <img
                                        src={
                                            activeVocab.image
                                        }
                                        alt={
                                            activeVocab.meaning
                                        }
                                        className="
                                            w-full
                                            h-32
                                            object-cover
                                        "
                                    />

                                    <div className="p-4">

                                        <div
                                            className="
                                                text-2xl
                                                font-bold
                                                text-gray-800
                                            "
                                        >
                                            {
                                                activeVocab.kanji
                                            }
                                        </div>

                                        <div
                                            className="
                                                text-sm
                                                text-gray-500
                                                mt-1
                                            "
                                        >
                                            {
                                                activeVocab.hiragana
                                            }
                                        </div>

                                        <div
                                            className="
                                                mt-3
                                                inline-flex
                                                px-3 py-1
                                                rounded-full
                                                bg-blue-100
                                                text-blue-700
                                                text-sm
                                                font-medium
                                            "
                                        >
                                            {
                                                activeVocab.meaning
                                            }
                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}

                    </DragOverlay>

                </DndContext>

            </div>

            {/* PREVIEW */}

            <TopicPreviewDrawer
                topic={selectedTopic}
                vocabs={vocabs.filter(
                    (item) =>
                        item.topicId ===
                        selectedTopic?._id
                )}
                onClose={() =>
                    setSelectedTopic(
                        null
                    )
                }
            />

            {/* MODAL */}

            <TopicModal
                open={openModal}
                topic={editingTopic}
                onClose={() =>
                    setOpenModal(false)
                }
                onSave={
                    handleSaveTopic
                }
            />

        </div>

    )

}

/*
========================
UTILS
========================
*/

function capitalize(text) {

    if (!text) return ""

    return (
        text.charAt(0)
            .toUpperCase() +
        text.slice(1)
    )

}

function randomColor() {

    const colors = [

        "#3B82F6",
        "#8B5CF6",
        "#EC4899",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#14B8A6",

    ]

    return colors[
        Math.floor(
            Math.random() *
            colors.length
        )
    ]

}