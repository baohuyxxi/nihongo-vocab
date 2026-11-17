import { useEffect, useRef } from 'react'

export default function SearchDropdown({ search, filtered = [], recentVocabs = [], activeIndex, showDropdown, handleSelect, setActiveIndex }) {
  const listRef = useRef(null)
  const displayItems = search?.trim() ? filtered : recentVocabs

  useEffect(() => {
    if (!showDropdown) return
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, showDropdown])

  useEffect(() => {
    if (!showDropdown) return
    const onKey = e => {
      if (e.isComposing || e.keyCode === 229) return
      if (e.key === 'Escape') return
      if (!displayItems.length) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => e.key === 'ArrowDown' ? (prev + 1) % displayItems.length : (prev - 1 + displayItems.length) % displayItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelect(displayItems[Math.min(activeIndex, displayItems.length - 1)], false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showDropdown, displayItems, activeIndex, handleSelect, setActiveIndex])

  if (!showDropdown) return null
  return <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border bg-white shadow-xl">
    {!displayItems.length ? <div className="p-3 text-sm text-gray-500">{search?.trim() ? 'Không tìm thấy từ phù hợp' : 'Chưa có từ vừa xem'}</div> : <div ref={listRef} className="max-h-[min(45vh,320px)] overflow-y-auto">
      {displayItems.map((item, index) => <button key={`${item._id || index}-${index}`} type="button" data-index={index} onMouseEnter={() => setActiveIndex(index)} onClick={() => handleSelect(item, false)} className={`w-full border-b px-3 py-2 text-left last:border-b-0 ${activeIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
        <div className="flex flex-wrap items-baseline gap-x-2"><span className="text-base font-semibold">{item.kanji || item.hiragana || item.katakana || '—'}</span>{item.kanji && (item.hiragana || item.katakana) && <span className="text-xs text-gray-500">{item.hiragana || item.katakana}</span>}</div>
        <div className="truncate text-sm text-gray-600">{item.meaning || '—'}</div>
      </button>)}
    </div>}
  </div>
}
