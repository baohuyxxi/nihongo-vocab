
import { TOPICS } from "../../constants/topics";
import { N3_TOPICS } from "../../constants/n3Units";
import { PART_OF_SPEECH } from "../../constants/partOfSpeech";

const LESSON_COUNT = 50;

const VALID_CURRICULUM_TABS = ["minna", "n3", "mixed"];

const TABS = [
  { key: "minna", label: "N5 / N4" },
  { key: "n3", label: "N3" },
  { key: "mixed", label: "Tổng hợp" },
];

export default function ReviewContent({
  selectedLessons = [],
  setSelectedLessons,

  selectedTopics = [],
  setSelectedTopics,

  selectedUnits = [],
  setSelectedUnits,

  selectedPartsOfSpeech = [],
  setSelectedPartsOfSpeech,

  curriculumTab = "minna",
  setCurriculumTab,

  isDragging,
  dragMode,
}) {
  const activeTab = VALID_CURRICULUM_TABS.includes(curriculumTab)
    ? curriculumTab
    : "minna";

  const handleTabChange = (nextTab) => {
    if (!VALID_CURRICULUM_TABS.includes(nextTab)) return;

    setCurriculumTab?.(nextTab);
  };

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
    <section className="min-w-0 w-full bg-white rounded-xl shadow p-3 sm:p-4 md:p-5 space-y-5 md:space-y-6">
      <h2 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
        📚 <span>Chọn nội dung ôn</span>
      </h2>

      <div
        role="tablist"
        aria-label="Curriculum selector"
        className="flex w-full rounded-xl bg-gray-100 p-1 border border-gray-200 overflow-hidden min-w-0"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-pressed={isActive}
              onClick={() => handleTabChange(tab.key)}
              className={`
                flex-1 min-w-0 h-11 rounded-lg px-2 text-[11px] sm:text-sm font-medium transition
                whitespace-nowrap touch-manipulation
                ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab !== "n3" && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-600">
            Bài Minna (1–50)
          </h3>

          <div
            className="
              grid gap-2 select-none
              grid-cols-4 sm:grid-cols-5 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10
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
                    rounded-lg border cursor-pointer text-[11px] sm:text-xs
                    font-medium transition select-none
                    min-h-[32px]
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
      )}

      {activeTab !== "minna" && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-600">
            Mimi kara Oboeru – N3 (12 Unit)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
            {N3_TOPICS.map((item) => {
              const checked = selectedUnits.includes(item.unit);

              return (
                <button
                  key={item.unit}
                  type="button"
                  onClick={() => toggleUnit(item.unit)}
                  title={`${item.label} - ${item.meaning}`}
                  className={`
                    px-2 py-3 rounded-lg border
                    text-xs sm:text-sm font-medium transition
                    min-h-[72px] leading-tight text-center
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
      )}

      {activeTab !== "n3" && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-600">
            Chủ đề mở rộng
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
            {TOPICS.map((item) => {
              const checked = selectedTopics.includes(item.key);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleTopic(item.key)}
                  className={`
                    px-3 py-2 rounded-lg border
                    text-xs sm:text-sm cursor-pointer transition text-center
                    min-h-[44px] leading-snug
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
      )}

      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-600">
          Loại từ
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
          {PART_OF_SPEECH.map((item) => {
            const checked = selectedPartsOfSpeech.includes(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => togglePartOfSpeech(item.key)}
                className={`
                  px-3 py-2 rounded-lg border
                  text-xs sm:text-sm cursor-pointer transition text-center
                  min-h-[44px] leading-snug
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
