import api from "./api"

/* =========================
   UPLOAD MEDIA
========================= */

export const uploadMedia = async (file, type = "image") => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const res = await api.post("/cloudinary/upload", formData)
    return res.data
}