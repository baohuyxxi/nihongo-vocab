import { useEffect, useRef, useState } from "react";
import { createKaiwaPlayback, idlePlayback } from "./kaiwaPlayback";

export default function useKaiwaAudio() {
  const player = useRef(null);
  const [state, setState] = useState(idlePlayback);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const playback = createKaiwaPlayback(setState);
    player.current = playback;
    return () => {
      playback.stop(false);
      player.current = null;
    };
  }, []);

  return {
    ...state,
    speed,
    play: (items, loop) => player.current?.play(items, loop),
    stop: () => player.current?.stop(),
    pause: () => player.current?.togglePause(),
    setSpeed(value) {
      setSpeed(value);
      player.current?.setRate(value);
    },
  };
}
