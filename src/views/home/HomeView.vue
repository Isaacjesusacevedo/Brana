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

    <!-- Piezas Destacadas -->
    <HomePiezasDestacadas
      :products="piezasDestacadas"
      @productClick="handleProductClick"
      @quickView="handleQuickView"
    />
    <!-- Colección Destacada -->
    <HomeFeatured
      :items="featuredItems"
      @itemClick="handleFeaturedClick"
    />

    <!-- Categorías -->
    <HomeCategorias>
      <!-- Categoría: Remeras -->
      <CategorySection
        :category="categorias.remeras"
        @productClick="handleProductClick"
        @quickView="handleQuickView"
      />

      <!-- Categoría: Buzos -->
      <CategorySection
        :category="categorias.buzos"
        @productClick="handleProductClick"
        @quickView="handleQuickView"
      />

      <!-- Categoría: Pantalones -->
      <CategorySection
        :category="categorias.pantalones"
        @productClick="handleProductClick"
        @quickView="handleQuickView"
      />
    </HomeCategorias>

    <!-- Filosofía Preview -->
    <HomePhilosophy />

    <!-- Newsletter/CTA Final -->
    <HomeNewsletter @submit="handleNewsletter" />

    <!-- Modal de vista rápida del producto -->
    <BaseModal 
      v-model="showQuickView" 
      size="large"
    >
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
import { ref, reactive } from 'vue';
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
import HomeNewsletter from '@/components/home/HomeNewletter.vue';

// Product Components
import CategorySection from '@/components/product/CategorySection.vue';
import ProductQuickView from '@/components/product/ProducQuickView.vue';

// Types
import type { Category, FeaturedItem, Product } from '@/types/Index';

const router = useRouter();

// Estado del modal
const showQuickView = ref(false);
const selectedProduct = ref<Product | null>(null);

// Data para carrusel principal
const featuredItems = ref<FeaturedItem[]>([
  {
    id: 1,
    imagen: '/images/featured-1.jpg',
    titulo: 'The Magician',
    categoria: 'Streetwear Premium',
  },
  {
    id: 2,
    imagen: '/images/featured-2.jpg',
    titulo: 'The Empress',
    categoria: 'Alta Costura',
  },
  {
    id: 3,
    imagen: '/images/featured-3.jpg',
    titulo: 'The Hierophant',
    categoria: 'Edición Limitada',
  },
  {
    id: 4,
    imagen: '/images/featured-4.jpg',
    titulo: 'The Lovers',
    categoria: 'Colección Dual',
  },
  {
    id: 5,
    imagen: '/images/featured-5.jpg',
    titulo: 'The Chariot',
    categoria: 'Deportivo Luxury',
  },
  {
    id: 6,
    imagen: '/images/featured-6.jpg',
    titulo: 'Strength',
    categoria: 'Oversize Collection',
  },
]);

