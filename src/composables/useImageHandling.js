export function useImageHandling() {
  const getPlaceholderImage = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
  }

  const getImageUrl = (controller) => {
    if (controller.image) {
      return `/downloaded_images/${controller.image}`
    }
    return getPlaceholderImage()
  }

  const handleImageError = (event) => {
    event.target.src = getPlaceholderImage()
  }

  const formatConnectionName = (connection) => {
    return connection
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim()
  }

  return {
    getImageUrl,
    handleImageError,
    formatConnectionName
  }
}
