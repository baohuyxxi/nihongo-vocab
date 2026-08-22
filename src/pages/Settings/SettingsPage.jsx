import { useNavigate } from "react-router-dom"
import {
    BookOpen,
    Settings,
} from "lucide-react"

export default function SettingsPage() {
    const navigate = useNavigate()

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
            {options.map((option) => {
                const Icon = option.icon

                return (
                    <div
                        key={option.id}
                        className="
                            group
                            flex
                            items-center
                            gap-4
                            p-4
                            rounded-lg
                            bg-gradient-to-r
                            from-gray-100
                            to-gray-200
                            cursor-pointer
                            hover:from-gray-200
                            hover:to-gray-300
                            transition-all
                        "
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