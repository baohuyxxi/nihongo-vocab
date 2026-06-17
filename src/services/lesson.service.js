import api from "./api"

/**
 * Danh sách bài học
 */
export const getLessons = () => {
  return api.get("/lessons")
}

/**
 * Chi tiết 1 bài
 */
export const getLessonDetail = (lesson) => {
  return api.get(`/lessons/${lesson}`)
}


/**
 * 🚀 Lấy tất cả PHÓ TỪ
 */
export const getAllAdverbs = () => {
  return api.get("/lessons/adverbs/grouped")
}

export const getDuplicateHiragana = () => {
  return api.get("/lessons/duplicate-hiragana")
}

// export const getKanjiFrequency = () => {
//   return api.get("/lessons/kanji-frequency")
// } 

export const getKanjiFrequency =
    async ({
        page = 1,
        limit = 50,
    } = {}) => {

        const res =
            await api.get(
                "/lessons/kanji-frequency",
                {
                    params: {
                        page,
                        limit,
                    },
                }
            )

        return res
    }