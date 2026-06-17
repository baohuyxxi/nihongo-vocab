export default function Pagination({
    page,
    totalPages,
    setPage,
}) {

    if (totalPages <= 1)
        return null

    return (
        <div className="
            flex justify-center
            gap-2
            flex-wrap
        ">

            <button
                disabled={page === 1}
                onClick={() =>
                    setPage(
                        p => p - 1
                    )
                }
                className="
                    px-3 py-2
                    border rounded-lg
                "
            >
                ←
            </button>

            <span
                className="
                    px-4 py-2
                    text-sm
                "
            >
                {page}
                /
                {totalPages}
            </span>

            <button
                disabled={
                    page === totalPages
                }
                onClick={() =>
                    setPage(
                        p => p + 1
                    )
                }
                className="
                    px-3 py-2
                    border rounded-lg
                "
            >
                →
            </button>

        </div>
    )
}