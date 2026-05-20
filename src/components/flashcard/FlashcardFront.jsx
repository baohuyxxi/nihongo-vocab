import JapaneseTextWithAudio
  from "../JapaneseTextWithAudio"

import VietnameseTextAutoFit
  from "../VietnameseTextAutoFit"

import KanjiStrokePlayer
  from "./KanjiStrokePlayer"

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

              scale-75
              sm:scale-90
              md:scale-100
            "
          >
            <KanjiStrokePlayer
              kanji={text}
            />
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