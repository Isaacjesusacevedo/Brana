<template>
  <!-- ── Cargando ─────────────────────────────────────────────────────── -->
  <div v-if="loading" :class="['product-list', `product-list--${mode}`]">
    <div v-for="n in skeletonCount" :key="`sk-${n}`" class="product-skeleton">
      <div class="skeleton-img" />
      <div class="skeleton-body">
        <div class="skeleton-line skeleton-line--cat" />
        <div class="skeleton-line skeleton-line--name" />
        <div class="skeleton-line skeleton-line--price" />
      </div>
    </div>
  </div>

  <!-- ── Sin resultados ────────────────────────────────────────────────── -->
  <div v-else-if="!products.length" class="product-empty">
    <span class="empty-sym">◈</span>
    <p class="empty-msg">{{ emptyMessage }}</p>
  </div>

  <!-- ── Grilla / Lista ────────────────────────────────────────────────── -->
  <div v-else :class="['product-list', `product-list--${mode}`]">
    <div
      v-for="product in products"
      :key="product.id"
      class="product-list__cell"
    >
      <ProductCard
        :product="product"
        :disableNav="true"
        @click="emit('product-click', $event)"
      />

      <!-- Acciones rápidas que aparecen al hacer hover -->
      <div class="product-list__actions">
        <button
          class="act-btn"
          title="Vista rápida"
          @click.stop="emit('quick-view', product)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Vista rápida
        </button>
        <button
          class="act-btn act-btn--cart"
          title="Agregar al carrito"
          @click.stop="emit('add-to-cart', product)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Al carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/Index';
import ProductCard from './ProductCard.vue';

interface Props {
  products: Product[];
  loading?: boolean;
  mode?: 'grid' | 'list';
  skeletonCount?: number;
  emptyMessage?: string;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  mode: 'grid',
  skeletonCount: 12,
  emptyMessage: 'No hay productos disponibles.',
});

const emit = defineEmits<{
  'product-click': [product: Product];
  'quick-view':   [product: Product];
  'add-to-cart':  [product: Product];
}>();
</script>

<style scoped>
/* ── Grid y List layouts ─────────────────────────────────────────────── */
.product-list {
  width: 100%;
}

.product-list--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.product-list--list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Celda ───────────────────────────────────────────────────────────── */
.product-list__cell {
  position: relative;
}

/* En modo lista los cards son horizontales */
.product-list--list .product-list__cell :deep(.product-card) {
  display: flex;
  flex-direction: row;
  height: 120px;
}

.product-list--list .product-list__cell :deep(.product-card__image-wrapper) {
  width: 120px;
  flex-shrink: 0;
  height: 100%;
}

.product-list--list .product-list__cell :deep(.product-card__info) {
  flex: 1;
  padding: 1rem;
}

/* ── Acciones rápidas ────────────────────────────────────────────────── */
.product-list__actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 0;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
  z-index: 2;
}

.product-list__cell:hover .product-list__actions {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.act-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 8px;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 0.15s ease;
}

.act-btn svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

/* Vista rápida — fondo semitransparente negro */
.act-btn:first-child {
  background: rgba(0, 0, 0, 0.85);
  color: rgba(255, 255, 255, 0.8);
  border-right: 1px solid rgba(218, 165, 32, 0.2);
}

.act-btn:first-child:hover {
  background: rgba(20, 20, 20, 0.95);
  color: #fff;
}

/* Al carrito — dorado */
.act-btn--cart {
  background: rgba(218, 165, 32, 0.9);
  color: #000;
}

.act-btn--cart:hover {
  background: #DAA520;
}

/* ── Skeleton ────────────────────────────────────────────────────────── */
.product-skeleton {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  animation: sk-pulse 1.6s ease-in-out infinite;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #222 50%,
    #1a1a1a 75%
  );
  background-size: 200% 100%;
  animation: sk-shimmer 1.6s ease-in-out infinite;
}

.skeleton-body {
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #222 50%,
    #1a1a1a 75%
  );
  background-size: 200% 100%;
  animation: sk-shimmer 1.6s ease-in-out infinite;
}

.skeleton-line--cat   { width: 35%; height: 8px; }
.skeleton-line--name  { width: 75%; }
.skeleton-line--price { width: 45%; margin-top: 4px; }

@keyframes sk-shimmer {
  0%   { background-position:  200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes sk-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.85; }
}

/* ── Estado vacío ────────────────────────────────────────────────────── */
.product-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  gap: 1.25rem;
  color: rgba(255, 255, 255, 0.3);
}

.empty-sym {
  font-size: 2.5rem;
  opacity: 0.3;
}

.empty-msg {
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-align: center;
}

/* ── Responsive ──────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .product-list--grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .act-btn {
    font-size: 0;       /* Ocultar texto en mobile, solo iconos */
    padding: 10px;
    flex: 0 0 auto;
    width: 50%;
  }

  .act-btn svg {
    width: 15px;
    height: 15px;
  }
}
</style>
