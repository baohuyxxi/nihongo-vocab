import { TOPICS } from "../../constants/topics"
import { PART_OF_SPEECH } from "../../constants/partOfSpeech"

const LESSON_COUNT = 50

export default function ReviewContent({
    selectedLessons,
    setSelectedLessons,
    selectedTopics,
    setSelectedTopics,
    selectedPartsOfSpeech,
    setSelectedPartsOfSpeech,
    isDragging,
    dragMode,
}) {
    const toggleLesson = (lesson, forceMode) => {
        setSelectedLessons((prev) => {
            const exists = prev.includes(lesson)

            if (forceMode === "add" && !exists) {
                return [...prev, lesson]
            }

            if (forceMode === "remove" && exists) {
                return prev.filter((l) => l !== lesson)
            }

            if (forceMode) {
                return prev
            }

            return exists
                ? prev.filter((l) => l !== lesson)
                : [...prev, lesson]
        })
    }
    const toggleTopic = (key) => {
        setSelectedTopics((prev) => {
            if (prev.includes(key)) {
                return prev.filter((t) => t !== key)
            }

            return [...prev, key]
        })
    }

    // =========================
    // PART OF SPEECH
    // =========================

    const togglePartOfSpeech = (key) => {
        setSelectedPartsOfSpeech((prev) => {
            if (prev.includes(key)) {
                return prev.filter((t) => t !== key)
            }

            return [...prev, key]
        })
    }
    return (
        <section className="lg:col-span-2 bg-white rounded-xl shadow p-5 space-y-6">

            <h2 className="font-semibold flex items-center gap-2">
                📚 <span>Chọn nội dung ôn</span>
            </h2>


            {/* LESSONS */}

            <div>

                <h3 className="text-sm font-medium mb-2 text-gray-600">
                    Bài Minna (1–50)
                </h3>

                <div
                    className="
            grid
            gap-2
            select-none
            grid-cols-4
            sm:grid-cols-6
            md:grid-cols-8
            lg:grid-cols-10
          "
                    onMouseUp={() => {
                        isDragging.current = false
                    }}
                    onMouseLeave={() => {
                        isDragging.current = false
                    }}
                >

                    {Array.from(
                        { length: LESSON_COUNT },
                        (_, i) => i + 1
                    ).map((lesson) => {

                        const checked =
                            selectedLessons.includes(lesson)

                        return (
                            <div
                                key={lesson}

                                className={`
                  aspect-square
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  cursor-pointer
                  text-xs
                  font-medium
                  transition

                  ${checked
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-100 hover:bg-gray-200"
                                    }
                `}

                                onMouseDown={() => {
                                    isDragging.current = true

                                    dragMode.current = checked
                                        ? "remove"
                                        : "add"

                                    toggleLesson(
                                        lesson,
                                        dragMode.current
                                    )
                                }}

                                onMouseEnter={() => {
                                    if (!isDragging.current) {
                                        return
                                    }

                                    toggleLesson(
                                        lesson,
                                        dragMode.current
                                    )
                                }}
                            >
                                {lesson}
                            </div>
                        )
                    })}

                </div>

            </div>


            {/* TOPICS */}

            <div>

                <h3 className="text-sm font-medium mb-2 text-gray-600">
                    Chủ đề mở rộng
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">

                    {TOPICS.map((item) => {

                        const checked =
                            selectedTopics.includes(item.key)

                        return (
                            <div
                                key={item.key}
                                onClick={() =>
                                    toggleTopic(item.key)
                                }
                                className={`
                  px-3
                  py-2
                  rounded-lg
                  border
                  text-sm
                  cursor-pointer
                  transition
                  text-center

                  ${checked
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-gray-100 hover:bg-gray-200"
                                    }
                `}
                            >
                                {item.label}
                            </div>
                        )
                    })}

                </div>

            </div>


            {/* PART OF SPEECH */}

            <div>

                <h3 className="text-sm font-medium mb-2 text-gray-600">
                    Loại từ
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">

                    {PART_OF_SPEECH.map((item) => {

                        const checked =
                            selectedPartsOfSpeech.includes(
                                item.key
                            )

                        return (
                            <div
                                key={item.key}
                                onClick={() =>
                                    togglePartOfSpeech(item.key)
                                }
                                className={`
                  px-3
                  py-2
                  rounded-lg
                  border
                  text-sm
                  cursor-pointer
                  transition
                  text-center

                  ${checked
                                        ? "bg-purple-600 text-white border-purple-600"
                                        : "bg-gray-100 hover:bg-gray-200"
                                    }
                `}
                            >
                                {item.label}
                            </div>
                        )
                    })}

                </div>

            </div>

        </section>
    )
}