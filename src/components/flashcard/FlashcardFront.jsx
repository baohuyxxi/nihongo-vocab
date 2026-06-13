import JapaneseTextWithAudio
  from "../JapaneseTextWithAudio"

import VietnameseTextAutoFit
  from "../VietnameseTextAutoFit"

import KanjiStrokePlayer
  from "./KanjiStrokePlayer"

import KanjiText from "./KanjiText"


export default function FlashcardFront({
  text,
  isJP,
  isKanji,
  onSpeak,
}) {

  return (

    <div
      className="
        absolute inset-0
        bg-white
        rounded-2xl sm:rounded-3xl
        shadow-lg sm:shadow-xl
        flex items-center justify-center
        backface-hidden
        px-3
        sm:px-6
        md:px-8
        py-4
        sm:py-6
        text-center
        overflow-hidden
      "
    >

      <div
        className="
          w-full
          h-full
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >

        {isKanji ? (
          <div
            className="
      w-full
      h-full

      flex
      items-center
      justify-center

      overflow-hidden
      px-2
    "
          >
            <div
              className="
        flex
        items-center
        justify-center
        gap-1

        max-w-full
  

        scale-[0.55]
        sm:scale-[0.75]
        md:scale-90
        lg:scale-100

        origin-center
        whitespace-nowrap
      "
            >
              <KanjiText text={text} />
            </div>
          </div>
        ) : isJP ? (

          <div
            className="
              w-full
              h-full
              text-[1.4rem]
              leading-snug
              sm:text-[2rem]
              md:text-[2.8rem]
              lg:text-[3.2rem]

              break-words
              overflow-hidden
            "
          >
            <JapaneseTextWithAudio
              text={text}
              autoPlay={false}
              onSpeak={onSpeak}
            />
          </div>

        ) : (

          <div
            className="
              w-full
              overflow-hidden
            "
          >
            <VietnameseTextAutoFit
              text={text}
            />
          </div>

        )}

      </div>

    </div>
  )
}