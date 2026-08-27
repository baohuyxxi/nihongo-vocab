// utils/reviewStorage.js

export const REVIEW_CONFIG_KEY =
  "reviewConfig"

export const REVIEW_SESSION_KEY =
  "reviewSessionData"

export const FLASHCARD_PROGRESS_KEY =
  "flashcardProgress"


export const getReviewConfig = () => {
  try {
    const data =
      localStorage.getItem(
        REVIEW_CONFIG_KEY
      )

    return data
      ? JSON.parse(data)
      : null

  } catch {
    return null
  }
}


export const saveReviewConfig = (
  config
) => {
  localStorage.setItem(
    REVIEW_CONFIG_KEY,
    JSON.stringify(config)
  )
}


export const getReviewSession = () => {
  try {
    const data =
      localStorage.getItem(
        REVIEW_SESSION_KEY
      )

    return data
      ? JSON.parse(data)
      : null

  } catch {
    return null
  }
}


export const saveReviewSession = (
  session
) => {
  localStorage.setItem(
    REVIEW_SESSION_KEY,
    JSON.stringify(session)
  )
}


export const clearReviewSession = () => {
  localStorage.removeItem(
    REVIEW_SESSION_KEY
  )
}


export const getFlashcardProgress = () => {
  try {
    const data =
      localStorage.getItem(
        FLASHCARD_PROGRESS_KEY
      )

    return data
      ? JSON.parse(data)
      : null

  } catch {
    return null
  }
}


export const saveFlashcardProgress = (
  progress
) => {
  localStorage.setItem(
    FLASHCARD_PROGRESS_KEY,
    JSON.stringify(progress)
  )
}


export const clearFlashcardProgress =
  () => {

    localStorage.removeItem(
      FLASHCARD_PROGRESS_KEY
    )
  }