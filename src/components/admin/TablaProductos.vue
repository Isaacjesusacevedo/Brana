<template>
  <!-- ── Skeleton ──────────────────────────────────────────────────────── -->
  <div v-if="loading" class="tabla-skeleton">
    <div v-for="n in 8" :key="n" class="skeleton-row" />
  </div>

  <!-- ── Sin resultados ────────────────────────────────────────────────── -->
  <div v-else-if="!products.length" class="tabla-empty">
    <span class="empty-icon">◈</span>
    <p>No hay productos cargados aún.</p>
  </div>

  <!-- ── Tabla ─────────────────────────────────────────────────────────── -->
  <div v-else class="tabla-wrapper">
    <table class="tabla-productos">
      <thead>
        <tr>
          <th class="col-img">Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th class="col-num">Precio</th>
          <th class="col-num">Stock</th>
          <th>Talles</th>
          <th class="col-actions">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <!-- Imagen miniatura -->
          <td class="col-img">
            <img
              :src="product.imagen"
              :alt="product.nombre ?? product.titulo"
              class="prod-thumb"
            />
          </td>

          <!-- Nombre + badge NUEVO -->
          <td>
            <span class="prod-nombre">{{ product.nombre ?? product.titulo ?? '—' }}</span>
            <span v-if="product.nuevo" class="badge-nuevo">NUEVO</span>
          </td>

          <!-- Categoría -->
          <td class="text-muted">{{ product.categoria ?? '—' }}</td>

          <!-- Precio -->
          <td class="col-num">
            <span v-if="product.precio">$ {{ formatPrice(product.precio) }}</span>
            <span v-else class="text-muted">—</span>
          </td>

          <!-- Stock -->
          <td class="col-num">
            <span :class="['stock-val', { 'stock-low': (product.stock ?? Infinity) <= 3 }]">
              {{ product.stock ?? '—' }}
            </span>
          </td>

          <!-- Talles -->
          <td>
            <span class="tallas-list">{{ product.tallas?.join(' · ') ?? '—' }}</span>
          </td>

          <!-- Acciones -->
          <td class="col-actions">
            <button
              class="action-btn action-btn--edit"
              title="Editar producto"
              @click="$emit('edit', product)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              class="action-btn action-btn--delete"
              title="Eliminar producto"
              @click="confirmDelete(product)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ── Diálogo de confirmación de borrado ─────────────────────────────── -->
  <Teleport to="body">
    <div v-if="confirmTarget" class="confirm-overlay" @click.self="confirmTarget = null">
      <div class="confirm-dialog">
        <p class="confirm-msg">
          ¿Eliminar <strong>{{ confirmTarget.nombre ?? confirmTarget.titulo }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="confirm-actions">
          <button class="confirm-btn confirm-btn--cancel" @click="confirmTarget = null">
            Cancelar
          </button>
          <button class="confirm-btn confirm-btn--delete" @click="doDelete">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types/producto.types'

defineProps<{
  products: Product[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit:   [product: Product]
  delete: [id: string]
}>()

const confirmTarget = ref<Product | null>(null)

function confirmDelete(product: Product) {
  confirmTarget.value = product
}

function doDelete() {
  if (!confirmTarget.value) return
  emit('delete', String(confirmTarget.value.id))
  confirmTarget.value = null
}

const formatPrice = (v: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v)
</script>

<style scoped>
/* ── Skeleton ──────────────────────────────────────────────────────────── */
.tabla-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-row {
  height: 58px;
  border-radius: 6px;
  background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s ease-in-out infinite;
}

@keyframes sk-shimmer {
  0%   { background-position:  200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Empty ─────────────────────────────────────────────────────────────── */
.tabla-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: #444;
  font-size: 14px;
}

.empty-icon {
  font-size: 2.2rem;
  opacity: 0.25;
}

/* ── Tabla wrapper ─────────────────────────────────────────────────────── */
.tabla-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #1a1a1a;
}

.tabla-productos {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

/* ── Cabecera ──────────────────────────────────────────────────────────── */
.tabla-productos thead tr {
  background: #0d0d0d;
  border-bottom: 1px solid #1f1f1f;
}

.tabla-productos th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Filas ─────────────────────────────────────────────────────────────── */
.tabla-productos tbody tr {
  border-bottom: 1px solid #111;
  transition: background 0.15s;
}

.tabla-productos tbody tr:last-child {
  border-bottom: none;
}

.tabla-productos tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.tabla-productos td {
  padding: 12px 16px;
  vertical-align: middle;
  color: #ccc;
}

/* ── Columnas específicas ──────────────────────────────────────────────── */
.col-img {
  width: 60px;
  padding-right: 8px;
}

.col-num {
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.col-actions {
  width: 84px;
  text-align: right;
}

/* ── Contenido de celdas ───────────────────────────────────────────────── */
.prod-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #222;
  display: block;
}

.prod-nombre {
  font-weight: 600;
  color: #e8e8e8;
}

.badge-nuevo {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: rgba(218, 165, 32, 0.12);
  color: #DAA520;
  border: 1px solid rgba(218, 165, 32, 0.25);
  vertical-align: middle;
}

.text-muted {
  color: #444;
}

.tallas-list {
  font-size: 12px;
  color: #555;
  letter-spacing: 0.3px;
}

.stock-low {
  color: #f87171;
}

/* ── Botones de acción ─────────────────────────────────────────────────── */
.action-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.action-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.action-btn--edit {
  background: #1a1a1a;
  color: #666;
  margin-right: 4px;
}

.action-btn--edit:hover {
  background: rgba(218, 165, 32, 0.14);
  color: #DAA520;
}

.action-btn--delete {
  background: #1a1a1a;
  color: #666;
}

.action-btn--delete:hover {
  background: rgba(220, 38, 38, 0.12);
  color: #f87171;
}

/* ── Modal de confirmación ─────────────────────────────────────────────── */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-dialog {
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 28px 32px;
  max-width: 400px;
  width: 90%;
}

.confirm-msg {
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.confirm-msg strong {
  color: #fff;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-btn {
  padding: 9px 20px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.confirm-btn--cancel {
  background: #1c1c1c;
  color: #777;
  border: 1px solid #2a2a2a;
}

.confirm-btn--cancel:hover {
  border-color: #444;
  color: #ccc;
}

.confirm-btn--delete {
  background: rgba(220, 38, 38, 0.9);
  color: #fff;
}

.confirm-btn--delete:hover {
  background: #dc2626;
}
</style>
