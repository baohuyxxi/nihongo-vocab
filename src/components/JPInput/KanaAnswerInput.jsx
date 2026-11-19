
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  toHiragana,
  toKatakana,
} from "wanakana";

const KANA = /^[\u3040-\u309F\u30A0-\u30FFー]+$/u;

const SHORTCUTS = {
  ms: "ます",
  sms: "します",
};

const splitKana = (text) => {
  const chars = Array.from(text);
  const result = [];
  let pending = "";

  for (const char of chars) {
    if (!pending && KANA.test(char)) {
      result.push(char);
    } else {
      pending += char;
    }
  }

  return { chars: result, pending };
};

export default function KanaAnswerInput({
  cells = [],
  hints = [],
  onChange,
  onHint,
  onCheck,
  canCheck = false,
  canHint = true,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const composingRef = useRef(false);
  const draftRef = useRef("");
  const cellsRef = useRef(cells);
  const hintsRef = useRef(hints);
  const selectedRef = useRef(0);
  const scriptRef = useRef("hiragana");

  const [selected, setSelected] = useState(0);
  const [draft, setDraft] = useState("");
  const [script, setScript] = useState("hiragana");
  const [isFocused, setIsFocused] = useState(false);
  const [choosingHint, setChoosingHint] = useState(false);

  const total = cells.length;

  cellsRef.current = cells;
  hintsRef.current = hints;
  selectedRef.current = selected;
  scriptRef.current = script;

  const isHint = (index) =>
    hintsRef.current.includes(index);

  const findEditable = (start, step = 1) => {
    let i = start;

    while (i >= 0 && i < total) {
      if (!isHint(i)) return i;
      i += step;
    }

    return -1;
  };

  const clearDraft = () => {
    draftRef.current = "";
    setDraft("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const selectCell = (index, focus = true) => {
    if (disabled || index < 0 || index >= total) return;
    if (isHint(index)) return;

    selectedRef.current = index;
    setSelected(index);

    if (focus) {
      inputRef.current?.focus({
        preventScroll: true,
      });
      setIsFocused(true);
    }
  };

  useEffect(() => {
    const first = cells.findIndex(
      (_, index) => !hints.includes(index)
    );

    if (first >= 0) {
      selectedRef.current = first;
      setSelected(first);
    }

    clearDraft();
    setChoosingHint(false);
  }, [total]);

  useEffect(() => {
    if (disabled) {
      clearDraft();
      setChoosingHint(false);
    }
  }, [disabled]);

  const writeCharacters = (characters, pending = "") => {
    const next = [...cellsRef.current];
    let position = selectedRef.current;
    let written = 0;

    for (const char of characters) {
      position = findEditable(position);

      if (position === -1) break;

      next[position] = char;
      written++;
      position++;
    }

    if (written > 0) {
      cellsRef.current = next;
      onChange?.(next);
    }

    const nextPosition = findEditable(position);

    clearDraft();

    if (nextPosition >= 0) {
      selectedRef.current = nextPosition;
      setSelected(nextPosition);

      if (pending) {
        draftRef.current = pending;
        setDraft(pending);

        if (inputRef.current) {
          inputRef.current.value = pending;
        }
      }
    } else {
      inputRef.current?.blur();
    }
  };


  const processText = (value) => {
    if (disabled || choosingHint) return;

    const raw = String(value || "").normalize("NFKC");

    draftRef.current = raw;
    setDraft(raw);

    if (!raw) return;

    // 1. Nhập Kana trực tiếp bằng Japanese IME
    if (KANA.test(raw)) {
      writeCharacters(Array.from(raw));
      return;
    }

    const lower = raw.toLowerCase();

    // 2. Nhận diện từ viết tắt
    const shortcut = SHORTCUTS[raw.toLowerCase()];

    if (shortcut) {
      const useKatakana =
        scriptRef.current === "katakana" ||
        (
          scriptRef.current === "auto" &&
          /^[A-Z]/.test(raw)
        );

      const output = useKatakana
        ? toKatakana(shortcut)
        : shortcut;

      writeCharacters(Array.from(output));
      return;
    }

    // 3. Giữ nguyên tiền tố của từ viết tắt
    // s -> chờ sh, shi hoặc sms
    // sm -> chờ sms
    // m -> chờ ms
    const shortcutPrefixes = ["s", "sm", "m"];

    if (shortcutPrefixes.includes(lower)) {
      return;
    }

    // 4. Chuyển Romaji thông thường
    const useKatakana =
      scriptRef.current === "katakana" ||
      (
        scriptRef.current === "auto" &&
        /^[A-Z]/.test(raw)
      );

    const converted = useKatakana
      ? toKatakana(raw, { IMEMode: true })
      : toHiragana(raw, { IMEMode: true });

    const { chars, pending } = splitKana(converted);

    if (chars.length) {
      writeCharacters(chars, pending);
    }
  };


  const handleChange = (event) => {
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

  const handleCompositionEnd = (event) => {
    composingRef.current = false;
    processText(event.currentTarget.value);
  };

  const handleBackspace = () => {
    if (draftRef.current) {
      const next = draftRef.current.slice(0, -1);
      draftRef.current = next;
      setDraft(next);

      if (inputRef.current) {
        inputRef.current.value = next;
      }

      return;
    }

    const next = [...cellsRef.current];
    const index = selectedRef.current;

    if (index < 0 || index >= total) return;

    if (next[index]) {
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
      selectCell(previous, false);
    }
  };

  const handleKeyDown = (event) => {
    if (disabled || composingRef.current ||
      event.nativeEvent?.isComposing ||
      event.keyCode === 229) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (!canCheck || disabled) return;

      clearDraft();
      inputRef.current?.blur();
      onCheck?.();

      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previous = findEditable(
        selectedRef.current - 1,
        -1
      );

      if (previous >= 0) {
        clearDraft();
        selectCell(previous);
      }

      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = findEditable(
        selectedRef.current + 1
      );

      if (next >= 0) {
        clearDraft();
        selectCell(next);
      }

      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      handleBackspace();
    }
  };

  const toggleScript = () => {
    const modes = ["hiragana", "katakana", "auto"];

    const currentIndex = modes.indexOf(scriptRef.current);

    const next = modes[(currentIndex + 1) % modes.length];

    setScript(next);
    scriptRef.current = next;

    clearDraft();
  };

  const handleCellClick = (index) => {
    if (disabled) return;

    if (choosingHint) {
      if (isHint(index)) return;

      clearDraft();
      onHint?.(index);
      setChoosingHint(false);

      return;
    }

    selectCell(index);
  };

  const handleHintButton = () => {
    setIsFocused(false);
    if (!canHint || disabled) return;

    clearDraft();
    inputRef.current?.blur();
    setChoosingHint((old) => !old);
  };

  const filled = cells.filter(
    (value) => String(value).trim()
  ).length;

  return (
    <div className="w-full">

      {/* NÚT CHẾ ĐỘ + CÁC Ô ĐÁP ÁN */}

      <div className="relative flex min-h-16 items-center justify-center">

        {/* NÚT HIRAGANA / KATAKANA - BÊN TRÁI */}

        <button
          type="button"
          disabled={disabled}
          onClick={toggleScript}
          title={
            script === "hiragana"
              ? "Chuyển sang Katakana"
              : "Chuyển sang Hiragana"
          }
          className="
      absolute left-0 top-1/2 z-10
      flex h-11 w-11 -translate-y-1/2
      items-center justify-center
      rounded-xl border border-slate-600
      bg-slate-800 text-xl font-bold
      text-white transition
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

        {/* CÁC Ô KANA */}

        <div
          className="
      flex flex-wrap items-center justify-center
      gap-2.5 px-12
      sm:gap-3 sm:px-14
    "
        >
          {cells.map((value, index) => {
            const hinted = hints.includes(index);

            const active =
              isFocused &&
              selected === index &&
              !hinted &&
              !disabled &&
              !choosingHint;

            const showDraft =
              active && draft && !choosingHint;

            return (
              <button
                key={index}
                type="button"
                disabled={
                  disabled ||
                  (hinted && !choosingHint)
                }
                onClick={() => handleCellClick(index)}
                className={`
            relative flex h-14 w-12
            shrink-0 items-center justify-center
            overflow-hidden rounded-xl border-2
            text-center text-2xl font-bold
            transition-colors
            sm:h-16 sm:w-14 sm:text-3xl

            ${hinted
                    ? "border-amber-400 bg-amber-50 text-amber-700"
                    : choosingHint
                      ? "border-amber-300 bg-amber-50 text-slate-700"
                      : active
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-800"
                  }

            disabled:cursor-default
          `}
              >
                <span
                  className="
              block max-w-full overflow-hidden
              text-ellipsis whitespace-nowrap
            "
                >
                  {showDraft ? draft : value}
                </span>

                {choosingHint && !hinted && (
                  <span
                    className="
                absolute right-0.5 top-0
                text-[11px] text-amber-600
              "
                  >
                    ?
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>



      {/* INPUT THẬT - CHỈ NHẬN BÀN PHÍM */}
      <div className="relative h-0 overflow-visible">
        <input
          ref={inputRef}
          type="text"
          className="
            absolute left-1/2 top-0
            h-px w-px -translate-x-1/2
            opacity-0
          "
          aria-label="Nhập đáp án tiếng Nhật"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          lang="ja"
          enterKeyHint="done"
          disabled={disabled || choosingHint}
          onChange={handleChange}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>


      {/* NÚT */}
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
            text-sm font-semibold transition
            ${choosingHint
              ? "border-amber-500 bg-amber-200 text-amber-900"
              : "border-amber-200 bg-amber-50 text-amber-700"
            }
            disabled:opacity-40
          `}
        >
          {choosingHint ? "Hủy gợi ý" : "💡 Gợi ý"}
        </button>

        <button
          type="button"
          onClick={() => {
            if (!canCheck || disabled) return;

            clearDraft();
            inputRef.current?.blur();
            onCheck?.();
          }}
          disabled={!canCheck || disabled}
          className="
            min-h-11 rounded-full
            bg-blue-600 px-7 py-2
            text-sm font-bold text-white
            transition hover:bg-blue-700
            disabled:opacity-40
          "
        >
          Kiểm tra
        </button>
      </div>
    </div>
  );
}
