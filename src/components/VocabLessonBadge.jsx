export default function VocabLessonBadge({ vocab }) {
  if (!vocab) return null
  const pill = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium'
  if (vocab.unit != null) return <div className="flex flex-wrap gap-1.5"><span className={`${pill} bg-blue-100 text-blue-700`}>Unit {vocab.unit}</span>{vocab.n3Order != null && <span className={`${pill} bg-slate-100 text-slate-600`}>STT {vocab.n3Order}</span>}</div>
  if (vocab.lesson != null) return <span className={`${pill} bg-orange-100 text-orange-700`}>Bài {vocab.lesson}</span>
  return null
}
