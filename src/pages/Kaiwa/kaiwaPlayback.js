import { speakJP } from "../../utils/speak.js";

export const idlePlayback = { status: "idle", activeId: null, error: false };

export function createKaiwaPlayback(publish, {
  makeAudio = (url) => new Audio(url),
  synth = globalThis.speechSynthesis,
  speak = speakJP,
} = {}) {
  let queue = [];
  let index = 0;
  let repeat = false;
  let rate = 1;
  let sound = null;
  let paused = false;
  let nextOnResume = null;

  function release() {
    const previous = sound;
    sound = null;
    if (previous?.media) {
      previous.media.onended = null;
      previous.media.onerror = null;
      previous.media.pause();
      previous.media.removeAttribute("src");
      previous.media.load();
    }
    if (previous?.utterance) {
      previous.utterance.onend = null;
      previous.utterance.onerror = null;
      synth?.cancel();
      if (synth?.paused) synth.resume();
    }
  }

  function stop(notify = true) {
    release();
    queue = [];
    paused = false;
    nextOnResume = null;
    if (notify) publish(idlePlayback);
  }

  function playCurrent(useClip = true) {
    release();
    const item = queue[index];
    if (!item) return stop();

    const current = {};
    sound = current;
    publish({ status: "playing", activeId: item.id, error: false });
    const advance = () => {
      if (sound !== current) return;
      if (paused) {
        nextOnResume = advance;
        return;
      }
      if (!repeat) index++;
      playCurrent();
    };
    const fail = () => {
      if (sound !== current) return;
      if (current.media && item.jp && synth) {
        if (paused) nextOnResume = () => playCurrent(false);
        else playCurrent(false);
        return;
      }
      stop(false);
      publish({ ...idlePlayback, error: true });
    };

    try {
      if (useClip && item.audioUrl) {
        const media = makeAudio(item.audioUrl);
        current.media = media;
        media.playbackRate = rate;
        media.onended = advance;
        media.onerror = fail;
        const playback = media.play();
        playback?.catch(() => {
          if (!paused) fail();
        });
      } else if (item.jp && synth) {
        const voice = synth.getVoices().find((candidate) => /^ja(?:[-_]|$)/i.test(candidate.lang));
        current.utterance = speak(item.jp, rate, voice, { onEnd: advance, onError: fail });
        if (!current.utterance) fail();
      } else {
        fail();
      }
    } catch {
      fail();
    }
  }

  return {
    play(items, loop = false) {
      stop(false);
      queue = items;
      index = 0;
      repeat = loop;
      playCurrent();
    },
    stop,
    togglePause() {
      if (!sound) return;
      paused = !paused;
      const current = sound;
      publish({ status: paused ? "paused" : "playing", activeId: queue[index].id, error: false });
      if (!paused && nextOnResume) {
        const resume = nextOnResume;
        nextOnResume = null;
        resume();
      } else if (current.media) {
        if (paused) current.media.pause();
        else current.media.play()?.catch(() => current.media?.onerror?.());
      } else if (paused) {
        synth.pause();
      } else {
        synth.resume();
      }
    },
    setRate(value) {
      rate = value;
      if (sound?.media) sound.media.playbackRate = rate;
    },
  };
}
