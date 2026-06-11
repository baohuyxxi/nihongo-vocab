import {
    useDraggable,
} from "@dnd-kit/core"

import {
    Volume2,
    GripVertical,
} from "lucide-react"

import { speakJP } from "../../../utils/speak"

export default function
    VocabularyDraggable({
        vocab,
        compact = false,
    }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: vocab._id,
    })

    const style = transform
        ? {
            transform: `
          translate3d(
            ${transform.x}px,
            ${transform.y}px,
            0
          )
        `,
        }
        : undefined

    return (

        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
      group
      relative
      rounded-2xl
      border
      bg-white
      overflow-hidden
      shadow-sm
      transition-all
      cursor-grab
      active:cursor-grabbing

      ${compact
                    ? `
            flex
            items-center
            gap-3
            p-3
          `
                    : `
            block
          `
                }

      ${isDragging
                    ? `
            opacity-50
            scale-105
            rotate-1
            z-50
          `
                    : `
            hover:shadow-md
            hover:-translate-y-1
            border-gray-100
          `
                }
    `}
        >

            {/* IMAGE */}

            <img
                src={vocab.image}
                alt={vocab.meaning}
                className={`
        object-cover
        rounded-xl

        ${compact
                        ? `
              w-16 h-16
              shrink-0
            `
                        : `
              w-full
              h-28 sm:h-32
            `
                    }
      `}
            />

            {/* CONTENT */}

            <div className="flex-1 min-w-0">

                <div
                    className="
          flex items-start
          justify-between
          gap-2
        "
                >

                    <div className="min-w-0">

                        <h3
                            className="
              text-lg sm:text-xl
              font-bold
              text-gray-800
              truncate
            "
                        >
                            {vocab.kanji}
                        </h3>

                        <p
                            className="
              text-sm
              text-gray-500
              truncate
            "
                        >
                            {vocab.hiragana}
                        </p>

                    </div>

                    <button
                        onClick={(e) => {

                            e.stopPropagation()

                            speakJP(
                                vocab.kanji ||
                                vocab.hiragana
                            )

                        }}
                        className="
            shrink-0
            w-9 h-9
            rounded-xl
            bg-blue-50
            hover:bg-blue-100
            text-blue-600
            flex items-center
            justify-center
            transition
          "
                    >

                        <Volume2 size={16} />

                    </button>

                </div>

                <div
                    className="
          mt-2
          inline-flex
          items-center
          rounded-full
          bg-gray-100
          px-3 py-1
          text-sm
          font-medium
          text-gray-700
          max-w-full
        "
                >

                    <span className="truncate">
                        {vocab.meaning}
                    </span>

                </div>

            </div>

        </div>



    )

}