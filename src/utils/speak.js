export const speakJP = (text, rate = 1) => {
  if (!window.speechSynthesis || !text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = rate; // 0.7 = chậm, 1 = nhanh
  utterance.pitch = 1;

  window.speechSynthesis.cancel(); // tránh chồng tiếng
  window.speechSynthesis.speak(utterance);
};
