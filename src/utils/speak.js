export const speakJP = (text, rate = 1, voice, events) => {
  if (!window.speechSynthesis || !text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang || "ja-JP";
  if (voice) utterance.voice = voice;
  utterance.rate = rate; // 0.7 = chậm, 1 = nhanh
  utterance.pitch = 1;
  if (events) {
    utterance.onend = events.onEnd;
    utterance.onerror = events.onError;
  }

  window.speechSynthesis.cancel(); // tránh chồng tiếng
  window.speechSynthesis.speak(utterance);
  return utterance;
};
