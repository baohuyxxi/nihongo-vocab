
import { useEffect, useState } from "react";

import { TOPICS } from "../../constants/topics";
import { N3_TOPICS } from "../../constants/n3Units";
import { PART_OF_SPEECH } from "../../constants/partOfSpeech";
import { getCurriculum } from "../../services/kanjiCurriculum.service";

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

  selectedKanjiPairs = [],
  setSelectedKanjiPairs = () => {},

  selectedPartsOfSpeech = [],
  setSelectedPartsOfSpeech,

  curriculumTab = "minna",
  setCurriculumTab,
  n3Source,
  setN3Source,

  isDragging,
  dragMode,
}) {
  const [kanjiCurriculum, setKanjiCurriculum] = useState([]);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [curriculumError, setCurriculumError] = useState("");

  const activeTab = VALID_CURRICULUM_TABS.includes(curriculumTab)
    ? curriculumTab
    : "minna";

  const handleTabChange = (nextTab) => {
    if (!VALID_CURRICULUM_TABS.includes(nextTab)) return;

    setCurriculumTab?.(nextTab);
  };

  const isPairSelected = (week, day) =>
    selectedKanjiPairs.some(
      (item) => item.week === week && item.day === day,
    );

  const toggleKanjiPair = (week, day) => {
    setSelectedKanjiPairs((prev) => {
      const exists = prev.some(
        (item) => item.week === week && item.day === day,
      );

      const next = exists
        ? prev.filter((item) => !(item.week === week && item.day === day))
        : [...prev, { week, day }];

      if (typeof setN3Source === "function") {
        setN3Source("sou-matome-kanji");
      }

      return next;
    });
  };

  const toggleWeekSelection = (week, days) => {
    const allSelected = days.every((day) =>
      isPairSelected(week, day.day),
    );

    setSelectedKanjiPairs((prev) => {
      const remaining = prev.filter((item) => item.week !== week);

      const next = allSelected
        ? remaining
        : [
            ...remaining,
            ...days.map((day) => ({ week, day: day.day })),
          ];

      if (typeof setN3Source === "function") {
        setN3Source("sou-matome-kanji");
      }

      return next;
    });
  };

  useEffect(() => {
    let mounted = true;

    const loadCurriculum = async () => {
      setCurriculumLoading(true);
      setCurriculumError("");

      try {
        const response = await getCurriculum();
        const rawWeeks = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        const normalizedWeeks = rawWeeks
          .map((weekItem) => {
            const week = Number(weekItem?.week);

            if (!Number.isInteger(week)) {
              return null;
            }

            const days = Array.isArray(weekItem?.days)
              ? weekItem.days
                  .map((dayItem) => {
                    const day = Number(dayItem?.day);

                    if (!Number.isInteger(day)) {
                      return null;
                    }

                    return {
                      ...dayItem,
                      day,
                    };
                  })
                  .filter(Boolean)
                  .filter(
                    (dayItem) =>
                      Number(dayItem.day) > 0 &&
                      (dayItem.totalEntries > 0 ||
                        dayItem.kanjiCount > 0 ||
                        dayItem.vocabularyCount > 0),
                  )
              : [];

            return {
              week,
              days,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.week - b.week);

        if (!mounted) return;

        setKanjiCurriculum(normalizedWeeks);

        if (normalizedWeeks.length > 0) {
          setExpandedWeeks((prev) => {
            const next = { ...prev };
            normalizedWeeks.forEach((weekItem) => {
              if (!(weekItem.week in next)) {
                next[weekItem.week] = weekItem.week === normalizedWeeks[0].week;
              }
            });
            return next;
          });
        }
      } catch (err) {
        console.error("Load N3 Kanji curriculum error:", err);

        if (!mounted) return;

        setCurriculumError(
          "API /api/kanji-curriculum không trả đủ metadata tuần/ngày để hiển thị lựa chọn. Không suy đoán dữ liệu theo cách thủ công.",
        );
      } finally {
        if (mounted) {
          setCurriculumLoading(false);
        }
      }
    };

    loadCurriculum();

    return () => {
      mounted = false;
    };
  }, []);

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
    setSelectedUnits((prev) => {
      const next = prev.includes(unit)
        ? prev.filter((u) => u !== unit)
        : [...prev, unit];

      if (typeof setN3Source === "function") {
        setN3Source("mimi-kara");
      }

      return next;
    });
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
        className="grid w-full grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1 border border-gray-200 min-w-0"
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
                min-h-[44px] rounded-lg px-2 text-[11px] sm:text-xs md:text-sm font-medium transition
                whitespace-nowrap touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
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

      {activeTab !== "minna" && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Sou Matome N3 – Kanji
            </h3>

            <span className="text-xs font-medium text-gray-500">
              Đã chọn: {selectedKanjiPairs.length}
            </span>
          </div>

          {curriculumLoading && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-sm text-gray-500">
              Đang tải dữ liệu tuần/ngày từ API...
            </div>
          )}

          {!curriculumLoading && curriculumError && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-4 text-sm text-amber-700">
              {curriculumError}
            </div>
          )}

          {!curriculumLoading && !curriculumError && kanjiCurriculum.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-sm text-gray-500">
              Không có dữ liệu curriculum Kanji để hiển thị.
            </div>
          )}

          {!curriculumLoading && !curriculumError && kanjiCurriculum.length > 0 && (
            <div className="space-y-3">
              {kanjiCurriculum.map((weekItem) => {
                const week = weekItem.week;
                const isOpen = !!expandedWeeks[week];
                const allSelected = weekItem.days.length > 0 &&
                  weekItem.days.every((dayItem) =>
                    isPairSelected(week, dayItem.day),
                  );

                return (
                  <div
                    key={`week-${week}`}
                    className="rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedWeeks((prev) => ({
                            ...prev,
                            [week]: !prev[week],
                          }))
                        }
                        className="flex items-center gap-2 text-left text-sm font-medium text-gray-700"
                      >
                        <span>{isOpen ? "▾" : "▸"}</span>
                        <span>Tuần {week}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWeekSelection(week, weekItem.days)}
                        className={`rounded border px-2 py-1 text-[11px] font-medium transition ${
                          allSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {allSelected ? "Bỏ chọn" : "Chọn cả tuần"}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="border-t border-gray-200 p-3">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-2">
                          {weekItem.days.map((dayItem) => {
                            const checked = isPairSelected(week, dayItem.day);

                            return (
                              <button
                                key={`week-${week}-day-${dayItem.day}`}
                                type="button"
                                onClick={() => toggleKanjiPair(week, dayItem.day)}
                                className={`
                                  min-h-[42px] rounded-lg border px-2 py-2 text-xs sm:text-sm font-medium transition
                                  ${
                                    checked
                                      ? "bg-orange-500 text-white border-orange-500"
                                      : "bg-gray-100 hover:bg-gray-200"
                                  }
                                `}
                                title={`Tuần ${week} - Ngày ${dayItem.day}`}
                              >
                                Ngày {dayItem.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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

      {activeTab !== "n3" && (
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
      )}
    </section>
  );
}
