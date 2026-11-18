import { useNavigate } from "react-router-dom"
import {
    BookOpen,
    Monitor,
    Moon,
    Sun,
} from "lucide-react"
import { useTheme } from "../../hooks/useTheme"

export default function SettingsPage() {
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()

    const themeOptions = [
        { id: "light", label: "Sáng", description: "Giao diện sáng", icon: Sun },
        { id: "dark", label: "Tối", description: "Giao diện tối", icon: Moon },
        { id: "system", label: "Hệ thống", description: "Theo thiết bị", icon: Monitor },
    ]

    const options = [
        {
            id: "vocabulary",
            title: "Từ vựng",
            desc: "Quản lý từ vựng",
            icon: BookOpen,
            color: "from-blue-500 to-blue-600",
        },
    ]

    return (
        <div className="flex flex-col gap-4">
            <section className="theme-panel rounded-xl p-4 sm:p-5" aria-labelledby="theme-heading">
                <div className="mb-4">
                    <h2 id="theme-heading" className="text-base sm:text-lg font-bold">
                        Giao diện
                    </h2>
                    <p className="theme-muted mt-1 text-sm">
                        Chọn giao diện sáng, tối hoặc theo thiết bị.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {themeOptions.map((option) => {
                        const Icon = option.icon
                        const selected = theme === option.id

                        return (
                            <button
                                key={option.id}
                                type="button"
                                className="theme-selector-option flex min-h-16 items-center gap-3 rounded-lg p-3 text-left"
                                aria-pressed={selected}
                                onClick={() => setTheme(option.id)}
                            >
                                <Icon size={20} aria-hidden="true" />
                                <span className="min-w-0 flex-1">
                                    <span className="block font-semibold">{option.label}</span>
                                    <span className="theme-muted block text-xs">{option.description}</span>
                                </span>
                                {selected && (
                                    <span className="text-xs font-semibold" aria-label="Đang chọn">
                                        Đang dùng
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </section>

            {options.map((option) => {
                const Icon = option.icon

                return (
                    <div
                        key={option.id}
                        className="theme-panel group flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-all hover:bg-gray-50"
                        onClick={() =>
                            navigate(`/settings/${option.id}`)
                        }
                    >
                        {/* ICON */}
                        <div
                            className={`
                                w-12 h-12
                                sm:w-14 sm:h-14
                                shrink-0
                                rounded-xl
                                bg-gradient-to-r
                                ${option.color}
                                flex
                                items-center
                                justify-center
                                text-white
                                group-hover:scale-110
                                transition
                            `}
                        >
                            <Icon size={22} />
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800">
                                {option.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {option.desc}
                            </p>

                            <div className="mt-2 text-xs sm:text-sm font-medium text-blue-500 group-hover:underline">
                                Quản lý →
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}