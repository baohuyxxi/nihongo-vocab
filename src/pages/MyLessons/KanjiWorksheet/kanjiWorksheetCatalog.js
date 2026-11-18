import { getKanjiFrequency } from "../../../services/lesson.service"
import { getKanjiCharacter } from "../../../utils/kanjiWorksheet"

const PAGE_LIMIT = 100
const CONCURRENT_REQUESTS = 4

function getPageItems(response, page) {
  if (!Array.isArray(response?.data)) {
    throw new Error(`Dữ liệu Kanji từ trang ${page} không đúng định dạng.`)
  }
  return response.data
}

export async function fetchKanjiWorksheetCatalog() {
  const firstPage = await getKanjiFrequency({ page: 1, limit: PAGE_LIMIT })
  const totalPages = Number(firstPage?.totalPages)

  const catalog = getPageItems(firstPage, 1)
  const totalItems = firstPage?.total == null
    ? Number.NaN
    : Number(firstPage.total)
  const pageCount = Number.isInteger(totalPages) && totalPages > 0
    ? totalPages
    : Number.isFinite(totalItems) && totalItems >= 0
      ? Math.max(1, Math.ceil(totalItems / PAGE_LIMIT))
      : catalog.length < PAGE_LIMIT
        ? 1
        : null
  if (pageCount === null) {
    throw new Error("API Kanji không trả về thông tin phân trang hợp lệ.")
  }
  const failedPages = []

  for (let startPage = 2; startPage <= pageCount; startPage += CONCURRENT_REQUESTS) {
    const pageNumbers = Array.from(
      { length: Math.min(CONCURRENT_REQUESTS, pageCount - startPage + 1) },
      (_, index) => startPage + index,
    )
    const responses = await Promise.allSettled(
      pageNumbers.map((page) => getKanjiFrequency({ page, limit: PAGE_LIMIT })),
    )

    responses.forEach((result, index) => {
      const page = pageNumbers[index]
      if (result.status === "rejected") {
        failedPages.push(page)
        return
      }
      try {
        catalog.push(...getPageItems(result.value, page))
      } catch {
        failedPages.push(page)
      }
    })
  }

  const byCharacter = new Map()
  catalog.forEach((record) => {
    const kanji = getKanjiCharacter(record)
    if (kanji && !byCharacter.has(kanji)) {
      byCharacter.set(kanji, record)
    }
  })

  if (failedPages.length) {
    const error = new Error(
      `Không tải được dữ liệu Kanji ở ${failedPages.length} trang. Một số kết quả tìm kiếm có thể chưa đầy đủ.`,
    )
    error.partialCatalog = [...byCharacter.values()]
    throw error
  }

  return [...byCharacter.values()]
}
