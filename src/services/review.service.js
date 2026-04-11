import api from "./api"

/**
 * Lấy vocab ôn tập theo cấu hình
 */
export const getReviewVocab = ({
  lessons = [],
  topics = [], // ✅ thêm
  mode,
  directions = [],
  limit = 30,
}) => {
  return api.get("/vocab/review", {
    params: {
      lessons: lessons.join(","),   // 1,2,3
      topics: topics.join(","),     // numbers,time
      mode,
      directions: directions.join(","),
      limit,
    },
  })
}