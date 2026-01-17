const KEY = "typing_review_session_v1"

export const loadTypingSession = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const saveTypingSession = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export const clearTypingSession = () => {
  localStorage.removeItem(KEY)
}
