
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  toHiragana,
  toKatakana,
} from "wanakana";

// ======================================
// CONFIG
// ======================================

const KANA_REGEX =
  /^[\u3040-\u309F\u30A0-\u30FFー]+$/u;

const SHORTCUTS = {
  ms: "ます",
  sms: "します",
};

const MODES = [
  "auto",
  "hiragana",
  "katakana",

];

const SHORTCUT_PREFIXES = [
  "s",
  "sm",
  "m",
];

function splitConverted(text) {
  const chars = [];
  let pending = "";

  for (const char of Array.from(text)) {
    if (!pending && KANA_REGEX.test(char)) {
      chars.push(char);
    } else {
      pending += char;
    }
  }

  return { chars, pending };
}

// ======================================
// COMPONENT
// ======================================

export default function KanaAnswerInput({
  cells = [],
  hints = [],

  onChange,
  onHint,
  onCheck,

  canCheck = false,
  canHint = true,
  disabled = false,

  resetKey,
}) {
  const inputRefs = useRef([]);

  const composingRef = useRef(false);

  const draftRef = useRef("");

  const cellsRef = useRef(cells);
  const hintsRef = useRef(hints);

  const selectedRef = useRef(0);
  const scriptRef = useRef("auto");

  const [selected, setSelected] = useState(0);
  const [draft, setDraft] = useState("");

  const [script, setScript] = useState("auto");

  const [isFocused, setIsFocused] = useState(false);

  const [choosingHint, setChoosingHint] = useState(false);

  const total = cells.length;


  cellsRef.current = cells;
  hintsRef.current = hints;

  const isDesktopKeyboard = () => {
    if (typeof window === "undefined") return false;

    return (
      window.matchMedia(
        "(min-width: 768px) and (hover: hover) and (pointer: fine)"
      ).matches &&
      (!navigator.maxTouchPoints || navigator.maxTouchPoints === 0)
    );
  };

  // ======================================
  // HELPERS
  // ======================================

  const isHint = (index) => {
    return hintsRef.current.includes(index);
  };

  const findEditable = (start, step = 1) => {
    let index = start;

    while (
      index >= 0 &&
      index < cellsRef.current.length
    ) {
      if (!isHint(index)) {
        return index;
      }

      index += step;
    }

    return -1;
  };

  const setActive = (index) => {
    selectedRef.current = index;
    setSelected(index);
  };

  const clearDraft = () => {
    draftRef.current = "";
    setDraft("");
  };

  // ======================================
  // FOCUS
  //
  // Focus trực tiếp input thật.
  // Không scrollIntoView.
  // Không window.scrollTo.
  // ======================================

  const focusCell = (index, preventScroll = true) => {
    if (
      disabled ||
      index < 0 ||
      index >= total ||
      isHint(index)
    ) {
      return;
    }

    setActive(index);

    const input = inputRefs.current[index];

    if (!input) return;

    if (document.activeElement !== input) {
      input.focus({
        preventScroll,
      });
    }
  };

  // ======================================
  // RESET QUESTION
  // ======================================

  useEffect(() => {
    const first = cellsRef.current.findIndex(
      (_, index) => !hintsRef.current.includes(index)
    );

    setActive(first >= 0 ? first : 0);

    clearDraft();

    composingRef.current = false;

    setChoosingHint(false);
    setIsFocused(false);

    scriptRef.current = "hiragana";
    setScript("hiragana");

    if (
      inputRefs.current.some(
        (input) => input === document.activeElement
      )
    ) {
      document.activeElement.blur();
    }

    // Chỉ tự focus trên máy tính.
    // Không mở bàn phím ảo trên điện thoại/iPad.
    if (!isDesktopKeyboard() || first < 0) return;

    const frame = requestAnimationFrame(() => {
      focusCell(first, true);
    });

    return () => cancelAnimationFrame(frame);

  }, [resetKey, total]);
  // ======================================
  // DISABLED
  // ======================================

  useEffect(() => {
    if (!disabled) return;

    clearDraft();
    setChoosingHint(false);
    setIsFocused(false);

    const active = document.activeElement;

    if (inputRefs.current.includes(active)) {
      active.blur();
    }
  }, [disabled]);

  // ======================================
  // WRITE CHARACTERS
  // ======================================

  const writeCharacters = (
    characters,
    pending = ""
  ) => {
    const next = [...cellsRef.current];

    let position = selectedRef.current;
    let written = 0;

    for (const character of characters) {
      position = findEditable(position);

      if (position < 0) break;

      next[position] = character;

      written++;
      position++;
    }

    if (written > 0) {
      cellsRef.current = next;
      onChange?.(next);
    }

    const nextPosition = findEditable(position);

    draftRef.current = pending;
    setDraft(pending);

    if (nextPosition >= 0) {
      setActive(nextPosition);

      // Chuyển giữa các input thật.
      // Không tạo input mới.
      // Không cuộn trang bằng JS.
      const input = inputRefs.current[nextPosition];

      input?.focus({
        preventScroll: true,
      });

    } else {
      clearDraft();

      // Máy tính: giữ focus ở ô cuối để có thể nhấn Enter.
      if (isDesktopKeyboard()) {
        const lastEditable = findEditable(
          cellsRef.current.length - 1,
          -1
        );

        if (lastEditable >= 0) {
          setActive(lastEditable);
          setIsFocused(true);

          inputRefs.current[lastEditable]?.focus({
            preventScroll: true,
          });
        }

        return;
      }

      // Điện thoại/iPad: giữ nguyên hành vi cũ.
      const active = document.activeElement;

      if (inputRefs.current.includes(active)) {
        active.blur();
      }

      setIsFocused(false);
    }
  };

  // ======================================
  // PROCESS ROMAJI / KANA
  // ======================================

  const processText = (value) => {
    if (disabled || choosingHint) return;

    const raw = String(value || "").normalize("NFKC");

    draftRef.current = raw;
    setDraft(raw);

    if (!raw) return;

    // Kana trực tiếp từ bàn phím Nhật

    if (KANA_REGEX.test(raw)) {
      writeCharacters(Array.from(raw));
      return;
    }

    const lower = raw.toLowerCase();

    const useKatakana =
      scriptRef.current === "katakana" ||
      (
        scriptRef.current === "auto" &&
        /[A-Z]/.test(raw)
      );

    // SHORTCUT ms / sms

    if (SHORTCUTS[lower]) {
      const kana = SHORTCUTS[lower];

      const output = useKatakana
        ? toKatakana(kana)
        : kana;

      writeCharacters(Array.from(output));
      return;
    }

    // Giữ các tiền tố shortcut

    if (SHORTCUT_PREFIXES.includes(lower)) {
      return;
    }

    // ROMAJI -> KANA

    const converted = useKatakana
      ? toKatakana(raw, { IMEMode: true })
      : toHiragana(raw, { IMEMode: true });

    const { chars, pending } =
      splitConverted(converted);

    if (chars.length > 0) {
      writeCharacters(chars, pending);
    }
  };

  // ======================================
  // INPUT CHANGE
  // ======================================

  const handleChange = (index, event) => {
    if (disabled || isHint(index)) return;

    if (selectedRef.current !== index) {
      setActive(index);
    }

    const value = event.currentTarget.value;

    if (
      composingRef.current ||
      event.nativeEvent?.isComposing
    ) {
      draftRef.current = value;
      setDraft(value);
      return;
    }

    processText(value);
  };

  // ======================================
  // COMPOSITION
  // ======================================

  const handleCompositionStart = (index) => {
    setActive(index);
    composingRef.current = true;
  };

  const handleCompositionEnd = (index, event) => {
    composingRef.current = false;

    setActive(index);

    processText(event.currentTarget.value);
  };

  // ======================================
  // BACKSPACE
  // ======================================

  const handleBackspace = (index) => {
    if (draftRef.current) {
      const next = draftRef.current.slice(0, -1);

      draftRef.current = next;
      setDraft(next);
      return;
    }

    const next = [...cellsRef.current];

    if (next[index] && !isHint(index)) {
      next[index] = "";

      cellsRef.current = next;
      onChange?.(next);

      return;
    }

    const previous = findEditable(index - 1, -1);

    if (previous >= 0) {
      next[previous] = "";

      cellsRef.current = next;
      onChange?.(next);

      focusCell(previous);
    }
  };

  // ======================================
  // CHECK
  // ======================================

  const submitAnswer = () => {
    if (disabled) return;

    // Đọc dữ liệu mới nhất trực tiếp từ ref.
    // Tránh trường hợp state React chưa kịp cập nhật.
    const latestCells = cellsRef.current;

    const isComplete =
      latestCells.length > 0 &&
      latestCells.every((cell) => cell.trim());

    if (!isComplete) return;

    clearDraft();

    const active = document.activeElement;

    if (inputRefs.current.includes(active)) {
      active.blur();
    }

    setIsFocused(false);

    onCheck?.([...latestCells]);
  };

  // ======================================
  // KEYDOWN
  // ======================================

  const handleKeyDown = (index, event) => {
    if (
      disabled ||
      composingRef.current ||
      event.nativeEvent?.isComposing ||
      event.keyCode === 229
    ) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      submitAnswer();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      clearDraft();

      const previous = findEditable(
        index - 1,
        -1
      );

      if (previous >= 0) {
        focusCell(previous);
      }

      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();

      clearDraft();

      const next = findEditable(index + 1);

      if (next >= 0) {
        focusCell(next);
      }

      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();

      handleBackspace(index);
    }
  };

  // ======================================
  // SCRIPT TOGGLE
  // ======================================

  const toggleScript = () => {
    const currentIndex = MODES.indexOf(
      scriptRef.current
    );

    const next = MODES[
      (currentIndex + 1) % MODES.length
    ];

    scriptRef.current = next;
    setScript(next);

    clearDraft();
  };

  // ======================================
  // HINT
  // ======================================

  const handleHintButton = () => {
    if (!canHint || disabled) return;

    clearDraft();

    const active = document.activeElement;

    if (inputRefs.current.includes(active)) {
      active.blur();
    }

    setIsFocused(false);

    setChoosingHint((previous) => !previous);
  };

  const handleHintCell = (index) => {
    if (
      disabled ||
      !choosingHint ||
      isHint(index)
    ) {
      return;
    }

    clearDraft();

    onHint?.(index);

    setChoosingHint(false);
  };

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="w-full">

      {/* INPUT CELLS */}

      <div className="
        relative flex min-h-[76px]
        items-center justify-center
      ">

        {/* SCRIPT BUTTON */}

        <button
          type="button"
          disabled={disabled}
          onClick={toggleScript}
          className="
            absolute left-0 top-1/2 z-10
            flex h-11 w-11
            -translate-y-1/2
            items-center justify-center
            rounded-xl border border-slate-600
            bg-slate-800 text-xl font-bold
            text-white transition-colors
            hover:bg-slate-700
            disabled:opacity-40
            sm:h-12 sm:w-12
          "
        >
          {script === "hiragana"
            ? "あ"
            : script === "katakana"
              ? "ア"
              : "アあ"}
        </button>

        <div className="
          flex flex-wrap
          items-center justify-center
          gap-2.5 px-12
          sm:gap-3 sm:px-14
        ">

          {cells.map((value, index) => {
            const hinted = hints.includes(index);

            const active =
              isFocused &&
              selected === index &&
              !disabled &&
              !choosingHint &&
              !hinted;

            const displayValue =
              active && draft
                ? draft
                : value || "";

            return (
              <div
                key={index}
                className="
                  relative h-14 w-12 shrink-0
                  sm:h-16 sm:w-14
                "
              >

                {/* REAL INPUT */}

                <input
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  value={displayValue}
                  disabled={
                    disabled ||
                    hinted ||
                    choosingHint
                  }
                  onFocus={() => {
                    setActive(index);
                    setIsFocused(true);
                  }}
                  onBlur={() => {
                    if (
                      selectedRef.current === index
                    ) {
                      setIsFocused(false);
                    }
                  }}
                  onChange={(event) =>
                    handleChange(index, event)
                  }
                  onCompositionStart={() =>
                    handleCompositionStart(index)
                  }
                  onCompositionEnd={(event) =>
                    handleCompositionEnd(index, event)
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                  onClick={() => {
                    setActive(index);
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  lang="ja"
                  enterKeyHint="done"
                  inputMode="text"
                  className={`
                    h-full w-full
                    rounded-xl border-2
                    bg-white px-1
                    text-center text-2xl
                    font-bold text-slate-800
                    outline-none
                    transition-colors
                    sm:text-3xl

                    ${hinted
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : active
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-800"
                    }

                    disabled:opacity-100
                  `}
                  style={{
                    fontSize: "max(16px, 1.5rem)",
                    WebkitAppearance: "none",
                  }}
                />

                {/* HINT SELECTION OVERLAY */}

                {choosingHint && !hinted && (
                  <button
                    type="button"
                    onClick={() =>
                      handleHintCell(index)
                    }
                    className="
                      absolute inset-0 z-10
                      flex items-start
                      justify-end
                      rounded-xl border-2
                      border-amber-400
                      bg-amber-50/70
                      p-1 text-xs
                      font-bold text-amber-700
                    "
                  >
                    ?
                  </button>
                )}

              </div>
            );
          })}

        </div>
      </div>

      {/* ACTIONS */}

      <div className="
        mt-3 flex items-center
        justify-center gap-2.5
      ">

        <button
          type="button"
          onClick={handleHintButton}
          disabled={disabled || !canHint}
          className={`
            min-h-11 rounded-full
            border px-5 py-2
            text-sm font-semibold
            transition-colors

            ${choosingHint
              ? "border-amber-500 bg-amber-200 text-amber-900"
              : "border-amber-200 bg-amber-50 text-amber-700"
            }

            disabled:opacity-40
          `}
        >
          {choosingHint
            ? "Hủy gợi ý"
            : "💡 Gợi ý"}
        </button>

        <button
          type="button"
          onClick={submitAnswer}
          disabled={!canCheck || disabled}
          className="
            min-h-11 rounded-full
            bg-blue-600 px-7 py-2
            text-sm font-bold text-white
            transition-colors
            hover:bg-blue-700
            disabled:opacity-40
          "
        >
          Kiểm tra
        </button>

      </div>

    </div>
  );
}
