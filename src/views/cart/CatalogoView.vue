<template>
  <div class="catalog-container">
    <!-- Fondo de estrellas -->
    <StarsBackground :particleCount="70" />
    
    <!-- Decoraciones flotantes -->
    <div class="floating-decorations">
      <img 
        src="@/assets/images/logos/estatuart2.png" 
        alt="Decoration" 
        class="decoration decoration-1"
      />
      <img 
        src="@/assets/images/logos/toquealoeterno.png" 
        alt="Decoration" 
        class="decoration decoration-2"
      />
    </div>

    <div class="catalog-content">
      <!-- Header -->
      <header class="catalog-header">
        <h1 class="catalog-title">
          <span class="icon">◆</span>
          CATÁLOGO
          <span class="icon">◆</span>
        </h1>
        <p class="catalog-subtitle">Todas las piezas de la colección</p>
      </header>

      <!-- Filters & Sort Bar -->
      <div class="filter-bar">
        <!-- Category Filter -->
        <div class="filter-group">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="selectedCategory = cat.id"
            :class="['filter-btn', { active: selectedCategory === cat.id }]"
          >
            {{ cat.nombre }}
          </button>
        </div>

        <!-- Sort & View Options -->
        <div class="filter-actions">
          <!-- Sort -->
          <select v-model="sortBy" class="sort-select">
            <option value="featured">Destacados</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="newest">Más Nuevos</option>
          </select>

          <!-- View Toggle -->
          <div class="view-toggle">
            <button 
              @click="viewMode = 'grid'"
              :class="['view-btn', { active: viewMode === 'grid' }]"
              title="Vista en cuadrícula"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="['view-btn', { active: viewMode === 'list' }]"
              title="Vista en lista"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Advanced Filters (Collapsible) -->
      <div class="advanced-filters" v-if="showAdvancedFilters">
        <div class="filter-section">
          <h3 class="filter-title">Precio</h3>
          <div class="price-range">
            <input 
              v-model.number="priceRange.min" 
              type="number" 
              placeholder="Mín"
              class="price-input"
            />
            <span class="price-separator">-</span>
            <input 
              v-model.number="priceRange.max" 
              type="number" 
              placeholder="Máx"
              class="price-input"
            />
          </div>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Colores</h3>
          <div class="color-filters">
            <button
              v-for="color in availableColors"
              :key="color.value"
              @click="toggleColor(color.value)"
              :class="['color-btn', { active: selectedColors.includes(color.value) }]"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
            ></button>
          </div>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Características</h3>
          <label class="checkbox-label">
            <input v-model="onlyNew" type="checkbox" />
            <span>Solo Nuevos</span>
          </label>
          <label class="checkbox-label">
            <input v-model="onlyDiscount" type="checkbox" />
            <span>Solo Ofertas</span>
          </label>
        </div>

        <button @click="clearFilters" class="clear-filters-btn">
          Limpiar Filtros
        </button>
      </div>

      <!-- Toggle Advanced Filters -->
      <button 
        @click="showAdvancedFilters = !showAdvancedFilters"
        class="toggle-filters-btn"
      >
        {{ showAdvancedFilters ? 'Ocultar' : 'Mostrar' }} Filtros Avanzados
        <svg 
          :class="['arrow-icon', { rotated: showAdvancedFilters }]"
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <!-- Results Count -->
      <div class="results-info">
        <p>{{ filteredProducts.length }} productos encontrados</p>
      </div>

      <!-- Products Grid/List -->
      <TransitionGroup 
        :name="viewMode === 'grid' ? 'grid' : 'list'"
        tag="div"
        :class="['products-container', viewMode]"
      >
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          :class="['product-card', viewMode]"
          @click="handleProductClick(product)"
        >
          <!-- Image -->
          <div class="product-image">
            <img :src="product.imagen" :alt="product.nombre || 'Producto'" />
            
            <!-- Badges -->
            <div class="badges">
              <span v-if="product.nuevo" class="badge new">NUEVO</span>
              <span v-if="product.precioAnterior" class="badge sale">SALE</span>
            </div>

            <!-- Quick Actions (Grid View) -->
            <div v-if="viewMode === 'grid'" class="quick-actions">
              <button 
                @click.stop="handleQuickView(product)"
                class="quick-btn"
                title="Vista rápida"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button 
                @click.stop="handleAddToCart(product)"
                class="quick-btn"
                title="Agregar al carrito"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="product-info">
            <p class="product-category">{{ product.categoria || 'Sin categoría' }}</p>
            <h3 class="product-name">{{ product.nombre || 'Producto' }}</h3>
            
            <!-- Colors -->
            <div class="product-colors">
              <span 
                v-for="color in product.colores?.slice(0, 4)" 
                :key="color"
                class="color-dot"
                :style="{ backgroundColor: color }"
              ></span>
              <span v-if="(product.colores?.length || 0) > 4" class="color-more">
                +{{ (product.colores?.length || 0) - 4 }}
              </span>
            </div>

            <!-- Price -->
            <div class="product-price">
              <span v-if="product.precioAnterior" class="price-old">
                ${{ product.precioAnterior }}
              </span>
              <span class="price-current">${{ product.precio || 0 }}</span>
            </div>

            <!-- Description (List View) -->
            <p v-if="viewMode === 'list'" class="product-description">
              {{ product.descripcion }}
            </p>

            <!-- Actions (List View) -->
            <div v-if="viewMode === 'list'" class="product-actions">
              <button 
                @click.stop="handleQuickView(product)"
                class="action-btn secondary"
              >
                Vista Rápida
              </button>
              <button 
                @click.stop="handleAddToCart(product)"
                class="action-btn primary"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          ←
        </button>
        
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="currentPage = page"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>

        <button 
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          →
        </button>
      </div>
    </div>

    <!-- Quick View Modal -->
    <BaseModal v-model="showQuickView" size="large">
      <ProductQuickView 
        v-if="selectedProduct"
        :product="selectedProduct"
        @addToCart="handleAddToCartFromModal"
        @close="showQuickView = false"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import StarsBackground from '@/components/ui/StarBackground.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import ProductQuickView from '@/components/product/ProducQuickView.vue';

