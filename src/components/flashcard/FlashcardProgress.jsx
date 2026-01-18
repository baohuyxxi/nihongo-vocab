export default function FlashcardProgress({ learned, total }) {
  const percent = total
    ? Math.round((learned / total) * 100)
    : 0

  return (
    <div className="w-full max-w-xl">
      <div className="h-2 sm:h-3 bg-gray-200 rounded-full">
        <div
          className="h-2 sm:h-3 bg-green-500 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs sm:text-sm text-center mt-1">
        Đã nhớ {learned}/{total} ({percent}%)
      </p>
    </div>
  )
}
