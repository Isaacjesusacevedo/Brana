<template>
  <div class="home-container">

    <StarsBackground :particleCount="80" />

    <div class="floating-decorations" aria-hidden="true">
      <img src="@/assets/images/logos/estatuaart1.png"    alt="" class="decoration decoration-1" />
      <img src="@/assets/images/logos/estatuart2.png"     alt="" class="decoration decoration-2" />
      <img src="@/assets/images/logos/toquealoeterno.png" alt="" class="decoration decoration-3" />
    </div>

    <!-- ① HERO -->
    <HomeHero />

    <!-- ② CUATRO PILARES -->
    <HomePilares />

    <!-- ③ COLECCIÓN DESTACADA
         HomeFeatured maneja su propio fetch de best-sellers.
         Carrusel orbital con eje vertical. -->
    <HomeFeatured
      :limit="8"
      @product-click="handleProductClick"
      @quick-view="handleQuickView"
    />

    <!-- ④ CATEGORÍAS — Remeras · Buzos · Pantalones
         CategorySection con slider horizontal independiente por línea.
         Carga silenciosa; si falla usa fallback interno.
         NOTA: CategorySection ya navega internamente con router.push cuando
         el producto tiene `ruta`. handleProductClick sólo se invoca cuando
         el producto NO tiene ruta propia (fallback navigation). -->
    <section class="categories-section">
      <div class="categories-header">
        <div class="header-ornament">
          <span class="orn-line"></span>
          <span class="orn-sym">◈</span>
          <span class="orn-line"></span>
        </div>
        <h2 class="categories-title">LÍNEAS</h2>
        <p class="categories-subtitle">Explorá cada colección</p>
      </div>

      <CategorySection
        v-for="cat in categoriasConProductos"
        :key="cat.id"
        :category="cat"
        @product-click="handleProductClick"
        @quick-view="handleQuickView"
      />
    </section>

    <!-- ⑤ FUSIÓN JP-ARG -->
    <HomeFusion />

    <!-- ⑥ FILOSOFÍA -->
    <HomePhilosophy />

    <!-- ⑦ NEWSLETTER -->
    <HomeNewsletter @submit="handleNewsletter" />

    <!-- Modal Quick View -->
    <BaseModal v-model="showQuickView" size="large">
      <ProductQuickView
        v-if="selectedProduct"
        :product="selectedProduct"
        @add-to-cart="handleAddToCart"
        @close="showQuickView = false"
      />
    </BaseModal>

    <!-- Toast de feedback global (newsletter, errores, etc.) -->
    <Transition name="toast">
      <div v-if="toast.visible" :class="['home-toast', `home-toast--${toast.type}`]" role="status">
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// UI
import StarsBackground from '@/components/tienda/common/StarBackground.vue';
import BaseModal       from '@/components/tienda/common/BaseModal.vue';

// Home
import HomeHero        from '@/components/tienda/home/HomeHero.vue';
import HomePilares     from '@/components/tienda/home/HomePilares.vue';
import HomeFeatured    from '@/components/tienda/home/HomeFeatured.vue';
import HomeFusion      from '@/components/tienda/home/HomeFusion.vue';
import HomePhilosophy  from '@/components/tienda/home/HomePhilosophy.vue';
import HomeNewsletter  from '@/components/tienda/home/HomeNewletter.vue';  // typo en filename, intencional

// Product
import CategorySection  from '@/components/tienda/producto/CategorySection.vue';
import ProductQuickView from '@/components/tienda/producto/ProducQuickView.vue'; // typo en filename, intencional

// Types & API
import type { Category, Product } from '@/types/producto.types';
import { categoriasApi } from '@/services/tienda/api';
import { useCartStore }  from '@/stores/useCartStore';

const router = useRouter();
const cart   = useCartStore();

// ── Toast global ──────────────────────────────────────────────────────────────
// Reemplaza alert() y da feedback visual sin bloquear la UI.
interface Toast { message: string; type: 'success' | 'error' | 'info'; visible: boolean }
const toast = ref<Toast>({ message: '', type: 'success', visible: false });
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const showToast = (message: string, type: Toast['type'] = 'success', duration = 3500) => {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { message, type, visible: true };
  toastTimer = setTimeout(() => { toast.value.visible = false; }, duration);
};

