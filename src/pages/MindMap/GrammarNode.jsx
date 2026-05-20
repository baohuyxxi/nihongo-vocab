export default function GrammarNode({ data }) {
  return (
    <div className="
      px-4 py-3
      rounded-xl
      bg-white
      border
      shadow-sm
      min-w-[160px]
    ">
      <div className="text-xs text-gray-500">
        📘 Grammar
      </div>

      <div className="font-bold text-green-600 text-sm mt-1">
        {data.label}
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {data.meaning}
      </div>
    </div>
  )
}