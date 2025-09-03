import { useRouter } from 'vue-router'

export function useProductNavigation() {
  const router = useRouter()

  const goBack = () => {
    router.push({ name: 'catalog' })
  }

  const goToCatalog = () => {
    router.push({ name: 'catalog' })
  }

  return {
    goBack,
    goToCatalog
  }
}
