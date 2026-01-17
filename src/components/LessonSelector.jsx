function LessonSelector({ selected, setSelected }) {
  const toggleLesson = (lesson) => {
    setSelected((prev) =>
      prev.includes(lesson)
        ? prev.filter((l) => l !== lesson)
        : [...prev, lesson]
    )
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: 50 }, (_, i) => i + 1).map((lesson) => (
        <label key={lesson} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={selected.includes(lesson)}
            onChange={() => toggleLesson(lesson)}
          />
          {lesson}
        </label>
      ))}
    </div>
  )
}
export default LessonSelector;