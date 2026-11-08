import FlashcardFront from "./FlashcardFront"
import FlashcardBack from "./FlashcardBack"
import { useEffect } from "react"

const getJapaneseText = (value) => {
    if (!value) return ""
    if (typeof value === "string") return value
    return value.hiragana || value.jp || value.word || ""
}

export default function Flashcard({
    front,
    back,
    showAnswer,
    onFlip,
    onSpeak,
    touchHandlers,
    direction,
    index,
    onExposeJP,
}) {
    const getJPText = () => {
        if (direction === "jp_vi" && !showAnswer) {
            return front || ""
        }

        if ((direction === "vi_jp" || direction === "kanji" || direction === "image") && showAnswer) {
            return getJapaneseText(back)
        }

        return null
    }


    // =========================
    // EXPOSE CURRENT JP
    // =========================

    useEffect(() => {

        const text = getJPText()

        onExposeJP?.(text)

    }, [
        direction,
        showAnswer,
        front,
        back,
        onExposeJP,
    ])


    // =========================
    // FRONT TEXT
    // =========================

    const frontText =
        direction === "image"
            ? front?.value
            : front


    return (

        <div
            className="
                w-full
                max-w-[95vw]
                sm:max-w-2xl
                md:max-w-3xl
                lg:max-w-4xl
                h-[clamp(220px,32vh,360px)]
                min-h-[220px]
                max-h-[360px]
                px-1
                sm:px-2
                md:h-[clamp(260px,35vh,420px)]
                md:max-h-[420px]
                lg:h-[clamp(300px,38vh,460px)]
                lg:max-h-[460px]
            "

            onClick={onFlip}

            {...touchHandlers}
        >

            <div
                className={`
                    relative
                    w-full
                    h-full

                    transition-transform
                    duration-500

                    transform-style-preserve-3d
                    cursor-pointer

                    ${
                        showAnswer
                            ? "rotate-x-180"
                            : ""
                    }
                `}
            >

                {/* =========================
                    FRONT
                ========================= */}

                <FlashcardFront
                    text={frontText}

                    isJP={
                        direction === "jp_vi"
                    }

                    isKanji={
                        direction === "kanji"
                    }

                    isImage={
                        direction === "image"
                    }

                    onSpeak={onSpeak}
                />


                {/* =========================
                    BACK
                ========================= */}

                <FlashcardBack
                    back={back}

                    isKanji={
                        direction === "kanji"
                    }

                    isImage={
                        direction === "image"
                    }

                    onSpeak={onSpeak}

                    isJP={
                        direction === "vi_jp"
                    }
                />

            </div>

        </div>
    )
}