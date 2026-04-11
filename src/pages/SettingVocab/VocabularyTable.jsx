import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  getVocabByLesson,
  getVocabByTopic,
  bulkSaveVocab,
  bulkCreateVocab,
} from "../../services/vocab.service"
import VocabTable from "../../components/vocab-table/VocabTable"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"
import { TOPICS } from "../../constants/topics"

export default function VocabularyTable() {
  const [searchParams, setSearchParams] = useSearchParams()

  const lesson = Number(searchParams.get("lesson")) || 1
  const [topic, setTopic] = useState(searchParams.get("topic") || "")

  const [rows, setRows] = useState([])
  const [dirty, setDirty] = useState(false)

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    loadData()
  }, [lesson, topic])

  const loadData = async () => {
    let res

    if (topic) {
      res = await getVocabByTopic(topic)
    } else {
      res = await getVocabByLesson(lesson)
    }

    setRows(res.data)
    setDirty(false)
  }

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (index, key, value) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, [key]: value, _dirty: true } : r
      )
    )
    setDirty(true)
  }

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        lesson: topic ? undefined : lesson,
        topic: topic || undefined,
        hiragana: "",
        katakana: "",
        phoneticVi: "",
        kanji: "",
        hanViet: "",
        meaning: "",
        _new: true,
        _dirty: true,
      },
    ])
    setDirty(true)
  }

  const handleSave = async () => {
    const edited = rows.filter((r) => r._dirty && !r._new)
    const created = rows.filter((r) => r._new)

    if (edited.length) await bulkSaveVocab(edited)
    if (created.length) await bulkCreateVocab(created)

    loadData()
  }

  const changeLesson = (value) => {
    const next = Math.min(50, Math.max(1, value))
    setTopic("") // reset topic
    setSearchParams({ lesson: next })
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">📘 Bảng từ vựng</h1>

      {/* CONTROL */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* LESSON */}
        <button
          onClick={() => changeLesson(lesson - 1)}
          className="border px-2 py-1 rounded"
        >
          <ChevronLeft size={18} />
        </button>

        <select
          value={lesson}
          disabled={!!topic}
          onChange={(e) => changeLesson(Number(e.target.value))}
          className="border px-2 py-1 rounded font-semibold"
        >
          {Array.from({ length: 50 }, (_, i) => i + 1).map((l) => (
            <option key={l} value={l}>
              Bài {l}
            </option>
          ))}
        </select>

        <button
          onClick={() => changeLesson(lesson + 1)}
          className="border px-2 py-1 rounded"
        >
          <ChevronRight size={18} />
        </button>

        {/* TOPIC */}
        <select
          value={topic}
          onChange={(e) => {
            const value = e.target.value
            setTopic(value)

            setSearchParams(
              value ? { topic: value } : { lesson }
            )
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="">-- Topic --</option>
          {TOPICS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`ml-auto flex items-center gap-2 px-4 py-1 rounded text-white ${
            dirty ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <Save size={16} />
          Lưu
        </button>
      </div>

      {/* TABLE */}
      <VocabTable
        rows={rows}
        onChange={handleChange}
        onAddRow={handleAddRow}
      />
    </div>
  )
}