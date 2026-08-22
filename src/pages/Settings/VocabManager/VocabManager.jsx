import { useState } from "react"

import VocabImageManager from "./VocabImageManager"

export default function VocabManager() {
    const [activeView, setActiveView] = useState(null)

    if (activeView === "image") {
        return (
            <VocabImageManager
                onBack={() => setActiveView(null)}
            />
        )
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {/* HEADER */}

            <div>
                <h1 className="text-2xl font-bold">
                    Quản lý từ vựng
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Quản lý và cập nhật dữ liệu từ vựng
                </p>
            </div>

            {/* OPTIONS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                    onClick={() => setActiveView("image")}
                    className="
                        group
                        text-left
                        p-5
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        hover:border-blue-300
                        hover:shadow-md
                        transition
                    "
                >
                    <div
                        className="
                            w-12
                            h-12
                            rounded-xl
                            bg-blue-500
                            flex
                            items-center
                            justify-center
                            text-white
                            mb-4
                            group-hover:scale-105
                            transition
                        "
                    >
                        🖼️
                    </div>

                    <h2 className="font-bold text-lg">
                        Cập nhật hình ảnh
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Thêm hoặc cập nhật hình ảnh cho từ vựng.
                    </p>
                </button>
            </div>
        </div>
    )
}