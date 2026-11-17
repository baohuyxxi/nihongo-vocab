
import { useCallback, useEffect, useRef, useState } from "react";
import { toHiragana } from "wanakana";

const KANA_REGEX = /^[\u3040-\u309F\u30A0-\u30FFー]+$/u;

const getKanaPrefix = (value = "") => {
  let prefix = "";
  let pending = "";

  for (const char of Array.from(String(value))) {
    if (!pending && KANA_REGEX.test(char)) {
      prefix += char;
    } else {
      pending += char;
    }
  }

  return { prefix, pending };
};

export default function KanaAnswerInput({
  cells = [],
  onChange,
  hints = [],
  onHint,
  onCheck,
  canCheck = false,
  disabled = false,
}) {
  const inputRefs = useRef([]);
  const composingRefs = useRef(new Set());

  const [drafts, setDrafts] = useState({});

  const total = cells.length;

  /* =========================================
     FOCUS
  ========================================= */

  const focusCell = useCallback(
    (index) => {
      if (index < 0 || index >= total) return;

      requestAnimationFrame(() => {
        const input = inputRefs.current[index];

        if (!input || input.disabled) return;

        input.focus();
        input.select();
      });
    },
    [total]
  );

  useEffect(() => {
    if (disabled || !total) return;

    const firstEmpty = cells.findIndex(
      (value, index) =>
        !value && !hints.includes(index)
    );

    if (firstEmpty >= 0) {
      focusCell(firstEmpty);
    }
  }, [disabled, total, focusCell]);

  /* =========================================
     DRAFT
  ========================================= */

  const updateDraft = (index, value) => {
    setDrafts((previous) => ({
      ...previous,
      [index]: value,
    }));
  };

  const clearDraft = (index) => {
    setDrafts((previous) => {
      const next = { ...previous };
      delete next[index];
      return next;
    });
  };

  const clearAllDrafts = () => {
    setDrafts({});
  };

  /* =========================================
     ROMAJI -> KANA
  ========================================= */

  const commitKana = useCallback(
    (index, rawValue) => {
      if (disabled || !rawValue) return;

      const raw = String(rawValue).normalize("NFKC");

      const converted = toHiragana(raw, {
        IMEMode: true,
      });

      const { prefix, pending } = getKanaPrefix(converted);

      if (!prefix) {
        updateDraft(index, pending || raw);
        return;
      }

      const nextCells = [...cells];
      const characters = Array.from(prefix);

      let position = index;

      for (const character of characters) {
        if (position >= total) break;

        nextCells[position] = character;
        position++;
      }

      onChange?.(nextCells);
      clearDraft(index);

      if (pending && position < total) {
        updateDraft(position, pending);
        focusCell(position);
        return;
      }

      if (position < total) {
        focusCell(position);
      } else {
        inputRefs.current[index]?.blur();
      }
    },
    [cells, total, disabled, onChange, focusCell]
  );

  /* =========================================
     INPUT
  ========================================= */

  const handleChange = (index, event) => {
    if (disabled || hints.includes(index)) return;

    const value = event.target.value;

    if (event.nativeEvent?.isComposing) {
      updateDraft(index, value);
      return;
    }

    commitKana(index, value);
  };

  /* =========================================
     JAPANESE IME
  ========================================= */

  const handleCompositionStart = (index) => {
    composingRefs.current.add(index);
  };

  const handleCompositionEnd = (index, event) => {
    composingRefs.current.delete(index);

    commitKana(index, event.currentTarget.value);
  };

  /* =========================================
     KEYBOARD
  ========================================= */

  const handleKeyDown = (index, event) => {
    if (disabled || hints.includes(index)) return;

    if (
      event.nativeEvent?.isComposing ||
      composingRefs.current.has(index)
    ) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (canCheck) onCheck?.();

      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusCell(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < total - 1) {
      event.preventDefault();
      focusCell(index + 1);
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();

      if (drafts[index]) {
        clearDraft(index);
        return;
      }

      if (cells[index]) {
        const next = [...cells];
        next[index] = "";

        onChange?.(next);
        return;
      }

      if (index > 0) {
        const previous = index - 1;

        if (hints.includes(previous)) return;

        const next = [...cells];
        next[previous] = "";

        onChange?.(next);
        clearDraft(previous);
        focusCell(previous);
      }
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="w-full">

      {/* KANA CELLS */}

      <div className="
        flex flex-wrap
        items-center justify-center
        gap-2 sm:gap-2.5
      ">
        {cells.map((value, index) => {
          const isHint = hints.includes(index);
          const draft = drafts[index];

          return (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              value={draft ?? value ?? ""}
              disabled={disabled || isHint}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              lang="ja"
              enterKeyHint="next"
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
              className={`
                h-11 w-10
                rounded-xl border-2
                text-center text-xl font-bold
                outline-none transition-colors
                sm:h-12 sm:w-12 sm:text-2xl

                ${
                  isHint
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }

                disabled:cursor-default
              `}
            />
          );
        })}
      </div>

      {/* ACTIONS */}

      <div className="
        mt-4 flex items-center
        justify-center gap-2.5
      ">
        <button
          type="button"
          onClick={() => {
            clearAllDrafts();
            onHint?.();
          }}
          disabled={disabled}
          className="
            min-h-10 rounded-full
            border border-amber-200
            bg-amber-50 px-5 py-2
            text-sm font-semibold text-amber-700
            transition hover:bg-amber-100
            disabled:opacity-40
          "
        >
          💡 Gợi ý
        </button>

        <button
          type="button"
          onClick={() => {
            clearAllDrafts();
            onCheck?.();
          }}
          disabled={!canCheck || disabled}
          className="
            min-h-10 rounded-full
            bg-blue-600 px-7 py-2
            text-sm font-bold text-white
            transition hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Kiểm tra
        </button>
      </div>

    </div>
  );
}
