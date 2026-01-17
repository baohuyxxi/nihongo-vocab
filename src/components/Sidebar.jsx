import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function Sidebar() {
  const [open, setOpen] = useState(true)

  return (
    <div
      className={`bg-white shadow-md h-screen transition-all duration-300
        ${open ? "w-64" : "w-16"}`}
    >
      {/* Toggle */}
      <div className="flex items-center justify-between p-4">
        {open && <h1 className="font-bold text-lg">Minna</h1>}
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-600 hover:text-black"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-1">
        <MenuItem to="/" label="Trang chủ" icon="🏠" open={open} />
        <MenuItem to="/vocabulary" label="Ôn từ vựng" icon="🧠" open={open} />
        <MenuItem
          to="/vocab-table?lesson=1"
          label="Bảng từ vựng"
          icon="📘"
          open={open}
        />
        <MenuItem to="/settings" label="Cài đặt" icon="⚙️" open={open} />
      </nav>
    </div>
  )
}

function MenuItem({ to, label, icon, open }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 text-sm transition
         ${
           isActive
             ? "bg-blue-100 text-blue-600 font-medium"
             : "text-gray-700"
         }
         hover:bg-blue-50`
      }
    >
      <span className="text-lg">{icon}</span>
      {open && <span>{label}</span>}
    </NavLink>
  )
}
