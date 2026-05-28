import { useEffect, useMemo, useRef, useState } from "react"
import {
  Search,
  BookOpen,
  Languages,
} from "lucide-react"

import JPTableInput from "../../../components/JPTableInput"

import {
  getAllVocab,
  bulkSaveVocab
} from "../../../services/vocab.service"

import SearchDropdown from "./SearchDropdown"
import VocabDetail from "./VocabDetail"

export default function VocabStudied() {

  const [allVocab, setAllVocab] = useState([])

  // ================= SEARCH =================

  const [jpSearch, setJpSearch] = useState("")
  const [viSearch, setViSearch] = useState("")

  const [selected, setSelected] = useState(null)

  const [showDropdown, setShowDropdown]
    = useState(false)

  const [activeIndex, setActiveIndex]
    = useState(0)

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

    const jpKeyword =
      jpSearch.toLowerCase().trim()

    const viKeyword =
      viSearch.toLowerCase().trim()

    // KHÔNG nhập gì
    if (!jpKeyword && !viKeyword) {
      return []
    }

    // SEARCH JP
    if (jpKeyword) {

      return allVocab
        .filter((item) => (

          item.kanji
            ?.toLowerCase()
            .includes(jpKeyword)

          ||

          item.hiragana
            ?.toLowerCase()
            .includes(jpKeyword)

          ||

          item.katakana
            ?.toLowerCase()
            .includes(jpKeyword)

          ||

          item.romaji
            ?.toLowerCase()
            .includes(jpKeyword)

        ))
        .slice(0, 20)

    }

    // SEARCH VI
    return allVocab
      .filter((item) => (

        item.meaning
          ?.toLowerCase()
          .includes(viKeyword)

        ||

        item.hanViet
          ?.toLowerCase()
          .includes(viKeyword)

      ))
      .slice(0, 20)

  }, [
    jpSearch,
    viSearch,
    allVocab
  ])

  /* ================= SELECT ================= */

  const handleSelect = (item) => {

    setSelected(item)

    setJpSearch(
      item.kanji ||
      item.hiragana ||
      item.katakana ||
      ""
    )

    setViSearch(
      item.meaning || ""
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

        <div
          className="
            max-w-5xl
            mx-auto

            px-3
            sm:px-5

            py-4
          "
        >

          {/* TITLE */}

          <div
            className="
              flex items-center
              gap-3
              mb-4
            "
          >

            <BookOpen size={28} />

            <div>

              <div
                className="
                  text-xl
                  sm:text-2xl
                  font-bold
                "
              >
                Từ vựng đã học
              </div>

              <div
                className="
                  text-xs
                  sm:text-sm
                  text-gray-500
                "
              >
                Search Japanese Vocabulary
              </div>

            </div>

          </div>

          {/* SEARCH */}

          <div
            ref={wrapperRef}
            className="
              relative
              space-y-3
            "
          >

            {/* JP SEARCH */}

            <div
              className="
                flex items-center
                gap-3

                border
                rounded-2xl

                bg-gray-50

                px-4
                py-3
              "
            >

              <Search
                size={20}
                className="text-gray-400 shrink-0"
              />

              <JPTableInput
                value={jpSearch}

                onChange={(v) => {

                  setJpSearch(v)

                  // clear ô VI
                  setViSearch("")

                  setShowDropdown(true)
                  setActiveIndex(0)

                }}

                placeholder="食べる / たべる / eat"

                className="
                  text-base
                  sm:text-lg

                  w-full

                  whitespace-nowrap
                  overflow-hidden
                  text-ellipsis
                "
              />

            </div>

            {/* VI SEARCH */}

            <div
              className="
                flex items-center
                gap-3

                border
                rounded-2xl

                bg-gray-50

                px-4
                py-3
              "
            >

              <Languages
                size={20}
                className="text-gray-400 shrink-0"
              />

              <input
                value={viSearch}

                onChange={(e) => {

                  setViSearch(e.target.value)

                  // clear ô JP
                  setJpSearch("")

                  setShowDropdown(true)
                  setActiveIndex(0)

                }}

                placeholder="ăn / học sinh / trường học"

                className="
                  bg-transparent
                  outline-none

                  text-base
                  sm:text-lg

                  w-full
                "
              />

            </div>

            {/* DROPDOWN */}

            <SearchDropdown
              search={jpSearch || viSearch}
              filtered={filtered}
              activeIndex={activeIndex}
              showDropdown={showDropdown}
              handleSelect={handleSelect}
            />

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div
        className="
          max-w-5xl
          mx-auto

          px-3
          sm:px-5

          py-5
        "
      >

        <VocabDetail
          selected={selected}
          onSave={handleSave}
        />

      </div>

    </div>

  )

}