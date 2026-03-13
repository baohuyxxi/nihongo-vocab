import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Pencil
} from "lucide-react"

import ImageUpload from "../../components/ImageUpload"
import Field from "./Field"

import {
  getVocabByLesson,
  bulkSaveVocab
} from "../../services/vocab.service"

import { speakJP } from "../../utils/speak"

export default function VocabularyStudy() {

  const [searchParams] = useSearchParams()
  const vocabId = Number(searchParams.get("vocabId")) || 1

  const [list, setList] = useState([])
  const [index, setIndex] = useState(0)

  const [editData, setEditData] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    loadData()
  }, [vocabId])

  useEffect(() => {

    const handleKey = (e) => {

      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()

      if (e.key === "3") {
        speakJP(editData.hiragana || editData.katakana, 1)
      }
    }

    window.addEventListener("keydown", handleKey)

    return () =>
      window.removeEventListener("keydown", handleKey)

  }, [index, editData])

  const loadData = async () => {

    const res = await getVocabByLesson(vocabId)
    const data = res.data || []

    setList(data)
    setIndex(0)

    if (data.length > 0) {
      setEditData(data[0])
    }

  }

  const vocab = list[index]

  useEffect(() => {
    if (vocab) {
      setEditData(vocab)
      setDirty(false)
    }
  }, [vocab])

  const updateField = (key, value) => {

    setEditData(prev => ({
      ...prev,
      [key]: value
    }))

    setDirty(true)

  }

  const updateExample = (value) => {

    setEditData(prev => ({
      ...prev,
      example: {
        ...(prev.example || {}),
        jp: value
      }
    }))

    setDirty(true)

  }

  const next = () => {

    if (index < list.length - 1) {
      setIndex(index + 1)
    }

  }

  const prev = () => {

    if (index > 0) {
      setIndex(index - 1)
    }

  }

  const save = async () => {

    await bulkSaveVocab([editData])

    const newList = [...list]
    newList[index] = editData
    setList(newList)

    setDirty(false)

  }

  if (!vocab) return <div>Loading...</div>

  return (

    <div className="h-screen flex flex-col items-center justify-center p-8 gap-10">

      {/* MAIN */}

      <div className="flex gap-14 max-w-6xl w-full">

        {/* IMAGE */}

        <div className="w-1/2 relative">

          <ImageUpload
            value={editData.image}
            onChange={(url) => {

              setEditData({
                ...editData,
                image: url
              })

              setDirty(true)

            }}
          />



          {/* SPEAK */}

          <button
            onClick={() =>
              speakJP(editData.hiragana || editData.katakana, 1)
            }
            className="absolute top-4 right-4 bg-white shadow-md p-3 rounded-full"
          >
            <Volume2 size={22} />
          </button>

          {/* EDIT MODE */}



        </div>

        {/* INFO */}

        <div className="w-1/2 flex flex-col gap-4">

          {/* HIRAGANA */}
          <button
            onClick={() => setEditMode(!editMode)}
            className="absolute top-4 right-16 bg-white shadow-md p-3 rounded-full"
          >
            <Pencil size={20} />
          </button>

          <div
            onClick={() =>
              speakJP(editData.hiragana || editData.katakana, 1)
            }
            className="text-5xl font-bold cursor-pointer"
          >
            {editData.hiragana || editData.katakana}
          </div>

          {/* ROMAJI */}

          {editMode ? (
            <Field
              label="Romaji"
              value={editData.romaji}
              placeholder="romaji"
              onChange={(v) => updateField("romaji", v)}
            />
          ) : (
            editData.romaji && (
              <div className="text-xl text-gray-500">
                {editData.romaji}
              </div>
            )
          )}

          {/* KANJI */}

          {editMode ? (
            <Field
              label="Kanji"
              value={editData.kanji}
              placeholder="kanji"
              onChange={(v) => updateField("kanji", v)}
            />
          ) : (
            editData.kanji && (
              <div className="text-3xl font-semibold">
                {editData.kanji}
              </div>
            )
          )}

          {/* HANVIET */}

          {editMode ? (
            <Field
              label="Hán Việt"
              value={editData.hanViet}
              placeholder="Hán Việt"
              onChange={(v) => updateField("hanViet", v)}
            />
          ) : (
            editData.hanViet && (
              <div className="text-lg text-gray-600 capitalize">
                {editData.hanViet}
              </div>
            )
          )}

          {/* MEANING */}

          {editMode ? (
            <Field
              label="Nghĩa"
              value={editData.meaning}
              placeholder="nghĩa"
              onChange={(v) => updateField("meaning", v)}
            />
          ) : (
            editData.meaning && (
              <div className="text-xl capitalize">
                {editData.meaning}
              </div>
            )
          )}

          {/* EN */}

          {editMode ? (
            <Field
              label="English"
              value={editData.en}
              placeholder="english"
              onChange={(v) => updateField("en", v)}
            />
          ) : (
            editData.en && (
              <div className="text-lg text-gray-500">
                {editData.en}
              </div>
            )
          )}

          {/* EXAMPLE */}

          {editMode ? (
            <Field
              label="Ví dụ"
              value={editData?.example?.jp}
              placeholder="日本語の例文"
              onChange={updateExample}
            />
          ) : (
            editData?.example?.jp && (
              <div className="text-xl mt-4">
                {editData.example.jp}
              </div>
            )
          )}

        </div>

      </div>

      {/* NAV */}

      <div className="flex items-center gap-8">

        <button
          onClick={prev}
          className="p-4 bg-white shadow rounded-full"
        >
          <ChevronLeft size={26} />
        </button>

        <div className="text-gray-600 text-lg font-medium">
          {index + 1} / {list.length}
        </div>

        <button
          onClick={next}
          className="p-4 bg-white shadow rounded-full"
        >
          <ChevronRight size={26} />
        </button>

        {/* SAVE */}

        {dirty && (
          <button
            onClick={save}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600"
          >
            Lưu
          </button>
        )}

      </div>

    </div>
  )
}