
import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const LINE_HEIGHT = 1.2;

export default function AutoFitText({
  text,
  className = "",
  maxLines = 2,
  minFontSize = 12,
  maxFontSize = 96,
}) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);

  const [fontSize, setFontSize] =
    useState(minFontSize);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;

    if (!container || !measure) return;

    let frameId;
    let disposed = false;

    const calculate = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width <= 0 || height <= 0) return;

      measure.style.width = `${width}px`;

      const fits = (size) => {
        measure.style.fontSize = `${size}px`;
        measure.style.lineHeight = String(LINE_HEIGHT);

        const rect = measure.getBoundingClientRect();
        const lineHeight = size * LINE_HEIGHT;

        const lineCount = Math.ceil(
          rect.height / lineHeight - 0.01
        );

        return (
          lineCount <= maxLines &&
          rect.height <= height &&
          measure.scrollWidth <= width + 1
        );
      };

      let low = 1;
      let high = Math.max(
        minFontSize,
        maxFontSize
      );

      let best = 1;

      // Binary search font size
      while (high - low > 0.5) {
        const mid = (low + high) / 2;

        if (fits(mid)) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      // Nếu font tối đa vẫn vừa
      if (fits(high)) {
        best = high;
      }

      // Giới hạn font trong khoảng hợp lệ
      // Cho phép nhỏ hơn minFontSize nếu cần
      // để tránh cắt nội dung.
      setFontSize(
        Math.min(
          maxFontSize,
          Math.max(1, best)
        )
      );
    };

    const schedule = () => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        if (!disposed) calculate();
      });
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(container);

    schedule();

    document.fonts?.ready.then(() => {
      if (!disposed) schedule();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [
    text,
    maxLines,
    minFontSize,
    maxFontSize,
  ]);

  return (
    <div
      ref={containerRef}
      className={`
        relative h-full w-full
        min-h-0 min-w-0
        ${className}
      `}
    >
      {/* HIDDEN MEASUREMENT */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-0 top-0
          invisible
          whitespace-normal
          break-words
          text-center font-bold
        "
        style={{
          width: "100%",
          height: "auto",
          fontSize: `${fontSize}px`,
          lineHeight: LINE_HEIGHT,
          overflowWrap: "anywhere",
        }}
      >
        {text}
      </div>

      {/* VISIBLE TEXT */}
      <div
        className="
          flex h-full w-full
          items-center justify-center
          text-center
        "
      >
        <span
          className="
            block max-w-full
            whitespace-normal
            break-words
            font-bold
          "
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: LINE_HEIGHT,
            overflowWrap: "anywhere",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
