import { Link } from "react-router-dom";
import RomajiInput from "../components/RomajiInput";

function Home() {
  return (
    <div className="flex gap-6">
      {/* Nội dung trái */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">
          BÀI 01 – はじめまして
        </h2>

        <p className="text-gray-600 mb-4">
          Giới thiệu các mẫu câu cơ bản trong giao tiếp hằng ngày...
        </p>

        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-6">
          Bật/Tắt phiên âm Hán tự
        </button>

        {/* Các phần */}
        <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded shadow">
          {[
            "Từ vựng",
            "Ngữ pháp",
            "Luyện đọc",
            "Hội thoại",
            "Luyện nghe",
            "Bài tập",
            "Hán tự",
            "Kanji Renshu",
            "Đọc hiểu",
            "Kiểm tra",
            "Tham khảo",
          ].map((item, index) => (
            <div
              key={index}
              className="border rounded p-3 text-center hover:bg-gray-100 cursor-pointer"
            >
              <div className="text-sm font-medium">Phần {index + 1}</div>
              <div className="text-xs text-gray-500">{item}</div>
            </div>
          ))}
        </div>
        <RomajiInput />
      </div>

      {/* Sidebar phải */}
      <div className="w-64 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">50 bài Minna no Nihongo</h3>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 50 }, (_, i) => i + 1).map((lesson) => (
            <Link
              key={lesson}
              to={`/lesson/${lesson}`}
              className="bg-teal-600 text-white text-sm py-1 rounded text-center hover:bg-teal-700"
            >
              {lesson}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
