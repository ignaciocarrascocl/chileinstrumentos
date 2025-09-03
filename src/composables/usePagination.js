export function usePagination(currentPage, totalPages) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Calculate visible page range
    for (let i = Math.max(2, currentPage.value - delta);
         i <= Math.min(totalPages.value - 1, currentPage.value + delta);
         i++) {
      range.push(i)
    }

    // Add first page and ellipsis if needed
    if (currentPage.value - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    // Add last page and ellipsis if needed
    if (currentPage.value + delta < totalPages.value - 1) {
      rangeWithDots.push('...', totalPages.value)
    } else {
      if (totalPages.value > 1) {
        rangeWithDots.push(totalPages.value)
      }
    }

    // Remove duplicates while preserving ellipsis
    return rangeWithDots.filter((page, index, array) =>
      array.indexOf(page) === index && page !== '...' || page === '...'
    )
  }

  return {
    getVisiblePages
  }
}
