
import { useEffect, useRef } from "react";

import AutoFitText from "./flashcard/AutoFitText";

export default function JapaneseTextWithAudio({
  text,
  autoPlay = false,
  onSpeak,
}) {
  const hasPlayed = useRef(false);

  // Reset khi đổi từ
  useEffect(() => {
    hasPlayed.current = false;
  }, [text]);

  // Tự động phát âm một lần
  useEffect(() => {
    if (
      !autoPlay ||
      hasPlayed.current ||
      !text ||
      typeof onSpeak !== "function"
    ) {
      return;
    }

    hasPlayed.current = true;
    onSpeak(text);
  }, [autoPlay, text, onSpeak]);

  if (!text) return null;

  const handleSpeak = (event) => {
    event.stopPropagation();

    if (typeof onSpeak === "function") {
      onSpeak(text);
    }
  };

  return (
    <div
      className="
        relative
        flex h-full w-full
        min-h-0 min-w-0
        items-center justify-center
      "
    >
      {/* JAPANESE AUTO FIT */}
      <div
        className="
          h-full w-full
          min-h-0 min-w-0
          px-2 py-8
          sm:px-6 sm:py-10
        "
      >
        <AutoFitText
          text={text}
          maxLines={2}
          minFontSize={12}
          maxFontSize={96}
        />
      </div>

      {/* AUDIO BUTTON */}
      {typeof onSpeak === "function" && (
        <button
          type="button"
          onClick={handleSpeak}
          className="
            absolute
            right-1 top-1
            z-20
            flex h-10 w-10
            items-center justify-center
            rounded-full
            bg-white/90
            text-xl
            shadow-sm
            transition
            hover:bg-blue-50
            active:scale-95
            sm:right-3 sm:top-3
            sm:h-12 sm:w-12
            sm:text-2xl
          "
          aria-label="Phát âm tiếng Nhật"
          title="Phát âm tiếng Nhật"
        >
          🔊
        </button>
      )}
    </div>
  );
}
