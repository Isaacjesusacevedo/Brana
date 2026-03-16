<template>
  <section class="featured-section">

    <!-- ── HEADER ──────────────────────────────────────────────────────── -->
    <div class="featured-header">
      <div class="header-ornament">
        <span class="orn-line"></span>
        <span class="orn-sym">◆</span>
        <span class="orn-line"></span>
      </div>
      <h2 class="featured-title">COLECCIÓN DESTACADA</h2>
      <p class="featured-subtitle">Las piezas más solicitadas</p>
    </div>

    <!-- ── LOADING ─────────────────────────────────────────────────────── -->
    <div v-if="loading" class="featured-loading">
      <span class="loading-sym">◈</span>
      <p class="loading-text">CARGANDO COLECCIÓN...</p>
    </div>

    <!-- ── CAROUSEL STAGE ─────────────────────────────────────────────── -->
    <div
      v-else
      class="carousel-stage"
      @mouseenter="stopAutoRotate"
      @mouseleave="startAutoRotate"
    >
      <!-- Anillos decorativos -->
      <div class="orbit-ring orbit-ring--outer" aria-hidden="true"></div>
      <div class="orbit-ring orbit-ring--inner" aria-hidden="true"></div>

      <!-- Centro ◆ -->
      <div class="orbit-center" aria-hidden="true">
        <span class="orbit-sym">◆</span>
      </div>

      <!-- Ítems posicionados trigonométricamente -->
      <div class="carousel-track">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="carousel-item"
          :class="{ 'is-active': index === activeIndex }"
          :style="getItemStyle(index)"
          @click="handleItemClick(index, item)"
        >
          <div class="product-card" :class="{ active: index === activeIndex }">
            <!-- Imagen -->
            <div class="card-media">
              <img
                :src="item.imagen"
                :alt="item.nombre ?? item.titulo ?? 'Producto'"
                class="card-img"
              />
              <div class="card-overlay" aria-hidden="true"></div>

              <!-- Badge nuevo -->
              <span v-if="item.nuevo" class="card-badge">NUEVO</span>

              <!-- Quick view — solo en ítem activo -->
              <button
                v-if="index === activeIndex"
                class="quick-view-btn"
                @click.stop="emit('quickView', item)"
              >
                Vista rápida
              </button>
            </div>

            <!-- Info -->
            <div class="card-body">
              <span class="card-cat">{{ item.categoria }}</span>
              <h3 class="card-name">{{ item.nombre ?? item.titulo }}</h3>

              <!-- Precio -->
              <div v-if="item.precio" class="card-price">
                <span v-if="item.precioAnterior" class="price-old">
                  $ {{ fmt(item.precioAnterior) }}
                </span>
                <span class="price-current">$ {{ fmt(item.precio) }}</span>
              </div>
            </div>

            <div class="card-shine" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CONTROLES ──────────────────────────────────────────────────── -->
    <div v-if="!loading && items.length" class="carousel-controls">
      <button class="ctrl-btn" @click="navigate('prev')" aria-label="Anterior">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="ctrl-counter">
        <span class="counter-cur">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
        <span class="counter-sep"></span>
        <span class="counter-tot">{{ String(items.length).padStart(2, '0') }}</span>
      </div>

      <button class="ctrl-btn" @click="navigate('next')" aria-label="Siguiente">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4L12 9L7 14" stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- ── DOTS ───────────────────────────────────────────────────────── -->
    <div v-if="!loading && items.length" class="carousel-dots" role="tablist">
      <button
        v-for="(_, i) in items"
        :key="i"
        class="dot"
        :class="{ active: activeIndex === i }"
        role="tab"
        :aria-selected="activeIndex === i"
        :aria-label="`Ítem ${i + 1}`"
        @click="setActive(i)"
      ></button>
    </div>

    <!-- ── CTA ────────────────────────────────────────────────────────── -->
    <div class="featured-cta">
      <router-link to="/catalogo" class="cta-btn">
        VER COLECCIÓN COMPLETA →
      </router-link>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CSSProperties } from 'vue';
import { useRouter } from 'vue-router';
import type { Product } from '@/types/producto.types';
import { productosApi } from '@/services/tienda/api';

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  /** Límite de productos a cargar desde la API (default 8) */
  limit?: number;
  /** Intervalo de auto-rotación en ms (default 4500) */
  rotationInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
  limit: 8,
  rotationInterval: 4500,
});

const emit = defineEmits<{
  /** Clic en un producto — para navegación en HomeView */
  productClick: [product: Product];
  /** Abre Quick View modal */
  quickView:    [product: Product];
}>();

const router = useRouter();

