import { useEffect, useState } from 'react'
import { Volume2, Pencil, Save, X, Loader2 } from 'lucide-react'
import EditableField from './EditableField'
import VocabLessonBadge from '../../../components/VocabLessonBadge'
import { speakJP } from '../../../utils/speak'
import { partOfSpeechMap } from '../../../utils/partOfSpeechMap'

const POS = ['noun','verb_g_1','verb_g_2','verb_g_3','adj_i','adj_na','adverb','conjunction','pronoun','interjection','expression','counter','prefix','suffix']
const imageUrl = (image) => typeof image === 'string' ? image.trim() : (image?.url || '')
const Field = ({ label, children }) => children == null || children === '' ? null : <div className="min-w-0"><div className="mb-1 text-xs text-gray-400">{label}</div><div className="break-words text-base font-medium text-gray-800">{children}</div></div>

export default function VocabDetail({ selected, onSave }) {
  const [data, setData] = useState(selected)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [brokenImage, setBrokenImage] = useState(false)

  useEffect(() => {
    setData(selected)
    setEditMode(false)
    setError('')
    setBrokenImage(false)
  }, [selected])

  if (!selected || !data) return <div className="rounded-2xl border bg-white py-12 text-center text-sm text-gray-400">Chọn từ vựng để xem chi tiết</div>

  const reading = data.hiragana || data.katakana || data.kanji || ''
  const url = imageUrl(data.image)
  const hasImage = Boolean(url) && !brokenImage
  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }))
  const speak = () => reading && speakJP(reading, 1)

  const save = async () => {
    if (saving) return
    try {
      setSaving(true)
      setError('')
      await onSave(data)
      setEditMode(false)
    } catch (err) {
      setError(err?.message || 'Không thể lưu từ vựng.')
    } finally {
      setSaving(false)
    }
  }

  return <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
    <div className="p-3 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={speak} className="break-all text-left text-3xl font-bold leading-tight hover:text-blue-600 sm:text-4xl" title="Nghe phát âm">{reading}</button>
            <button type="button" onClick={speak} className="rounded-full bg-gray-50 p-2 text-gray-600 hover:bg-blue-50" aria-label="Nghe phát âm"><Volume2 size={18}/></button>
          </div>
          {data.romaji && <div className="mt-1 text-sm text-gray-400">{data.romaji}</div>}
          <div className="mt-2"><VocabLessonBadge vocab={data}/></div>
        </div>
        {hasImage && <img src={url} alt={data.meaning || reading} onError={() => setBrokenImage(true)} className="h-24 w-24 shrink-0 rounded-xl bg-gray-50 object-cover sm:h-32 sm:w-32"/>}
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={() => { setEditMode(v => !v); setError(''); if (editMode) setData(selected) }} className="rounded-full border p-2 hover:bg-gray-50" title={editMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}>{editMode ? <X size={18}/> : <Pencil size={18}/>}</button>
          {editMode && <button type="button" disabled={saving} onClick={save} className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50" title="Lưu">{saving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}</button>}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="my-3 border-t"/>
      {editMode ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <EditableField label="Kanji" value={data.kanji || ''} onChange={v => update('kanji', v)}/>
        <EditableField label="Hiragana" value={data.hiragana || ''} onChange={v => update('hiragana', v)}/>
        <EditableField label="Katakana" value={data.katakana || ''} onChange={v => update('katakana', v)}/>
        <EditableField label="Romaji" value={data.romaji || ''} onChange={v => update('romaji', v)}/>
        <EditableField label="Hán Việt" value={data.hanViet || ''} onChange={v => update('hanViet', v)}/>
        <EditableField label="Nghĩa" value={data.meaning || ''} onChange={v => update('meaning', v)}/>
        <EditableField label="Loại từ" type="select" value={data.partOfSpeech || ''} options={POS} onChange={v => update('partOfSpeech', v)}/>
      </div> : <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <Field label="Kanji"><span className="text-xl font-semibold">{data.kanji}</span></Field>
        <Field label="Hán Việt">{data.hanViet}</Field>
        <Field label="Nghĩa">{data.meaning}</Field>
        <Field label="Loại từ">{data.partOfSpeech && <span className="inline-flex rounded-lg bg-blue-50 px-2 py-1 text-sm text-blue-700">{partOfSpeechMap[data.partOfSpeech] || data.partOfSpeech}</span>}</Field>
      </div>}
      {data.example?.jp && !editMode && <div className="mt-3 rounded-xl bg-gray-50 p-3"><div className="flex items-center justify-between"><span className="text-xs text-gray-400">Ví dụ</span><button type="button" onClick={() => speakJP(data.example.jp, 1)} className="rounded p-1 text-gray-500 hover:bg-gray-200" aria-label="Nghe ví dụ"><Volume2 size={16}/></button></div><p className="mt-1 text-base">{data.example.jp}</p>{data.example.vi && <p className="mt-1 text-sm text-gray-500">{data.example.vi}</p>}</div>}
    </div>
  </div>
}
