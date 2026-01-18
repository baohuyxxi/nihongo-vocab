import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getVocabByLesson,
  bulkSaveVocab,
  bulkCreateVocab,
} from "../../services/vocab.service";
import VocabTable from "../../components/VocabTable";
import {
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";

export default function VocabularyTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lesson = Number(searchParams.get("lesson")) || 1;

  const [rows, setRows] = useState([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    loadData();
  }, [lesson]);

  const loadData = async () => {
    const res = await getVocabByLesson(lesson);
    setRows(res.data);
    setDirty(false);
  };

  const handleChange = (index, key, value) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, [key]: value, _dirty: true } : r
      )
    );
    setDirty(true);
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        lesson,
        hiragana: "",
        katakana: "",
        kanji: "",
        hanViet: "",
        meaning: "",
        _new: true,
        _dirty: true,
      },
    ]);
    setDirty(true);
  };

  const handleSave = async () => {
    const edited = rows.filter((r) => r._dirty && !r._new);
    const created = rows.filter((r) => r._new);

    if (edited.length) await bulkSaveVocab(edited);
    if (created.length) await bulkCreateVocab(created);

    loadData();
  };

  const changeLesson = (value) => {
    const next = Math.min(50, Math.max(1, value));
    setSearchParams({ lesson: next });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">📘 Bảng từ vựng</h1>

      {/* CONTROL BAR */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Prev */}
        <button
          onClick={() => changeLesson(lesson - 1)}
          className="border px-2 py-1 rounded hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Select */}
        <select
          value={lesson}
          onChange={(e) => changeLesson(Number(e.target.value))}
          className="border px-2 py-1 rounded font-semibold"
        >
          {Array.from({ length: 50 }, (_, i) => i + 1).map((l) => (
            <option key={l} value={l}>
              Bài {l}
            </option>
          ))}
        </select>

        {/* Next */}
        <button
          onClick={() => changeLesson(lesson + 1)}
          className="border px-2 py-1 rounded hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>

        {/* Save */}
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

      <VocabTable
        rows={rows}
        onChange={handleChange}
        onAddRow={handleAddRow}
      />
    </div>
  );
}
