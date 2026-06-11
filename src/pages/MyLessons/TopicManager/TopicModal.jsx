    import {
  useEffect,
  useState,
} from "react"

import {
  X,
} from "lucide-react"

export default function TopicModal({
  open,
  onClose,
  onSave,
  topic,
}) {

  const [form, setForm]
    = useState({
      name: "",
      description: "",
      image: "",
      color: "#3B82F6",
    })

  useEffect(() => {

    if (topic) {

      setForm(topic)

    } else {

      setForm({
        name: "",
        description: "",
        image: "",
        color: "#3B82F6",
      })

    }

  }, [topic])

  if (!open) return null

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    })

  }

  return (

    <div
      className="
        fixed inset-0
        z-50
        bg-black/40
        backdrop-blur-sm
        flex items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-lg
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            flex items-center
            justify-between
            px-5 py-4
            border-b
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-gray-800
              "
            >
              {
                topic
                  ? "Chỉnh sửa chủ đề"
                  : "Tạo chủ đề"
              }
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Quản lý nhóm học tập
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-xl
              hover:bg-gray-100
              flex items-center
              justify-center
              transition
            "
          >

            <X size={18} />

          </button>

        </div>

        {/* BODY */}

        <div
          className="
            p-5
            space-y-5
          "
        >

          {/* NAME */}

          <div className="space-y-2">

            <label
              className="
                text-sm
                font-medium
                text-gray-700
              "
            >
              Tên chủ đề
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ví dụ: Động vật"
              className="
                w-full
                h-11
                rounded-xl
                border border-gray-200
                px-4
                outline-none
                focus:ring-2
                focus:ring-blue-200
              "
            />

          </div>

          {/* DESC */}

          <div className="space-y-2">

            <label
              className="
                text-sm
                font-medium
                text-gray-700
              "
            >
              Mô tả
            </label>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={handleChange}
              placeholder="Mô tả chủ đề..."
              rows={4}
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                outline-none
                resize-none
                focus:ring-2
                focus:ring-blue-200
              "
            />

          </div>

          {/* IMAGE */}

          <div className="space-y-2">

            <label
              className="
                text-sm
                font-medium
                text-gray-700
              "
            >
              Ảnh
            </label>

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="
                w-full
                h-11
                rounded-xl
                border border-gray-200
                px-4
                outline-none
                focus:ring-2
                focus:ring-blue-200
              "
            />

          </div>

          {/* COLOR */}

          <div className="space-y-2">

            <label
              className="
                text-sm
                font-medium
                text-gray-700
              "
            >
              Màu chủ đề
            </label>

            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="
                w-20 h-12
                rounded-xl
                border border-gray-200
                cursor-pointer
              "
            />

          </div>

        </div>

        {/* FOOTER */}

        <div
          className="
            flex items-center
            justify-end
            gap-3
            px-5 py-4
            border-t
            bg-gray-50
          "
        >

          <button
            onClick={onClose}
            className="
              h-11
              px-5
              rounded-xl
              border border-gray-200
              hover:bg-gray-100
              transition
            "
          >
            Hủy
          </button>

          <button
            onClick={() =>
              onSave(form)
            }
            className="
              h-11
              px-5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              transition
            "
          >
            Lưu chủ đề
          </button>

        </div>

      </div>

    </div>

  )

}