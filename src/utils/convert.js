import { ROMAJI_MAP } from "./romajiMap";

export function isPureRomaji(text) {
  return /^[a-z]+$/i.test(text);
}

export function convertRomajiChunk(chunk) {
  let result = "";
  let i = 0;

  while (i < chunk.length) {
    let found = false;

    for (let len = 3; len > 0; len--) {
      const part = chunk.slice(i, i + len).toLowerCase();
      if (ROMAJI_MAP[part]) {
        result += ROMAJI_MAP[part];
        i += len;
        found = true;
        break;
      }
    }

    if (!found) {
      result += chunk[i];
      i++;
    }
  }

  return result;
}
