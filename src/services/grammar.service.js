import api from "./api"

/* =========================
   GRAMMAR API
========================= */

/**
 * GET ALL + FILTER BY LESSON
 * GET /grammar?lesson=1
 */
export const getAllGrammar = (lesson) => {
    const params = new URLSearchParams()

    if (lesson) {
        params.append("lesson", lesson)
    }

    const query = params.toString()

    return api.get(
        query ? `/grammar?${query}` : "/grammar"
    )
}

export const getGrammarByLesson = (lesson) => {
    return api.get(`/grammar/lesson/${lesson}`)
}

/**
 * GET DETAIL BY ID
 * GET /grammar/:id
 */
export const getGrammarDetail = (id) => {
    return api.get(`/grammar/${id}`)
}

/**
 * CREATE
 */
export const createGrammar = (data) => {
    return api.post("/grammar", data)
}

/**
 * UPDATE
 */
export const updateGrammar = (id, data) => {
    return api.put(`/grammar/${id}`, data)
}

/**
 * DELETE
 */
export const deleteGrammar = (id) => {
    return api.delete(`/grammar/${id}`)
}

/**
 * BULK SAVE
 */
export const bulkSaveGrammar = (data) => {
    return api.post("/grammar/bulk-save", data)
}