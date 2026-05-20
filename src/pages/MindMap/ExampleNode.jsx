export default function ExampleNode({ data }) {
  return (
    <div className="
      px-3 py-2
      rounded-lg
      bg-orange-50
      border border-orange-200
      min-w-[160px]
    ">
      <div className="text-xs text-gray-500">
        💡 Example
      </div>

      <div className="text-sm font-medium">
        {data.text}
      </div>
    </div>
  )
}