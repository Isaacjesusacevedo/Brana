<template>
  <div class="catalog-container">
    <StarsBackground :particleCount="50" />

    <div class="floating-decorations">
      <img src="@/assets/images/logos/estatuart2.png"    alt="" class="decoration decoration-1" />
      <img src="@/assets/images/logos/toquealoeterno.png" alt="" class="decoration decoration-2" />
    </div>

    <div class="catalog-content">

      <!-- ── Header ──────────────────────────────────────────────────────── -->
      <header class="catalog-header">
        <div class="header-ornament">
          <span class="orn-line"></span>
          <span class="orn-sym">◆</span>
          <span class="orn-line"></span>
        </div>
        <h1 class="catalog-title">CATÁLOGO</h1>
        <p class="catalog-subtitle">Todas las piezas de la colección</p>
      </header>

      <!-- ── Tabs de categoría ────────────────────────────────────────────── -->
      <nav class="category-tabs" role="group" aria-label="Categorías">
        <button
          v-for="cat in filterCategories"
          :key="cat.id"
          class="cat-tab"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span class="tab-label">{{ cat.nombre }}</span>
          <span v-if="selectedCategory === cat.id" class="tab-indicator"></span>
        </button>
      </nav>

      <!-- ── Cuerpo: sidebar + productos ─────────────────────────────────── -->
      <div class="catalog-body">

        <!-- Sidebar de filtros -->
        <aside class="filter-sidebar" :class="{ 'is-open': sidebarOpen }">
          <div class="sidebar-inner">
            <ProductFilter
              v-model="filterState"
              :availableColors="AVAILABLE_COLORS.map(c => c.value)"
              @change="onFilterChange"
            />
          </div>
        </aside>

        <!-- Overlay mobile para cerrar sidebar -->
        <div
          v-if="sidebarOpen"
          class="sidebar-overlay"
          @click="sidebarOpen = false"
        ></div>

        <!-- Área principal de productos -->
        <div class="products-area">

          <!-- Toolbar: toggle sidebar + sort + view + count -->
          <div class="products-toolbar">
            <div class="toolbar-left">
              <button
                class="sidebar-toggle"
                @click="sidebarOpen = !sidebarOpen"
                :aria-label="sidebarOpen ? 'Cerrar filtros' : 'Abrir filtros'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="14" y2="12"/>
                  <line x1="4" y1="18" x2="10" y2="18"/>
                </svg>
                FILTROS
                <span v-if="activeFilterCount" class="filter-badge">{{ activeFilterCount }}</span>
              </button>

              <!-- Chips de filtros activos -->
              <TransitionGroup name="chip-fade" tag="div" class="active-chips">
                <button
                  v-if="filterState.soloNuevos"
                  key="nuevos"
                  class="filter-chip"
                  @click="filterState.soloNuevos = false; onFilterChange(filterState)"
                >
                  Solo nuevos ✕
                </button>
                <button
                  v-for="color in filterState.colores"
                  :key="color"
                  class="filter-chip color-chip"
                  @click="removeColor(color)"
                >
                  <span class="chip-color" :style="{ background: color }"></span>
                  ✕
                </button>
                <button
                  v-if="filterState.minPrecio || filterState.maxPrecio"
                  key="precio"
                  class="filter-chip"
                  @click="clearPrecio"
                >
                  Precio ✕
                </button>
              </TransitionGroup>
            </div>

            <div class="toolbar-right">
              <span v-if="!loadingProducts" class="result-count">
                {{ filteredProducts.length }}
                {{ filteredProducts.length === 1 ? 'pieza' : 'piezas' }}
              </span>

              <select v-model="sortBy" class="sort-select" aria-label="Ordenar por" @change="currentPage = 1">
                <option value="featured">Destacados</option>
                <option value="name-asc">A → Z</option>
                <option value="name-desc">Z → A</option>
                <option value="price-asc">Precio ↑</option>
                <option value="price-desc">Precio ↓</option>
                <option value="newest">Más nuevos</option>
              </select>

              <div class="view-toggle" role="group" aria-label="Modo de vista">
                <button
                  class="view-btn"
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                  aria-label="Cuadrícula"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button
                  class="view-btn"
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                  aria-label="Lista"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- ── Error de carga ─────────────────────────────────────────── -->
          <div v-if="apiError" class="api-error">
            <span class="err-sym">✕</span>
            <p>{{ apiError }}</p>
            <button class="retry-btn" @click="loadProducts">Reintentar</button>
          </div>

          <!-- ── ProductList ────────────────────────────────────────────── -->
          <ProductList
            v-else
            :products="paginatedProducts"
            :loading="loadingProducts"
            :mode="viewMode"
            :skeleton-count="itemsPerPage"
            empty-message="No hay productos con esos filtros."
            @product-click="handleProductClick"
            @quick-view="handleQuickView"
            @add-to-cart="handleAddToCart"
          />

          <!-- ── Paginación ─────────────────────────────────────────────── -->
          <div v-if="totalPages > 1" class="pagination">
            <button
              class="page-btn page-btn--arrow"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              aria-label="Página anterior"
            >←</button>

            <template v-for="p in displayedPages" :key="p">
              <span v-if="p === '...'" class="page-ellipsis">···</span>
              <button
                v-else
                class="page-btn"
                :class="{ active: currentPage === p }"
                @click="goToPage(Number(p))"
              >{{ p }}</button>
            </template>

            <button
              class="page-btn page-btn--arrow"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              aria-label="Página siguiente"
            >→</button>
          </div>

        </div><!-- /products-area -->
      </div><!-- /catalog-body -->
    </div><!-- /catalog-content -->

    <!-- ── Quick View Modal ───────────────────────────────────────────────── -->
    <BaseModal v-model="showQuickView" size="large">
      <ProducQuickView
        v-if="selectedProduct"
        :product="selectedProduct"
        @add-to-cart="handleAddToCartFromModal"
        @close="showQuickView = false"
      />
    </BaseModal>

    <!-- ── Toast ──────────────────────────────────────────────────────────── -->
    <Transition name="toast">
      <div v-if="toastVisible" class="cart-toast">
        <span class="toast-sym">◈</span>
        <p>{{ toastMsg }}</p>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import StarsBackground from '@/components/tienda/common/StarBackground.vue';