interface Product {
  id: number | string;
  nombre?: string;
  titulo?: string;
  imagen: string;
  imagenes?: string[];
  precio?: number;
  precioAnterior?: number;
  categoria?: string;
  nuevo?: boolean;
  colores?: string[];
  descripcion?: string;
  caracteristicas?: string[];
  stock?: number;
  tallas?: string[];
  ruta?: string;
  badge?: string;
  size?: 'normal' | 'featured' | 'wide' | 'tall';
}

const router = useRouter();

// State
const selectedCategory = ref('todos');
const sortBy = ref('featured');
const viewMode = ref<'grid' | 'list'>('grid');
const showAdvancedFilters = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Filters
const priceRange = ref({ min: 0, max: 200 });
const selectedColors = ref<string[]>([]);
const onlyNew = ref(false);
const onlyDiscount = ref(false);

// Modal
const showQuickView = ref(false);
const selectedProduct = ref<Product | null>(null);

// Categories
const categories = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'remeras', nombre: 'Remeras' },
  { id: 'buzos', nombre: 'Buzos' },
  { id: 'pantalones', nombre: 'Pantalones' },
  { id: 'accesorios', nombre: 'Accesorios' },
];

// Available Colors
const availableColors = [
  { name: 'Negro', value: '#000000' },
  { name: 'Blanco', value: '#FFFFFF' },
  { name: 'Oro', value: '#DAA520' },
  { name: 'Marrón', value: '#8B4513' },
  { name: 'Gris', value: '#6b7280' },
  { name: 'Azul', value: '#1e3a8a' },
];

