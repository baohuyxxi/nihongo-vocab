export default function GrammarCRUD() {
    return (
        <div
            className="
                bg-white
                rounded-2xl
                border border-gray-200
                p-6
                space-y-4
            "
        >

            <h2 className="text-xl font-bold">
                Thêm công thức
            </h2>

            <input
                type="text"
                placeholder="Mẫu ngữ pháp"
                className="
                    w-full p-3
                    rounded-xl
                    border border-gray-200
                "
            />

            <input
                type="text"
                placeholder="Ý nghĩa"
                className="
                    w-full p-3
                    rounded-xl
                    border border-gray-200
                "
            />

            <input
                type="text"
                placeholder="JLPT (N5, N4...)"
                className="
                    w-full p-3
                    rounded-xl
                    border border-gray-200
                "
            />

            <button
                className="
                    px-5 py-3
                    rounded-xl
                    bg-blue-500
                    text-white
                    hover:bg-blue-600
                "
            >
                Lưu
            </button>

        </div>
    )
}