import { ref } from 'vue'
import { useMidiStore } from '@/stores/midiStore'

export function useProductDetail() {
  const product = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const midiStore = useMidiStore()

  const loadProduct = async (productId) => {
    loading.value = true
    error.value = null

    try {
      // Try to get product by ID from Supabase first
      const foundProduct = await midiStore.getProductById(productId)

      if (foundProduct) {
        product.value = foundProduct
      } else {
        // Fallback: If store doesn't have controllers loaded, load them first and search by image field
        if (midiStore.controllers.length === 0) {
          await midiStore.loadControllers()
        }

        // Find product by image field (for backward compatibility)
        const fallbackProduct = midiStore.controllers.find(controller =>
          controller.image === productId
        )

        if (fallbackProduct) {
          product.value = fallbackProduct
        } else {
          error.value = 'Producto no encontrado'
        }
      }
    } catch (err) {
      error.value = `Error al cargar el producto: ${err.message}`
    } finally {
      loading.value = false
    }
  }

  return {
    product,
    loading,
    error,
    loadProduct
  }
}
