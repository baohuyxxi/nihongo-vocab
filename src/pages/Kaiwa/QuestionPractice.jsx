import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import JapaneseIMEInput from "../../components/JapaneseIMEInput";
import { listQuestions } from "../../services/kaiwaApi";
import { AudioControls, button, Japanese, panel, primary, ResourceState } from "./KaiwaUi";
import { practiceCounts } from "./kaiwaState";
import useKaiwaAudio from "./useKaiwaAudio";
import useKaiwaPractice from "./useKaiwaPractice";
import useKaiwaResource from "./useKaiwaResource";

function QuestionCard({ item, value, onDraft, onAssess, assessment, saving }) {
  const input = useRef(null);
  const audio = useKaiwaAudio();
  const [japanese, setJapanese] = useState(false);
  const [vietnamese, setVietnamese] = useState(false);
  const [suggestions, setSuggestions] = useState(false);

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={primary} onClick={() =>
          audio.play([{ id: item._id, jp: item.question.jp, audioUrl: item.audioUrl }])}>
          <Volume2 size={18} aria-hidden="true" /> Nghe câu hỏi
        </button>
        <AudioControls audio={audio} />
      </div>
      {audio.error && <p role="alert">Không phát được âm thanh. Bạn vẫn có thể mở nội dung câu hỏi.</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" className={button} aria-expanded={japanese}
          onClick={() => setJapanese(!japanese)}>{japanese ? "Ẩn" : "Hiện"} tiếng Nhật</button>
        <button type="button" className={button} aria-expanded={vietnamese}
          onClick={() => setVietnamese(!vietnamese)}>{vietnamese ? "Ẩn" : "Hiện"} nghĩa Việt</button>
        <button type="button" className={button} aria-expanded={suggestions}
          onClick={() => setSuggestions(!suggestions)}>{suggestions ? "Ẩn" : "Hiện"} câu trả lời gợi ý</button>
      </div>
      {japanese && <Japanese text={item.question.jp} />}
      {vietnamese && <p className="break-words">{item.question.vi}</p>}
      <div className="grid min-w-0 gap-1">
        <label htmlFor="kaiwa-answer" className="font-medium">Câu trả lời của bạn <span className="theme-muted text-sm">(tùy chọn)</span></label>
        <JapaneseIMEInput id="kaiwa-answer" ref={input} direction="vi_jp" value={value}
          onChange={onDraft} disabled={saving || Boolean(assessment)} showSubmit={false} maxLength={1000} />
      </div>
      {suggestions && (
        <div className="space-y-2">
          <h3 className="font-semibold">Câu trả lời gợi ý</h3>
          {!item.suggestedAnswers.length && <p className="theme-muted">Chưa có câu trả lời gợi ý.</p>}
          {item.suggestedAnswers.map((answer) => (
            <div className="grid min-w-0 gap-2 rounded-xl border p-3 sm:grid-cols-[minmax(0,1fr)_auto]" key={answer.id}>
              <div className="min-w-0">
                <Japanese text={answer.jp} reading={answer.reading} showReading />
                {answer.vi && <p className="break-words">{answer.vi}</p>}
                {answer.explanation && <p className="theme-muted break-words text-sm">{answer.explanation}</p>}
              </div>
              <button type="button" className={button + " self-start justify-self-start"}
                onClick={() => audio.play([{ ...answer, id: "suggestion:" + answer.id }])}>
                <Volume2 size={18} aria-hidden="true" /> Nghe câu mẫu
              </button>
            </div>
          ))}
        </div>
      )}
      {assessment ? <p role="status">Đã lưu · {assessment === "known" ? "Đã trả lời được" : "Cần luyện lại"}</p> : (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={primary} disabled={saving} onClick={() => onAssess("known")}>Đã trả lời được</button>
          <button type="button" className={button} disabled={saving} onClick={() => onAssess("retry")}>Cần luyện lại</button>
        </div>
      )}
    </div>
  );
}

function Navigation({ index, count, onMove, disabled }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Điều hướng câu hỏi">
      <button type="button" className={button} disabled={disabled || index === 0} onClick={() => onMove(index - 1)}>
        <ChevronLeft size={18} aria-hidden="true" /> Câu trước
      </button>
      <button type="button" className={button} disabled={disabled || index === count - 1} onClick={() => onMove(index + 1)}>
        Câu tiếp theo <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}

