import { useCallback, useState } from "react";
import { Headphones, MessagesSquare } from "lucide-react";
import { listDialogues, listQuestions } from "../../services/kaiwaApi";
import DialoguePlayer from "./DialoguePlayer";
import QuestionPractice from "./QuestionPractice";
import { availableLessons, readStored, writeStored } from "./kaiwaState";
import { button, primary, ResourceState } from "./KaiwaUi";
import useKaiwaResource from "./useKaiwaResource";

const tabKey = "kaiwa.tab.v1";
const books = { minna_1: "Minna no Nihongo I", minna_2: "Minna no Nihongo II" };

export default function KaiwaPage() {
  const [textbook, setTextbook] = useState("minna_1");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [tab, setTab] = useState(() =>
    readStored(localStorage, tabKey) === "practice" ? "practice" : "dialogue");
  const loadCatalog = useCallback(async (signal) => {
    const [dialogues, questions] = await Promise.all([
      listDialogues({ textbook }, signal),
      listQuestions({ textbook, source: "all", limit: 50 }, signal),
    ]);
    return { dialogues, lessons: availableLessons(dialogues, questions) };
  }, [textbook]);
  const catalog = useKaiwaResource(textbook, loadCatalog);
  const lessons = catalog.value?.lessons ?? [];
  const lesson = lessons.includes(selectedLesson) ? selectedLesson : lessons[0];
  const dialogue = catalog.value?.dialogues.find((item) => item.lesson === lesson);

  function changeTab(next) {
    setTab(next);
    writeStored(localStorage, tabKey, next);
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-4xl space-y-5 px-4 py-5 sm:px-6 sm:py-7">
      <header>
        <h1 className="text-3xl font-bold">会話 · Kaiwa</h1>
        <p className="theme-muted mt-1">Luyện nghe và giao tiếp tiếng Nhật</p>
      </header>
      <div className="theme-panel grid min-w-0 gap-3 rounded-2xl p-4 sm:grid-cols-2">
        <label className="grid min-w-0 gap-1 text-sm font-medium">
          Giáo trình
          <select className={button + " theme-panel w-full min-w-0"} value={textbook} onChange={(event) => {
            setTextbook(event.target.value);
            setSelectedLesson(null);
          }}>
            {Object.entries(books).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <label className="grid min-w-0 gap-1 text-sm font-medium">
          Bài học
          <select className={button + " theme-panel w-full min-w-0"} value={lesson ?? ""} disabled={!lessons.length}
            onChange={(event) => setSelectedLesson(Number(event.target.value))}>
            {!lessons.length && <option value="">{catalog.loading ? "Đang tải…" : "Chưa có bài"}</option>}
            {lessons.map((number) => <option key={number} value={number}>Bài {number}</option>)}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Chế độ Kaiwa">
        <button type="button" className={tab === "dialogue" ? primary : button}
          aria-pressed={tab === "dialogue"} onClick={() => changeTab("dialogue")}>
          <MessagesSquare size={18} aria-hidden="true" /> Hội thoại mẫu
        </button>
        <button type="button" className={tab === "practice" ? primary : button}
          aria-pressed={tab === "practice"} onClick={() => changeTab("practice")}>
          <Headphones size={18} aria-hidden="true" /> Nghe &amp; trả lời
        </button>
      </div>
      {catalog.loading || catalog.error || !lesson ? (
        <ResourceState resource={catalog} empty="Giáo trình này chưa có dữ liệu Kaiwa." />
      ) : tab === "dialogue" ? (
        <DialoguePlayer key={textbook + ":" + lesson} dialogueId={dialogue?._id} />
      ) : (
        <QuestionPractice key={textbook + ":" + lesson} textbook={textbook} lesson={lesson} />
      )}
    </main>
  );
}
