
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getVocabByLesson,
  getVocabByTopic,
  getVocabByUnit,
  bulkSaveVocab,
  bulkCreateVocab,
} from "../../services/vocab.service";

import VocabTable from "../../components/vocab-table/VocabTable";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { TOPICS } from "../../constants/topics";
import { N3_TOPICS } from "../../constants/n3Units";

export default function VocabularyTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const lesson = Number(searchParams.get("lesson")) || 1;
  const topic = searchParams.get("topic") || "";
  const unit = Number(searchParams.get("unit")) || 0;

  const [rows, setRows] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const currentUnit = N3_TOPICS.find(
    (item) => item.unit === unit,
  );

  /* =========================
     LOAD DATA
  ========================= */

  const fetchVocabs = async () => {
    if (unit) {
      return getVocabByUnit(unit);
    }

    if (topic) {
      return getVocabByTopic(topic);
    }

    return getVocabByLesson(lesson);
  };

  const loadData = async () => {
    const res = await fetchVocabs();

    setRows(res.data || []);
    setDirty(false);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetchVocabs();

        if (cancelled) return;

        setRows(res.data || []);
        setDirty(false);
      } catch (err) {
        if (cancelled) return;

        console.error("Load vocab error:", err);

        setRows([]);
        setError(
          err.message || "Không thể tải từ vựng",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [lesson, topic, unit]);

  /* =========================
     HANDLERS
  ========================= */

  const handleChange = (index, key, value) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, [key]: value, _dirty: true }
          : r,
      ),
    );

    setDirty(true);
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        lesson: unit || topic ? undefined : lesson,
        topic: unit ? undefined : topic || undefined,

        ...(unit && {
          level: "N3",
          unit,
          n3Type: "main",
        }),

        hiragana: "",
        katakana: "",
        phoneticVi: "",
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
    if (!dirty || saving || loading) return;

    setSaving(true);
    setError("");

    try {
      const edited = rows.filter(
        (r) => r._dirty && !r._new,
      );

      const created = rows.filter(
        (r) => r._new,
      );

      if (edited.length) {
        await bulkSaveVocab(edited);
      }

      if (created.length) {
        await bulkCreateVocab(created);
      }

      await loadData();
    } catch (err) {
      console.error("Save vocab error:", err);

      setError(
        err.message || "Lưu từ vựng thất bại",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     NAVIGATION
  ========================= */

  const changeLesson = (value) => {
    const next = Math.min(50, Math.max(1, value));

    setSearchParams({
      lesson: String(next),
    });
  };

  const changeTopic = (value) => {
    setSearchParams(
      value
        ? { topic: value }
        : { lesson: String(lesson) },
    );
  };

  const changeUnit = (value) => {
    const next = Number(value);

    setSearchParams(
      next
        ? { unit: String(next) }
        : { lesson: String(lesson) },
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">
        📘 Bảng từ vựng
      </h1>

      {/* CONTROL */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* LESSON PREVIOUS */}
        <button
          type="button"
          onClick={() => changeLesson(lesson - 1)}
          disabled={!!topic || !!unit || lesson <= 1}
          className="border px-2 py-1 rounded disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {/* LESSON SELECT */}
        <select
          value={topic || unit ? "" : lesson}
          onChange={(e) =>
            changeLesson(Number(e.target.value))
          }
          className="border px-2 py-1 rounded font-semibold"
        >
          <option value="" disabled>
            -- Chọn bài --
          </option>

          {Array.from(
            { length: 50 },
            (_, i) => i + 1,
          ).map((l) => (
            <option key={l} value={l}>
              Bài {l}
            </option>
          ))}
        </select>

        {/* LESSON NEXT */}
        <button
          type="button"
          onClick={() => changeLesson(lesson + 1)}
          disabled={!!topic || !!unit || lesson >= 50}
          className="border px-2 py-1 rounded disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>

        {/* MINNA TOPIC */}
        <select
          value={topic}
          onChange={(e) =>
            changeTopic(e.target.value)
          }
          className="border px-2 py-1 rounded"
        >
          <option value="">
            -- Topic --
          </option>

          {TOPICS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        {/* N3 UNIT */}
        <select
          value={unit}
          onChange={(e) =>
            changeUnit(e.target.value)
          }
          className="border px-2 py-1 rounded font-semibold"
        >
          <option value={0}>
            -- N3 Unit --
          </option>

          {N3_TOPICS.map((item) => (
            <option
              key={item.unit}
              value={item.unit}
            >
              Unit {item.unit} - {item.label}
            </option>
          ))}
        </select>

        {/* SAVE */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving || loading}
          className={`
            ml-auto flex items-center gap-2
            px-4 py-1 rounded text-white
            ${
              dirty && !saving && !loading
                ? "bg-blue-600"
                : "bg-gray-400"
            }
          `}
        >
          <Save size={16} />
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* N3 UNIT INFO */}
      {!!unit && currentUnit && (
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-orange-600">
            Unit {currentUnit.unit}
          </span>

          {" — "}
          {currentUnit.label}

          {currentUnit.meaning && (
            <>
              {" — "}
              {currentUnit.meaning}
            </>
          )}
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="py-8 text-center text-gray-500">
          Đang tải từ vựng...
        </div>
      ) : (
        <VocabTable
          rows={rows}
          onChange={handleChange}
          onAddRow={handleAddRow}
        />
      )}
    </div>
  );
}
