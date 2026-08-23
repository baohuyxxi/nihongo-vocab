import FlashcardFront from "./FlashcardFront"
import FlashcardBack from "./FlashcardBack"
import { useEffect } from "react"

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

    // =========================
    // JP TEXT FOR KEY "3"
    // =========================

    const getJPText = () => {

        // =========================
        // JP → VI
        // Front là tiếng Nhật
        // =========================

        if (
            direction === "jp_vi" &&
            !showAnswer
        ) {
            return front
        }


        // =========================
        // VI → JP
        // Back là tiếng Nhật
        // =========================

        if (
            direction === "vi_jp" &&
            showAnswer
        ) {
            return back
        }


        // =========================
        // IMAGE
        //
        // Front là IMAGE
        // Back mới có tiếng Nhật
        //
        // Chỉ cho phép đọc khi đã lật
        // =========================

        if (
            direction === "image" &&
            showAnswer
        ) {
            return back?.jp || null
        }


        // =========================
        // KANJI
        //
        // Nếu muốn phím 3 đọc JP
        // khi đang ở mặt sau Kanji
        // =========================

        if (
            direction === "kanji" &&
            showAnswer
        ) {
            return back?.jp || null
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

                h-[220px]
                xs:h-[240px]
                sm:h-[320px]
                md:h-[420px]
                lg:h-[500px]

                px-1
                sm:px-2
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