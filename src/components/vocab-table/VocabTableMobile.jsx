import VocabRowMobile from "./VocabRowMobile"

export default function VocabTableMobile({ rows, onChange, onKanaChange }) {
  return (
    <table className="md:hidden w-full border-collapse">
      <tbody>
        {rows.map((row, i) => (
          <VocabRowMobile
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
