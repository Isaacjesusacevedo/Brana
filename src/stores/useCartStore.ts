/**
 * useCartStore.ts — Store central del carrito con Pinia
 *
 * Sin pinia-plugin-persistedstate: la persistencia se maneja con un watcher
 * sobre localStorage, sin dependencias extra.
 *
 * Uso en App.vue (o main.ts, después de montar Pinia):
 *   import { watchCartStore } from '@/stores/useCartStore'
 *   onMounted(() => watchCartStore())
 */

import { defineStore } from 'pinia';
import { watch }       from 'vue';
import type { Product } from '@/types/producto.types';

// ─── Persistencia key ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'brana-cart';

// ─── Tipos internos ───────────────────────────────────────────────────────────
export interface CartLineItem {
  lineId:     string;
  productoId: number | string;
  nombre:     string;
  imagen:     string;
  precio:     number;
  categoria?: string;
  cantidad:   number;
  talla?:     string;
  color?:     string;
}

interface PersistedCart {
  items:          CartLineItem[];
  promoCode:      string | null;
  discountAmount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildLineId(id: number | string, talla?: string, color?: string): string {
  return `${id}__${talla ?? 'default'}__${color ?? 'default'}`;
}

function loadFromStorage(): PersistedCart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], promoCode: null, discountAmount: 0 };
    return JSON.parse(raw) as PersistedCart;
  } catch {
    return { items: [], promoCode: null, discountAmount: 0 };
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCartStore = defineStore('brana-cart', {
  state: (): {
    items:          CartLineItem[];
    promoCode:      string | null;
    discountAmount: number;
  } => {
    const saved = loadFromStorage();
    return {
      items:          saved.items,
      promoCode:      saved.promoCode,
      discountAmount: saved.discountAmount,
    };
  },

  getters: {
    totalItems: (state): number =>
      state.items.reduce((sum, item) => sum + item.cantidad, 0),

    subtotal: (state): number =>
      state.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),

    shippingCost(): number {
      return (this.subtotal as number) >= 100_000 ? 0 : 5_000;
    },

    total(): number {
      return Math.max(
        0,
        (this.subtotal as number) + (this.shippingCost as number) - this.discountAmount,
      );
    },

    isEmpty: (state): boolean => state.items.length === 0,
  },

  actions: {
    addItem(product: Product, cantidad = 1, talla?: string, color?: string): void {
      const lineId   = buildLineId(product.id, talla, color);
      const existing = this.items.find((i) => i.lineId === lineId);
      if (existing) {
        existing.cantidad += cantidad;
      } else {
        this.items.push({
          lineId,
          productoId: product.id,
          nombre:     product.nombre ?? product.titulo ?? 'Producto',
          imagen:     product.imagen,
          precio:     product.precio ?? 0,
          categoria:  product.categoria,
          cantidad,
          talla,
          color,
        });
      }
    },

    removeItem(lineId: string): void {
      const idx = this.items.findIndex((i) => i.lineId === lineId);
      if (idx > -1) this.items.splice(idx, 1);
    },

    updateQuantity(lineId: string, cantidad: number): void {
      if (cantidad <= 0) { this.removeItem(lineId); return; }
      const item = this.items.find((i) => i.lineId === lineId);
      if (item) item.cantidad = cantidad;
    },

    increment(lineId: string): void {
      const item = this.items.find((i) => i.lineId === lineId);
      if (item) item.cantidad++;
    },

    decrement(lineId: string): void {
      const item = this.items.find((i) => i.lineId === lineId);
      if (item && item.cantidad > 1) item.cantidad--;
    },

    applyPromoCode(code: string): boolean {
      const validCodes: Record<string, number> = {
        BRANA10:  10_000,
        ARCANA20: 20_000,
        TRIBU15:  15_000,
      };
      const upper = code.trim().toUpperCase();
      if (validCodes[upper] !== undefined) {
        this.promoCode      = upper;
        this.discountAmount = validCodes[upper];
        return true;
      }
      return false;
    },

    removePromoCode(): void {
      this.promoCode      = null;
      this.discountAmount = 0;
    },

    clear(): void {
      this.items          = [];
      this.promoCode      = null;
      this.discountAmount = 0;
    },
  },
});

// ─── Persistencia manual — llamar una vez desde App.vue o main.ts ─────────────
export function watchCartStore(): void {
  const store = useCartStore();
  watch(
    () => ({
      items:          store.items,
      promoCode:      store.promoCode,
      discountAmount: store.discountAmount,
    }),
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
      } catch { /* localStorage lleno o incógnito */ }
    },
    { deep: true },
  );
}