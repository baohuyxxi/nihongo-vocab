
import { TOPICS } from "../../constants/topics";
import { N3_TOPICS } from "../../constants/n3Units";
import { PART_OF_SPEECH } from "../../constants/partOfSpeech";

const LESSON_COUNT = 50;

export default function ReviewContent({
  selectedLessons = [],
  setSelectedLessons,

  selectedTopics = [],
  setSelectedTopics,

  selectedUnits = [],
  setSelectedUnits,

  selectedPartsOfSpeech = [],
  setSelectedPartsOfSpeech,

  isDragging,
  dragMode,
}) {
  // =========================
  // LESSON
  // =========================

  const toggleLesson = (lesson, forceMode) => {
    setSelectedLessons((prev) => {
      const exists = prev.includes(lesson);

      if (forceMode === "add" && !exists) {
        return [...prev, lesson];
      }

      if (forceMode === "remove" && exists) {
        return prev.filter((l) => l !== lesson);
      }

      if (forceMode) return prev;

      return exists
        ? prev.filter((l) => l !== lesson)
        : [...prev, lesson];
    });
  };

  // =========================
  // MINNA TOPICS
  // =========================

  const toggleTopic = (key) => {
    setSelectedTopics((prev) =>
      prev.includes(key)
        ? prev.filter((t) => t !== key)
        : [...prev, key],
    );
  };

  // =========================
  // N3 UNITS
  // =========================

  const toggleUnit = (unit) => {
    setSelectedUnits((prev) =>
      prev.includes(unit)
        ? prev.filter((u) => u !== unit)
        : [...prev, unit],
    );
  };

  // =========================
  // PART OF SPEECH
  // =========================

  const togglePartOfSpeech = (key) => {
    setSelectedPartsOfSpeech((prev) =>
      prev.includes(key)
        ? prev.filter((t) => t !== key)
        : [...prev, key],
    );
  };

  return (
    <section className="lg:col-span-2 bg-white rounded-xl shadow p-5 space-y-6">
      <h2 className="font-semibold flex items-center gap-2">
        📚 <span>Chọn nội dung ôn</span>
      </h2>

      {/* =========================
          MINNA LESSONS
      ========================= */}

      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-600">
          Bài Minna (1–50)
        </h3>

        <div
          className="
            grid gap-2 select-none
            grid-cols-4 sm:grid-cols-6
            md:grid-cols-8 lg:grid-cols-10
          "
          onMouseUp={() => {
            isDragging.current = false;
          }}
          onMouseLeave={() => {
            isDragging.current = false;
          }}
        >
          {Array.from(
            { length: LESSON_COUNT },
            (_, i) => i + 1,
          ).map((lesson) => {
            const checked = selectedLessons.includes(lesson);

            return (
              <div
                key={lesson}
                className={`
                  aspect-square flex items-center justify-center
                  rounded-lg border cursor-pointer text-xs
                  font-medium transition
                  ${
                    checked
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
                onMouseDown={() => {
                  isDragging.current = true;

                  dragMode.current = checked
                    ? "remove"
                    : "add";

                  toggleLesson(lesson, dragMode.current);
                }}
                onMouseEnter={() => {
                  if (!isDragging.current) return;

                  toggleLesson(lesson, dragMode.current);
                }}
              >
                {lesson}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
          N3 UNITS
      ========================= */}

      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-600">
          Mimi kara Oboeru – N3 (12 Unit)
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {N3_TOPICS.map((item) => {
            const checked = selectedUnits.includes(item.unit);

            return (
              <button
                key={item.unit}
                type="button"
                onClick={() => toggleUnit(item.unit)}
                title={`${item.label} - ${item.meaning}`}
                className={`
                  px-3 py-3 rounded-lg border
                  text-sm font-medium transition
                  ${
                    checked
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                <div>Unit {item.unit}</div>

                <div
                  className={`
                    text-xs mt-1
                    ${
                      checked
                        ? "text-orange-100"
                        : "text-gray-500"
                    }
                  `}
                >
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================
          MINNA TOPICS
      ========================= */}

      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-600">
          Chủ đề mở rộng
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {TOPICS.map((item) => {
            const checked = selectedTopics.includes(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleTopic(item.key)}
                className={`
                  px-3 py-2 rounded-lg border
                  text-sm cursor-pointer transition text-center
                  ${
                    checked
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================
          PART OF SPEECH
      ========================= */}

      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-600">
          Loại từ
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {PART_OF_SPEECH.map((item) => {
            const checked = selectedPartsOfSpeech.includes(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => togglePartOfSpeech(item.key)}
                className={`
                  px-3 py-2 rounded-lg border
                  text-sm cursor-pointer transition text-center
                  ${
                    checked
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
