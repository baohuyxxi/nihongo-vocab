import { useEffect, useMemo, useState } from "react"

import JPTableInput from "../../components/JPTableInput"

import { detectVerbGroup } from "../../utils/detectVerbGroup"
import { conjugateVerb } from "../../utils/conjugateVerb"

import { getAllVerbs } from "../../services/vocab.service"

export default function VerbConjugation() {
  const [verb, setVerb] = useState("")
  const [verbs, setVerbs] = useState([])

  const [group1, setGroup1] = useState([])
  const [group2, setGroup2] = useState([])
  const [group3, setGroup3] = useState([])

  useEffect(() => {
    const fetchVerbs = async () => {
      const res = await getAllVerbs()
      const data = res.data || []

      const mapped = data.map((v) => {
        const g = detectVerbGroup({
          kanji: v.kanji,
          hiragana: v.hiragana,
        })

        return {
          ...v,
          group: g,
          conjugated: conjugateVerb(v.hiragana, g),
        }
      })

      setVerbs(mapped)
      setGroup1(mapped.filter((v) => v.group === 1))
      setGroup2(mapped.filter((v) => v.group === 2))
      setGroup3(mapped.filter((v) => v.group === 3))
    }

    fetchVerbs()
  }, [])

  const found = useMemo(() => {
    if (!verb) return null
    return verbs.find((v) =>
      Object.values(v.conjugated || {}).includes(verb)
    )
  }, [verb, verbs])

  const conjugated = found?.conjugated
  const group = found?.group

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 md:px-8 py-4 space-y-6">

      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
        🔥 Tra cứu chia động từ
      </h1>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-3 sm:p-4 space-y-2">
        <div className="font-semibold text-sm sm:text-base">
          Nhập động từ
        </div>

        <JPTableInput
          value={verb}
          onChange={setVerb}
          className="text-xl sm:text-2xl md:text-3xl leading-8"
          placeholder="たべます / のみます / します"
        />
      </div>

      {/* RESULT */}
      {verb && (
        <div className="bg-white border rounded-xl p-4 sm:p-5 space-y-3">

          {/* BASIC INFO */}
          <div className="grid sm:grid-cols-2 gap-2 text-sm sm:text-base">

            <div>
              <span className="text-gray-500">Động từ:</span>{" "}
              <span className="font-bold text-blue-600">
                {verb}
              </span>
            </div>

            <div>
              <span className="text-gray-500">Nhóm:</span>{" "}
              <span className="font-bold text-green-600">
                {group || "?"}
              </span>
            </div>

            <div>
              <span className="text-gray-500">Kanji:</span>{" "}
              <span className="font-bold">
                {found?.kanji || "—"}
              </span>
            </div>

            <div>
              <span className="text-gray-500">Bài:</span>{" "}
              <span className="font-bold text-purple-600">
                {found?.lesson || "—"}
              </span>
            </div>
          </div>

          {/* CONJUGATION */}
          {conjugated && (
            <div className="border-t pt-3 grid sm:grid-cols-2 gap-2 text-sm sm:text-base">

              <Item label="📘 Từ điển" value={conjugated.dictionary} />
              <Item label="💬 Lịch sự" value={conjugated.masu} />
              <Item label="🔥 て" value={conjugated.te} />
              <Item label="⏪ Quá khứ" value={conjugated.ta} />
              <Item label="❌ Phủ định" value={conjugated.nai} />
              <Item label="⚡ Khả năng" value={conjugated.potential} />
              <Item label="🎯 Ý định" value={conjugated.volitional} />
              <Item label="📢 Mệnh lệnh" value={conjugated.imperative} />

            </div>
          )}
        </div>
      )}

      {/* GROUPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <GroupCard title="Nhóm 1" color="text-red-600" data={group1} />
        <GroupCard title="Nhóm 2" color="text-blue-600" data={group2} />
        <GroupCard title="Nhóm 3" color="text-green-600" data={group3} />

      </div>
    </div>
  )
}

/* ===================== ITEM ===================== */
function Item({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

/* ===================== GROUP CARD ===================== */
function GroupCard({ title, color, data }) {
  return (
    <div className="bg-white border rounded-xl p-3 sm:p-4">

      <div className={`text-lg sm:text-xl font-bold mb-3 ${color}`}>
        {title}
        <span className="ml-2 text-sm text-gray-500">
          ({data.length})
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">

        {data.map((v) => (
          <div
            key={v._id}
            className="border rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            <div className="text-base sm:text-lg font-semibold">
              {v.hiragana}
            </div>

            {v.kanji && (
              <div className="text-gray-600 text-sm">
                {v.kanji}
              </div>
            )}

            {v.meaning && (
              <div className="text-xs sm:text-sm text-gray-500">
                {v.meaning}
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  )
}