function RetryRound({ questions, onBack }) {
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState({});
  const [answers, setAnswers] = useState({});
  const question = questions[index];
  const allDone = Object.keys(answers).length === questions.length;
  return (
    <>
      <p className="theme-muted text-sm">Ôn lại trên thiết bị · Câu {index + 1}/{questions.length}</p>
      <QuestionCard key={question._id} item={question} value={drafts[question._id] ?? ""}
        assessment={answers[question._id]}
        onDraft={(value) => setDrafts((previous) => ({ ...previous, [question._id]: value }))}
        onAssess={(value) => {
          const next = { ...answers, [question._id]: value };
          setAnswers(next);
          const nextIndex = questions.findIndex((item) => !next[item._id]);
          if (nextIndex >= 0) setIndex(nextIndex);
        }} />
      <Navigation count={questions.length} index={index} onMove={setIndex} />
      <button type="button" className={button} onClick={onBack}>{allDone ? "Xong · Xem tổng kết" : "Về tổng kết"}</button>
    </>
  );
}

export default function QuestionPractice({ textbook, lesson }) {
  const practice = useKaiwaPractice(textbook, lesson);
  const [retrying, setRetrying] = useState(false);
  const load = useCallback((signal) => listQuestions({ textbook, lesson, source: "all" }, signal), [textbook, lesson]);
  const bank = useKaiwaResource(textbook + ":" + lesson, load);
  const { session, checking, saving, error, warning, active, index } = practice;
  const question = session?.questions[index];
  const assessment = session?.answers.find(({ questionId }) => questionId === question?._id);
  const retryQuestions = session?.questions.filter((item) => session.answers.some(
    (answer) => answer.questionId === item._id && answer.selfAssessment === "retry",
  ));

  return (
    <section className={panel} aria-label="Nghe và trả lời">
      <h2 className="text-xl font-bold">Nghe &amp; trả lời</h2>
      {error && <p role="alert">{error}</p>}
      {warning && <p role="status">{warning}</p>}
      {saving && <p role="status">Đang lưu phiên…</p>}
      {checking ? <p role="status">Đang kiểm tra phiên đã lưu…</p> : !active || !session ? (
        <>
          {session && (
            <button type="button" className={primary} disabled={saving} onClick={practice.resume}>
              {session.status === "completed" ? "Xem tổng kết" : "Tiếp tục"}
            </button>
          )}
          {practice.canRetryLookup && <button type="button" className={button} onClick={practice.retryLookup}>Thử tiếp tục lại</button>}
          {bank.value?.length ? (
            <div className="space-y-2">
              <p className="theme-muted text-sm">Nghe câu hỏi, tự trả lời rồi đánh giá mức độ nhớ.</p>
              <button type="button" className={session ? button : primary} disabled={saving || practice.canRetryLookup}
                onClick={practice.start}>Bắt đầu luyện tập</button>
            </div>
          ) : <ResourceState resource={bank} empty="Bài này chưa có câu hỏi luyện tập." />}
        </>
      ) : session.status === "completed" ? (
        retrying ? <RetryRound questions={retryQuestions} onBack={() => setRetrying(false)} /> : (
          <>
            <h3 className="font-semibold">Tổng kết phiên</h3>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries({
                "Tổng số câu": session.questions.length,
                "Đã trả lời": session.answers.length,
                "Đã trả lời được": practiceCounts(session.answers).known,
                "Cần luyện lại": practiceCounts(session.answers).retry,
              }).map(([label, count]) => (
                <div className="min-w-0 rounded-xl border p-3" key={label}>
                  <dt className="theme-muted text-sm">{label}</dt>
                  <dd className="text-2xl font-bold">{count}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              {retryQuestions.length > 0 && <button type="button" className={primary} onClick={() => setRetrying(true)}>Luyện lại câu chưa nhớ</button>}
              {bank.value?.length > 0 && <button type="button" className={button} disabled={saving} onClick={practice.start}>Bắt đầu phiên mới</button>}
            </div>
          </>
        )
      ) : question && (
        <>
          <p className="theme-muted text-sm" aria-live="polite">
            Câu {index + 1}/{session.questions.length} · Đã trả lời {session.answers.length}/{session.questions.length}
          </p>
          <QuestionCard key={session.sessionId + ":" + question._id} item={question}
            value={assessment?.userAnswer ?? practice.drafts[question._id] ?? ""}
            onDraft={(value) => practice.draft(question._id, value)}
            assessment={assessment?.selfAssessment} onAssess={(value) => practice.assess(question._id, value)}
            saving={saving} />
          <Navigation count={session.questions.length} index={index} disabled={saving} onMove={practice.navigate} />
          {session.answers.length === session.questions.length && (
            <button type="button" className={primary} disabled={saving} onClick={practice.complete}>Hoàn thành phiên</button>
          )}
        </>
      )}
    </section>
  );
}
