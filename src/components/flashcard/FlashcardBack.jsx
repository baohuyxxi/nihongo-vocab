import JapaneseTextWithAudio from "../JapaneseTextWithAudio"

export default function FlashcardBack({ back, onSpeak, isJP }) {
    return (
        <div className="absolute inset-0 bg-green-50 rounded-3xl shadow-xl
      flex flex-col items-center justify-center gap-4
      rotate-x-180 backface-hidden px-4 text-center">


            {isJP ? (
                <JapaneseTextWithAudio
                    text={back}
                    autoPlay={false}
                    onSpeak={onSpeak}
                />
            ) : (
                <span className="text-4xl sm:text-6xl md:text-[88px] font-bold">
                    {back}
                </span>

            )}
        </div>
    )
}
