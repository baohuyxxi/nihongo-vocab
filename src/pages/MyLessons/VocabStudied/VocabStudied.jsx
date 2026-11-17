import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search, BookOpen, Languages, X } from 'lucide-react'
import JPTableInput from '../../../components/JPTableInput'
import { normalizeVietnamese } from '../../../utils/normalizeVietnamese'
import { getAllVocab, bulkSaveVocab } from '../../../services/vocab.service'
import SearchDropdown from './SearchDropdown'
import VocabDetail from './VocabDetail'
import RecentVocabs from './RecentVocabs'

const readCache = (key) => {
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : [] }
  catch { return [] }
}
const jpValue = item => item.kanji || item.hiragana || item.katakana || ''
const scoreField = (value, query, exact, start, contains) => {
  if (!value || !query) return -1
  if (value === query) return exact
  if (value.startsWith(query)) return start
  if (value.includes(query)) return contains
  return -1
}

export default function VocabStudied() {
  const [allVocab, setAllVocab] = useState(() => readCache('allVocab'))
  const [recentVocabs, setRecentVocabs] = useState(() => readCache('recentVocabs'))
  const [jpSearch, setJpSearch] = useState('')
  const [viSearch, setViSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [error, setError] = useState('')
  const wrapperRef = useRef(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await getAllVocab()
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : []
        if (!active) return
        setAllVocab(list)
        try { localStorage.setItem('allVocab', JSON.stringify(list)) } catch (err) { console.warn('Không thể lưu cache từ vựng', err) }
      } catch (err) {
        if (active) { setError('Không tải được dữ liệu mới; đang dùng dữ liệu đã lưu (nếu có).'); console.error(err) }
      }
    }
    load()
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    const jp = jpSearch.trim().toLocaleLowerCase()
    const vi = normalizeVietnamese(viSearch || '')
    if (!jp && !vi) return []
    return allVocab.map(item => {
      let score = -1
      if (jp) {
        const values = [item.kanji, item.hiragana, item.katakana, item.romaji]
        values.forEach((v, i) => { score = Math.max(score, scoreField(String(v || '').toLocaleLowerCase(), jp, 100 - i * 2, 90 - i * 2, 80 - i * 2)) })
      } else {
        const meaning = normalizeVietnamese(item.meaning || '')
        const hanViet = normalizeVietnamese(item.hanViet || '')
        score = Math.max(scoreField(meaning, vi, 100, 90, 60), scoreField(hanViet, vi, 95, 85, 55))
        if (meaning.split(/\s+/).includes(vi)) score = Math.max(score, 80)
        if (hanViet.split(/\s+/).includes(vi)) score = Math.max(score, 75)
      }
      return { item, score }
    }).filter(x => x.score >= 0).sort((a, b) => b.score - a.score).slice(0, 50).map(x => x.item)
  }, [allVocab, jpSearch, viSearch])

  const handleSelect = useCallback((item, updateSearch = true) => {
    if (!item) return
    setSelected(item)
    if (updateSearch) { setJpSearch(jpValue(item)); setViSearch(item.meaning || '') }
    setShowDropdown(false)
    setRecentVocabs(prev => {
      const updated = [item, ...prev.filter(v => v._id !== item._id)].slice(0, 20)
      try { localStorage.setItem('recentVocabs', JSON.stringify(updated)) } catch (err) { console.warn(err) }
      return updated
    })
  }, [])

  useEffect(() => {
    const onPointerDown = e => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false) }
    const onEscape = e => { if (e.key === 'Escape') setShowDropdown(false) }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onEscape)
    return () => { document.removeEventListener('pointerdown', onPointerDown); window.removeEventListener('keydown', onEscape) }
  }, [])

  const handleSave = async data => {
    await bulkSaveVocab([data])
    setAllVocab(prev => {
      const updated = prev.map(v => v._id === data._id ? data : v)
      try { localStorage.setItem('allVocab', JSON.stringify(updated)) } catch (err) { console.warn(err) }
      return updated
    })
    setSelected(data)
    setRecentVocabs(prev => {
      const updated = prev.map(v => v._id === data._id ? data : v)
      try { localStorage.setItem('recentVocabs', JSON.stringify(updated)) } catch (err) { console.warn(err) }
      return updated
    })
  }

  return <div className="min-h-screen bg-gray-50">
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-3 px-3 py-3 sm:px-5 lg:grid-cols-[minmax(0,1fr)_260px]">
      <main className="min-w-0">
        <div className="sticky top-0 z-40 rounded-xl border bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex items-center gap-2"><BookOpen size={22}/><div className="font-bold">Từ vựng đã học</div><span className="ml-auto text-xs text-gray-400">{allVocab.length} từ</span></div>
          <div ref={wrapperRef} className="relative">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex min-w-0 items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 focus-within:border-blue-400"><Search size={18} className="shrink-0 text-gray-400"/><div className="min-w-0 flex-1" onFocusCapture={() => { setShowDropdown(true); setActiveIndex(0) }}><JPTableInput value={jpSearch} onChange={v => { setJpSearch(v); setViSearch(''); setShowDropdown(true); setActiveIndex(0) }} placeholder="食べる / たべる" className="w-full min-w-0 bg-transparent text-base"/></div>{jpSearch && <button type="button" aria-label="Xóa tiếng Nhật" onClick={() => { setJpSearch(''); setShowDropdown(false) }}><X size={16}/></button>}</div>
              <div className="flex min-w-0 items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 focus-within:border-blue-400"><Languages size={18} className="shrink-0 text-gray-400"/><input value={viSearch} onChange={e => { setViSearch(e.target.value); setJpSearch(''); setShowDropdown(true); setActiveIndex(0) }} onFocus={() => { setShowDropdown(true); setActiveIndex(0) }} placeholder="Nghĩa / Hán Việt" className="w-full min-w-0 bg-transparent text-base outline-none"/>{viSearch && <button type="button" aria-label="Xóa tiếng Việt" onClick={() => { setViSearch(''); setShowDropdown(false) }}><X size={16}/></button>}</div>
            </div>
            <SearchDropdown search={jpSearch || viSearch} filtered={filtered} recentVocabs={recentVocabs} activeIndex={activeIndex} showDropdown={showDropdown} handleSelect={handleSelect} setActiveIndex={setActiveIndex}/>
          </div>
          {error && <p className="mt-2 text-xs text-amber-700">{error}</p>}
        </div>
        <div className="mt-3"><VocabDetail selected={selected} onSave={handleSave}/></div>
      </main>
      <aside className="min-w-0 lg:sticky lg:top-3"><RecentVocabs recentVocabs={recentVocabs} onSelect={handleSelect}/></aside>
    </div>
  </div>
}
