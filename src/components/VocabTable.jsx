import { Turtle, Rabbit, Plus } from "lucide-react";
import { speakJP } from "../utils/speak";

export default function VocabTable({ rows, onChange, onAddRow }) {
  const columns = [
    { key: "__index", label: "STT", width: "w-14" },
    { key: "hiragana", label: "Hiragana", width: "w-64" },
    { key: "katakana", label: "Katakana", width: "w-64" },
    { key: "phoneticVi", label: "Phiên âm (Việt)", width: "w-64" },
    { key: "kanji", label: "Kanji", width: "w-32" },
    { key: "hanViet", label: "Hán Việt", width: "w-32" },
    { key: "meaning", label: "Nghĩa", width: "w-128" },
    { key: "__audio", label: "🔊", width: "w-24" },
  ];

  const getSpeakText = (row) =>
    row.hiragana || row.katakana || row.kanji || "";

  return (
    <div className="overflow-auto border bg-white rounded">
      <table className="min-w-full border-collapse text-base">
        {/* ===== HEADER ===== */}
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`border px-3 py-3 text-center font-semibold text-gray-700 ${c.width || ""}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* ===== BODY ===== */}
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row._id || i}
              className={row._dirty ? "bg-yellow-50" : ""}
            >
              {columns.map((c) => {
                /* ===== STT ===== */
                if (c.key === "__index") {
                  return (
                    <td
                      key={c.key}
                      className="border text-center font-semibold text-gray-600 text-lg"
                    >
                      {i + 1}
                    </td>
                  );
                }

                /* ===== AUDIO ===== */
                if (c.key === "__audio") {
                  const text = getSpeakText(row);
                  return (
                    <td key={c.key} className="border">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => speakJP(text, 0.5)}
                          title="Đọc chậm"
                          className="hover:text-blue-600"
                        >
                          <Turtle size={20} />
                        </button>
                        <button
                          onClick={() => speakJP(text, 1)}
                          title="Đọc nhanh"
                          className="hover:text-green-600"
                        >
                          <Rabbit size={20} />
                        </button>
                      </div>
                    </td>
                  );
                }

                /* ===== INPUT ===== */
                return (
                  <td key={c.key} className="border px-2 py-1">
                    <input
                      className="
                        w-full bg-transparent outline-none
                        text-lg
                        px-2 py-2
                        focus:bg-blue-50
                      "
                      value={row[c.key] || ""}
                      onChange={(e) =>
                        onChange(i, c.key, e.target.value)
                      }
                    />
                  </td>
                );
              })}
            </tr>
          ))}

          {/* ===== ADD NEW ROW ===== */}
          <tr className="bg-gray-50">
            <td colSpan={columns.length} className="p-4 text-center">
              <button
                onClick={onAddRow}
                className="flex items-center gap-2 mx-auto
                  text-lg font-medium
                  text-blue-600 hover:text-blue-800"
              >
                <Plus size={20} />
                Thêm từ vựng mới
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
