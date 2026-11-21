import { useEffect, useRef, useState } from "react"
import { Volume2 } from "lucide-react"
import { speakJP } from "../../utils/speak"
import { lesson } from "./lesson5"

const control = "rounded-lg border px-3 py-2 text-sm font-medium"
const primary = "rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"

const recordedVoices = [
    { id: "takehiro", label: "VOICEVOX · 玄野武宏 (Takehiro)" },
    { id: "tsumugi", label: "VOICEVOX · 春日部つむぎ (Tsumugi)" },
]

function getJapaneseVoices() {
    return (window.speechSynthesis?.getVoices() ?? [])
        .filter(voice => /^ja(?:[-_]|$)/i.test(voice.lang))
}

export default function KaiwaPage() {
    const [voices, setVoices] = useState(getJapaneseVoices)
    const [voiceUri, setVoiceUri] = useState("takehiro")
    const [audioError, setAudioError] = useState(false)
    const audioRef = useRef(null)
    const [mode, setMode] = useState("dialogue")
    const [showScript, setShowScript] = useState(false)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [played, setPlayed] = useState(false)
    const [revealed, setRevealed] = useState(false)

    useEffect(() => {
        const synthesis = window.speechSynthesis
        const audio = audioRef.current

        function refreshVoices() {
            setVoices(getJapaneseVoices())
        }

        synthesis?.addEventListener("voiceschanged", refreshVoices)
        return () => {
            synthesis?.removeEventListener("voiceschanged", refreshVoices)
            synthesis?.cancel()
            audio?.pause()
        }
    }, [])

    const question = lesson.questions[questionIndex]
    const browserSupported = Boolean(window.speechSynthesis)
    const recordedVoice = recordedVoices.find(voice => voice.id === voiceUri)
    const supported = Boolean(recordedVoice) || browserSupported

    const selectedVoice = voices.find(voice => voice.voiceURI === voiceUri)

    function stopAudio() {
        audioRef.current?.pause()
        window.speechSynthesis?.cancel()
        setAudioError(false)
    }

    async function playJapanese(text, clip) {
        stopAudio()
        if (!recordedVoice) {
            speakJP(text, 1, selectedVoice)
            return
        }

        const audio = audioRef.current
        const source = `${import.meta.env.BASE_URL}kaiwa/5/${recordedVoice.id}-${clip}.wav`
        audio.src = source
        try {
            await audio.play()
        } catch (error) {
            if (error.name !== "AbortError") setAudioError(true)
        }
    }

    function changeMode(nextMode) {
        if (nextMode === mode) return
        stopAudio()
        if (nextMode === "practice") {
            setQuestionIndex(Math.floor(Math.random() * lesson.questions.length))
            setPlayed(false)
            setRevealed(false)
        }
        setMode(nextMode)
    }

    function playQuestion() {
        playJapanese(question.jp, `question-${questionIndex + 1}`)
        setPlayed(true)
    }

    function nextQuestion() {
        const offset = 1 + Math.floor(Math.random() * (lesson.questions.length - 1))
        const nextIndex = (questionIndex + offset) % lesson.questions.length
        setQuestionIndex(nextIndex)
        setRevealed(false)
        playJapanese(lesson.questions[nextIndex].jp, `question-${nextIndex + 1}`)
        setPlayed(true)
    }

    return (
        <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
            <header>
                <h1 className="text-2xl font-bold">Kaiwa</h1>
                <p className="theme-muted mt-1">Bài {lesson.number} · {lesson.topic}</p>
            </header>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Chế độ Kaiwa">
                <button type="button" aria-pressed={mode === "dialogue"} className={mode === "dialogue" ? primary : control} onClick={() => changeMode("dialogue")}>
                    Hội thoại mẫu
                </button>
                <button type="button" aria-pressed={mode === "practice"} className={mode === "practice" ? primary : control} onClick={() => changeMode("practice")}>
                    Nghe và trả lời
                </button>
            </div>

            <audio ref={audioRef} preload="none" />
            {audioError && <p role="alert">Không phát được âm thanh. Hãy thử nghe lại hoặc chọn giọng khác.</p>}

            {supported && (
                <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor="kaiwa-voice" className="text-sm font-medium">Giọng đọc</label>
                    <select
                        id="kaiwa-voice"
                        value={recordedVoice?.id ?? selectedVoice?.voiceURI ?? ""}
                        onChange={event => {
                            stopAudio()
                            setVoiceUri(event.target.value)
                        }}
                        className={`${control} theme-panel min-w-0 max-w-full`}
                    >
                        {recordedVoices.map(voice => (
                            <option key={voice.id} value={voice.id}>{voice.label}</option>
                        ))}
                        {browserSupported && <option value="">Giọng trình duyệt mặc định</option>}
                        {voices.map(voice => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>
                        ))}
                    </select>
 
                </div>
            )}

            {recordedVoice && <p className="theme-muted text-xs">Âm thanh: VOICEVOX:玄野武宏 · VOICEVOX:春日部つむぎ</p>}

            {!supported && <p role="status">Trình duyệt này không hỗ trợ đọc văn bản thành tiếng.</p>}

            {mode === "dialogue" ? (
                <section className="theme-panel space-y-4 rounded-xl p-4 sm:p-5" aria-label="Hội thoại mẫu">
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={!supported}
                            onClick={() => playJapanese(lesson.dialogue.map(line => line.jp).join(" "), "dialogue")}
                            className={`${primary} inline-flex items-center gap-2 disabled:opacity-50`}
                        >
                            <Volume2 size={16} aria-hidden="true" /> Nghe hội thoại
                        </button>
                        <button type="button" aria-expanded={showScript} onClick={() => setShowScript(value => !value)} className={control}>
                            {showScript ? "Ẩn lời thoại" : "Xem lời thoại và bản dịch"}
                        </button>
                    </div>
                    {showScript && (
                        <ol className="divide-y">
                            {lesson.dialogue.map(({ speaker, jp, vi }, index) => (
                                <li key={jp} className="flex items-start justify-between gap-3 py-3">
                                    <div>
                                        <p className="theme-muted text-xs font-medium">{speaker}</p>
                                        <p lang="ja" className="mt-1 font-semibold">{jp}</p>
                                        <p className="theme-muted text-sm">{vi}</p>
                                    </div>
                                    <button type="button" disabled={!supported} onClick={() => playJapanese(jp, `line-${index + 1}`)} className={`${control} disabled:opacity-50`} aria-label={`Nghe câu của ${speaker}`}>
                                        <Volume2 size={16} aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            ) : (
                <section className="theme-panel space-y-4 rounded-xl p-4 sm:p-5" aria-label="Nghe và trả lời">
                    <p>Nghe câu hỏi và tự trả lời thành tiếng trước khi mở câu trả lời mẫu.</p>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" disabled={!supported} onClick={playQuestion} className={`${primary} inline-flex items-center gap-2 disabled:opacity-50`}>
                            <Volume2 size={16} aria-hidden="true" /> {played ? "Nghe lại" : "Nghe câu hỏi"}
                        </button>
                        <button type="button" disabled={!played && supported} aria-expanded={revealed} onClick={() => setRevealed(value => !value)} className={`${control} disabled:opacity-50`}>
                            {revealed ? "Ẩn câu hỏi và câu trả lời mẫu" : "Xem câu hỏi và câu trả lời mẫu"}
                        </button>
                        <button type="button" disabled={!supported} onClick={nextQuestion} className={`${control} disabled:opacity-50`}>Câu khác</button>
                    </div>
                    {revealed && (
                        <div className="space-y-3 border-t pt-3">
                            <div>
                                <p lang="ja" className="font-semibold">{question.jp}</p>
                                <p className="theme-muted text-sm">{question.vi}</p>
                            </div>
                            <div>
                                <p className="theme-muted text-xs">Câu trả lời mẫu</p>
                                <p lang="ja" className="font-semibold">{question.answer}</p>
                                <p className="theme-muted text-sm">{question.answerVi}</p>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

