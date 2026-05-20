// FlashcardBack.jsx

import JapaneseTextWithAudio
    from "../JapaneseTextWithAudio"

import VietnameseTextAutoFit
    from "../VietnameseTextAutoFit"

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

                <>

                    {/* HÁN VIỆT */}

                    {back.hanViet && (

                        <div
                            className="
                font-bold
                text-gray-800

                leading-tight

                text-2xl
                sm:text-4xl
                md:text-6xl
                lg:text-7xl

                break-words
              "
                        >
                            {back.hanViet}
                        </div>

                    )}

                    {/* JP */}

                    <div
                        className="
              w-full

              text-lg
              sm:text-2xl
              md:text-4xl

              overflow-hidden
            "
                    >

                        <JapaneseTextWithAudio
                            text={back.jp}
                            autoPlay={false}
                            onSpeak={onSpeak}
                        />

                    </div>

                    {/* VN */}

                    <div
                        className="
              w-full
              max-w-[90%]
              overflow-hidden
            "
                    >

                        <VietnameseTextAutoFit
                            text={back.meaning}
                        />

                    </div>

                </>

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