// FlashcardBack.jsx

import JapaneseTextWithAudio
    from "../JapaneseTextWithAudio"

import VietnameseTextAutoFit
    from "../VietnameseTextAutoFit"

import FlashCardBackKanji
    from "./FlashCardBackKanji"
import FlashCardBackImage from "./FlashCardBackImage"

export default function FlashcardBack({
    back,
    onSpeak,
    isJP,
    isKanji,
    isImage,
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
            <div className="flex h-full w-full min-h-0 items-center justify-center">

            {/* =========================
                IMAGE MODE
            ========================= */}

            {isImage ? (

                <FlashCardBackImage
                    back={back}
                    onSpeak={onSpeak}
                />

            ) : isKanji && back ? (

                /* =========================
                    KANJI MODE
                ========================= */

                <FlashCardBackKanji
                    back={back}
                    onSpeak={onSpeak}
                />

            ) : isJP ? (

                /* =========================
                    JP MODE
                ========================= */

                <div className="flex h-full w-full items-center justify-center px-2 py-4">

                    <JapaneseTextWithAudio
                        text={back}
                        autoPlay={false}
                        onSpeak={onSpeak}
                    />

                </div>

            ) : (

                /* =========================
                    VI MODE
                ========================= */

                <div className="flex h-full w-full items-center justify-center">

                    <VietnameseTextAutoFit
                        text={back}
                    />

                </div>

            )}

            </div>
        </div>
    )
}