// ── Quick View ────────────────────────────────────────────────────────────────
const showQuickView   = ref(false);
const selectedProduct = ref<Product | null>(null);

// ── Categorías (Remeras · Buzos · Pantalones) ─────────────────────────────────
const categoriasFromApi = ref<Category[]>([]);

// Fallback con productos de ejemplo — se usa si la API no responde
const FALLBACK_CATEGORIAS: Category[] = [
  {
    id: 'remeras', slug: 'remeras',
    nombre: 'Remeras', icono: '◈',
    descripcion: 'Piezas únicas con simbolismo propio. Cada diseño, una declaración.',
    ruta: '/catalogo?categoria=remeras',
    productos: [
      { id: 'r1', nombre: 'Kage',       imagen: '/images/remeras/kage.jpg',      precio: 18500, categoria: 'Remeras', nuevo: true  },
      { id: 'r2', nombre: 'Hanabi',     imagen: '/images/remeras/hanabi.jpg',    precio: 17200, categoria: 'Remeras'               },
      { id: 'r3', nombre: 'Pampa Noir', imagen: '/images/remeras/pampanoir.jpg', precio: 19800, categoria: 'Remeras', nuevo: true  },
      { id: 'r4', nombre: 'Ryū',        imagen: '/images/remeras/ryu.jpg',       precio: 21000, categoria: 'Remeras'               },
      { id: 'r5', nombre: 'Oni',        imagen: '/images/remeras/oni.jpg',       precio: 16500, categoria: 'Remeras'               },
    ],
  },
  {
    id: 'buzos', slug: 'buzos',
    nombre: 'Buzos', icono: '◆',
    descripcion: 'Abrigo con esencia. Diseños oversize para quienes habitan el margen.',
    ruta: '/catalogo?categoria=buzos',
    productos: [
      { id: 'b1', nombre: 'Tormenta Negra', imagen: '/images/buzos/tormenta.jpg',   precio: 32000, categoria: 'Buzos', nuevo: true },
      { id: 'b2', nombre: 'Viento Sur',     imagen: '/images/buzos/vientosur.jpg',  precio: 29500, categoria: 'Buzos'              },
      { id: 'b3', nombre: 'Cruz del Sur',   imagen: '/images/buzos/cruzdelsur.jpg', precio: 34000, categoria: 'Buzos'              },
      { id: 'b4', nombre: 'Tsuki',          imagen: '/images/buzos/tsuki.jpg',      precio: 31000, categoria: 'Buzos'              },
      { id: 'b5', nombre: 'Eternidad',      imagen: '/images/buzos/eternidad.jpg',  precio: 38000, categoria: 'Buzos', nuevo: true },
    ],
  },
  {
    id: 'pantalones', slug: 'pantalones',
    nombre: 'Pantalones', icono: '✦',
    descripcion: 'Cortes que rompen la forma. Estructura y movimiento en equilibrio.',
    ruta: '/catalogo?categoria=pantalones',
    productos: [
      { id: 'p1', nombre: 'Sombra',    imagen: '/images/pantalones/sombra.jpg',    precio: 27000, categoria: 'Pantalones', nuevo: true },
      { id: 'p2', nombre: 'Abismo',    imagen: '/images/pantalones/abismo.jpg',    precio: 25500, categoria: 'Pantalones'               },
      { id: 'p3', nombre: 'Éter',      imagen: '/images/pantalones/eter.jpg',      precio: 29000, categoria: 'Pantalones'               },
      { id: 'p4', nombre: 'Horizonte', imagen: '/images/pantalones/horizonte.jpg', precio: 26000, categoria: 'Pantalones'               },
    ],
  },
];

const categoriasConProductos = computed<Category[]>(() => {
  const fromApi = categoriasFromApi.value.filter(c => (c.productos?.length ?? 0) > 0);
  return fromApi.length ? fromApi : FALLBACK_CATEGORIAS;
});

// Carga silenciosa — si falla usa fallback automáticamente
const fetchCategorias = async () => {
  try {
    const all = await categoriasApi.getAll();
    categoriasFromApi.value = all.filter(c => c.slug && (c.productos?.length ?? 0) > 0);
  } catch (e) {
    console.warn('Categorías no disponibles, usando fallback:', e);
  }
};