// All Products (esto vendría de una API o store)
const allProducts = ref<Product[]>([
  // Remeras
  {
    id: 'rem-1',
    nombre: 'Arcana Nº1',
    imagen: '/images/remera-1.jpg',
    imagenes: ['/images/remera-1.jpg'],
    precio: 45,
    precioAnterior: 60,
    categoria: 'Remera',
    nuevo: true,
    colores: ['#000000', '#FFFFFF', '#DAA520', '#8B4513'],
    descripcion: 'Remera premium con diseño místico y acabado suave.',
  },
  {
    id: 'rem-2',
    nombre: 'Mystic Circle',
    imagen: '/images/remera-2.jpg',
    precio: 42,
    categoria: 'Remera',
    colores: ['#000000', '#1a1a1a'],
    descripcion: 'Círculo místico bordado con detalles en hilo dorado.',
  },
  {
    id: 'rem-3',
    nombre: 'Digital Tarot',
    imagen: '/images/remera-3.jpg',
    precio: 48,
    categoria: 'Remera',
    nuevo: true,
    colores: ['#FFFFFF', '#DAA520'],
    descripcion: 'Fusión de tarot tradicional con estética cyberpunk.',
  },
  {
    id: 'rem-4',
    nombre: 'Sacred Geometry',
    imagen: '/images/remera-4.jpg',
    precio: 50,
    precioAnterior: 65,
    categoria: 'Remera',
    colores: ['#000000', '#2a2a2a', '#3a3a3a'],
    descripcion: 'Geometría sagrada en alta definición.',
  },
  // Buzos
  {
    id: 'buz-1',
    nombre: 'Ethereal Hoodie',
    imagen: '/images/buzo-1.jpg',
    precio: 85,
    precioAnterior: 110,
    categoria: 'Buzo',
    nuevo: true,
    colores: ['#000000', '#1a1a1a', '#DAA520'],
    descripcion: 'Buzo con capucha premium, ultra suave y cálido.',
  },
  {
    id: 'buz-2',
    nombre: 'Cosmic Energy',
    imagen: '/images/buzo-2.jpg',
    precio: 90,
    categoria: 'Buzo',
    colores: ['#FFFFFF', '#f0f0f0'],
    descripcion: 'Energía cósmica plasmada en tejido premium.',
  },
  {
    id: 'buz-3',
    nombre: 'Lunar Phase',
    imagen: '/images/buzo-3.jpg',
    precio: 95,
    categoria: 'Buzo',
    nuevo: true,
    colores: ['#000000', '#2a2a2a', '#FFFFFF'],
    descripcion: 'Fases lunares en diseño minimalista elegante.',
  },
  {
    id: 'buz-4',
    nombre: 'Astral Journey',
    imagen: '/images/buzo-4.jpg',
    precio: 88,
    precioAnterior: 115,
    categoria: 'Buzo',
    colores: ['#DAA520', '#FFD700', '#8B4513'],
    descripcion: 'Viaje astral representado en bordados detallados.',
  },
  // Pantalones
  {
    id: 'pant-1',
    nombre: 'Void Walker',
    imagen: '/images/pantalon-1.jpg',
    precio: 75,
    categoria: 'Pantalón',
    nuevo: true,
    colores: ['#000000', '#1a1a1a'],
    descripcion: 'Pantalón cargo con múltiples bolsillos tácticos.',
  },
  {
    id: 'pant-2',
    nombre: 'Dimensional Cargo',
    imagen: '/images/pantalon-2.jpg',
    precio: 80,
    categoria: 'Pantalón',
    colores: ['#000000', '#2a2a2a', '#8B4513'],
    descripcion: 'Cargo multidimensional con diseño futurista.',
  },
  {
    id: 'pant-3',
    nombre: 'Quantum Jogger',
    imagen: '/images/pantalon-3.jpg',
    precio: 72,
    precioAnterior: 95,
    categoria: 'Pantalón',
    colores: ['#000000', '#FFFFFF'],
    descripcion: 'Jogger deportivo con tecnología de tejido avanzada.',
  },
  {
    id: 'pant-4',
    nombre: 'Parallel Lines',
    imagen: '/images/pantalon-4.jpg',
    precio: 78,
    categoria: 'Pantalón',
    nuevo: true,
    colores: ['#1a1a1a', '#3a3a3a'],
    descripcion: 'Líneas paralelas que desafían las dimensiones.',
  },
]);

