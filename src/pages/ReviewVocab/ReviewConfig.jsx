import { useRef } from "react";

import ReviewOptions from "../../components/reviewConfig/ReviewOptions";

import ReviewContent from "../../components/reviewConfig/ReviewContent";

export default function ReviewConfig({
  selectedLessons,
  setSelectedLessons,

  selectedTopics,
  setSelectedTopics,

  selectedUnits,
  setSelectedUnits,

  selectedN3Topics,
  setSelectedN3Topics,

  selectedPartsOfSpeech,
  setSelectedPartsOfSpeech,

  curriculumTab,
  setCurriculumTab,

  mode,
  setMode,

  directions,
  setDirections,

  reviewLimit,
  setReviewLimit,

  onStart,
  onContinue,

  hasSession,
}) {
  const isDragging = useRef(false);

  const dragMode = useRef("add");

  return (
    <div className="space-y-8">
      <div
        className="
          grid
          grid-cols-1
          gap-5
          min-w-0
          overflow-x-hidden
          lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.7fr)]
          xl:gap-6
        "
      >
        <ReviewOptions
          mode={mode}
          setMode={setMode}
          directions={directions}
          setDirections={setDirections}
          reviewLimit={reviewLimit}
          setReviewLimit={setReviewLimit}
        />

        <ReviewContent
          selectedLessons={selectedLessons}
          setSelectedLessons={setSelectedLessons}
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          selectedPartsOfSpeech={selectedPartsOfSpeech}
          setSelectedPartsOfSpeech={setSelectedPartsOfSpeech}
          selectedUnits={selectedUnits}
          setSelectedUnits={setSelectedUnits}
          selectedN3Topics={selectedN3Topics}
          setSelectedN3Topics={setSelectedN3Topics}
          curriculumTab={curriculumTab}
          setCurriculumTab={setCurriculumTab}
          isDragging={isDragging}
          dragMode={dragMode}
        />
      </div>

      <div
        className="
          flex
          flex-col
          sm:flex-row
          justify-center
          gap-3
          w-full
        "
      >
        <button
          type="button"
          onClick={onContinue}
          disabled={!hasSession}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            min-h-[44px]
            rounded-xl
            bg-gray-100
            text-gray-700
            border
            border-gray-300
            text-sm
            sm:text-base
            font-semibold
            hover:bg-gray-200
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            w-full
            sm:w-auto
          "
        >
          ▶️ Tiếp tục ôn
        </button>

        <button
          type="button"
          onClick={onStart}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            min-h-[44px]
            rounded-xl
            bg-blue-600
            text-white
            text-sm
            sm:text-base
            font-semibold
            hover:bg-blue-700
            w-full
            sm:w-auto
          "
        >
          🚀 Bắt đầu ôn mới
        </button>
      </div>
    </div>
  );
}
