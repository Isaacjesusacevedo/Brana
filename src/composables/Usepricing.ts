/**
 * usePricing.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Composable con utilidades de formateo de precios y descuentos.
 * Reemplaza las funciones `fmt()` y `discountPercent()` que están
 * duplicadas en CategorySection, ProductList y ProducQuickView.
 *
 * Uso:
 *   import { usePricing } from '@/composables/usePricing'
 *   const { fmt, discountPercent, hasDiscount } = usePricing()
 */

export function usePricing() {
    /**
     * Formatea un número como precio en pesos argentinos.
     * Ej: 18500 → "$18.500"
     * Devuelve '—' si el valor es nulo/indefinido.
     */
    const fmt = (value: number | undefined | null): string => {
      if (value === undefined || value === null) return '—'
      return new Intl.NumberFormat('es-AR', {
        style:                 'currency',
        currency:              'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
  
    /**
     * Calcula el porcentaje de descuento entre precio actual y precio anterior.
     * Retorna 0 si alguno de los valores es nulo/indefinido o si no hay descuento real.
     *
     * Ej: precioAnterior=25000, precio=18500 → 26
     */
    const discountPercent = (
      precio:         number | undefined | null,
      precioAnterior: number | undefined | null,
    ): number => {
      if (!precio || !precioAnterior || precioAnterior <= precio) return 0
      return Math.round(((precioAnterior - precio) / precioAnterior) * 100)
    }
  
    /**
     * Devuelve true si el producto tiene descuento real aplicado.
     */
    const hasDiscount = (
      precio:         number | undefined | null,
      precioAnterior: number | undefined | null,
    ): boolean => discountPercent(precio, precioAnterior) > 0
  
    /**
     * Formatea el badge de descuento listo para mostrar en UI.
     * Ej: "-26%"  |  '' si no hay descuento.
     */
    const discountLabel = (
      precio:         number | undefined | null,
      precioAnterior: number | undefined | null,
    ): string => {
      const pct = discountPercent(precio, precioAnterior)
      return pct > 0 ? `-${pct}%` : ''
    }
  
    return { fmt, discountPercent, hasDiscount, discountLabel }
  }