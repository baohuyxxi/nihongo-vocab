import { useEffect } from "react"

export default function useFlashcardKeyboard({
    next,
    prev,
    flip,
    markKnown,
    markUnknown,
    speak,
    currentJP,
}) {
    useEffect(() => {
        const handleKey = (e) => {
            switch (e.key) {
                case "ArrowRight":
                    next()
                    break
                case "ArrowLeft":
                    prev()
                    break
                case " ":
                case "ArrowUp":
                    e.preventDefault()
                    flip()
                    break
                case "ArrowDown":
                    e.preventDefault()
                    flip()
                    break
                case "1":
                    markUnknown()
                    break
                case "2":
                    markKnown()
                    break
                case "3": 
                    if (currentJP) {
                        speak(currentJP)
                    }
                    break
                default:
                    break
            }
        }

        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [next, prev, flip, markKnown, markUnknown, speak, currentJP,])
}