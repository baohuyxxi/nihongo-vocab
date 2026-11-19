
import { useEffect, useRef } from "react";

import AutoFitText from "./flashcard/AutoFitText";
import JapaneseRubyText from "./JapaneseRubyText";

export default function JapaneseTextWithAudio({
  text,
  autoPlay = false,
  onSpeak,
  kanji,
  hiragana,
  showFurigana = true,
}) {
  const normalizedText =
    typeof text === "string"
      ? text
      : text?.hiragana ||
        text?.jp ||
        text?.word ||
        "";

  const hasPlayed = useRef(false);

  useEffect(() => {
    hasPlayed.current = false;
  }, [text]);

  useEffect(() => {
    if (
      !autoPlay ||
      hasPlayed.current ||
      !normalizedText ||
      typeof onSpeak !== "function"
    ) {
      return;
    }

    hasPlayed.current = true;
    onSpeak(normalizedText);
  }, [autoPlay, normalizedText, onSpeak]);

  if (!normalizedText) return null;

  const handleSpeak = (event) => {
    event.stopPropagation();

    if (typeof onSpeak === "function") {
      onSpeak(normalizedText);
    }
  };

  const hasKanji =
    typeof kanji === "string" &&
    /[\p{Script=Han}々〆ヶ]/u.test(kanji);

  return (
    <div
      className="
        flashcard-japanese
        relative
        flex h-full w-full
        min-h-0 min-w-0
        items-center justify-center
      "
    >
      <div
        className="
          flashcard-japanese
          h-full w-full
          min-h-0 min-w-0
          px-2 py-8
          sm:px-6 sm:py-10
        "
      >
        {hasKanji ? (
          <div className="
            flex h-full w-full
            items-center justify-center
            overflow-hidden
            text-center
          ">
            <JapaneseRubyText
              kanji={kanji}
              hiragana={hiragana}
              showFurigana={showFurigana}
              className="
                block max-w-full
                text-[clamp(2rem,8vw,5.5rem)]
                font-normal
                leading-[1.35]
                [overflow-wrap:anywhere]
              "
            />
          </div>
        ) : (
          <AutoFitText
            text={normalizedText}
            maxLines={2}
            minFontSize={12}
            maxFontSize={96}
          />
        )}
      </div>

      {typeof onSpeak === "function" && (
        <button
          type="button"
          onClick={handleSpeak}
          className="
            absolute
            right-1 top-1
            z-20
            flex h-10 w-10
            items-center justify-center
            rounded-full
            bg-white/90
            text-xl
            shadow-sm
            transition
            hover:bg-blue-50
            active:scale-95
            sm:right-3 sm:top-3
            sm:h-12 sm:w-12
            sm:text-2xl
            flashcard-control
          "
          aria-label="Phát âm tiếng Nhật"
          title="Phát âm tiếng Nhật"
        >
          🔊
        </button>
      )}
    </div>
  );
}