// Computed
const filteredProducts = computed(() => {
  let filtered = [...allProducts.value];

  // Category filter
  if (selectedCategory.value !== 'todos') {
    filtered = filtered.filter(p => 
      p.categoria?.toLowerCase().includes(selectedCategory.value.toLowerCase())
    );
  }

  // Price filter
  if (priceRange.value.min > 0 || priceRange.value.max < 200) {
    filtered = filtered.filter(p => {
      const precio = p.precio || 0;
      return precio >= priceRange.value.min && precio <= priceRange.value.max;
    });
  }

  // Color filter
  if (selectedColors.value.length > 0) {
    filtered = filtered.filter(p =>
      p.colores?.some(c => selectedColors.value.includes(c))
    );
  }

  // New filter
  if (onlyNew.value) {
    filtered = filtered.filter(p => p.nuevo);
  }

  // Discount filter
  if (onlyDiscount.value) {
    filtered = filtered.filter(p => p.precioAnterior);
  }

  // Sort
  switch (sortBy.value) {
    case 'name-asc':
      filtered.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
      break;
    case 'name-desc':
      filtered.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
      break;
    case 'price-asc':
      filtered.sort((a, b) => (a.precio || 0) - (b.precio || 0));
      break;
    case 'price-desc':
      filtered.sort((a, b) => (b.precio || 0) - (a.precio || 0));
      break;
    case 'newest':
      filtered.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));
      break;
  }

  return filtered;
});

const totalPages = computed(() => 
  Math.ceil(filteredProducts.value.length / itemsPerPage.value)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const displayedPages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const toggleColor = (color: string) => {
  const index = selectedColors.value.indexOf(color);
  if (index > -1) {
    selectedColors.value.splice(index, 1);
  } else {
    selectedColors.value.push(color);
  }
};

const clearFilters = () => {
  priceRange.value = { min: 0, max: 200 };
  selectedColors.value = [];
  onlyNew.value = false;
  onlyDiscount.value = false;
};

const handleProductClick = (product: Product) => {
  router.push(`/producto/${product.id}`);
};

const handleQuickView = (product: Product) => {
  selectedProduct.value = product;
  showQuickView.value = true;
};

const handleAddToCart = (product: Product) => {
  console.log('Adding to cart:', product);
  alert(`${product.nombre || 'Producto'} agregado al carrito`);
};

const handleAddToCartFromModal = (
  product: Product, 
  quantity: number, 
  color?: string, 
  size?: string
) => {
  console.log('Adding from modal:', { product, quantity, color, size });
  
  // Construir mensaje con detalles
  let message = `${product.nombre || 'Producto'} x${quantity} agregado al carrito`;
  if (color) message += ` - Color seleccionado`;
  if (size) message += ` - Talle: ${size}`;
  
  alert(message);
  showQuickView.value = false;
  
  // TODO: Aquí conectar con tu store de carrito
  // useCartStore().addItem({ ...product, quantity, color, size })
};
</script>

<style scoped>
.catalog-container {
  position: relative;
  min-height: 100vh;
  background: #000;
  overflow-x: hidden;
}

/* Decoraciones flotantes */
.floating-decorations {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.08;
}

.decoration {
  position: absolute;
  width: 250px;
  height: 250px;
  object-fit: contain;
  filter: blur(2px);
}

.decoration-1 {
  top: 20%;
  left: -5%;
  animation: float1 30s ease-in-out infinite;
}

.decoration-2 {
  bottom: 15%;
  right: -5%;
  animation: float2 35s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(25px, -25px) rotate(10deg); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-25px, 25px) rotate(-10deg); }
}

/* Content */
.catalog-content {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
}

/* Header */
.catalog-header {
  text-align: center;
  margin-bottom: 3rem;
}

.catalog-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  letter-spacing: 0.3em;
  color: #fff;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.catalog-title .icon {
  color: #DAA520;
  margin: 0 1rem;
  font-size: 0.8em;
}

.catalog-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.filter-btn:hover {
  border-color: rgba(218, 165, 32, 0.5);
  color: #DAA520;
}

