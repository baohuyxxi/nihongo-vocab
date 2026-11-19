
import JapaneseTextWithAudio from "../JapaneseTextWithAudio";
import JapaneseRubyText from "../JapaneseRubyText";

export default function FlashCardBackImage({
  back,
  onSpeak,
  kanji,
  hiragana,
  showFurigana = true,
}) {
  if (!back) return null;

  const meaning =
    typeof back.meaning === "string"
      ? back.meaning.trim()
      : "";

  const capitalize = (value) => {
    if (!value) return "";

    return (
      value.charAt(0).toLocaleUpperCase("vi-VN") +
      value.slice(1)
    );
  };

  return (
    <div
      className="
        flashcard-japanese
        flex h-full w-full
        flex-col items-center justify-center
        gap-3 sm:gap-4 md:gap-5
        overflow-hidden px-3 sm:px-5 md:px-7
        py-4 sm:py-5 text-center
      "
    >
      {/* KANJI */}

      {back.kanji && (
        <div className="flashcard-japanese w-full text-[clamp(2rem,6vw,4rem)] leading-tight">
          <JapaneseRubyText
            kanji={back.kanji || kanji}
            hiragana={back.hiragana || hiragana}
            showFurigana={showFurigana}
            className="max-w-full"
          />
        </div>
      )}

      {/* JP / HIRAGANA */}

      <div className="
        flex min-h-[60px] w-full
        items-center justify-center
        overflow-hidden
        sm:min-h-[80px]
        md:min-h-[100px]
      ">
        <JapaneseTextWithAudio
          text={back.jp}
          autoPlay={false}
          onSpeak={onSpeak}
        />
      </div>

      {/* MEANING */}

      {meaning && (
        <div
          className="
            flashcard-vietnamese
            w-full
            break-words
            text-[clamp(1.5rem,4vw,3rem)]
            font-normal
            leading-snug
          "
        >
          {capitalize(meaning)}
        </div>
      )}
    </div>
  );
}
