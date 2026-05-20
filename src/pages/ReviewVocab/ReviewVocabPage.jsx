import { useState } from "react"
import ReviewConfig from "./ReviewConfig"
import { useNavigate } from "react-router-dom"

export default function ReviewVocabPage() {
  const navigate = useNavigate()

  const [selectedLessons, setSelectedLessons] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] = useState([]) // ✅ thêm

  const [mode, setMode] = useState("typing")
  const [directions, setDirections] = useState(["jp_vi"])
  const [loading, setLoading] = useState(false)

  const startReview = () => {
    const data = {
      lessons: selectedLessons,
      topics: selectedTopics, // ✅ thêm
      partsOfSpeech: selectedPartsOfSpeech, // ✅ thêm
      mode,
      directions,
    }

    localStorage.setItem("reviewConfig", JSON.stringify(data))
    navigate("/review-session")
  }

  return (
    <ReviewConfig
      selectedLessons={selectedLessons}
      setSelectedLessons={setSelectedLessons}
      selectedTopics={selectedTopics}          // ✅ thêm
      setSelectedTopics={setSelectedTopics}    // ✅ thêm
      selectedPartsOfSpeech={selectedPartsOfSpeech}          // ✅ thêm
      setSelectedPartsOfSpeech={setSelectedPartsOfSpeech}    // ✅ thêm
      mode={mode}
      setMode={setMode}
      directions={directions}
      setDirections={setDirections}
      onStart={startReview}
      loading={loading}
    />
  )
}