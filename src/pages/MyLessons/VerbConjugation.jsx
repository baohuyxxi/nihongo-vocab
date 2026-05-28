import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import JPTableInput
  from "../../components/JPTableInput"

import {
  detectVerbGroup,
} from "../../utils/detectVerbGroup"

import {
  conjugateVerb,
} from "../../utils/conjugateVerb"

import {
  getAllVerbs,
} from "../../services/vocab.service"

export default function VerbConjugation() {

  const [verb, setVerb]
    = useState("")

  const [verbs, setVerbs]
    = useState([])

  const [selectedVerb, setSelectedVerb]
    = useState(null)

  const [group1, setGroup1]
    = useState([])

  const [group2, setGroup2]
    = useState([])

  const [group3, setGroup3]
    = useState([])

  const [showSuggest, setShowSuggest]
    = useState(false)

  const [selectedIndex, setSelectedIndex]
    = useState(0)

  const inputRef = useRef(null)

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchVerbs = async () => {

      const res =
        await getAllVerbs()

      const data =
        res.data || []

      const mapped = data.map((v) => {

        const g =
          detectVerbGroup({
            kanji: v.kanji,
            hiragana: v.hiragana,
          })

        return {
          ...v,
          group: g,
          conjugated:
            conjugateVerb(
              v.hiragana,
              g
            ),
        }
      })

      setVerbs(mapped)

      setGroup1(
        mapped.filter(
          (v) => v.group === 1
        )
      )

      setGroup2(
        mapped.filter(
          (v) => v.group === 2
        )
      )

      setGroup3(
        mapped.filter(
          (v) => v.group === 3
        )
      )
    }

    fetchVerbs()

  }, [])

  /* ================= MATCH ================= */

  const matchedVerbs =
    useMemo(() => {

      if (!verb.trim())
        return []

      const keyword =
        verb.trim()

      return [...verbs]

        .map((v) => {

          const forms =
            Object.values(
              v.conjugated || {}
            )

          let score = 0

          forms.forEach((f) => {

            if (!f) return

            // exact
            if (f === keyword) {

              score = Math.max(
                score,
                1000
              )
            }

            // startsWith
            else if (
              f.startsWith(
                keyword
              )
            ) {

              score = Math.max(
                score,
                800
              )
            }

            // includes
            else if (
              f.includes(
                keyword
              )
            ) {

              score = Math.max(
                score,
                500
              )
            }
          })

          return {
            ...v,
            score,
          }
        })

        .filter(
          (v) => v.score > 0
        )

        .sort((a, b) => {

          // exact trước
          if (
            b.score !== a.score
          ) {

            return (
              b.score - a.score
            )
          }

          // ngắn hơn ưu tiên
          return (
            a.hiragana.length
            - b.hiragana.length
          )
        })

    }, [verb, verbs])

  /* ================= FOUND ================= */

  const found =
    selectedVerb
    || matchedVerbs[0]
    || null

  const conjugated =
    found?.conjugated

  const group =
    found?.group

  /* ================= KEYBOARD ================= */

  const handleKeyDown = (e) => {

    if (
      !matchedVerbs.length
    ) return

    // ENTER
    if (
      e.key === "Enter"
    ) {

      e.preventDefault()

      const picked =
        matchedVerbs[
        selectedIndex
        ]

      if (picked) {

        setVerb(
          picked.hiragana
        )

        setSelectedVerb(
          picked
        )

        setShowSuggest(
          false
        )
      }
    }

    // DOWN
    if (
      e.key === "ArrowDown"
    ) {

      e.preventDefault()

      setSelectedIndex(
        (p) =>
          Math.min(
            p + 1,
            matchedVerbs.length
            - 1
          )
      )
    }

    // UP
    if (
      e.key === "ArrowUp"
    ) {

      e.preventDefault()

      setSelectedIndex(
        (p) =>
          Math.max(
            p - 1,
            0
          )
      )
    }
  }

  useEffect(() => {

    setSelectedIndex(0)

  }, [verb])

  return (

    <div
      className="
        max-w-6xl
        mx-auto

        px-3
        sm:px-5
        md:px-8

        py-4

        space-y-6
      "
    >

      {/* TITLE */}

      <h1
        className="
          text-xl
          sm:text-2xl
          md:text-3xl

          font-bold
        "
      >
        🔥 Tra cứu chia động từ
      </h1>

      {/* INPUT */}

      <div
        className="
          bg-white
          border
          rounded-xl

          p-3
          sm:p-4

          space-y-3

          relative
        "
      >

        <div
          className="
            font-semibold
            text-sm
            sm:text-base
          "
        >
          Nhập động từ
        </div>

        <div ref={inputRef}>

          <JPTableInput
            value={verb}

            onChange={(v) => {

              setVerb(v)

              // reset chọn cũ
              setSelectedVerb(
                null
              )

              setShowSuggest(
                true
              )
            }}

            onFocus={() =>
              setShowSuggest(
                true
              )
            }

            onKeyDown={
              handleKeyDown
            }

            className="
              text-xl
              sm:text-2xl
              md:text-3xl

              leading-8
            "

            placeholder="
              たべます / のみます / します
            "
          />

        </div>

        {/* SUGGEST */}

        {showSuggest
          && matchedVerbs.length > 0 && (

            <div
              className="
                border
                rounded-xl

                overflow-hidden

                max-h-[320px]
                overflow-y-auto
              "
            >

              {matchedVerbs
                .slice(0, 8)
                .map((
                  v,
                  index
                ) => (

                  <button
                    key={`${v._id}-${index}`}

                    type="button"

                    onClick={() => {

                      setVerb(
                        v.hiragana
                      )

                      setSelectedVerb(
                        v
                      )

                      setSelectedIndex(
                        index
                      )

                      setShowSuggest(
                        false
                      )
                    }}

                    className={`
                      w-full
                      text-left

                      px-4
                      py-3

                      border-b
                      last:border-b-0

                      transition

                      ${selectedIndex
                        === index
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"}
                    `}
                  >

                    <div
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      {v.hiragana}
                    </div>

                    <div
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      {v.kanji || "—"}
                      {" ・ "}
                      {v.meaning || "—"}
                    </div>

                  </button>
                ))}

            </div>
          )}

      </div>

      {/* RESULT */}

      {verb && found && (

        <div
          className="
            bg-white
            border
            rounded-xl

            p-4
            sm:p-5

            space-y-3
          "
        >

          {/* BASIC INFO */}

          <div
            className="
              grid
              sm:grid-cols-2

              gap-2

              text-sm
              sm:text-base
            "
          >

            <InfoItem
              label="Động từ"
              value={verb}
              color="text-blue-600"
            />

            <InfoItem
              label="Nhóm"
              value={group || "?"}
              color="text-green-600"
            />

            <InfoItem
              label="Kanji"
              value={
                found?.kanji
                || "—"
              }
            />

            <InfoItem
              label="Bài"
              value={
                found?.lesson
                || "—"
              }
              color="text-purple-600"
            />

            <InfoItem
              label="Nghĩa"
              value={
                found?.meaning
                || "—"
              }
            />

          </div>

          {/* CONJUGATION */}

          {conjugated && (

            <div
              className="
                border-t
                pt-3

                grid
                sm:grid-cols-2

                gap-2

                text-sm
                sm:text-base
              "
            >

              <Item
                label="📘 Từ điển"
                value={
                  conjugated.dictionary
                }
              />

              <Item
                label="💬 Lịch sự"
                value={
                  conjugated.masu
                }
              />

              <Item
                label="🔥 て"
                value={
                  conjugated.te
                }
              />

              <Item
                label="⏪ Quá khứ"
                value={
                  conjugated.ta
                }
              />

              <Item
                label="❌ Phủ định"
                value={
                  conjugated.nai
                }
              />

              <Item
                label="⚡ Khả năng"
                value={
                  conjugated.potential
                }
              />

              <Item
                label="🎯 Ý định"
                value={
                  conjugated.volitional
                }
              />

              <Item
                label="📢 Mệnh lệnh"
                value={
                  conjugated.imperative
                }
              />

              <Item
                label="🧱 Điều kiện"
                value={
                  conjugated.conditionalBa
                }
              />

              <Item
                label="🚫 Cấm chỉ"
                value={
                  conjugated.prohibition
                }
              />

              <Item
                label="🎭 Bị động"
                value={
                  conjugated.passive
                }
              />

              <Item
                label="🕹 Sai khiến"
                value={
                  conjugated.causative
                }
              />

            </div>
          )}

        </div>
      )}

      {/* GROUPS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3

          gap-4
        "
      >

        <GroupCard
          title="Nhóm 1"
          color="text-red-600"
          data={group1}
        />

        <GroupCard
          title="Nhóm 2"
          color="text-blue-600"
          data={group2}
        />

        <GroupCard
          title="Nhóm 3"
          color="text-green-600"
          data={group3}
        />

      </div>

    </div>
  )
}

/* ================= INFO ================= */

function InfoItem({
  label,
  value,
  color = "",
}) {

  return (

    <div
      className="
        flex
        justify-between

        gap-2
      "
    >

      <span
        className="
          text-gray-500
        "
      >
        {label}:
      </span>

      <span
        className={`
          font-bold
          text-right
          ${color}
        `}
      >
        {value}
      </span>

    </div>
  )
}

/* ================= ITEM ================= */

function Item({
  label,
  value,
}) {

  return (

    <div
      className="
        flex
        justify-between

        gap-2
      "
    >

      <span
        className="
          font-semibold
        "
      >
        {value}
      </span>

      <span
        className="
          text-gray-500
        "
      >
        {label}
      </span>

    </div>
  )
}

/* ================= GROUP ================= */

function GroupCard({
  title,
  color,
  data,
}) {

  return (

    <div
      className="
        bg-white
        border
        rounded-xl

        p-3
        sm:p-4
      "
    >

      <div
        className={`
          text-lg
          sm:text-xl

          font-bold

          mb-3

          ${color}
        `}
      >

        {title}

        <span
          className="
            ml-2
            text-sm
            text-gray-500
          "
        >
          ({data.length})
        </span>

      </div>

      <div
        className="
          space-y-2

          max-h-[400px]
          overflow-y-auto

          pr-1
        "
      >

        {data.map((v) => (

          <div
            key={v._id}

            className="
              border
              rounded-lg

              px-3
              py-2

              hover:bg-gray-50
            "
          >

            <div
              className="
                text-base
                sm:text-lg

                font-semibold
              "
            >
              {v.hiragana}
            </div>

            {v.kanji && (

              <div
                className="
                  text-gray-600
                  text-sm
                "
              >
                {v.kanji}
              </div>
            )}

            {v.meaning && (

              <div
                className="
                  text-xs
                  sm:text-sm

                  text-gray-500
                "
              >
                {v.meaning}
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  )
}