import JapaneseTextWithAudio from "../JapaneseTextWithAudio"
import VietnameseTextAutoFit from "../VietnameseTextAutoFit"

export default function FlashcardBack({
    back,
    onSpeak,
    isJP,
    isKanji,
}) {
    return (
        <div
            className="absolute inset-0 bg-green-50 rounded-3xl shadow-xl
      flex flex-col items-center justify-center gap-4
      rotate-x-180 backface-hidden px-4 text-center"
        >
            {/* ===== KANJI MODE ===== */}
            {isKanji && back ? (
                <>
                    {/* 🔥 HÁN VIỆT – NỔI NHẤT */}
                    {back.hanViet && (
                        <div className="font-bold text-gray-800
        text-4xl sm:text-6xl md:text-[90px] leading-tight">
                            {back.hanViet}
                        </div>
                    )}

                    {/* 🇯🇵 KANJI / JP */}
                    <JapaneseTextWithAudio
                        text={back.jp}
                        autoPlay={false}
                        onSpeak={onSpeak}
                    />

                    {/* 🇻🇳 NGHĨA */}
                    <VietnameseTextAutoFit text={back.meaning} />
                </>
            ) : isJP ? (

                /* ===== JP STRING ===== */
                <JapaneseTextWithAudio
                    text={back}
                    autoPlay={false}
                    onSpeak={onSpeak}
                />
            ) : (
                /* ===== NORMAL TEXT ===== */
                // <span className="text-4xl sm:text-6xl md:text-[88px] font-bold">
                //     {back}
                // </span>
                <VietnameseTextAutoFit text={back} />
            )}
        </div>
    )
}
