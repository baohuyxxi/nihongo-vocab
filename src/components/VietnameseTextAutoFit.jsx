
import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export default function VietnameseTextAutoFit({
  text,
  aboveText = "",
  aboveItalic = true,

  maxLines = 4,

  maxFont = 68,
  minFont = 18,

  mobileMaxFont = 26,
  tabletMaxFont = 42,

  step = 2,
}) {
  const ref = useRef(null);
  const wrapperRef = useRef(null);

  const [fontSize, setFontSize] = useState(maxFont);

  useLayoutEffect(() => {
    const el = ref.current;
    const wrapper = wrapperRef.current;

    if (!el || !wrapper) return;

    const fitText = () => {
      const width = window.innerWidth;

      let responsiveMax = maxFont;

      if (width < 640) {
        responsiveMax = mobileMaxFont;
      } else if (width < 1024) {
        responsiveMax = tabletMaxFont;
      }

      let size = responsiveMax;

      el.style.fontSize = `${size}px`;
      el.style.lineHeight = "1.2";

      const availableWidth = wrapper.clientWidth;

      const maxHeight =
        wrapper.clientHeight > 0
          ? wrapper.clientHeight
          : Infinity;

      while (size > minFont) {
        const fitsWidth =
          el.scrollWidth <= availableWidth;

        const fitsHeight =
          el.scrollHeight <= maxHeight;

        const fitsLines =
          el.scrollHeight <=
          size * 1.2 * maxLines;

        if (fitsWidth && fitsHeight && fitsLines) {
          break;
        }

        size = Math.max(minFont, size - step);
        el.style.fontSize = `${size}px`;
      }

      setFontSize(size);
    };

    fitText();

    const observer = new ResizeObserver(fitText);

    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [
    text,
    aboveText,
    maxLines,
    maxFont,
    minFont,
    mobileMaxFont,
    tabletMaxFont,
    step,
  ]);

  if (!text && !aboveText) return null;

  return (
    <div
      ref={wrapperRef}
      className="
        flashcard-vietnamese
        flex w-full min-w-0
        items-center justify-center
        px-2 sm:px-4 md:px-6
      "
    >
      <div
        ref={ref}
        style={{
          fontSize,
          lineHeight: 1.2,
          fontWeight: 400,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
        className="
          flex w-full
          flex-col
          items-center
          justify-center
          gap-3 sm:gap-4
          text-center
          font-normal
        "
      >
        {aboveText && (
          <div
            className={`
              flashcard-hanviet
              w-full
              font-normal
              ${aboveItalic ? "italic" : ""}
            `}
          >
            {aboveText}
          </div>
        )}

        {text && (
          <div className="flashcard-vietnamese w-full font-normal">
            {text}
          </div>
        )}
      </div>
    </div>
  );
}
