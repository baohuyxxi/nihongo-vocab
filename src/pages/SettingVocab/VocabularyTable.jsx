import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getVocabByLesson, bulkSaveVocab } from "../../services/vocab.service";
import VocabTable from "../../components/VocabTable";

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

  const handleSave = async () => {
    const edited = rows.filter((r) => r._dirty);
    if (edited.length === 0) return;

    await bulkSaveVocab(edited);
    loadData();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">📘 Bảng từ vựng</h1>

      <div className="flex gap-2 items-center">
        <span>Bài:</span>
        <select
          value={lesson}
          onChange={(e) =>
            setSearchParams({ lesson: e.target.value })
          }
          className="border px-2 py-1"
        >
          {Array.from({ length: 50 }, (_, i) => i + 1).map((l) => (
            <option key={l} value={l}>
              Bài {l}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`px-4 py-1 rounded text-white ${
            dirty ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          💾 Lưu
        </button>
      </div>

      <VocabTable rows={rows} onChange={handleChange} />
    </div>
  );
}