import BaseModal       from '@/components/tienda/common/BaseModal.vue';
import ProductList     from '@/components/tienda/producto/ProductFilter.vue';
import ProducQuickView from '@/components/tienda/producto/ProducQuickView.vue';
import ProductFilter   from '@/components/tienda/producto/ProductFilter.vue';
import type { FilterState } from '@/components/tienda/producto/ProductFilter.vue';

import type { Product, Category } from '@/types/producto.types';
import { productosApi, categoriasApi } from '@/services/tienda/api';
import type { ProductQueryParams } from '@/services/tienda/api';
import { useCartStore } from '@/stores/useCartStore';

const router = useRouter();
const cart   = useCartStore();

// ── Constantes ────────────────────────────────────────────────────────────────
const STATIC_CATEGORY = { id: 'todos', nombre: 'Todos', slug: 'todos' };
const AVAILABLE_COLORS = [
  { name: 'Negro',  value: '#000000' },
  { name: 'Blanco', value: '#FFFFFF' },
  { name: 'Oro',    value: '#DAA520' },
  { name: 'Marrón', value: '#8B4513' },
  { name: 'Gris',   value: '#6b7280' },
  { name: 'Azul',   value: '#1e3a8a' },
];
const itemsPerPage = 12;

// ── Estado de UI ──────────────────────────────────────────────────────────────
const viewMode    = ref<'grid' | 'list'>('grid');
const sidebarOpen = ref(false);
const sortBy      = ref('featured');
const currentPage = ref(1);

// Filtros de categoría (tab)
const selectedCategory = ref('todos');

// Estado de ProductFilter (precio, colores, soloNuevos, orderBy)
const filterState = ref<FilterState>({
  colores: [],
  soloNuevos: false,
});

// ── Estado de datos ───────────────────────────────────────────────────────────
const allProducts     = ref<Product[]>([]);
const apiCategories   = ref<Category[]>([]);
const loadingProducts = ref(true);
const apiError        = ref<string | null>(null);

// ── Modal / Quick View ────────────────────────────────────────────────────────
const showQuickView   = ref(false);
const selectedProduct = ref<Product | null>(null);

