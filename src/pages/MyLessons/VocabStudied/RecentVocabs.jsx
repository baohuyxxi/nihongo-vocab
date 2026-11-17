export default function RecentVocabs({ recentVocabs = [], onSelect }) {
  return <div className="overflow-hidden rounded-2xl border bg-white">
    <div className="border-b px-3 py-2.5 text-sm font-semibold">Từ vừa xem <span className="font-normal text-gray-400">({recentVocabs.length})</span></div>
    {!recentVocabs.length ? <div className="p-3 text-sm text-gray-400">Chưa có dữ liệu</div> : <div className="max-h-[min(65vh,550px)] divide-y overflow-y-auto">
      {recentVocabs.map((item, index) => <button type="button" key={item._id || index} onClick={() => onSelect?.(item, false)} className="w-full px-3 py-2 text-left hover:bg-gray-50">
        <div className="flex items-baseline gap-2"><span className="min-w-0 shrink-0 text-sm font-semibold">{item.kanji || item.hiragana || item.katakana || '—'}</span><span className="min-w-0 truncate text-xs text-gray-400">{item.hiragana || item.katakana || ''}</span></div>
        <div className="truncate text-xs text-gray-600">{item.meaning || '—'}</div>
      </button>)}
    </div>}
  </div>
}
