export default function Field({
  label,
  value,
  onChange,
  placeholder
}) {

  return (

    <div className="flex flex-col gap-1">

      {label && (
        <span className="text-sm text-gray-500">
          {label}
        </span>
      )}

      <input
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

    </div>

  )

}