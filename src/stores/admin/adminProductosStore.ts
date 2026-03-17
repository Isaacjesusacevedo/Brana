import { defineStore } from 'pinia'
import { ref } from 'vue'

import { adminProductoService } from '@/services/admin/adminProductoService'
import type { ProductListParams } from '@/services/admin/adminProductoService'
import { useAdminStore } from '@/stores/useAdminStore'
import type { Product } from '@/types/producto.types'

export const useAdminProductosStore = defineStore('adminProductos', () => {
  const products = ref<Product[]>([])
  const total    = ref(0)
  const page     = ref(1)
  const pageSize = ref(20)
  const loading  = ref(false)
  const error    = ref<string | null>(null)

  const adminStore = useAdminStore()

  /**
   * Carga la lista paginada de productos desde el backend.
   * Actualiza products[], total, y el estado de loading/error.
   */
  async function fetchProducts(params: ProductListParams = {}) {
    loading.value = true
    error.value   = null

    try {
      const token  = adminStore.token!
      const result = await adminProductoService.getAll(token, {
        page:     page.value,
        pageSize: pageSize.value,
        ...params,
      })
      products.value = result.items
      total.value    = result.total
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar productos'
    } finally {
      loading.value = false
    }
  }

  /**
   * Elimina un producto por ID y actualiza el estado local sin volver a hacer fetch.
   * Lanza error si la operación falla (para que el caller lo maneje).
   */
  async function removeProduct(id: string) {
    const token = adminStore.token!
    await adminProductoService.remove(token, id)
    products.value = products.value.filter(p => String(p.id) !== id)
    total.value--
  }

  return {
    products,
    total,
    page,
    pageSize,
    loading,
    error,
    fetchProducts,
    removeProduct,
  }
})
