
import JapaneseTextWithAudio from "../JapaneseTextWithAudio";
import VietnameseTextAutoFit from "../VietnameseTextAutoFit";

import KanjiText from "./KanjiText";

export default function FlashcardFront({
  text,
  isJP,
  isKanji,
  isImage,
  onSpeak,
}) {
  return (
    <div
      className="
        absolute inset-0
        rounded-2xl bg-white
        shadow-lg backface-hidden
        sm:rounded-3xl sm:shadow-xl
      "
    >
      <div
        className="
          flex h-full w-full min-h-0 min-w-0
          items-center justify-center
          px-3 py-3
          sm:px-6 sm:py-5
          md:px-8
        "
      >
        {isImage ? (
          /* IMAGE */
          <div
            className="
              flex h-full w-full min-h-0 min-w-0
              items-center justify-center
              p-2
            "
          >
            <img
              src={text}
              alt=""
              className="
                block max-h-full max-w-full
                rounded-xl object-contain
              "
            />
          </div>
        ) : isKanji ? (
          /* KANJI */
          <div
            className="
              flex h-full w-full min-h-0 min-w-0
              items-center justify-center
            "
          >
            <div
              className="
                flex max-w-full
                origin-center items-center
                justify-center gap-1
                scale-[0.55]
                sm:scale-[0.75]
                md:scale-90
                lg:scale-100
              "
            >
              <KanjiText text={text} />
            </div>
          </div>
        ) : isJP ? (
          /* JAPANESE */
          <div
            className="
              flex h-full w-full min-h-0 min-w-0
              items-center justify-center
              px-1 py-2
              sm:px-2 sm:py-3
            "
          >
            <JapaneseTextWithAudio
              text={text}
              autoPlay={false}
              onSpeak={onSpeak}
            />
          </div>
        ) : (
          /* VIETNAMESE */
          <div
            className="
              flex h-full w-full min-h-0 min-w-0
              items-center justify-center
            "
          >
            <VietnameseTextAutoFit text={text} />
          </div>
        )}
      </div>
    </div>
  );
}