// Data para piezas destacadas (productos especiales en grid)
const piezasDestacadas = ref<Product[]>([
  {
    id: 'featured-1',
    nombre: 'OBSIDIAN_ESSENCE',
    imagen: '/images/featured/obsidian.jpg',
    imagenes: [
      '/images/featured/obsidian.jpg',
      '/images/featured/obsidian-alt.jpg',
    ],
    precio: 89,
    categoria: 'Edición Especial',
    badge: 'EXCLUSIVO',
    size: 'featured',
    colores: ['#1a1a1a', '#D4AF37', '#f5f5f5'],
    descripcion: 'Pieza exclusiva de la colección Obsidian. Diseño único con detalles en oro.',
    caracteristicas: [
      'Edición limitada 50 unidades',
      'Bordado artesanal en oro',
      'Tela premium importada',
      'Certificado de autenticidad',
    ],
  },
  {
    id: 'featured-2',
    nombre: 'GOLDEN_VOID',
    imagen: '/images/featured/golden-void.jpg',
    precio: 85,
    categoria: 'Premium',
    colores: ['#1a1a1a', '#6b7280', '#1e3a8a'],
    descripcion: 'El vacío dorado materializado en tela premium.',
  },
  {
    id: 'featured-3',
    nombre: 'AMBER_RITUAL',
    imagen: '/images/featured/amber.jpg',
    precio: 92,
    categoria: 'Ritual Collection',
    colores: ['#D4AF37', '#1a1a1a', '#854d0e'],
    nuevo: true,
    descripcion: 'Ritual del ámbar. Diseño ceremonial para los elegidos.',
  },
  {
    id: 'featured-4',
    nombre: 'ELDRITCH_LUXURY',
    imagen: '/images/featured/eldritch.jpg',
    precio: 88,
    categoria: 'Luxury Line',
    size: 'wide',
    colores: ['#f5f5f5', '#1a1a1a'],
    descripcion: 'Lujo ancestral. Para quienes comprenden el misterio.',
  },
  {
    id: 'featured-5',
    nombre: 'SOLAR_GOLD',
    imagen: '/images/featured/solar.jpg',
    precio: 90,
    categoria: 'Solar Series',
    colores: ['#D4AF37', '#FFD700'],
    descripcion: 'Oro solar capturado en tejido premium.',
  },
  {
    id: 'featured-6',
    nombre: 'COSMIC_GOLD',
    imagen: '/images/featured/cosmic.jpg',
    precio: 95,
    categoria: 'Cosmic Collection',
    size: 'tall',
    nuevo: true,
    colores: ['#D4AF37', '#1a1a1a', '#FFD700'],
    descripcion: 'El cosmos dorado en su máxima expresión.',
  },
]);

