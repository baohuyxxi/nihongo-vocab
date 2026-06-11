import {
  X,
  BookOpen,
  Sparkles,
} from "lucide-react"

export default function
TopicPreviewDrawer({
  topic,
  vocabs,
  onClose,
}) {

  if (!topic) return null

  return (

    <div
      className="
        fixed inset-0
        z-[100]
        bg-black/60
        backdrop-blur-md
        overflow-hidden
      "
    >

      {/* CLOSE */}

      <button
        onClick={onClose}
        className="
          absolute
          top-5 right-5
          z-50
          w-12 h-12
          rounded-2xl
          bg-white/10
          backdrop-blur-md
          border border-white/10
          text-white
          flex items-center
          justify-center
          hover:bg-white/20
          transition
        "
      >

        <X size={22} />

      </button>

      {/* MAIN */}

      <div
        className="
          h-full
          overflow-y-auto
        "
      >

        {/* HERO */}

        <div
          className="
            relative
            min-h-[380px]
            flex items-center
            justify-center
            overflow-hidden
          "
        >

          {/* BG */}

          <img
            src={topic.image}
            alt={topic.name}
            className="
              absolute inset-0
              w-full
              h-full
              object-cover
              scale-110
              blur-sm
            "
          />

          <div
            className="
              absolute inset-0
              bg-black/70
            "
          />

          {/* CONTENT */}

          <div
            className="
              relative z-10
              text-center
              px-4
              max-w-4xl
            "
          >

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4 py-2
                rounded-full
                bg-white/10
                backdrop-blur-md
                border border-white/10
                text-white
                text-sm
                mb-6
              "
            >

              <Sparkles size={16} />

              Chủ đề học tập

            </div>

            <h1
              className="
                text-4xl
                sm:text-6xl
                lg:text-7xl
                font-black
                text-white
                tracking-tight
              "
            >
              {topic.name}
            </h1>

            <p
              className="
                mt-5
                text-sm
                sm:text-lg
                text-white/70
                max-w-2xl
                mx-auto
                leading-relaxed
              "
            >
              {topic.description}
            </p>

            <div
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                px-5 py-3
                rounded-2xl
                bg-white/10
                backdrop-blur-md
                border border-white/10
                text-white
              "
            >

              <BookOpen size={18} />

              <span
                className="
                  font-medium
                "
              >
                {vocabs.length}
                từ vựng
              </span>

            </div>

          </div>

        </div>

        {/* VOCABS */}

        <div
          className="
            relative
            z-10
            max-w-7xl
            mx-auto
            px-4 sm:px-6
            py-8 sm:py-10
          "
        >

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              gap-4
              sm:gap-5
            "
          >

            {vocabs.map((item) => (

              <div
                key={item._id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  bg-white
                  border border-gray-100
                  shadow-sm
                  hover:shadow-2xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >

                {/* IMAGE */}

                <div
                  className="
                    relative
                    aspect-square
                    overflow-hidden
                  "
                >

                  <img
                    src={item.image}
                    alt={item.meaning}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-110
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

                  {/* TEXT */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      p-4
                    "
                  >

                    <div
                      className="
                        text-white
                        text-2xl
                        sm:text-3xl
                        font-black
                        leading-none
                      "
                    >
                      {item.kanji}
                    </div>

                    <div
                      className="
                        mt-1
                        text-white/80
                        text-xs
                        sm:text-sm
                      "
                    >
                      {item.hiragana}
                    </div>

                  </div>

                </div>

                {/* BOTTOM */}

                <div
                  className="
                    p-4
                  "
                >

                  <div
                    className="
                      inline-flex
                      items-center
                      px-3 py-1.5
                      rounded-full
                      bg-blue-50
                      text-blue-600
                      text-xs
                      sm:text-sm
                      font-semibold
                    "
                  >
                    {item.meaning}
                  </div>

                  {item.partOfSpeech && (

                    <div
                      className="
                        mt-3
                        text-xs
                        text-gray-400
                      "
                    >
                      {item.partOfSpeech}
                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}