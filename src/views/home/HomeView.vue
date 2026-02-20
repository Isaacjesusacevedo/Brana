<template>
  <div class="home-container">
    <!-- Fondo de estrellas -->
    <StarsBackground :particleCount="80" />
    
    <!-- Decoraciones flotantes -->
    <div class="floating-decorations">
      <img 
        src="@/assets/images/logos/estatuaart1.png" 
        alt="Decoration" 
        class="decoration decoration-1"
      />
      <img 
        src="@/assets/images/logos/estatuart2.png" 
        alt="Decoration" 
        class="decoration decoration-2"
      />
      <img 
        src="@/assets/images/logos/toquealoeterno.png" 
        alt="Decoration" 
        class="decoration decoration-3"
      />
    </div>

    <!-- Hero Section -->
    <HomeHero />

    <!-- Loading global -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-symbol">◈</div>
      <p class="loading-text">CARGANDO COLECCIÓN...</p>
    </div>

    <!-- Error global -->
    <div v-else-if="error" class="error-banner">
      <p>⚠ No se pudo cargar la colección. <button @click="fetchData">Reintentar</button></p>
    </div>

    <template v-else>
      <!-- Piezas Destacadas — viene de GET /api/products/featured -->
      <HomePiezasDestacadas
        :products="piezasDestacadas"
        @productClick="handleProductClick"
        @quickView="handleQuickView"
      />

      <!-- Colección Destacada (carrusel editorial) — datos fijos, no son productos del DB -->
      <HomeFeatured
        :items="featuredItems"
        @itemClick="handleFeaturedClick"
      />

      <!-- Categorías — viene de GET /api/categories -->
      <HomeCategorias>
        <CategorySection
          v-for="cat in categorias"
          :key="cat.id"
          :category="cat"
          @productClick="handleProductClick"
          @quickView="handleQuickView"
        />
      </HomeCategorias>
    </template>

    <!-- Filosofía Preview -->
    <HomePhilosophy />

    <!-- Newsletter/CTA Final -->
    <HomeNewsletter @submit="handleNewsletter" />

    <!-- Modal de vista rápida del producto -->
    <BaseModal v-model="showQuickView" size="large">
      <ProductQuickView 
        v-if="selectedProduct"
        :product="selectedProduct"
        @addToCart="handleAddToCart"
        @close="showQuickView = false"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Layout & UI Components
import StarsBackground from '@/components/ui/StarBackground.vue';
import BaseModal from '@/components/ui/BaseModal.vue';

// Home Components
import HomeHero from '@/components/home/HomeHero.vue';
import HomeFeatured from '@/components/home/HomeFeatured.vue';
import HomeCategorias from '@/components/home/HomeCategorias.vue';
import HomePiezasDestacadas from '@/components/home/HomePiezasDestacadas.vue';
import HomePhilosophy from '@/components/home/HomePhilosophy.vue';
import HomeNewsletter from '@/components/home/HomeNewletter.vue';         // ✅ FIX: HomeNewletter → HomeNewsletter

// Product Components
import CategorySection from '@/components/product/CategorySection.vue';
import ProductQuickView from '@/components/product/ProducQuickView.vue';

// Types & API
import type { Category, FeaturedItem, Product } from '@/types/Index';
import { productosApi, categoriasApi } from '@/services/api';

const router = useRouter();

// ─── Estado de carga ──────────────────────────────────────────────────────────
const loading = ref(true);
const error   = ref(false);

// ─── Estado del modal ─────────────────────────────────────────────────────────
const showQuickView   = ref(false);
const selectedProduct = ref<Product | null>(null);

// ─── Datos de la API ──────────────────────────────────────────────────────────
const piezasDestacadas = ref<Product[]>([]);
const categorias       = ref<Category[]>([]);

