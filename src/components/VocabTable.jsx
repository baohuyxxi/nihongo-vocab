import { speakJP } from "../utils/speak";

export default function VocabTable({ rows, onChange }) {
  const columns = [
    { key: "hiragana", label: "Hiragana" },
    { key: "katakana", label: "Katakana" },
    { key: "romaji", label: "Romaji" },
    { key: "phoneticVi", label: "Phiên âm" },
    { key: "kanji", label: "Kanji" },
    { key: "hanViet", label: "Hán Việt" },
    { key: "meaning", label: "Nghĩa" },
    { key: "partOfSpeech", label: "Loại" },
    { key: "__audio", label: "🔊" },
  ];

  const getSpeakText = (row) =>
    row.hiragana || row.katakana || row.kanji || "";

  return (
    <div className="overflow-auto border bg-white">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="border p-2 text-center">
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
                if (c.key === "__audio") {
                  const text = getSpeakText(row);

                  return (
                    <td key={c.key} className="border text-center">
                      <div className="flex justify-center gap-2">
                        {/* Đọc chậm */}
                        <button
                          onClick={() => speakJP(text, 0.5)}
                          className="hover:scale-110 transition"
                          title="Đọc chậm"
                        >
                          🐢
                        </button>

                        {/* Đọc nhanh */}
                        <button
                          onClick={() => speakJP(text, 1)}
                          className="hover:scale-110 transition"
                          title="Đọc nhanh"
                        >
                          🐇
                        </button>
                      </div>
                    </td>
                  );
                }

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
        </tbody>
      </table>
    </div>
  );
}
