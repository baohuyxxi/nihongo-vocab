
import JapaneseTextWithAudio from "../JapaneseTextWithAudio";
import VietnameseTextAutoFit from "../VietnameseTextAutoFit";

import FlashCardBackKanji from "./FlashCardBackKanji";
import FlashCardBackImage from "./FlashCardBackImage";

const isValidText = (value) => {
    if (typeof value !== "string") return false;

    const text = value.trim();

    return (
        text.length > 0 &&
        !["null", "undefined"].includes(text.toLowerCase())
    );
};

const capitalizeFirst = (value) => {
    const text = value.trim();

    if (!text) return "";

    return (
        text.charAt(0).toLocaleUpperCase("vi-VN") +
        text.slice(1)
    );
};

export default function FlashcardBack({
    back,
    onSpeak,
    isJP,
    isKanji,
    isImage,
    kanji,
    hanViet,
    hiragana,
    showFurigana = true,
}) {
    const hasKanji =
        typeof kanji === "string" &&
        /[\p{Script=Han}々〆ヶ]/u.test(kanji);

    const hanVietText = isValidText(hanViet)
        ? hanViet.trim()
        : "";

    const meaning = isValidText(back)
        ? capitalizeFirst(back)
        : "";

    return (
        <div
            className="
  absolute inset-0
  flex flex-col
  items-center justify-center
  overflow-hidden
  rounded-2xl sm:rounded-3xl
  shadow-lg sm:shadow-xl
  px-3 py-4 sm:px-6 sm:py-6 md:px-8
  rotate-x-180
  backface-hidden
  text-center
  flashcard-back
"
        >
            <div className="
        flex h-full w-full min-h-0 min-w-0
        items-center justify-center
      ">

                {/* IMAGE MODE */}

                {isImage ? (
                    <FlashCardBackImage
                        back={back}
                        onSpeak={onSpeak}
                        kanji={kanji}
                        hiragana={hiragana}
                        showFurigana={showFurigana}
                    />

                ) : isKanji && back ? (

                    /* KANJI MODE */

                    <FlashCardBackKanji
                        back={back}
                        onSpeak={onSpeak}
                    />

                ) : isJP ? (

                    /* JAPANESE MODE */

                    <div className="
            flex h-full w-full flex-col
            items-center justify-center gap-2
            px-2 py-4
          ">
                        {hasKanji && hanVietText ? (
                            <div className="flashcard-hanviet shrink-0 text-sm sm:text-base">
                                Hán Việt: {hanVietText}
                            </div>
                        ) : null}
                        <JapaneseTextWithAudio
                            text={back}
                            kanji={kanji}
                            hiragana={hiragana}
                            showFurigana={showFurigana}
                            autoPlay={false}
                            onSpeak={onSpeak}
                        />
                    </div>

                ) : (

                    /* VIETNAMESE MODE */

                    <VietnameseTextAutoFit
                        text={meaning}
                        aboveText={
                            hasKanji ? hanVietText : ""
                        }
                        aboveItalic={true}
                        maxLines={4}
                        maxFont={68}
                        mobileMaxFont={26}
                        tabletMaxFont={42}
                    />

                )}

            </div>
        </div>
    );
}