onMounted(fetchCategorias);

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * Navega al detalle del producto.
 * Prioriza product.ruta (URL custom del backend) y cae en /producto/:id.
 *
 * NOTA: CategorySection ya hace su propio router.push cuando el producto
 * tiene `ruta`. Este handler sólo actúa en el caso en que no lo haga
 * (productos sin ruta en fallback). Para evitar doble navegación, el
 * arreglo definitivo debe estar en CategorySection eliminando el push
 * interno y delegando siempre en este handler.
 */
const handleProductClick = (product: Product) => {
  const dest = product.ruta ?? `/producto/${product.id}`;
  router.push(dest);
};

const handleQuickView = (product: Product) => {
  selectedProduct.value = product;
  showQuickView.value   = true;
};

/**
 * Agrega al carrito desde el Quick View.
 *
 * ProducQuickView emite: (product, quantity, color?, size?)
 * useCartStore.addItem espera: (product, quantity, talla?, color?)
 *
 * Se mapean explícitamente para que el orden de argumentos sea inequívoco
 * y no se rompa si la firma del store cambia.
 */
const handleAddToCart = (
  product: Product,
  cantidad: number,
  color?: string,
  talla?: string,
) => {
  cart.addItem(product, cantidad, talla, color);
  showQuickView.value = false;
  showToast(`"${product.nombre}" agregado al carrito ✓`);
};

/**
 * Suscripción al newsletter.
 * TODO: reemplazar el console.log por la llamada real al endpoint
 * cuando esté disponible (ej: newsletterApi.subscribe(email)).
 */
const handleNewsletter = (email: string) => {
  console.info('[Newsletter] Email capturado para suscripción:', email);
  // TODO: await newsletterApi.subscribe(email)
  showToast('¡Bienvenida a la tribu! Revisá tu casilla de correo.');
};
</script>

<style scoped>
.home-container {
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
  opacity: 0.12;
}

.decoration {
  position: absolute;
  width: 280px;
  height: 280px;
  object-fit: contain;
  filter: blur(1px);
}

.decoration-1 { top: 10%;    left: -5%;  animation: float1 20s ease-in-out infinite; }
.decoration-2 { top: 40%;    right: -5%; animation: float2 25s ease-in-out infinite; }
.decoration-3 { bottom: 10%; left: 5%;   animation: float3 30s ease-in-out infinite; }

@keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(30px,-30px) rotate(10deg)} }
@keyframes float2 { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(-30px,30px) rotate(-10deg)} }
@keyframes float3 { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(40px,-20px) rotate(15deg)} }

/* ── Sección de Categorías ── */
.categories-section {
  position: relative;
  z-index: 1;
  padding-top: 2rem;
}

.categories-header {
  text-align: center;
  padding: 4rem 2rem 2rem;
}

.header-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.orn-line {
  width: 70px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(218,165,32,0.6), transparent);
}

.orn-sym { color: #DAA520; font-size: 0.75rem; opacity: 0.8; }

.categories-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  letter-spacing: 0.35em;
  color: #fff;
  text-transform: uppercase;
  margin: 0 0 0.6rem;
}

.categories-subtitle {
  font-size: 0.8rem;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
}

/* ── Toast global ── */
.home-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 0.85rem 2rem;
  border-radius: 4px;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  border: 1px solid;
}

.home-toast--success {
  background: rgba(0, 0, 0, 0.92);
  color: #DAA520;
  border-color: rgba(218,165,32,0.4);
  box-shadow: 0 4px 24px rgba(218,165,32,0.15);
}

.home-toast--error {
  background: rgba(0, 0, 0, 0.92);
  color: #e74c3c;
  border-color: rgba(231,76,60,0.4);
  box-shadow: 0 4px 24px rgba(231,76,60,0.15);
}

.home-toast--info {
  background: rgba(0, 0, 0, 0.92);
  color: rgba(255,255,255,0.75);
  border-color: rgba(255,255,255,0.15);
}

.toast-enter-active,
.toast-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(-50%) translateY(12px); }
.toast-leave-to     { opacity: 0; transform: translateX(-50%) translateY(12px); }

/* ── Responsive ── */
@media (min-width: 641px) and (max-width: 1024px) {
  .decoration { width: 200px; height: 200px; }
}

@media (max-width: 640px) {
  .decoration { display: none; }
  .home-toast { white-space: normal; text-align: center; width: 90vw; }
}
</style>