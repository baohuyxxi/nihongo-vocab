import { useCallback, useState } from "react";
import { Repeat, Volume2 } from "lucide-react";
import { getDialogue } from "../../services/kaiwaApi";
import { AudioControls, button, Japanese, panel, primary, ResourceState } from "./KaiwaUi";
import useKaiwaAudio from "./useKaiwaAudio";
import useKaiwaResource from "./useKaiwaResource";

export default function DialoguePlayer({ dialogueId }) {
  const load = useCallback((signal) => getDialogue(dialogueId, signal), [dialogueId]);
  const resource = useKaiwaResource(dialogueId, load);
  const audio = useKaiwaAudio();
  const [reading, setReading] = useState(false);
  const [translation, setTranslation] = useState(false);

  if (!resource.value) {
    return <ResourceState resource={resource} empty="Bài này chưa có hội thoại mẫu." />;
  }

  const { title, speakers, lines } = resource.value;
  const names = new Map(speakers.map(({ id, name }) => [id, name]));
  return (
    <section className={panel} aria-label="Hội thoại mẫu">
      <h2 className="break-words text-xl font-bold">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={primary} disabled={!lines.length} onClick={() => audio.play(lines)}>
          <Volume2 size={18} aria-hidden="true" /> Nghe toàn bộ
        </button>
        <AudioControls audio={audio} allowPause />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <label className="inline-flex min-h-10 items-center gap-2">
          <input type="checkbox" checked={reading} onChange={(event) => setReading(event.target.checked)} />
          Hiện cách đọc kana
        </label>
        <label className="inline-flex min-h-10 items-center gap-2">
          <input type="checkbox" checked={translation} onChange={(event) => setTranslation(event.target.checked)} />
          Hiện nghĩa Việt
        </label>
      </div>
      {audio.error && <p role="alert">Không phát được âm thanh. Hãy thử nghe lại.</p>}
      <ol className="space-y-2">
        {lines.map((line) => (
          <li key={line.id} aria-current={audio.activeId === line.id ? "true" : undefined}
            className={"grid min-w-0 gap-2 rounded-xl border p-3 sm:grid-cols-[minmax(0,1fr)_auto] " +
              (audio.activeId === line.id ? "border-blue-500 ring-1 ring-blue-500" : "")}>
            <div className="min-w-0">
              <p className="theme-muted break-words text-sm font-semibold">{names.get(line.speakerId)}</p>
              <Japanese text={line.jp} reading={line.reading} showReading={reading} />
              {translation && line.vi && <p className="theme-muted break-words">{line.vi}</p>}
            </div>
            <div className="flex flex-wrap items-start gap-2">
              <button type="button" className={button} onClick={() => audio.play([line])}
                aria-label={"Nghe lượt thoại " + line.order}><Volume2 size={18} aria-hidden="true" /> Nghe</button>
              <button type="button" className={button} onClick={() => audio.play([line], true)}
                aria-label={"Lặp lượt thoại " + line.order}><Repeat size={18} aria-hidden="true" /> Lặp</button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
