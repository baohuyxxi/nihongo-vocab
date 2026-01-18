import { useEffect, useState } from "react"
import ReviewConfig from "./ReviewConfig"
import { useNavigate } from "react-router-dom"

export default function ReviewVocabPage() {
  const navigate = useNavigate();

  const [selectedLessons, setSelectedLessons] = useState([])
  const [mode, setMode] = useState("typing")
  const [directions, setDirections] = useState(["jp_vi"])
  const [vocabList, setVocabList] = useState([])
  const [loading, setLoading] = useState(false)

  const startReview = () => {
    const data ={
      lessons: selectedLessons,
      mode,
      directions
    }
    localStorage.setItem("reviewConfig", JSON.stringify(data))

    navigate("/review-session");


  }

  return (
    <ReviewConfig
      selectedLessons={selectedLessons}
      setSelectedLessons={setSelectedLessons}
      mode={mode}
      setMode={setMode}
      directions={directions}
      setDirections={setDirections}
      onStart={startReview}
      loading={loading}
    />
  )
}