// ── Toast ──────────────────────────────────────────────────────────────────────
const toastVisible = ref(false);
const toastMsg     = ref('');
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const showToast = (msg: string) => {
  toastMsg.value = msg;
  toastVisible.value = true;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastVisible.value = false; }, 3000);
};

// ── Categorías para los tabs ──────────────────────────────────────────────────
const filterCategories = computed(() => [
  STATIC_CATEGORY,
  ...apiCategories.value.map(c => ({ id: c.slug, nombre: c.nombre })),
]);

// ── Conteo de filtros activos (para el badge del botón) ───────────────────────
const activeFilterCount = computed(() => {
  let n = filterState.value.colores.length;
  if (filterState.value.soloNuevos) n++;
  if (filterState.value.minPrecio || filterState.value.maxPrecio) n++;
  return n || null;
});

// ── Carga de datos ────────────────────────────────────────────────────────────
const loadProducts = async () => {
  loadingProducts.value = true;
  apiError.value = null;

  try {
    const params: ProductQueryParams = {
      categoria:  selectedCategory.value !== 'todos' ? selectedCategory.value : undefined,
      minPrecio:  filterState.value.minPrecio,
      maxPrecio:  filterState.value.maxPrecio,
      soloNuevos: filterState.value.soloNuevos || undefined,
      page:       1,
      pageSize:   200,
    };

    const [productsRes, catsRes] = await Promise.all([
      productosApi.getAll(params),
      apiCategories.value.length ? Promise.resolve(null) : categoriasApi.getAll(),
    ]);

    allProducts.value = productsRes.items;
    if (catsRes) apiCategories.value = catsRes;
  } catch (err) {
    apiError.value = err instanceof Error
      ? err.message
      : 'No se pudo conectar con el servidor.';
  } finally {
    loadingProducts.value = false;
  }
};

onMounted(loadProducts);
watch([selectedCategory, () => filterState.value.soloNuevos], () => {
  currentPage.value = 1;
  loadProducts();
});

// ── Filtros + Sort en cliente ─────────────────────────────────────────────────
const filteredProducts = computed(() => {
  let list = [...allProducts.value];

  if (filterState.value.minPrecio) {
    list = list.filter(p => (p.precio ?? 0) >= filterState.value.minPrecio!);
  }
  if (filterState.value.maxPrecio) {
    list = list.filter(p => (p.precio ?? 0) <= filterState.value.maxPrecio!);
  }
  if (filterState.value.colores.length) {
    list = list.filter(p =>
      p.colores?.some(c => filterState.value.colores.includes(c)),
    );
  }

  const order = filterState.value.orderBy ?? sortBy.value;
  const desc  = filterState.value.desc ?? false;

  switch (order) {
    case 'nombre':
    case 'name-asc':
      list.sort((a, b) => (a.nombre ?? '').localeCompare(b.nombre ?? ''));
      if (desc) list.reverse();
      break;
    case 'name-desc':
      list.sort((a, b) => (b.nombre ?? '').localeCompare(a.nombre ?? ''));
      break;
    case 'precio':
    case 'price-asc':
      list.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));
      if (desc) list.reverse();
      break;
    case 'price-desc':
      list.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0));
      break;
    case 'nuevo':
    case 'newest':
      list.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));
      break;
  }

  return list;
});

// ── Paginación ─────────────────────────────────────────────────────────────────
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage),
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const displayedPages = computed<(number | '...')[]>(() => {
  const total = totalPages.value;
  const cur   = currentPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];
  if (cur > 3) pages.push('...');
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
  if (cur < total - 2) pages.push('...');
  pages.push(total);
  return pages;
});

