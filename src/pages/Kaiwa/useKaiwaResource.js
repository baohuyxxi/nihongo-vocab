import { useEffect, useState } from "react";
import { kaiwaError } from "../../services/kaiwaApi";

export default function useKaiwaResource(key, load) {
  const [entry, setEntry] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    load(controller.signal).then(
      (value) => {
        if (!controller.signal.aborted) setEntry({ key, version, value });
      },
      (error) => {
        if (!controller.signal.aborted) setEntry({ key, version, error: kaiwaError(error) });
      },
    );
    return () => controller.abort();
  }, [key, load, version]);

  const current = entry?.key === key && entry.version === version ? entry : null;
  return { ...current, loading: Boolean(key && !current), retry: () => setVersion((value) => value + 1) };
}
