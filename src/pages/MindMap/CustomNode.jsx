export default function CustomNode({ data }) {
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        background: "#118ab2",
        color: "#fff",
        fontWeight: 500,
        minWidth: 120,
        textAlign: "center",
      }}
    >
      {data.label}
    </div>
  );
}