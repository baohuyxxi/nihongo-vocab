
import { Volume2 } from "lucide-react";

import JapaneseTextWithAudio from "../JapaneseTextWithAudio";
import VietnameseTextAutoFit from "../VietnameseTextAutoFit";
import JapaneseRubyText from "../JapaneseRubyText";

import KanjiText from "./KanjiText";

const hasKanji = (value) => {
  if (typeof value !== "string") return false;

  return /[\p{Script=Han}々〆ヶ]/u.test(value);
};

export default function FlashcardFront({
  text,
  isJP,
  isKanji,
  isImage,
  onSpeak,
  kanji,
  hiragana,
  showFurigana = true,
}) {
  const japaneseText = kanji || text || "";

  const shouldShowRuby =
    isJP && hasKanji(japaneseText);

  const handleSpeak = (e) => {
    e.stopPropagation();

    if (onSpeak) {
      onSpeak(japaneseText);
    }
  };

  return (
    <div
      className="
        absolute inset-0
        flashcard-front
        rounded-2xl
        shadow-lg backface-hidden
        sm:rounded-3xl sm:shadow-xl
      "
    >
      <div
        className="
          relative
          flex h-full w-full
          min-h-0 min-w-0
          items-center justify-center
          px-3 py-3
          sm:px-6 sm:py-5
          md:px-8
        "
      >
        {/* =========================
            IMAGE
        ========================= */}

        {isImage ? (
          <div
            className="
              flex h-full w-full
              min-h-0 min-w-0
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
        ) : (

          /* =========================
              KANJI MODE
          ========================= */

          isKanji ? (
            <div
              className="
                flex h-full w-full
                min-h-0 min-w-0
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
          ) : (

            /* =========================
                JAPANESE MODE
            ========================= */

            isJP ? (
              <div
                className="
                  relative
                  flex h-full w-full
                  min-h-0 min-w-0
                  items-center justify-center
                  px-2 py-8
                  sm:px-4
                "
              >

                {/* AUDIO BUTTON */}

                {shouldShowRuby && (
                  <button
                    type="button"
                    onClick={handleSpeak}
                    aria-label="Phát âm tiếng Nhật"
                    className="
                      absolute
                      right-1 top-1
                      z-10
                      flex h-11 w-11
                      items-center justify-center
                      rounded-full
                      border border-slate-100
                      bg-white
                      flashcard-control
                      shadow-sm
                      transition
                      hover:bg-sky-50
                      active:scale-95
                      sm:right-2 sm:top-2
                    "
                  >
                    <Volume2 size={23} />
                  </button>
                )}

                {/* KANJI + FURIGANA */}

                {shouldShowRuby ? (
                  <div
                    className="
                      flex w-full
                      max-w-full
                      items-center
                      justify-center
                      overflow-visible
                      text-center
                      text-[clamp(2.5rem,6vw,5.5rem)]
                      font-medium
                      leading-[1.9]
                      tracking-wide
                      flashcard-japanese
                    "
                  >
                    <JapaneseRubyText
                      kanji={japaneseText}
                      hiragana={hiragana}
                      showFurigana={showFurigana}
                      className="
                        japanese-ruby
                        max-w-full
                      "
                    />
                  </div>
                ) : (

                  /* KANA ONLY */

                  <div
                    className="
                      flex h-full w-full
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
                )}
              </div>
            ) : (

              /* =========================
                  VIETNAMESE
              ========================= */

              <div
                className="
                  flex h-full w-full
                  min-h-0 min-w-0
                  items-center justify-center
                "
              >
                <VietnameseTextAutoFit text={text} />
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
