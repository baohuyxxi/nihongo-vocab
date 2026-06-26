import { useEffect, useMemo, useRef, useState } from "react"
import {
  Search,
  BookOpen,
  Languages,
} from "lucide-react"

import JPTableInput from "../../../components/JPTableInput"
import { normalizeVietnamese } from "../../../utils/normalizeVietnamese"

import {
  getAllVocab,
  bulkSaveVocab
} from "../../../services/vocab.service"

import SearchDropdown from "./SearchDropdown"
import VocabDetail from "./VocabDetail"
import RecentVocabs from "./RecentVocabs"

export default function VocabStudied() {

  const [allVocab, setAllVocab] = useState(() => {
    const savedVocab = localStorage.getItem("allVocab")
    return savedVocab ? JSON.parse(savedVocab) : []
  })
  const [recentVocabs, setRecentVocabs] = useState(() => {

    const savedRecent =
      localStorage.getItem("recentVocabs")

    return savedRecent
      ? JSON.parse(savedRecent)
      : []

  })
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
      localStorage.setItem("allVocab", JSON.stringify(res.data || []))

    } catch (err) {

    }

  }

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {

    const jpKeyword = jpSearch.toLowerCase().trim()

    const viKeyword = normalizeVietnamese(viSearch)

    // KHÔNG nhập gì
    if (!jpKeyword && !viKeyword) {
      return []
    }

    // SEARCH JP
    if (jpKeyword) {

      return allVocab
        .map((item) => {

          const kanji = item.kanji?.toLowerCase() || ""
          const hiragana = item.hiragana?.toLowerCase() || ""
          const katakana = item.katakana?.toLowerCase() || ""
          const romaji = item.romaji?.toLowerCase() || ""

          let score = -1

          // ===== Exact =====
          if (kanji === jpKeyword) score = 100
          else if (hiragana === jpKeyword) score = 98
          else if (katakana === jpKeyword) score = 96
          else if (romaji === jpKeyword) score = 94

          // ===== Starts With =====
          else if (kanji.startsWith(jpKeyword)) score = 90
          else if (hiragana.startsWith(jpKeyword)) score = 88
          else if (katakana.startsWith(jpKeyword)) score = 86
          else if (romaji.startsWith(jpKeyword)) score = 84

          // ===== Contains =====
          else if (kanji.includes(jpKeyword)) score = 80
          else if (hiragana.includes(jpKeyword)) score = 78
          else if (katakana.includes(jpKeyword)) score = 76
          else if (romaji.includes(jpKeyword)) score = 74

          return { item, score }
        })
        .filter(x => x.score >= 0)
        .sort((a, b) => b.score - a.score)
        .map(x => x.item)
        .slice(0, 50)

    }
    // SEARCH VI
    return allVocab
      .map((item) => {
        const meaning = normalizeVietnamese(item.meaning)
        const hanViet = normalizeVietnamese(item.hanViet)

        let score = -1

        // Trùng hoàn toàn
        if (meaning === viKeyword) score = 100
        else if (hanViet === viKeyword) score = 95

        // Bắt đầu bằng từ khóa
        else if (meaning.startsWith(viKeyword)) score = 90
        else if (hanViet.startsWith(viKeyword)) score = 85

        // Có chứa nguyên từ
        else if (
          meaning.split(/\s+/).includes(viKeyword)
        ) {
          score = 80
        }
        else if (
          hanViet.split(/\s+/).includes(viKeyword)
        ) {
          score = 75
        }

        // Chứa chuỗi
        else if (meaning.includes(viKeyword)) score = 60
        else if (hanViet.includes(viKeyword)) score = 55

        return { item, score }
      })
      .filter(x => x.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.item)
      .slice(0, 50)

  }, [
    jpSearch,
    viSearch,
    allVocab
  ])

  /* ================= SELECT ================= */

  const handleSelect = (
    item,
    updateSearch = true
  ) => {
    setSelected(item)
    // Chỉ cập nhật ô tìm kiếm
    // khi được yêu cầu
    if (updateSearch) {
      setJpSearch(
        item.kanji ||
        item.hiragana ||
        item.katakana ||
        ""
      )

      setViSearch(
        item.meaning || ""
      )

    }
    setShowDropdown(false)
    setRecentVocabs((prev) => {

      const filtered = prev.filter(
        (v) => v._id !== item._id
      )
      const updated = [
        item,
        ...filtered,
      ].slice(0, 20)

      localStorage.setItem(
        "recentVocabs",
        JSON.stringify(updated)
      )

      return updated

    })

  }

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setShowDropdown(false)
      }

    }
    document.addEventListener(
      "pointerdown",
      handlePointerDown
    )
    return () =>
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      )
  }, [])

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

      <div
        className="
        max-w
        mx-auto
        px-3
        sm:px-5
        py-5
        grid
        grid-cols-1
        lg:grid-cols-4
        gap-6
        items-start
      "
      >

        {/* LEFT */}

        <div
          className="
          lg:col-span-3
        "
        >

          {/* HEADER */}

          <div
            className="
            sticky
            top-0

            bg-white

            border-b

            z-40
          "
          >

            <div
              className="
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

                {/* JP */}

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
                    className="
                    text-gray-400
                    shrink-0
                  "
                  />

                  <JPTableInput
                    value={jpSearch}
                    onChange={(v) => {
                      setJpSearch(v)
                      setViSearch("")
                      setShowDropdown(true)
                      setActiveIndex(0)
                    }}
                    onFocus={() => {
                      setShowDropdown(true)
                      setActiveIndex(0)
                    }}
                    placeholder="食べる / たべる  "
                    className="
                    text-base
                    sm:text-lg

                    w-full
                  "
                  />

                </div>

                {/* VI */}

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
                    className="
                    text-gray-400
                    shrink-0
                  "
                  />

                  <input
                    value={viSearch}
                    onChange={(e) => {

                      setViSearch(
                        e.target.value
                      )
                      setJpSearch("")
                      setShowDropdown(true)
                      setActiveIndex(0)

                    }}
                    onFocus={() => {
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

                <SearchDropdown
                  search={
                    jpSearch ||
                    viSearch
                  }
                  filtered={filtered}
                  recentVocabs={recentVocabs}
                  activeIndex={activeIndex}
                  showDropdown={showDropdown}
                  handleSelect={handleSelect}
                  setActiveIndex={setActiveIndex}
                />

              </div>

            </div>

          </div>

          {/* DETAIL */}

          <div className="mt-5">

            <VocabDetail
              selected={selected}
              onSave={handleSave}
            />

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
          lg:col-span-1
        "
        >

          <div
            className="
            lg:sticky
            lg:top-5
          "
          >

            <RecentVocabs
              recentVocabs={recentVocabs}
              onSelect={handleSelect}
            />

          </div>

        </div>

      </div>

    </div>

  )

}