import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const storedValue = window.localStorage.getItem(key);

      if (storedValue === null) {
        return initialValue;
      }

      return JSON.parse(storedValue);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage quota / browser privacy errors.
    }
  }, [key, value]);

  return [value, setValue];
}
