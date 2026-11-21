import { Pause, Play, Square } from "lucide-react";

export const button = "inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium disabled:opacity-50";
export const primary = button + " border-blue-700 bg-blue-700 text-white hover:bg-blue-800";
export const panel = "theme-panel min-w-0 space-y-4 rounded-2xl p-4 sm:p-5";

export function ResourceState({ resource, empty }) {
  if (resource.loading) return <p className={panel} role="status">Đang tải dữ liệu Kaiwa…</p>;
  if (resource.error) return (
    <div className={panel}>
      <p role="alert">{resource.error}</p>
      <button type="button" className={button} onClick={resource.retry}>Thử lại</button>
    </div>
  );
  return <p className={panel} role="status">{empty}</p>;
}

export function AudioControls({ audio, allowPause = false }) {
  return (
    <>
      {allowPause && audio.status !== "idle" && (
        <button type="button" className={button} onClick={audio.pause}>
          {audio.status === "paused" ? <><Play size={16} aria-hidden="true" /> Tiếp tục</> :
            <><Pause size={16} aria-hidden="true" /> Tạm dừng</>}
        </button>
      )}
      {audio.status !== "idle" && (
        <button type="button" className={button} onClick={audio.stop}>
          <Square size={16} aria-hidden="true" /> Dừng
        </button>
      )}
      <label className="inline-flex items-center gap-2 text-sm">
        Tốc độ
        <select className={button + " theme-panel"} value={audio.speed}
          onChange={(event) => audio.setSpeed(Number(event.target.value))}>
          {[0.7, 0.85, 1, 1.15, 1.3].map((rate) => <option key={rate} value={rate}>{rate}×</option>)}
        </select>
      </label>
    </>
  );
}

export function Japanese({ text, reading, showReading }) {
  return (
    <>
      <p lang="ja" className="break-words text-xl font-semibold leading-relaxed sm:text-2xl">{text}</p>
      {showReading && reading && reading !== text &&
        <p lang="ja" className="theme-muted break-words text-sm">{reading}</p>}
    </>
  );
}
