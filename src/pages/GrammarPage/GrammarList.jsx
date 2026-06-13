import { useState } from "react"
import GrammarDetail from "./GrammarDetail"
import GrammarStructure from "./GrammarStructure"

export default function GrammarList({ grammars, loading }) {
    const [selected, setSelected] = useState(null)

    if (loading) {
        return (
            <div className="py-10 text-center font-medium text-gray-600">
                Đang tải dữ liệu...
            </div>
        )
    }

    if (!grammars?.length) {
        return (
            <div className="py-10 text-center text-gray-500 border border-dashed rounded-2xl bg-gray-50">
                Không tìm thấy cấu trúc ngữ pháp nào.
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {grammars.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => setSelected(item)}
                        className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 space-y-3"
                    >
                        {/* HEADER BADGES */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                                Bài {item.lesson}
                            </span>
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                                #{item.order}
                            </span>
                            <span className="text-xs font-semibold bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full">
                                {item.level}
                            </span>
                        </div>

                        {/* KEY & MEANING */}
                        <div>
                            <div className="text-lg font-bold text-gray-900 font-sans">
                                {item.key}
                            </div>
                            <div className="text-blue-600 text-sm font-medium mt-0.5">
                                {item.meaning}
                            </div>
                        </div>

                        {/* STRUCTURE PREVIEW (Hiển thị đồ thị trực quan ngay tại danh sách) */}
                        {!!item.structure?.length && (
                            <div 
                                className="pointer-events-none transform scale-[0.95] origin-left -my-2"
                                onClick={(e) => e.stopPropagation()} // Đề phòng lỗi nổi bọt sự kiện
                            >
                                <GrammarStructure structure={item.structure} />
                            </div>
                        )}

                        {/* EXAMPLE PREVIEW */}
                        {item.examples?.[0] && (
                            <div className="text-xs text-gray-500 border-t pt-2 mt-1 truncate font-sans italic">
                                <span className="font-medium text-gray-400 not-italic mr-1">Ví dụ:</span>
                                {item.examples[0].jp}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* MODAL XEM CHI TIẾT */}
            <GrammarDetail
                grammar={selected}
                onClose={() => setSelected(null)}
            />
        </>
    )
}