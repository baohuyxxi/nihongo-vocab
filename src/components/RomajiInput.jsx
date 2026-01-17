import { useState } from "react";
import { toHiragana, toKatakana } from "wanakana";

export default function IMELikeInput() {
  const [value, setValue] = useState("");
  const [romaji, setRomaji] = useState("");
  const [buffer, setBuffer] = useState("");
  const [mode, setMode] = useState("hiragana");
  const [isComposing, setIsComposing] = useState(false);

  const updateBuffer = (r, m = mode) => {
    const kana =
      m === "katakana" ? toKatakana(r) : toHiragana(r);
    setBuffer(kana);
  };

  const handleKeyDown = (e) => {
    // chữ cái
    if (/^[a-z]$/i.test(e.key)) {
      e.preventDefault();
      const nextRomaji = romaji + e.key;
      setRomaji(nextRomaji);
      updateBuffer(nextRomaji);
      setIsComposing(true);
      return;
    }

    // SPACE
    if (e.key === " ") {
      e.preventDefault();

      if (isComposing) {
        const nextMode =
          mode === "hiragana" ? "katakana" : "hiragana";
        setMode(nextMode);
        updateBuffer(romaji, nextMode);
      } else {
        setValue((v) => v + " ");
      }
      return;
    }

    // ENTER → chốt
    if (e.key === "Enter" && isComposing) {
      e.preventDefault();
      setValue((v) => v + buffer);
      setRomaji("");
      setBuffer("");
      setIsComposing(false);
      setMode("hiragana");
      return;
    }

    // BACKSPACE
    if (e.key === "Backspace") {
      e.preventDefault();

      if (isComposing) {
        if (romaji.length > 0) {
          const nextRomaji = romaji.slice(0, -1);
          setRomaji(nextRomaji);
          updateBuffer(nextRomaji);
        } else {
          setBuffer("");
          setIsComposing(false);
        }
      } else {
        setValue((v) => v.slice(0, -1));
      }
    }
  };

  return (
    <input
      value={value + buffer}
      onKeyDown={handleKeyDown}
      placeholder="IME giả – xóa không bug"
      className="border p-2 w-full"
    />
  );
}