const goToPage = (p: number) => {
  currentPage.value = Math.max(1, Math.min(p, totalPages.value));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch([sortBy, filterState], () => { currentPage.value = 1; }, { deep: true });

// ── Acciones de filtros ───────────────────────────────────────────────────────
const selectCategory = (id: string) => {
  selectedCategory.value = id;
  currentPage.value = 1;
};

const onFilterChange = (state: FilterState) => {
  filterState.value = state;
  currentPage.value = 1;
  // En mobile cerrar sidebar al aplicar
  if (window.innerWidth < 1024) sidebarOpen.value = false;
};

const removeColor = (color: string) => {
  filterState.value = {
    ...filterState.value,
    colores: filterState.value.colores.filter(c => c !== color),
  };
};

const clearPrecio = () => {
  filterState.value = {
    ...filterState.value,
    minPrecio: undefined,
    maxPrecio: undefined,
  };
};

// ── Handlers de productos ─────────────────────────────────────────────────────
const handleProductClick = (product: Product) => {
  router.push(product.ruta ?? `/producto/${product.id}`);
};

const handleQuickView = (product: Product) => {
  selectedProduct.value = product;
  showQuickView.value   = true;
};

const handleAddToCart = (product: Product) => {
  cart.addItem(product, 1);
  showToast(`${product.nombre ?? 'Producto'} agregado al carrito.`);
};

const handleAddToCartFromModal = (
  product: Product,
  cantidad: number,
  color?: string,
  talla?: string,
) => {
  cart.addItem(product, cantidad, talla, color);
  showToast(`${product.nombre ?? 'Producto'} × ${cantidad} agregado.`);
  showQuickView.value = false;
};
</script>

<style scoped>
/* ════════════════════════════════════════
   VARIABLES & BASE
════════════════════════════════════════ */
:root {
  --gold: #DAA520;
  --sidebar-w: 260px;
}

.catalog-container {
  position: relative;
  min-height: 100vh;
  background: #000;
  overflow-x: hidden;
}

/* ── Decoraciones flotantes ── */
.floating-decorations {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.06;
}

.decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: blur(4px);
}

.decoration-1 { top: 15%; left: -3%; animation: f1 32s ease-in-out infinite; }
.decoration-2 { bottom: 12%; right: -3%; animation: f2 38s ease-in-out infinite; }

@keyframes f1 { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(20px,-20px) rotate(8deg); } }
@keyframes f2 { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-20px,20px) rotate(-8deg); } }

/* ════════════════════════════════════════
   CONTENT WRAPPER
════════════════════════════════════════ */
.catalog-content {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
  padding: 8rem 2rem 5rem;
}

/* ════════════════════════════════════════
   HEADER
════════════════════════════════════════ */
.catalog-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

.orn-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(218,165,32,0.6), transparent);
}

