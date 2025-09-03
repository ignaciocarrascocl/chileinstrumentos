export function useProductFormatting() {
  const getImageUrl = (product) => {
    if (product.image) {
      return `/downloaded_images/${product.image}`
    }

    if (product['parsed image']) {
      return product['parsed image']
    }

    // Fallback placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
  }

  const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
  }

  const formatDimensions = (dimensions) => {
    if (!dimensions || dimensions === 'NA') return 'No especificado'

    const parts = dimensions.split(';')
    if (parts.length === 3) {
      return `${parts[0]} × ${parts[1]} × ${parts[2]}`
    }
    return dimensions
  }

  return {
    getImageUrl,
    handleImageError,
    formatDimensions
  }
}
