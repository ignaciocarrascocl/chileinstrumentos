import { supabase } from '@/lib/supabase'

/**
 * Products service for interacting with Supabase database
 */
export class ProductsService {
  
  /**
   * Fetch all products from the database
   * @returns {Promise<Array>} Array of products
   */
  static async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products_atabase2')
        .select('*')
      
      if (error) {
        throw error
      }
      
      // Transform the data to match the expected format
      const transformedData = (data || []).map(item => this.transformProduct(item))
      
      console.log(`Fetched ${transformedData.length} products from Supabase`)
      return transformedData
    } catch (error) {
      console.error('Error fetching products:', error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }
  }

  /**
   * Transform product data to match expected format
   * @param {Object} product - Raw product from database
   * @returns {Object} Transformed product
   */
  static transformProduct(product) {
    const transformed = { ...product }
    
    // Handle price - it's stored as text, but might need formatting
    if (product['Street Price-0']) {
      // If it's a number string without $, add $ and proper formatting
      const priceStr = String(product['Street Price-0'])
      if (/^\d+$/.test(priceStr)) {
        // It's just a number (cents), convert to dollar format
        const priceInDollars = parseInt(priceStr) / 100
        transformed['Street Price-0'] = `$${priceInDollars.toFixed(2)}`
      } else if (!priceStr.startsWith('$') && /^\d+\.\d+$/.test(priceStr)) {
        // It's a decimal number, add $ sign
        transformed['Street Price-0'] = `$${priceStr}`
      }
      // Otherwise keep as is (already formatted)
    }
    
    // Ensure array fields are properly handled
    const arrayFields = ['controls', 'connectivity', 'power']
    arrayFields.forEach(field => {
      if (product[field]) {
        if (typeof product[field] === 'string') {
          try {
            transformed[field] = JSON.parse(product[field])
          } catch {
            console.warn(`Failed to parse ${field} for product ${product.Model}:`, product[field])
            transformed[field] = []
          }
        } else if (Array.isArray(product[field])) {
          transformed[field] = product[field]
        } else {
          transformed[field] = []
        }
      } else {
        transformed[field] = []
      }
    })
    
    // Handle dimensions_inches (jsonb field)
    if (product.dimensions_inches) {
      if (typeof product.dimensions_inches === 'object') {
        // If it's an array, join with semicolons
        if (Array.isArray(product.dimensions_inches)) {
          transformed.dimensions_inches = product.dimensions_inches.join(';')
        } else if (typeof product.dimensions_inches === 'string') {
          // Already a string, keep as is
          transformed.dimensions_inches = product.dimensions_inches
        } else {
          // Convert object to string representation
          transformed.dimensions_inches = JSON.stringify(product.dimensions_inches)
        }
      }
    }
    
    // Handle numeric fields properly
    if (product.Year !== null && product.Year !== undefined) {
      transformed.Year = typeof product.Year === 'string' ? parseInt(product.Year) : product.Year
    }
    
    if (product.keys_count !== null && product.keys_count !== undefined) {
      transformed.keys_count = typeof product.keys_count === 'string' ? parseInt(product.keys_count) : product.keys_count
    }
    
    // pads_count is text in schema, but app expects number
    if (product.pads_count !== null && product.pads_count !== undefined && product.pads_count !== 'NA') {
      if (typeof product.pads_count === 'string') {
        const parsed = parseInt(product.pads_count)
        transformed.pads_count = isNaN(parsed) ? 0 : parsed
      }
    }
    
    return transformed
  }

  /**
   * Fetch a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Product object or null if not found
   */
  static async getProductById(id) {
    try {
      // First try to find by ID field
      let { data, error } = await supabase
        .from('products_atabase2')
        .select('*')
        .eq('ID', id)
        .single()
      
      if (error && error.code === 'PGRST116') {
        // If not found by ID, try searching by image field (for backward compatibility)
        const result = await supabase
          .from('products_atabase2')
          .select('*')
          .eq('image', id)
          .single()
        
        data = result.data
        error = result.error
      }
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null
        }
        throw error
      }
      
      return data ? this.transformProduct(data) : null
    } catch (error) {
      console.error('Error fetching product by ID:', error)
      throw new Error(`Failed to fetch product: ${error.message}`)
    }
  }

  /**
   * Search products by various fields
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Filtered products
   */
  static async searchProducts(filters = {}) {
    try {
      let query = supabase.from('products_atabase2').select('*')
      
      // Text search across multiple fields
      if (filters.searchQuery) {
        const searchTerm = `%${filters.searchQuery}%`
        query = query.or(`Model.ilike.${searchTerm},Manufacturer-0.ilike.${searchTerm},Blog-headline-0.ilike.${searchTerm}`)
      }
      
      // Manufacturer filter
      if (filters.manufacturers && filters.manufacturers.length > 0) {
        query = query.in('Manufacturer-0', filters.manufacturers)
      }
      
      // Key count filter
      if (filters.keyCounts && filters.keyCounts.length > 0) {
        query = query.in('keys_count', filters.keyCounts)
      }
      
      // Key type filter
      if (filters.keyTypes && filters.keyTypes.length > 0) {
        query = query.in('keys_type', filters.keyTypes)
      }
      
      // Pad count filter
      if (filters.padCounts && filters.padCounts.length > 0) {
        query = query.in('pads_count', filters.padCounts)
      }
      
      // Year range filter
      if (filters.yearRange && filters.yearRange.min !== null && filters.yearRange.max !== null) {
        query = query.gte('Year', filters.yearRange.min).lte('Year', filters.yearRange.max)
      }
      
      // Price range filter (note: this requires converting text to numeric)
      // We'll handle this in the client side for now since the column is text
      
      // IsController filter (if needed)
      if (filters.isController !== undefined) {
        query = query.eq('IsController', filters.isController ? 'yes' : 'no')
      }
      
      // Sorting
      if (filters.sortBy) {
        const ascending = filters.sortOrder === 'asc'
        query = query.order(filters.sortBy, { ascending })
      }
      
      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
      }
      
      const { data, error } = await query
      
      if (error) {
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Error searching products:', error)
      throw new Error(`Failed to search products: ${error.message}`)
    }
  }

  /**
   * Get unique values for filters
   * @returns {Promise<Object>} Object containing unique values for each filter field
   */
  static async getFilterOptions() {
    try {
      const { data, error } = await supabase
        .from('products_atabase2')
        .select('Manufacturer-0, keys_count, keys_type, pads_count, Year')
      
      if (error) {
        throw error
      }
      
      // Process data to get unique values
      const manufacturers = [...new Set(data.map(item => item['Manufacturer-0']).filter(Boolean))].sort()
      const keyCounts = [...new Set(data.map(item => item.keys_count).filter(item => item && item !== 'NA'))].sort((a, b) => Number(a) - Number(b))
      const keyTypes = [...new Set(data.map(item => item.keys_type).filter(item => item && item !== 'NA'))].sort()
      const padCounts = [...new Set(data.map(item => item.pads_count).filter(item => item && item !== 'NA' && item > 0))].sort((a, b) => Number(a) - Number(b))
      const years = [...new Set(data.map(item => item.Year).filter(item => item && item !== 'NA'))].sort((a, b) => Number(b) - Number(a))
      
      return {
        manufacturers,
        keyCounts,
        keyTypes,
        padCounts,
        years
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
      throw new Error(`Failed to fetch filter options: ${error.message}`)
    }
  }

  /**
   * Get products count for performance
   * @returns {Promise<number>} Total number of products
   */
  static async getProductsCount() {
    try {
      const { count, error } = await supabase
        .from('products_atabase2')
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        throw error
      }
      
      return count || 0
    } catch (error) {
      console.error('Error fetching products count:', error)
      throw new Error(`Failed to fetch products count: ${error.message}`)
    }
  }
}
