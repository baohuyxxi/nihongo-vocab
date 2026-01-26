import JapaneseTextWithAudio from "../JapaneseTextWithAudio"
import VietnameseTextAutoFit from "../VietnameseTextAutoFit"
import KanjiStrokePlayer from "./KanjiStrokePlayer"
export default function FlashcardFront({ text, isJP, isKanji, onSpeak }) {
  return (
    <div
      className="
        absolute inset-0 bg-white rounded-3xl shadow-xl
        flex items-center justify-center backface-hidden
        px-4 text-center
      "
    >
      {isKanji ? (
        <KanjiStrokePlayer kanji={text} />
      ) : isJP ? (
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
