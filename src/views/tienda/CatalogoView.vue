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
@import '@/assets/css/views/catalogo.css';
</style>