.orn-sym { color: var(--gold, #daa520); font-size: 0.7rem; opacity: 0.7; }

.catalog-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 900;
  letter-spacing: 0.3em;
  color: #fff;
  text-transform: uppercase;
  margin: 0 0 0.7rem;
}

.catalog-subtitle {
  font-size: 0.82rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
}

/* ════════════════════════════════════════
   CATEGORY TABS
════════════════════════════════════════ */
.category-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  margin-bottom: 2.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar { display: none; }

.cat-tab {
  position: relative;
  padding: 0.8rem 1.6rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.cat-tab:hover { color: rgba(255, 255, 255, 0.75); }

.cat-tab.active { color: var(--gold, #daa520); }

.tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gold, #daa520);
  border-radius: 2px 2px 0 0;
  box-shadow: 0 0 8px rgba(218,165,32,0.5);
}

/* ════════════════════════════════════════
   CATALOG BODY: sidebar + products
════════════════════════════════════════ */
.catalog-body {
  display: grid;
  grid-template-columns: var(--sidebar-w, 260px) 1fr;
  gap: 2.5rem;
  align-items: start;
}

/* ════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════ */
.filter-sidebar {
  position: sticky;
  top: 7rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  padding: 1.8rem 1.4rem;
}

.sidebar-inner {
  /* ProductFilter ocupa todo el ancho del sidebar */
  width: 100%;
}

/* Mobile overlay */
.sidebar-overlay {
  display: none;
}

/* ════════════════════════════════════════
   PRODUCTS AREA
════════════════════════════════════════ */
.products-area {
  min-width: 0; /* evita overflow en grid */
}

/* ── Toolbar ── */
.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
  flex: 1;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-shrink: 0;
}

/* Botón toggle sidebar (visible en desktop también para colapsar) */
.sidebar-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
  position: relative;
}

.sidebar-toggle:hover {
  border-color: rgba(218, 165, 32, 0.4);
  color: var(--gold, #daa520);
}

.filter-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--gold, #daa520);
  color: #000;
  font-size: 0.6rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Chips de filtros activos */
.active-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  background: rgba(218, 165, 32, 0.1);
  border: 1px solid rgba(218, 165, 32, 0.3);
  color: var(--gold, #daa520);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background: rgba(218, 165, 32, 0.18);
  border-color: var(--gold, #daa520);
}

.chip-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.2);
  flex-shrink: 0;
}

/* Chip animations */
.chip-fade-enter-active,
.chip-fade-leave-active { transition: all 0.2s ease; }
.chip-fade-enter-from,
.chip-fade-leave-to { opacity: 0; transform: scale(0.8); }

/* Resultado count */
.result-count {
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
  white-space: nowrap;
}

/* Sort select */
.sort-select {
  padding: 0.5rem 2rem 0.5rem 0.85rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.78rem;
  border-radius: 2px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23aaa' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
}

.sort-select:focus { outline: none; border-color: var(--gold, #daa520); }

/* View toggle */
.view-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

.view-btn {
  padding: 0.45rem 0.65rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover { color: rgba(218, 165, 32, 0.7); }
.view-btn.active { background: rgba(218, 165, 32, 0.15); color: var(--gold, #daa520); }

/* ════════════════════════════════════════
   API ERROR
════════════════════════════════════════ */
.api-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 2rem;
  color: rgba(255, 255, 255, 0.4);
}

.err-sym { font-size: 2.5rem; color: #dc2626; opacity: 0.5; }
.api-error p { font-size: 0.85rem; letter-spacing: 0.1em; }

.retry-btn {
  padding: 0.65rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(218, 165, 32, 0.4);
  color: var(--gold, #daa520);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.retry-btn:hover { background: rgba(218, 165, 32, 0.1); }

/* ════════════════════════════════════════
   PAGINACIÓN
════════════════════════════════════════ */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  margin-top: 3.5rem;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 0.7rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.page-btn--arrow { font-size: 1rem; letter-spacing: 0; }
.page-btn:hover:not(:disabled) { border-color: var(--gold, #daa520); color: var(--gold, #daa520); }
.page-btn.active { background: var(--gold, #daa520); border-color: var(--gold, #daa520); color: #000; font-weight: 800; }
.page-btn:disabled { opacity: 0.2; cursor: not-allowed; }
.page-ellipsis { color: rgba(255,255,255,0.2); padding: 0 0.4rem; letter-spacing: 0.1em; line-height: 40px; }

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
.cart-toast {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1.4rem;
  background: rgba(10, 10, 10, 0.96);
  border: 1px solid rgba(218, 165, 32, 0.35);
  border-radius: 4px;
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.65);
  max-width: 320px;
}

.toast-sym { color: var(--gold, #daa520); font-size: 0.9rem; flex-shrink: 0; }
.cart-toast p { font-size: 0.8rem; color: rgba(255, 255, 255, 0.8); margin: 0; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px) scale(0.96); }

/* ════════════════════════════════════════
   RESPONSIVE — TABLET (≤ 1024px)
   Sidebar pasa a drawer lateral
════════════════════════════════════════ */
@media (max-width: 1024px) {
  .catalog-body {
    grid-template-columns: 1fr;
  }

  .filter-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    max-width: 85vw;
    z-index: 500;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
    border-radius: 0;
    border-left: none;
    padding-top: 4rem;
  }

  .filter-sidebar.is-open {
    transform: translateX(0);
    box-shadow: 4px 0 40px rgba(0,0,0,0.6);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 499;
    backdrop-filter: blur(2px);
  }
}

/* ════════════════════════════════════════
   RESPONSIVE — MOBILE (≤ 640px)
════════════════════════════════════════ */
@media (max-width: 640px) {
  .catalog-content { padding: 6rem 1rem 3rem; }
  .category-tabs { gap: 0; }
  .cat-tab { padding: 0.75rem 1rem; font-size: 0.68rem; }
  .products-toolbar { gap: 0.6rem; }
  .toolbar-right { gap: 0.5rem; }
  .result-count { display: none; }
  .cart-toast { bottom: 1rem; right: 1rem; left: 1rem; max-width: none; }
  .decoration { display: none; }
  .pagination { gap: 0.3rem; }
  .page-btn { min-width: 36px; height: 36px; font-size: 0.8rem; }
}
</style>