import { useState } from "react"
import MenuItem from "./MenuItem"
import { Home, Brain, BookOpen, Settings, Menu } from "lucide-react"

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded shadow"
      >
        <Menu size={20} />
      </button>

      {/* BACKDROP MOBILE */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          bg-white shadow-lg h-screen flex flex-col
          transition-all duration-300 ease-in-out

          /* Mobile overlay */
          fixed inset-y-0 left-0 z-50 w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0

          /* Desktop */
          lg:relative
          ${desktopOpen ? "lg:w-64" : "lg:w-16"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          {(desktopOpen || mobileOpen) && (
            <h1 className="font-bold text-lg tracking-wide">
              📘 Minna
            </h1>
          )}

          {/* TOGGLE */}
          <button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setDesktopOpen((o) => !o)
              } else {
                setMobileOpen(false)
              }
            }}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-2 space-y-1">
          <MenuItem to="/" label="Trang chủ" icon={Home} open={desktopOpen || mobileOpen} />
          <MenuItem to="/vocabulary" label="Ôn từ vựng" icon={Brain} open={desktopOpen || mobileOpen} />
          <MenuItem to="/vocab-table?lesson=1" label="Bảng từ vựng" icon={BookOpen} open={desktopOpen || mobileOpen} />
          <MenuItem to="/settings" label="Cài đặt" icon={Settings} open={desktopOpen || mobileOpen} />
        </nav>
      </aside>
    </>
  )
}
