import {
  Folder,
} from "lucide-react"

export default function
TopicSidebar({
  topics,
  selectedTopic,
  setSelectedTopic,
}) {

  return (

    <div
      className="
        bg-white
        rounded-3xl
        border border-gray-100
        shadow-sm
        p-4
        h-fit
      "
    >

      <div
        className="
          flex items-center
          gap-2
          mb-4
        "
      >

        <Folder
          size={18}
          className="text-blue-500"
        />

        <h2
          className="
            font-bold
            text-gray-800
          "
        >
          Chủ đề
        </h2>

      </div>

      <div className="space-y-2">

        {topics.map((topic) => (

          <button
            key={topic._id}
            onClick={() =>
              setSelectedTopic(topic)
            }
            className={`
              w-full
              rounded-2xl
              p-3
              flex items-center
              gap-3
              transition
              border

              ${
                selectedTopic?._id ===
                topic._id
                  ? `
                    border-blue-200
                    bg-blue-50
                  `
                  : `
                    border-gray-100
                    hover:bg-gray-50
                  `
              }
            `}
          >

            <div
              className="
                w-4 h-4
                rounded-full
                shrink-0
              "
              style={{
                background:
                  topic.color,
              }}
            />

            <div
              className="
                flex-1
                text-left
                min-w-0
              "
            >

              <div
                className="
                  font-medium
                  text-sm
                  text-gray-800
                  truncate
                "
              >
                {topic.name}
              </div>

              <div
                className="
                  text-xs
                  text-gray-500
                  truncate
                "
              >
                {topic.description}
              </div>

            </div>

          </button>

        ))}

      </div>

    </div>

  )

}