.filter-btn.active {
  background: #DAA520;
  border-color: #DAA520;
  color: #000;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-select {
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.9rem;
  border-radius: 2px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.sort-select:focus {
  outline: none;
  border-color: #DAA520;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  padding: 0.25rem;
}

.view-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.view-btn:hover {
  color: #DAA520;
}

.view-btn.active {
  background: rgba(218, 165, 32, 0.2);
  color: #DAA520;
}

/* Advanced Filters */
.advanced-filters {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-title {
  font-size: 1rem;
  font-weight: 500;
  color: #DAA520;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  flex: 1;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.9rem;
  border-radius: 2px;
}

.price-input:focus {
  outline: none;
  border-color: #DAA520;
}

.price-separator {
  color: rgba(255, 255, 255, 0.5);
}

.color-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-btn {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.color-btn:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.color-btn.active {
  border-color: #DAA520;
  border-width: 3px;
}

.color-btn.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #DAA520;
  font-weight: bold;
  text-shadow: 0 0 4px #000;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 0.95rem;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.clear-filters-btn {
  grid-column: 1 / -1;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.clear-filters-btn:hover {
  border-color: #ff4444;
  color: #ff4444;
}

.toggle-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;
  margin-bottom: 2rem;
}

.toggle-filters-btn:hover {
  border-color: #DAA520;
  color: #DAA520;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

/* Results Info */
.results-info {
  text-align: center;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  letter-spacing: 0.1em;
}

/* Products Container */
.products-container {
  margin-bottom: 4rem;
}

.products-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.products-container.list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Product Card - Grid View */
.product-card.grid {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-card.grid:hover {
  transform: translateY(-8px);
}

.product-card.grid .product-image {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
}

.product-card.grid .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card.grid:hover .product-image img {
  transform: scale(1.1);
}

/* Product Card - List View */
.product-card.list {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card.list:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(218, 165, 32, 0.3);
}

.product-card.list .product-image {
  width: 250px;
  height: 250px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.product-card.list .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Badges */
.badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 2;
}

.badge {
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  border-radius: 2px;
}

.badge.new {
  background: #4ade80;
  color: #000;
}

.badge.sale {
  background: #ff4444;
  color: #fff;
}

/* Quick Actions */
.quick-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.product-card:hover .quick-actions {
  opacity: 1;
}

.quick-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-btn:hover {
  background: #DAA520;
  border-color: #DAA520;
  color: #000;
  transform: scale(1.1);
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-category {
  color: #DAA520;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.product-colors {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 0.25rem 0;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.color-more {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.price-old {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: line-through;
  font-size: 0.95rem;
}

.price-current {
  color: #DAA520;
  font-size: 1.3rem;
  font-weight: 600;
}

.product-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 1rem 0;
}

.product-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.action-btn.primary {
  background: #DAA520;
  color: #000;
}

.action-btn.primary:hover {
  background: #FFD700;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
}

.action-btn.secondary:hover {
  border-color: #DAA520;
  color: #DAA520;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 4rem;
}

.page-btn {
  min-width: 45px;
  height: 45px;
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.page-btn:hover:not(:disabled) {
  border-color: #DAA520;
  color: #DAA520;
}

.page-btn.active {
  background: #DAA520;
  border-color: #DAA520;
  color: #000;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Animations */
.grid-enter-active,
.grid-leave-active,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.grid-enter-from,
.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.grid-leave-to,
.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 1024px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-actions {
    justify-content: space-between;
  }

  .products-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .product-card.list {
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .product-card.list .product-image {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 768px) {
  .catalog-content {
    padding: 6rem 1rem 2rem;
  }

  .filter-bar {
    padding: 1rem;
  }

  .filter-group {
    width: 100%;
  }

  .filter-btn {
    flex: 1;
    text-align: center;
  }

  .advanced-filters {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .products-container.grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .product-card.list {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .product-card.list .product-image {
    width: 100%;
    height: 200px;
  }

  .decoration {
    display: none;
  }
}

@media (max-width: 480px) {
  .catalog-title {
    font-size: 2rem;
  }

  .products-container.grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-select,
  .view-toggle {
    width: 100%;
  }
}
</style>