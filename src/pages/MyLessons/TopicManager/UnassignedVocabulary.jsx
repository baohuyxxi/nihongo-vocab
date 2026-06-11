import {
  useDroppable,
} from "@dnd-kit/core"

import {
  Inbox,
} from "lucide-react"

import VocabularyDraggable
  from "./VocabularyDraggable"

export default function
UnassignedVocabulary({
  vocabs,
}) {

  const { setNodeRef, isOver }
    = useDroppable({
      id: "unassigned",
    })

  return (

    <div
      ref={setNodeRef}
      className={`
        bg-white
        rounded-3xl
        border
        shadow-sm
        transition-all
        overflow-hidden

        ${
          isOver
            ? `
              border-blue-300
              ring-4
              ring-blue-100
            `
            : `
              border-gray-100
            `
        }
      `}
    >

      {/* HEADER */}

      <div
        className="
          px-4 sm:px-5
          py-4
          border-b border-gray-100
          flex items-center
          justify-between
          gap-3
        "
      >

        <div
          className="
            flex items-center
            gap-3
          "
        >

          <div
            className="
              w-11 h-11
              rounded-2xl
              bg-gray-100
              flex items-center
              justify-center
              text-gray-600
            "
          >

            <Inbox size={20} />

          </div>

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-gray-800
              "
            >
              Chưa phân loại
            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Kéo thả vào chủ đề
            </p>

          </div>

        </div>

        <div
          className="
            px-3 py-1
            rounded-full
            bg-blue-100
            text-blue-700
            text-sm
            font-medium
          "
        >
          {vocabs.length}
        </div>

      </div>

      {/* LIST */}

      <div
        className="
          max-h-[600px]
          overflow-y-auto
          p-3 sm:p-4

          scrollbar-thin
          scrollbar-thumb-gray-300
          scrollbar-track-transparent
        "
      >

        {vocabs.length > 0 ? (

          <div className="space-y-3">

            {vocabs.map((item) => (

              <VocabularyDraggable
                key={item._id}
                vocab={item}
                compact
              />

            ))}

          </div>

        ) : (

          <div
            className="
              border-2
              border-dashed
              border-gray-200
              rounded-2xl
              p-10
              text-center
            "
          >

            <div
              className="
                text-gray-400
                text-sm
              "
            >
              Không có từ vựng nào
            </div>

          </div>

        )}

      </div>

    </div>

  )

}