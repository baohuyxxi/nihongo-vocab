import VocabRowDesktop from "./VocabRowDesktop"

export default function VocabTableDesktop({
  rows,
  onChange,
  onKanaChange,
}) {
  return (
    <table className="hidden md:table min-w-full border-collapse table-fixed">
      <colgroup>
        <col style={{ width: "2%" }} />
        <col style={{ width: "16%" }} />
        <col style={{ width: "9%" }} />
        <col style={{ width: "11%" }} />
        <col style={{ width: "11%" }} />
        <col style={{ width: "5%" }} />
        <col style={{ width: "12%" }} />
        <col style={{ width: "18%" }} />
        <col style={{ width: "7%" }} />
        <col style={{ width: "2%" }} />
      </colgroup>

      <thead className="bg-gray-200 sticky top-0 z-10">
        <tr>
          <Th>STT</Th>
          <Th>Hira / Kata</Th>
          <Th>Phiên Âm</Th>
          <Th>Kanji</Th>
          <Th>Hán Việt</Th>
          <Th>Từ loại</Th>
          <Th>Tiếng Anh</Th>
          <Th>Nghĩa</Th>
          <Th>Hình Ảnh</Th>
          <Th>🔊</Th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row, i) => (
          <VocabRowDesktop
            key={i}
            index={i}
            row={row}
            onChange={onChange}
            onKanaChange={onKanaChange}
          />
        ))}
      </tbody>
    </table>
  )
}

function Th({ children }) {
  return (
    <th className="border px-2 py-3 text-left text-sm font-semibold">
      {children}
    </th>
  )
}