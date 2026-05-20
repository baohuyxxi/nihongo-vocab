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

    const jpText = () => {

        if (
            direction === "jp_vi"
            && !showAnswer
        ) {
            return front
        }

        if (
            direction === "vi_jp"
            && showAnswer
        ) {
            return back
        }

        return null
    }

    useEffect(() => {

        onExposeJP?.(jpText)

    }, [jpText, onExposeJP])

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

          ${showAnswer
                        ? "rotate-x-180"
                        : ""
                    }
        `}
            >

                <FlashcardFront
                    text={front}

                    isJP={
                        direction === "jp_vi"
                    }

                    isKanji={
                        direction === "kanji"
                    }

                    onSpeak={onSpeak}
                />

                <FlashcardBack
                    back={back}

                    isKanji={
                        direction === "kanji"
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