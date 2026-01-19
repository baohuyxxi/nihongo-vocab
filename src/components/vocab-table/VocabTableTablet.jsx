import VocabRowTablet from "./VocabRowTablet"

export default function VocabTableTablet({ rows, onChange, onKanaChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-2">
      {rows.map((row, i) => (
        <VocabRowTablet
          key={i}
          index={i}
          row={row}
          onChange={onChange}
          onKanaChange={onKanaChange}
        />
      ))}
    </div>
  )
}
