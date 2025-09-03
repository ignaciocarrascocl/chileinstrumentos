import { ref } from 'vue'

export function useFilters(searchQuery, setAdvancedFilters) {
  const advancedFilters = ref({
    manufacturers: [],
    keyCounts: [],
    keyTypes: [],
    padCounts: [],
    yearRange: { min: null, max: null },
    priceRange: { min: null, max: null },
    quickFilters: []
  })

  const formatRangeFilter = (range) => {
    return range ? {
      min: range[0],
      max: range[1]
    } : { min: null, max: null }
  }

  const handleSearch = (query) => {
    searchQuery.value = query
  }

  const handleFiltersChanged = (filters) => {
    const formattedFilters = {
      ...filters,
      yearRange: formatRangeFilter(filters.yearRange),
      priceRange: formatRangeFilter(filters.priceRange)
    }

    advancedFilters.value = formattedFilters
    setAdvancedFilters(formattedFilters)
  }

  const resetFilters = () => {
    advancedFilters.value = {
      manufacturers: [],
      keyCounts: [],
      keyTypes: [],
      padCounts: [],
      yearRange: { min: null, max: null },
      priceRange: { min: null, max: null },
      quickFilters: []
    }
    searchQuery.value = ''
    setAdvancedFilters(advancedFilters.value)
  }

  return {
    advancedFilters,
    handleSearch,
    handleFiltersChanged,
    resetFilters
  }
}
