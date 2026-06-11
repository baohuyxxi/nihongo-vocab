import {
  LayoutGrid,
  Plus,
  Search,
} from "lucide-react"

export default function TopicHeader({
  search,
  setSearch,
  onCreateTopic,
  totalTopics = 0,
  totalVocabs = 0,
}) {

  return (

    <div
      className="
        bg-white
        border border-gray-100
        rounded-3xl
        shadow-sm
        p-4 sm:p-5
      "
    >

      <div
        className="
          flex flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-5
        "
      >

        {/* LEFT */}

        <div
          className="
            flex items-start
            gap-4
          "
        >

          {/* ICON */}

          <div
            className="
              hidden sm:flex
              w-14 h-14
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              to-indigo-600
              text-white
              items-center
              justify-center
              shrink-0
            "
          >

            <LayoutGrid
              size={26}
            />

          </div>

          {/* TEXT */}

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3 py-1
                rounded-full
                bg-blue-50
                text-blue-600
                text-xs sm:text-sm
                font-medium
                mb-3
              "
            >

              <LayoutGrid
                size={14}
              />

              Topic Manager

            </div>

            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-800
              "
            >
              Quản lý chủ đề
            </h1>

            <p
              className="
                text-sm sm:text-base
                text-gray-500
                mt-2
                leading-relaxed
              "
            >
              Tổ chức từ vựng theo
              nhóm để học nhanh và
              trực quan hơn
            </p>

            {/* STATS */}

            <div
              className="
                flex flex-wrap
                items-center
                gap-3
                mt-4
              "
            >

              <div
                className="
                  px-3 py-1.5
                  rounded-full
                  bg-gray-100
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                📚 {totalTopics}
                chủ đề
              </div>

              <div
                className="
                  px-3 py-1.5
                  rounded-full
                  bg-blue-100
                  text-sm
                  font-medium
                  text-blue-700
                "
              >
                🈴 {totalVocabs}
                từ vựng
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
            flex flex-col
            sm:flex-row
            gap-3
            xl:min-w-[420px]
          "
        >

          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="
                absolute
                left-4 top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Tìm chủ đề..."
              className="
                w-full
                h-11
                rounded-2xl
                border border-gray-200
                bg-gray-50
                pl-11 pr-4
                text-sm
                outline-none
                focus:ring-2
                focus:ring-blue-200
                focus:border-blue-300
                transition
              "
            />

          </div>

          {/* BUTTON */}

          <button
            onClick={onCreateTopic}
            className="
              h-11
              px-5
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              flex items-center
              justify-center
              gap-2
              transition
              active:scale-[0.98]
              whitespace-nowrap
            "
          >

            <Plus size={18} />

            Tạo chủ đề

          </button>

        </div>

      </div>

    </div>

  )

}