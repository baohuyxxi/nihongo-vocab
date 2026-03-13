import { useEffect, useState } from "react"
import { ImagePlus } from "lucide-react"
import { uploadMedia } from "../services/upload.service"

export default function ImageUpload({ value, onChange }) {

  const [preview, setPreview] = useState(value || "")

  useEffect(() => {
    setPreview(value || "")
  }, [value])

  const handleFile = async (e) => {

    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreview(url)

    const res = await uploadMedia(file)

    onChange(res.url)
  }

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center bg-white rounded-2xl shadow overflow-hidden">

      <label className="relative cursor-pointer group w-full h-full flex items-center justify-center">

        {preview ? (
          <>
            <img
              src={preview}
              className="max-h-full object-contain group-hover:opacity-70 transition"
            />

            <div
              className="
              absolute inset-0
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition
            "
            >
              <ImagePlus size={32} className="text-white drop-shadow" />
            </div>
          </>
        ) : (
          <div
            className="
            flex flex-col items-center justify-center
            text-gray-400 gap-2
          "
          >
            <ImagePlus size={40} />
            <span>Thêm ảnh</span>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

      </label>

    </div>
  )
}