// ─── Carrusel editorial (datos de marketing, no vienen del DB) ────────────────
const featuredItems = ref<FeaturedItem[]>([
  { id: 1, imagen: '/images/featured-1.jpg', titulo: 'The Magician',   categoria: 'Streetwear Premium' },
  { id: 2, imagen: '/images/featured-2.jpg', titulo: 'The Empress',    categoria: 'Alta Costura'        },
  { id: 3, imagen: '/images/featured-3.jpg', titulo: 'The Hierophant', categoria: 'Edición Limitada'    },
  { id: 4, imagen: '/images/featured-4.jpg', titulo: 'The Lovers',     categoria: 'Colección Dual'      },
  { id: 5, imagen: '/images/featured-5.jpg', titulo: 'The Chariot',    categoria: 'Deportivo Luxury'    },
  { id: 6, imagen: '/images/featured-6.jpg', titulo: 'Strength',       categoria: 'Oversize Collection' },
]);

// ─── Carga de datos ───────────────────────────────────────────────────────────
const fetchData = async () => {
  loading.value = true;
  error.value   = false;

  try {
    // Ambas llamadas en paralelo para máxima velocidad
    const [featured, allCats] = await Promise.all([
      productosApi.getFeatured(6),  // GET /api/products/featured?limit=6
      categoriasApi.getAll(),       // GET /api/categories
    ]);

    piezasDestacadas.value = featured;

    // Solo categorías con slug y con al menos un producto
    categorias.value = allCats.filter(c => c.slug && c.productos.length > 0);
  } catch (e) {
    console.error('Error cargando datos de la home:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

// ─── Handlers ─────────────────────────────────────────────────────────────────

// ✅ FIX: handler faltante en la versión anterior — HomePiezasDestacadas y
//         CategorySection emiten este evento, sin él TypeScript lo marca como error
const handleProductClick = (product: Product) => {
  router.push(`/producto/${product.id}`);
};

const handleFeaturedClick = (item: FeaturedItem) => {
  // TODO: navegar a colección o detalle según el item
  console.log('Featured item clicked:', item);
};

const handleQuickView = (product: Product) => {
  selectedProduct.value = product;
  showQuickView.value = true;
};

const handleAddToCart = (product: Product, quantity: number, color?: string, size?: string) => {
  // TODO: conectar con useCartStore() cuando implementes el carrito
  console.log('Adding to cart:', { product, quantity, color, size });
  alert(`Agregado al carrito: ${product.nombre} x${quantity}`);
  showQuickView.value = false;
};

const handleNewsletter = (email: string) => {
  // TODO: conectar con endpoint de newsletter
  console.log('Newsletter subscription:', email);
};
</script>

<style scoped>
.home-container {
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
  opacity: 0.15;
}

.decoration {
  position: absolute;
  width: 300px;
  height: 300px;
  object-fit: contain;
  filter: blur(1px);
}

.decoration-1 {
  top: 10%;
  left: -5%;
  animation: float1 20s ease-in-out infinite;
}

.decoration-2 {
  top: 40%;
  right: -5%;
  animation: float2 25s ease-in-out infinite;
}

.decoration-3 {
  bottom: 10%;
  left: 5%;
  animation: float3 30s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50%       { transform: translate(30px, -30px) rotate(10deg); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50%       { transform: translate(-30px, 30px) rotate(-10deg); }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50%       { transform: translate(40px, -20px) rotate(15deg); }
}

/* Loading */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem;
  gap: 1.5rem;
}

.loading-symbol {
  font-size: 4rem;
  color: #DAA520;
  animation: spinSlow 3s linear infinite;
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.loading-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}

/* Error */
.error-banner {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.error-banner button {
  margin-left: 1rem;
  padding: 0.5rem 1.5rem;
  background: #DAA520;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: background 0.2s;
}

.error-banner button:hover {
  background: #FFD700;
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .decoration {
    width: 200px;
    height: 200px;
    opacity: 0.8;
  }
}

/* Móvil */
@media (max-width: 640px) {
  .decoration {
    display: none;
  }
}
</style>