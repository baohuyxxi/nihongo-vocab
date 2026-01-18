import JapaneseTextWithAudio from "../JapaneseTextWithAudio"
import VietnameseTextAutoFit from "../VietnameseTextAutoFit"

export default function FlashcardFront({ text, isJP, onSpeak }) {
  return (
    <div className="absolute inset-0 bg-white rounded-3xl shadow-xl
      flex items-center justify-center backface-hidden
      px-4 text-center">
      {isJP ? (
        <JapaneseTextWithAudio
          text={text}
          autoPlay={false}
          onSpeak={onSpeak}
        />
      ) : (
        <VietnameseTextAutoFit text={text} />
      )}
    </div>
  )
}
