// FlashcardBack.jsx

import JapaneseTextWithAudio
    from "../JapaneseTextWithAudio"

import VietnameseTextAutoFit
    from "../VietnameseTextAutoFit"

import FlashCardBackKanji from "./FlashCardBackKanji"

export default function FlashcardBack({
    back,
    onSpeak,
    isJP,
    isKanji,
}) {

    return (

        <div
            className="
        absolute inset-0

        bg-green-50

        rounded-2xl sm:rounded-3xl

        shadow-lg sm:shadow-xl

        flex flex-col
        items-center
        justify-center

        gap-2
        sm:gap-4
        md:gap-5

        rotate-x-180
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

            {/* ===== KANJI MODE ===== */}

            {isKanji && back ? (
                <FlashCardBackKanji
                    back={back}
                    onSpeak={onSpeak}
                />
            ) : isJP ? (

                <div
                    className="
                    w-full
                    h-full
                    text-[1.3rem]
                    leading-snug
                    sm:text-[2rem]
                    md:text-[2.8rem]
                    lg:text-[3rem]
                    overflow-hidden
                    break-words"
                >

                    <JapaneseTextWithAudio
                        text={back}
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
                        text={back}
                    />

                </div>

            )}

        </div>
    )
}