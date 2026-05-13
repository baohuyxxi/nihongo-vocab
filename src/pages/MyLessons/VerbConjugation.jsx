// src/pages/VerbConjugation/VerbConjugation.jsx

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

  // =====================
  // LOAD DATA
  // =====================
  useEffect(() => {
    const fetchVerbs = async () => {
      try {
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

        localStorage.setItem("verbs", JSON.stringify(mapped))
      } catch (err) {
        console.error(err)
      }
    }

    fetchVerbs()
  }, [])

  // =====================
  // FIND INPUT VERB
  // =====================
  const found = useMemo(() => {
    if (!verb || !verbs.length) return null

    return verbs.find((v) => {
      const c = v.conjugated
      if (!c) return false

      return Object.values(c).includes(verb)
    })
  }, [verb, verbs])

  const group = found?.group
  const conjugated = found?.conjugated

  return (
    <div className="max-w-6xl mx-auto p-5 space-y-6">

      <h1 className="text-3xl font-bold">
        Tra cứu chia động từ
      </h1>

      {/* INPUT */}
      <div className="bg-white border rounded p-4">
        <div className="font-semibold mb-2">
          Nhập động từ
        </div>

        <JPTableInput
          value={verb}
          onChange={setVerb}
          className="text-3xl leading-10"
          placeholder="たべます / のみます / します"
        />
      </div>

      {/* RESULT */}
      {verb && (
        <div className="bg-white border rounded p-5 space-y-3">

          <div className="text-xl">
            Động từ:
            <span className="ml-2 font-bold text-blue-600">
              {verb} | {found?.kanji || "Không có kanji"} | {found?.meaning || "Không có nghĩa"}
            </span>
          </div>
          <div className="text-xl">
            Nhóm:
            <span className="ml-2 font-bold text-green-600">
              {group || "Không xác định"}
            </span>
          </div>
          <div className="text-xl">
            Bài:
            <span className="ml-2 font-bold text-purple-600">
              {found?.lesson || "Không xác định"}
            </span>
          </div>

          {/* =====================
              CONJUGATION DISPLAY
          ===================== */}
          {conjugated && (
            <div className="border-t pt-3 space-y-1">

              <div className="font-semibold text-gray-700">
                Các thể:
              </div>

              <div>📘 Thể từ điển: <b>{conjugated.dictionary}</b></div>
              <div>💬 Thể lịch sự: <b>{conjugated.masu}</b></div>
              <div>🔥 Thể て: <b>{conjugated.te}</b></div>
              <div>⏪ Thể quá khứ: <b>{conjugated.ta}</b></div>
              <div>❌ Thể phủ định: <b>{conjugated.nai}</b></div>
              <div>⚡ Thể khả năng: <b>{conjugated.potential}</b></div>
              <div>🎯 Thể ý định: <b>{conjugated.volitional}</b></div>
              <div>📢 Thể mệnh lệnh: <b>{conjugated.imperative}</b></div>

            </div>
          )}

        </div>
      )}

      {/* GROUPS */}
      <div className="grid md:grid-cols-3 gap-5">

        <GroupCard title="Nhóm 1" color="text-red-600" data={group1} />
        <GroupCard title="Nhóm 2" color="text-blue-600" data={group2} />
        <GroupCard title="Nhóm 3" color="text-green-600" data={group3} />

      </div>
    </div>
  )
}

// =====================
// GROUP CARD
// =====================
function GroupCard({ title, color, data }) {
  return (
    <div className="bg-white border rounded p-4">

      <div className={`text-2xl font-bold mb-4 ${color}`}>
        {title}
        <span className="ml-2 text-lg text-gray-500">
          ({data.length})
        </span>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-auto">

        {data.map((v) => (
          <div
            key={v._id}
            className="border rounded px-3 py-2 hover:bg-gray-50"
          >
            <div className="text-xl font-semibold">
              {v.hiragana}
            </div>

            {v.kanji && (
              <div className="text-gray-600">
                {v.kanji}
              </div>
            )}

            {v.meaning && (
              <div className="text-sm text-gray-500">
                {v.meaning}
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  )
}