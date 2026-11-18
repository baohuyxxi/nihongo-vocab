export default function CustomNode({ data }) {
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        background: "var(--color-information-surface)",
        color: "var(--color-text-primary)",
        fontWeight: 500,
        minWidth: 120,
        textAlign: "center",
      }}
    >
      {data.label}
    </div>
  );
}