import { useEffect, useMemo, useRef, useState } from "react"
import { Search, BookOpen } from "lucide-react"

import JPTableInput from "../../../components/JPTableInput"

import {
  getAllVocab,
  bulkSaveVocab
} from "../../../services/vocab.service"

import SearchDropdown from "./SearchDropdown"
import VocabDetail from "./VocabDetail"

export default function VocabStudied() {

  const [allVocab, setAllVocab] = useState([])

  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)

  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const wrapperRef = useRef(null)

  /* ================= FETCH ================= */

  useEffect(() => {

    loadData()

  }, [])

  const loadData = async () => {

    try {

      const res = await getAllVocab()

      setAllVocab(res.data || [])

    } catch (err) {

      console.log(err)

    }

  }

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {

    if (!search.trim()) return []

    const keyword = search.toLowerCase()

    return allVocab
      .filter((item) => (

        item.kanji
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.hiragana
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.katakana
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.meaning
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.romaji
          ?.toLowerCase()
          .includes(keyword)

      ))
      .slice(0, 20)

  }, [search, allVocab])

  /* ================= SELECT ================= */

  const handleSelect = (item) => {

    setSelected(item)

    setSearch(
      item.kanji ||
      item.hiragana ||
      item.katakana ||
      ""
    )

    setShowDropdown(false)

  }

  /* ================= SAVE ================= */

  const handleSave = async (data) => {

    await bulkSaveVocab([data])

    const newList = [...allVocab]

    const index = newList.findIndex(
      v => v._id === data._id
    )

    if (index !== -1) {
      newList[index] = data
    }

    setAllVocab(newList)
    setSelected(data)

  }

  return (

    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <div className="sticky top-0 bg-white border-b z-40">

        <div className="max-w-5xl mx-auto p-5">

          <div className="flex items-center gap-3 mb-4">

            <BookOpen size={28} />

            <div>

              <div className="text-2xl font-bold">
                Từ vựng đã học
              </div>

              <div className="text-sm text-gray-500">
                Search Japanese Vocabulary
              </div>

            </div>

          </div>

          {/* SEARCH */}

          <div
            ref={wrapperRef}
            className="relative"
          >

            <div
              className="
                flex items-start gap-3
                border rounded-2xl
                bg-gray-50
                px-4 py-3
              "
            >

              <Search
                size={20}
                className="mt-1 text-gray-400"
              />

              <JPTableInput
                value={search}
                onChange={(v) => {

                  setSearch(v)
                  setShowDropdown(true)
                  setActiveIndex(0)

                }}
                placeholder="食べる / ăn / eat"
                className="text-lg"
              />

            </div>

            <SearchDropdown
              search={search}
              filtered={filtered}
              activeIndex={activeIndex}
              showDropdown={showDropdown}
              handleSelect={handleSelect}
            />

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-5xl mx-auto p-5">

        <VocabDetail
          selected={selected}
          onSave={handleSave}
        />

      </div>

    </div>

  )

}