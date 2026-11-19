
import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import VietnameseTextAutoFit from "../VietnameseTextAutoFit";

const MAX_SIZE = 82;
const MIN_SIZE = 30;
const STEP = 2;

const getText = (...values) => {
  for (const value of values) {
    if (
      typeof value === "string" &&
      value.trim() &&
      !["null", "undefined"].includes(
        value.trim().toLowerCase()
      )
    ) {
      return value.trim();
    }
  }

  return "";
};

export default function FlashCardBackKanji({
  back,
  onSpeak,
}) {
  const jpRef = useRef(null);
  const wrapperRef = useRef(null);

  const [fontSize, setFontSize] = useState(MAX_SIZE);

  const japaneseText = getText(
    back?.hiragana,
    back?.word,
    back?.jp
  );

  const hanVietText = getText(
    back?.hanViet,
    back?.hanviet
  );

  const meaningText = getText(
    back?.meaning,
    back?.meaningText
  );

  useLayoutEffect(() => {
    const el = jpRef.current;
    const wrapper = wrapperRef.current;

    if (!el || !wrapper) return;

    const fitText = () => {
      let size = MAX_SIZE;

      el.style.fontSize = `${size}px`;

      while (
        size > MIN_SIZE &&
        (
          el.scrollHeight > wrapper.clientHeight ||
          el.scrollWidth > wrapper.clientWidth
        )
      ) {
        size -= STEP;
        el.style.fontSize = `${size}px`;
      }

      setFontSize(size);
    };

    fitText();

    const observer = new ResizeObserver(fitText);
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [japaneseText]);

  if (!back) return null;

  const capitalize = (value) =>
    value
      ? value.charAt(0).toLocaleUpperCase("vi-VN") +
        value.slice(1)
      : "";

  return (
    <div
      className="
        flashcard-japanese
        flex h-full w-full
        flex-col items-center justify-center
        gap-3 sm:gap-4 md:gap-5
        overflow-hidden px-3 py-3
        sm:px-5 md:px-7 text-center
      "
    >
      {/* HÁN VIỆT + NGHĨA */}

      {(hanVietText || meaningText) && (
        <VietnameseTextAutoFit
          aboveText={hanVietText}
          text={capitalize(meaningText)}
          maxLines={4}
          maxFont={48}
          mobileMaxFont={22}
          tabletMaxFont={34}
        />
      )}

      {/* JAPANESE */}

      <div
        ref={wrapperRef}
        className="
          relative
          flex min-h-[58px] w-full
          items-center justify-center
          overflow-hidden
          sm:min-h-[72px]
          md:min-h-[90px]
        "
      >
        <span
          ref={jpRef}
          style={{
            fontSize,
            fontWeight: 400,
            lineHeight: 1.2,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
          className="
            whitespace-normal
            break-words
            px-8 sm:px-12
            text-center
            font-normal
          "
        >
          {japaneseText}
        </span>

        {japaneseText && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSpeak?.(japaneseText);
            }}
            className="
              absolute right-0 top-1/2
              -translate-y-1/2
              text-xl
              transition
              hover:scale-110
              active:scale-95
              sm:text-2xl
            "
            aria-label="Đọc từ"
          >
            🔊
          </button>
        )}
      </div>
    </div>
  );
}
