export default function TableNode({ data }) {
  const cell = {
    border: "1px solid var(--color-border-primary)",
    padding: "6px 10px",
    textAlign: "center",
  };

  const header = {
    ...cell,
    fontWeight: "bold",
    background: "var(--color-background-secondary)",
  };

  return (
    <div
      style={{
        background: "var(--color-surface)",
        padding: 12,
        borderRadius: 10,
        border: "2px solid var(--color-border-primary)",
      }}
    >
      <table style={{ borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>
            <th style={header}></th>
            <th style={header}>Từ điển</th>
            <th style={header}>Lịch sự</th>
            <th style={header}>Thể Nối</th>
            <th style={header}>Thể Quá Khứ</th>
            <th style={header}>Thể Phủ Định</th>
          </tr>
        </thead>

        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}>
              {i === 0 && (
                <td style={cell} rowSpan={data.rows.length}>
                  V1
                </td>
              )}

              <td style={cell}>{row.dict}</td>
              <td style={cell}>{row.mas}</td>

              {row.te && (
                <td style={{ ...cell, background: row.color }} rowSpan={row.span}>
                  {row.te}
                </td>
              )}

              {row.ta && (
                <td style={{ ...cell, background: row.color }} rowSpan={row.span}>
                  {row.ta}
                </td>
              )}

              <td style={cell}>{row.nai}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 8 }}>
        ⚠️ {data.note}
      </div>
    </div>
  );
}