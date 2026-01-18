import { NavLink } from "react-router-dom"
function MenuItem({ to, label, icon: Icon, open }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        group flex items-center gap-3
        px-4 py-2 mx-2 rounded-lg
        transition
        ${
          isActive
            ? "bg-blue-100 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        }
        `
      }
    >
      <Icon size={20} className="shrink-0" />

      {open && (
        <span className="whitespace-nowrap text-sm font-medium">
          {label}
        </span>
      )}
    </NavLink>
  )
}

export default MenuItem