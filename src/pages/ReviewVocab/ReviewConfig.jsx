import { useRef }
  from "react"

import ReviewOptions
  from "../../components/reviewConfig/ReviewOptions"

import ReviewContent
  from "../../components/reviewConfig/ReviewContent"


export default function ReviewConfig({

  selectedLessons,
  setSelectedLessons,

  selectedTopics,
  setSelectedTopics,

  selectedPartsOfSpeech,
  setSelectedPartsOfSpeech,

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

  const isDragging =
    useRef(false)

  const dragMode =
    useRef("add")


  return (

    <div className="space-y-8">

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
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

          selectedLessons={
            selectedLessons
          }

          setSelectedLessons={
            setSelectedLessons
          }

          selectedTopics={
            selectedTopics
          }

          setSelectedTopics={
            setSelectedTopics
          }

          selectedPartsOfSpeech={
            selectedPartsOfSpeech
          }

          setSelectedPartsOfSpeech={
            setSelectedPartsOfSpeech
          }

          isDragging={
            isDragging
          }

          dragMode={
            dragMode
          }

        />

      </div>


      <div
        className="
          flex
          justify-center
          gap-3
        "
      >

        <button

          type="button"

          onClick={
            onContinue
          }

          disabled={
            !hasSession
          }

          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-8
            py-3
            rounded-xl
            bg-gray-100
            text-gray-700
            border
            border-gray-300
            text-lg
            font-semibold
            hover:bg-gray-200
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >

          ▶️ Tiếp tục ôn

        </button>


        <button

          type="button"

          onClick={
            onStart
          }

          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-8
            py-3
            rounded-xl
            bg-blue-600
            text-white
            text-lg
            font-semibold
            hover:bg-blue-700
          "
        >

          🚀 Bắt đầu ôn mới

        </button>

      </div>

    </div>
  )
}