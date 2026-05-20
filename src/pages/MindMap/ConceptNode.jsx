export default function ConceptNode({ data }) {
  return (
    <div className="
      px-4 py-2
      rounded-xl
      bg-blue-500
      text-white
      shadow-md
      min-w-[140px]
      text-center
    ">
      <div className="font-bold text-sm">
        {data.label}
      </div>

      {data.sub && (
        <div className="text-xs opacity-80">
          {data.sub}
        </div>
      )}
    </div>
  )
}