// Data para categorías
const categorias = reactive<{
  remeras: Category;
  buzos: Category;
  pantalones: Category;
}>({
  remeras: {
    id: 'remeras',
    nombre: 'Remeras',
    descripcion: 'Diseños únicos que cuentan historias',
    icono: '✧',
    ruta: '/categoria/remeras',
    productos: [
      {
        id: 'rem-1',
        nombre: 'Arcana Nº1',
        imagen: '/images/remera-1.jpg',
        imagenes: ['/images/remera-1.jpg', '/images/remera-1-alt.jpg'],
        precio: 45,
        precioAnterior: 60,
        categoria: 'Remera',
        nuevo: true,
        colores: ['#000000', '#FFFFFF', '#DAA520', '#8B4513'],
        descripcion: 'Remera premium con diseño místico y acabado suave.',
        caracteristicas: [
          '100% algodón orgánico',
          'Diseño serigrafado a mano',
          'Corte regular fit',
          'Edición limitada'
        ],
      },
      {
        id: 'rem-2',
        nombre: 'Mystic Circle',
        imagen: '/images/remera-2.jpg',
        imagenes: ['/images/remera-2.jpg'],
        precio: 42,
        categoria: 'Remera',
        colores: ['#000000', '#1a1a1a'],
        descripcion: 'Círculo místico bordado con detalles en hilo dorado.',
      },
      {
        id: 'rem-3',
        nombre: 'Digital Tarot',
        imagen: '/images/remera-3.jpg',
        imagenes: ['/images/remera-3.jpg'],
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
        imagenes: ['/images/remera-4.jpg'],
        precio: 50,
        precioAnterior: 65,
        categoria: 'Remera',
        colores: ['#000000', '#2a2a2a', '#3a3a3a'],
        descripcion: 'Geometría sagrada en alta definición.',
      },
    ],
  },
  buzos: {
    id: 'buzos',
    nombre: 'Buzos',
    descripcion: 'Confort místico para tus días',
    icono: '◆',
    ruta: '/categoria/buzos',
    productos: [
      {
        id: 'buz-1',
        nombre: 'Ethereal Hoodie',
        imagen: '/images/buzo-1.jpg',
        imagenes: ['/images/buzo-1.jpg', '/images/buzo-1-alt.jpg'],
        precio: 85,
        precioAnterior: 110,
        categoria: 'Buzo',
        nuevo: true,
        colores: ['#000000', '#1a1a1a', '#DAA520'],
        descripcion: 'Buzo con capucha premium, ultra suave y cálido.',
        caracteristicas: [
          'Tejido premium extra suave',
          'Capucha ajustable',
          'Bolsillo canguro amplio',
          'Puños y bajo elastizados'
        ],
      },
      {
        id: 'buz-2',
        nombre: 'Cosmic Energy',
        imagen: '/images/buzo-2.jpg',
        imagenes: ['/images/buzo-2.jpg'],
        precio: 90,
        categoria: 'Buzo',
        colores: ['#FFFFFF', '#f0f0f0'],
        descripcion: 'Energía cósmica plasmada en tejido premium.',
      },
      {
        id: 'buz-3',
        nombre: 'Lunar Phase',
        imagen: '/images/buzo-3.jpg',
        imagenes: ['/images/buzo-3.jpg'],
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
        imagenes: ['/images/buzo-4.jpg'],
        precio: 88,
        precioAnterior: 115,
        categoria: 'Buzo',
        colores: ['#DAA520', '#FFD700', '#8B4513'],
        descripcion: 'Viaje astral representado en bordados detallados.',
      },
    ],
  },
  pantalones: {
    id: 'pantalones',
    nombre: 'Pantalones',
    descripcion: 'Movimiento y estilo en armonía',
    icono: '☆',
    ruta: '/categoria/pantalones',
    productos: [
      {
        id: 'pant-1',
        nombre: 'Void Walker',
        imagen: '/images/pantalon-1.jpg',
        imagenes: ['/images/pantalon-1.jpg'],
        precio: 75,
        categoria: 'Pantalón',
        nuevo: true,
        colores: ['#000000', '#1a1a1a'],
        descripcion: 'Pantalón cargo con múltiples bolsillos tácticos.',
        caracteristicas: [
          'Tela resistente y flexible',
          '8 bolsillos funcionales',
          'Cintura ajustable',
          'Corte carpenter'
        ],
      },
      {
        id: 'pant-2',
        nombre: 'Dimensional Cargo',
        imagen: '/images/pantalon-2.jpg',
        imagenes: ['/images/pantalon-2.jpg'],
        precio: 80,
        categoria: 'Pantalón',
        colores: ['#000000', '#2a2a2a', '#8B4513'],
        descripcion: 'Cargo multidimensional con diseño futurista.',
      },
      {
        id: 'pant-3',
        nombre: 'Quantum Jogger',
        imagen: '/images/pantalon-3.jpg',
        imagenes: ['/images/pantalon-3.jpg'],
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
        imagenes: ['/images/pantalon-4.jpg'],
        precio: 78,
        categoria: 'Pantalón',
        nuevo: true,
        colores: ['#1a1a1a', '#3a3a3a'],
        descripcion: 'Líneas paralelas que desafían las dimensiones.',
      },
    ],
  },
});

// Handlers
const handleFeaturedClick = (item: FeaturedItem) => {
  console.log('Featured item clicked:', item);
  // Puedes agregar lógica adicional aquí
};

const handleProductClick = (product: Product) => {
  console.log('Product clicked:', product);
  router.push(`/producto/${product.id}`);
};

const handleQuickView = (product: Product) => {
  selectedProduct.value = product;
  showQuickView.value = true;
};

const handleAddToCart = (product: Product, quantity: number, color?: string, size?: string) => {
  console.log('Adding to cart:', { product, quantity, color, size });
  
  // Aquí iría la lógica del carrito
  // Por ahora solo mostramos un mensaje
  alert(`Agregado al carrito: ${product.nombre} x${quantity}`);
  
  // Cerrar el modal
  showQuickView.value = false;
};

const handleNewsletter = (email: string) => {
  console.log('Newsletter subscription:', email);
  // Aquí iría la lógica para suscribir al newsletter
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
  50% { transform: translate(30px, -30px) rotate(10deg); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-30px, 30px) rotate(-10deg); }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(40px, -20px) rotate(15deg); }
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .decoration {
    width: 200px;
    height: 200px;
    opacity: 0.8;
  }
}

/* Móvil (<= 640px) */
@media (max-width: 640px) {
  .decoration {
    display: none;
  }
}
</style>