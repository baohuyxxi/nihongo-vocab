import api from "./api"

/**
 * Lấy tất cả từ vựng
 */
export const getAllVocab = () => {
  return api.get("/vocab")
}


/**
 * Lấy random vocab để ôn
 */
export const getRandomVocab = (lessons, limit = 20) => {
  return api.get("/vocab/review", {
    params: {
      lessons: lessons.join(","),
      limit,
    },
  })
}




export const getReviewSession = (params) => {
  return api.get("/vocab/review-session", { params })
}


export const getVocabByLesson = (lesson) => {
  return api.get(`/vocab/lesson/${lesson}`);

}

export const bulkSaveVocab = (data) => {
  return api.put("/vocab/bulk/save", data);
}

export const bulkCreateVocab = (data) => {
  return api.post("/vocab/bulk/create", data);
}