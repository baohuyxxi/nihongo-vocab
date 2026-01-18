import { Turtle, Rabbit, Plus } from "lucide-react";
import { speakJP } from "../utils/speak";

export default function VocabTable({ rows, onChange, onAddRow }) {
  const columns = [
    { key: "__index", label: "STT", width: "w-12" },
    { key: "hiragana", label: "Hiragana" },
    { key: "katakana", label: "Katakana" },
    { key: "kanji", label: "Kanji" },
    { key: "hanViet", label: "Hán Việt" },
    { key: "meaning", label: "Nghĩa" },
    { key: "__audio", label: "🔊", width: "w-20" },
  ];

  const getSpeakText = (row) =>
    row.hiragana || row.katakana || row.kanji || "";

  return (
    <div className="overflow-auto border bg-white rounded">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`border p-2 text-center ${c.width || ""}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

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
                      className="border text-center font-medium text-gray-600"
                    >
                      {i + 1}
                    </td>
                  );
                }

                /* ===== AUDIO ===== */
                if (c.key === "__audio") {
                  const text = getSpeakText(row);
                  return (
                    <td key={c.key} className="border text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => speakJP(text, 0.5)}
                          title="Đọc chậm"
                          className="hover:text-blue-600"
                        >
                          <Turtle size={16} />
                        </button>
                        <button
                          onClick={() => speakJP(text, 1)}
                          title="Đọc nhanh"
                          className="hover:text-green-600"
                        >
                          <Rabbit size={16} />
                        </button>
                      </div>
                    </td>
                  );
                }

                /* ===== NORMAL INPUT ===== */
                return (
                  <td key={c.key} className="border p-1">
                    <input
                      className="w-full outline-none bg-transparent"
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
            <td colSpan={columns.length} className="p-2 text-center">
              <button
                onClick={onAddRow}
                className="flex items-center gap-2 mx-auto text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
                Thêm từ vựng mới
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
