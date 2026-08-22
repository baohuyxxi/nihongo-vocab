import { useEffect, useState } from "react"
import {
    Image,
    Link,
    Save,
    SkipForward,
    Loader2,
    CheckCircle2,
} from "lucide-react"

import ImageUpload from "../../../components/ImageUpload"

import {
    getVocabWithoutImage,
    bulkSaveVocab,
} from "../../../services/vocab.service"


export default function VocabImageManager({ onBack }) {

    const [vocab, setVocab] = useState(null)

    const [imageUrl, setImageUrl] = useState("")

    const [remaining, setRemaining] = useState(0)

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)


    // =========================
    // GET RANDOM VOCAB
    // =========================

    const fetchNextVocab = async () => {

        try {

            setLoading(true)

            setVocab(null)
            setImageUrl("")

            const res =
                await getVocabWithoutImage()

            setVocab(res.data)

            setRemaining(
                res.remaining ?? 0
            )

        } catch (error) {

            console.error(
                "GET VOCAB WITHOUT IMAGE:",
                error
            )

            setVocab(null)

            setRemaining(0)

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {

        fetchNextVocab()

    }, [])


    // =========================
    // SAVE
    // =========================

    const handleSave = async () => {

        if (!vocab) return


        if (!imageUrl.trim()) {

            alert("Vui lòng thêm ảnh")

            return
        }


        try {

            setSaving(true)


            const data = [
                {
                    ...vocab,
                    image: imageUrl.trim(),
                },
            ]


            await bulkSaveVocab(data)


            // Lấy từ ngẫu nhiên tiếp theo
            await fetchNextVocab()


        } catch (error) {

            console.error(
                "SAVE VOCAB IMAGE:",
                error
            )

            alert(
                error?.response?.data?.message ||
                "Không thể cập nhật ảnh"
            )

        } finally {

            setSaving(false)

        }
    }


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div
                className="
                    w-full
                    h-[calc(100vh-120px)]
                    min-h-[400px]
                    flex
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-3
                        text-gray-500
                    "
                >

                    <Loader2
                        size={32}
                        className="
                            animate-spin
                            text-blue-500
                        "
                    />

                    <span>
                        Đang tìm từ chưa có ảnh...
                    </span>

                </div>

            </div>
        )
    }


    // =========================
    // DONE
    // =========================

    if (!vocab) {

        return (
            <div
                className="
                    w-full
                    h-[calc(100vh-120px)]
                    min-h-[400px]
                    flex
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-3
                        text-center
                        px-6
                    "
                >

                    <CheckCircle2
                        size={52}
                        className="text-green-500"
                    />


                    <h2
                        className="
                            text-xl
                            font-bold
                            text-gray-800
                        "
                    >
                        Hoàn thành!
                    </h2>


                    <p
                        className="
                            text-sm
                            text-gray-500
                        "
                    >
                        Không còn danh từ nào chưa có ảnh.
                    </p>


                    <button
                        type="button"
                        onClick={fetchNextVocab}
                        className="
                            mt-2
                            px-4
                            py-2
                            rounded-lg
                            bg-blue-500
                            text-white
                            hover:bg-blue-600
                            transition
                        "
                    >
                        Kiểm tra lại
                    </button>


                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                text-gray-500
                                hover:bg-gray-100
                                transition
                            "
                        >
                            Quay lại
                        </button>
                    )}

                </div>

            </div>
        )
    }


    // =========================
    // JAPANESE
    // =========================

    const japanese =
        vocab.kanji ||
        vocab.hiragana ||
        vocab.katakana ||
        ""


    return (

        <div
            className="
                w-full
                h-[calc(100vh-120px)]
                min-h-[600px]
                flex
                flex-col
            "
        >

            {/* =========================
                HEADER
            ========================= */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    mb-4
                    shrink-0
                "
            >

                {/* BACK */}

                <button
                    type="button"
                    onClick={onBack}
                    disabled={saving}
                    title="Quay lại"
                    className="
                        shrink-0
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        text-gray-500
                        hover:text-gray-800
                        hover:bg-gray-50
                        hover:border-gray-300
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >

                    <span
                        className="
                            text-xl
                            leading-none
                        "
                    >
                        ←
                    </span>

                </button>


                {/* TITLE */}

                <div
                    className="
                        flex-1
                        min-w-0
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <Image
                            size={22}
                            className="
                                text-blue-500
                                shrink-0
                            "
                        />

                        <h1
                            className="
                                text-lg
                                sm:text-2xl
                                font-bold
                                truncate
                            "
                        >
                            Cập nhật ảnh từ vựng
                        </h1>

                    </div>


                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-2
                            gap-y-1
                            mt-0.5
                        "
                    >

                        <p
                            className="
                                text-xs
                                sm:text-sm
                                text-gray-500
                            "
                        >
                            Ưu tiên cập nhật ảnh cho danh từ
                        </p>


                        {/* REMAINING */}

                        <span
                            className="
                                text-xs
                                text-blue-600
                                font-medium
                            "
                        >
                            • Còn {remaining} từ
                        </span>

                    </div>

                </div>


                {/* CURRENT TOPIC */}

                {vocab.topic && (
                    <span
                        className="
                            hidden
                            sm:block
                            shrink-0
                            px-3
                            py-1.5
                            rounded-full
                            bg-blue-50
                            text-blue-600
                            text-xs
                            font-medium
                        "
                    >
                        {vocab.topic}
                    </span>
                )}

            </div>


            {/* =========================
                MAIN WORKSPACE
            ========================= */}

            <div
                className="
                    flex-1
                    min-h-0
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                "
            >

                <div
                    className="
                        h-full
                        grid
                        grid-cols-1
                        lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]
                    "
                >

                    {/* =====================
                        LEFT
                    ===================== */}

                    <div
                        className="
                            min-h-0
                            p-4
                            sm:p-5
                            lg:p-6
                            flex
                            flex-col
                            border-b
                            lg:border-b-0
                            lg:border-r
                            border-gray-200
                        "
                    >

                        {/* VOCAB INFO */}

                        <div
                            className="
                                shrink-0
                                flex
                                flex-col
                                items-center
                                text-center
                                mb-4
                            "
                        >

                            {/* MOBILE TOPIC */}

                            {vocab.topic && (
                                <span
                                    className="
                                        sm:hidden
                                        px-3
                                        py-1
                                        rounded-full
                                        bg-blue-50
                                        text-blue-600
                                        text-xs
                                        font-medium
                                        mb-3
                                    "
                                >
                                    {vocab.topic}
                                </span>
                            )}


                            {/* JAPANESE */}

                            <div
                                className="
                                    text-3xl
                                    sm:text-4xl
                                    font-bold
                                    text-gray-800
                                "
                            >
                                {japanese}
                            </div>


                            {/* HIRAGANA */}

                            {vocab.hiragana &&
                                vocab.hiragana !== japanese && (
                                    <div
                                        className="
                                            text-base
                                            sm:text-lg
                                            text-gray-500
                                            mt-1
                                        "
                                    >
                                        {vocab.hiragana}
                                    </div>
                                )}


                            {/* MEANING */}

                            <div
                                className="
                                    text-base
                                    sm:text-lg
                                    text-gray-700
                                    mt-2
                                "
                            >
                                {vocab.meaning}
                            </div>


                            {/* PART OF SPEECH */}

                            <span
                                className="
                                    mt-2
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-gray-100
                                    text-gray-500
                                    text-xs
                                "
                            >
                                Danh từ
                            </span>

                        </div>


                        {/* IMAGE */}

                        <div
                            className="
                                flex-1
                                min-h-0
                            "
                        >

                            <ImageUpload
                                value={imageUrl}
                                onChange={setImageUrl}
                            />

                        </div>

                    </div>


                    {/* =====================
                        RIGHT
                    ===================== */}

                    <div
                        className="
                            min-h-0
                            p-4
                            sm:p-5
                            lg:p-6
                            flex
                            flex-col
                            gap-5
                        "
                    >

                        {/* TITLE */}

                        <div>

                            <h2
                                className="
                                    text-base
                                    font-semibold
                                "
                            >
                                Chọn ảnh
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Upload ảnh hoặc nhập URL.
                            </p>

                        </div>


                        {/* URL */}

                        <div>

                            <label
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >

                                <Link size={16} />

                                Link ảnh

                            </label>


                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) =>
                                    setImageUrl(
                                        e.target.value
                                    )
                                }
                                placeholder="
                                    https://example.com/image.jpg
                                "
                                className="
                                    w-full
                                    px-3
                                    py-2.5
                                    rounded-lg
                                    border
                                    border-gray-300
                                    outline-none
                                    text-sm
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </div>


                        {/* IMAGE STATUS */}

                        <div
                            className="
                                p-4
                                rounded-xl
                                bg-gray-50
                                border
                                border-gray-100
                            "
                        >

                            <div
                                className="
                                    text-xs
                                    text-gray-500
                                    mb-1
                                "
                            >
                                Ảnh hiện tại
                            </div>


                            <div
                                className="
                                    text-sm
                                    font-medium
                                    break-all
                                "
                            >
                                {imageUrl
                                    ? "Đã chọn ảnh"
                                    : "Chưa có ảnh"}
                            </div>

                        </div>


                        {/* REMAINING INFO */}

                        <div
                            className="
                                px-4
                                py-3
                                rounded-xl
                                bg-blue-50
                                border
                                border-blue-100
                            "
                        >

                            <div
                                className="
                                    text-xs
                                    text-blue-500
                                "
                            >
                                Tiến độ
                            </div>


                            <div
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-700
                                    mt-0.5
                                "
                            >
                                Còn {remaining} danh từ chưa có ảnh
                            </div>

                        </div>


                        {/* SPACER */}

                        <div className="flex-1" />


                        {/* ACTIONS */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                            "
                        >

                            {/* SAVE */}

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={
                                    saving ||
                                    !imageUrl.trim()
                                }
                                className="
                                    w-full
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-4
                                    py-3
                                    rounded-xl
                                    bg-blue-500
                                    text-white
                                    font-medium
                                    hover:bg-blue-600
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                {saving ? (
                                    <Loader2
                                        size={19}
                                        className="
                                            animate-spin
                                        "
                                    />
                                ) : (
                                    <Save size={19} />
                                )}


                                {saving
                                    ? "Đang lưu..."
                                    : "Lưu và chuyển từ tiếp theo"}

                            </button>


                            {/* SKIP */}

                            <button
                                type="button"
                                onClick={fetchNextVocab}
                                disabled={saving}
                                className="
                                    w-full
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-gray-300
                                    text-gray-700
                                    hover:bg-gray-50
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                <SkipForward size={18} />

                                Bỏ qua

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}