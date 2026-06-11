import {
    useDroppable,
} from "@dnd-kit/core"

import {
    Eye,
    Pencil,
    Trash2,
    BookOpen,
} from "lucide-react"

import VocabularyDraggable
    from "./VocabularyDraggable"

export default function
    TopicCard({
        topic,
        vocabs,
        onPreview,
        onEdit,
        onDelete,
    }) {

    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id: topic._id,
    })

    const previewVocabs
        = vocabs.slice(0, 4)

    const remainCount
        = vocabs.length - 4

    return (

        <div
            ref={setNodeRef}
            className={`
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                bg-white
                shadow-sm
                transition-all
                duration-300

                ${isOver
                    ? `
                      border-blue-300
                      ring-4
                      ring-blue-100
                      scale-[1.01]
                    `
                    : `
                      border-gray-100
                      hover:shadow-xl
                    `
                }
            `}
        >

            {/* COVER */}

            <div
                className="
                    relative
                    h-44 lg:h-52
                    overflow-hidden
                "
            >

                <img
                    src={topic.image}
                    alt={topic.name}
                    className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />

                <div
                    className="
                        absolute inset-0
                        bg-gradient-to-t
                        from-black/70
                        via-black/10
                        to-transparent
                    "
                />

                {/* BADGE */}

                <div
                    className="
                        absolute
                        top-4 left-4
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-semibold
                        text-white
                        backdrop-blur-md
                        bg-white/20
                        border border-white/20
                    "
                >
                    {vocabs.length} từ
                </div>

                {/* ACTIONS */}

                <div
                    className="
                        absolute
                        top-4 right-4
                        flex items-center
                        gap-2
                    "
                >

                    <button
                        onClick={() =>
                            onPreview(topic)
                        }
                        className="
                            w-10 h-10
                            rounded-xl
                            bg-white/20
                            backdrop-blur-md
                            border border-white/20
                            text-white
                            flex items-center
                            justify-center
                            hover:bg-white/30
                            transition
                        "
                    >

                        <Eye size={18} />

                    </button>

                    <button
                        onClick={() =>
                            onEdit(topic)
                        }
                        className="
                            w-10 h-10
                            rounded-xl
                            bg-white/20
                            backdrop-blur-md
                            border border-white/20
                            text-white
                            flex items-center
                            justify-center
                            hover:bg-white/30
                            transition
                        "
                    >

                        <Pencil size={18} />

                    </button>

                    <button
                        onClick={() =>
                            onDelete(
                                topic._id
                            )
                        }
                        className="
                            w-10 h-10
                            rounded-xl
                            bg-red-500/80
                            text-white
                            flex items-center
                            justify-center
                            hover:bg-red-600
                            transition
                        "
                    >

                        <Trash2 size={18} />

                    </button>

                </div>

                {/* INFO */}

                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-5
                        text-white
                    "
                >

                    <h2
                        className="
                            text-2xl
                            font-bold
                        "
                    >
                        {topic.name}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-white/80
                            line-clamp-2
                        "
                    >
                        {topic.description}
                    </p>

                </div>

            </div>

            {/* BODY */}

            <div className="p-4">



                <div
                    className="
                            border-2
                            border-dashed
                            border-gray-200
                            rounded-2xl
                            p-8
                            text-center
                        "
                >

                    <div
                        className="
                                text-sm
                                text-gray-400
                            "
                    >
                        Kéo từ vựng vào đây
                    </div>

                </div>



            </div>

        </div>

    )

}