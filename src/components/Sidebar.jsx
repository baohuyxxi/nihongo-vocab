import { NavLink } from "react-router-dom"
import MenuItem from "./MenuItem"
import { useState } from "react"
import {
  Home,
  Brain,
  BookOpen,
  Settings,
  Menu,
} from "lucide-react"

export default function Sidebar() {
  const [open, setOpen] = useState(false) // 👈 mặc định đóng

  return (
    <aside
      className={`
        bg-white shadow-lg h-screen
        transition-all duration-300
        ${open ? "w-64" : "w-16"}
        flex flex-col
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        {open && (
          <h1 className="font-bold text-lg tracking-wide">
            📘 Minna
          </h1>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 mt-2 space-y-1">
        <MenuItem
          to="/"
          label="Trang chủ"
          icon={Home}
          open={open}
        />
        <MenuItem
          to="/vocabulary"
          label="Ôn từ vựng"
          icon={Brain}
          open={open}
        />
        <MenuItem
          to="/vocab-table?lesson=1"
          label="Bảng từ vựng"
          icon={BookOpen}
          open={open}
        />
        <MenuItem
          to="/settings"
          label="Cài đặt"
          icon={Settings}
          open={open}
        />
      </nav>
    </aside>
  )
}