// ── Fallback estático — se usa si la API no responde ─────────────────────────
const FALLBACK: Product[] = [
  { id: 1, imagen: '/images/featured/kage.jpg',       nombre: 'Kage',           categoria: 'Remera · Edición Limitada' },
  { id: 2, imagen: '/images/featured/tormenta.jpg',   nombre: 'Tormenta Negra', categoria: 'Buzo · Oversize'           },
  { id: 3, imagen: '/images/featured/hanabi.jpg',     nombre: 'Hanabi',         categoria: 'Remera · Colección Verano' },
  { id: 4, imagen: '/images/featured/cruzdelsur.jpg', nombre: 'Cruz del Sur',   categoria: 'Pantalón · Premium'        },
  { id: 5, imagen: '/images/featured/oni.jpg',        nombre: 'Oni',            categoria: 'Buzo · Streetwear'         },
  { id: 6, imagen: '/images/featured/pampanoir.jpg',  nombre: 'Pampa Noir',     categoria: 'Remera · JP-ARG'           },
];

// ── Estado ────────────────────────────────────────────────────────────────────
const loading     = ref(true);
const items       = ref<Product[]>([]);
const activeIndex = ref(0);

// ── Carga de datos — best-sellers desde la API ────────────────────────────────
const fetchFeatured = async () => {
  loading.value = true;
  try {
    const products = await productosApi.getFeatured(props.limit);
    items.value = products.length ? products : FALLBACK;
  } catch {
    items.value = FALLBACK;
  } finally {
    loading.value = false;
    startAutoRotate();
  }
};

onMounted(fetchFeatured);

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v);

// ── Radios de la órbita — orientación VERTICAL (ry > rx) ─────────────────────
// El eje vertical domina: los ítems se desplazan principalmente de arriba a abajo
const windowW = ref(typeof window !== 'undefined' ? window.innerWidth : 1280);

const radii = computed(() => {
  if (windowW.value <= 480)  return { rx: 90,  ry: 130 };
  if (windowW.value <= 640)  return { rx: 115, ry: 165 };
  if (windowW.value <= 768)  return { rx: 145, ry: 205 };
  if (windowW.value <= 1024) return { rx: 185, ry: 260 };
  return                            { rx: 225, ry: 315 };
});

// ── Posicionamiento trigonométrico ────────────────────────────────────────────
// Ángulo 0 → ítem activo en la cima (12 en punto, desplazamiento hacia abajo)
const getItemStyle = (index: number): CSSProperties => {
  const n     = items.value.length;
  const step  = (2 * Math.PI) / n;
  const angle = (index - activeIndex.value) * step - Math.PI / 2;

  const { rx, ry } = radii.value;
  const x = Math.cos(angle) * rx;
  const y = Math.sin(angle) * ry;

  // cosA: 1 = frente (cima), −1 = fondo (nadir)
  const cosA    = Math.cos(angle + Math.PI / 2);
  const scale   = 0.50 + ((cosA + 1) / 2) * 0.50;   // 0.50 → 1.00
  const opacity = 0.18 + ((cosA + 1) / 2) * 0.82;   // 0.18 → 1.00
  const zIndex  = Math.round((cosA + 1) * 50) + 1;

  return {
    transform:     `translate(${x}px, ${y}px) scale(${scale})`,
    opacity,
    zIndex,
    pointerEvents: (scale < 0.62 ? 'none' : 'auto') as CSSProperties['pointerEvents'],
  };
};

// ── Navegación ────────────────────────────────────────────────────────────────
const navigate = (dir: 'prev' | 'next') => {
  const n = items.value.length;
  activeIndex.value = dir === 'next'
    ? (activeIndex.value + 1) % n
    : (activeIndex.value - 1 + n) % n;
  resetTimer();
};

const setActive = (index: number) => {
  activeIndex.value = index;
  resetTimer();
};

const handleItemClick = (index: number, item: Product) => {
  if (index !== activeIndex.value) {
    setActive(index);
    return;
  }
  // Clic en el activo → navega al detalle
  router.push(item.ruta ?? `/producto/${item.id}`);
  emit('productClick', item);
};

// ── Auto-rotación ─────────────────────────────────────────────────────────────
let timer: number | null = null;

const startAutoRotate = () => {
  if (timer !== null || loading.value) return;
  timer = window.setInterval(() => navigate('next'), props.rotationInterval);
};

const stopAutoRotate = () => {
  if (timer !== null) { clearInterval(timer); timer = null; }
};

const resetTimer = () => { stopAutoRotate(); startAutoRotate(); };

onUnmounted(stopAutoRotate);

// ── Resize con debounce ───────────────────────────────────────────────────────
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

const onResize = debounce(() => { windowW.value = window.innerWidth; }, 150);
onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => window.removeEventListener('resize', onResize));
</script>

<style scoped>
@import '@/assets/css/components/home-featured.css';
</style>
