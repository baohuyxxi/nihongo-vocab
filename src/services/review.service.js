import api from "./api"

/**
 * Lấy vocab ôn tập theo cấu hình
 */
export const getReviewVocab = ({
  lessons,
  mode,
  directions,
  limit = 30,
}) => {
  return api.get("/vocab/review", {
    params: {
      lessons: lessons.join(","),
      mode,
      directions: directions.join(","),
      limit,
    },
  })
}
