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
/* ═══════════════════════════
   SECCIÓN
═══════════════════════════ */
.featured-section {
  position: relative;
  width: 100%;
  padding: 6rem 0 4rem;
  overflow: visible;
}

/* ═══════════════════════════
   HEADER
═══════════════════════════ */
.featured-header {
  text-align: center;
  margin-bottom: 1rem;
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

.orn-sym {
  color: #DAA520;
  font-size: 0.75rem;
  opacity: 0.8;
}

.featured-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  letter-spacing: 0.35em;
  color: #fff;
  text-transform: uppercase;
  margin: 0 0 0.6rem;
}

.featured-subtitle {
  font-size: 0.8rem;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
}

/* ═══════════════════════════
   LOADING
═══════════════════════════ */
.featured-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 8rem 2rem;
}

.loading-sym {
  font-size: 3rem;
  color: #DAA520;
  animation: spinSlow 3s linear infinite;
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.78rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  animation: textPulse 1.5s ease-in-out infinite;
}

@keyframes textPulse {
  0%,100% { opacity: 0.35; }
  50%      { opacity: 0.8;  }
}

/* ═══════════════════════════
   STAGE
   Altura = ry*2 + card_h + margin
   Desktop: 315*2 + 340 + 60 = 1030px
═══════════════════════════ */
.carousel-stage {
  position: relative;
  width: 100%;
  height: 1030px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  user-select: none;
}

/* Anillos decorativos */
.orbit-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: ringBreath 6s ease-in-out infinite;
}

.orbit-ring--outer {
  width: 500px;
  height: 680px;
  border: 1px solid rgba(218,165,32,0.07);
  box-shadow: 0 0 60px rgba(218,165,32,0.02), inset 0 0 60px rgba(218,165,32,0.02);
}

.orbit-ring--inner {
  width: 340px;
  height: 460px;
  border: 1px dashed rgba(218,165,32,0.04);
  animation-delay: 2s;
}

@keyframes ringBreath {
  0%,100% { opacity: 0.5; transform: scale(1);    }
  50%      { opacity: 1;   transform: scale(1.02); }
}

/* Centro ◆ */
.orbit-center {
  position: absolute;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 1.5px solid rgba(218,165,32,0.45);
  background: radial-gradient(circle, rgba(218,165,32,0.12) 0%, transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  pointer-events: none;
  animation: centerGlow 3.5s ease-in-out infinite;
}

.orbit-sym {
  font-size: 1.5rem;
  color: #DAA520;
  animation: symPulse 4s ease-in-out infinite;
}

@keyframes centerGlow {
  0%,100% { box-shadow: 0 0 18px rgba(218,165,32,0.22); }
  50%      { box-shadow: 0 0 40px rgba(218,165,32,0.50); }
}
@keyframes symPulse {
  0%,100% { opacity: 0.7; transform: scale(1);    }
  50%      { opacity: 1;   transform: scale(1.18); }
}

/* ═══════════════════════════
   TRACK + ÍTEMS
═══════════════════════════ */
.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-item {
  position: absolute;
  width: 240px;
  height: 340px;
  transition:
    transform 0.75s cubic-bezier(0.22,0.61,0.36,1),
    opacity   0.75s cubic-bezier(0.22,0.61,0.36,1);
  will-change: transform, opacity;
  cursor: pointer;
}

/* ═══════════════════════════
   TARJETA
═══════════════════════════ */
.product-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: #080808;
  border: 1px solid rgba(218,165,32,0.08);
  transition: border-color 0.45s ease, box-shadow 0.45s ease;
  display: flex;
  flex-direction: column;
}

.product-card.active {
  border-color: rgba(218,165,32,0.65);
  box-shadow:
    0 36px 90px rgba(0,0,0,0.88),
    0  0   55px rgba(218,165,32,0.20),
    inset 0 0 22px rgba(218,165,32,0.06);
}

/* Media */
.card-media {
  position: relative;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.72s cubic-bezier(0.22,0.61,0.36,1);
}

.product-card.active .card-img { transform: scale(1.07); }

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 35%, rgba(0,0,0,.20) 65%, rgba(0,0,0,.72) 100%);
}

/* Badge */
.card-badge {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  padding: 0.25rem 0.6rem;
  background: #4ade80;
  color: #000;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  border-radius: 2px;
  z-index: 2;
}

/* Quick view */
.quick-view-btn {
  position: absolute;
  bottom: 0.7rem;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  padding: 0.45rem 1.1rem;
  background: rgba(218,165,32,0.92);
  border: none;
  color: #000;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 10;
}

.product-card.active:hover .quick-view-btn {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Body */
.card-body {
  padding: 0.75rem 0.95rem 0.85rem;
  background: linear-gradient(180deg, #0a0a0a 0%, #111 100%);
  flex-shrink: 0;
  border-top: 1px solid rgba(218,165,32,0.06);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.card-cat {
  font-size: 0.52rem;
  font-weight: 700;
  color: #DAA520;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  opacity: 0.72;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 0.04em;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.price-old {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.25);
  text-decoration: line-through;
}

.price-current {
  font-size: 0.88rem;
  font-weight: 700;
  color: #DAA520;
}

/* Shine */
.card-shine {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,.04) 0%, transparent 48%);
  opacity: 0;
  transition: opacity 0.45s ease;
  pointer-events: none;
}

.product-card.active .card-shine { opacity: 1; }

/* ═══════════════════════════
   CONTROLES
═══════════════════════════ */
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  margin-top: 2.5rem;
  position: relative;
  z-index: 200; /* por encima del z-index máximo de las cards (101) */
}

.ctrl-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(218,165,32,0.04);
  border: 1.5px solid rgba(218,165,32,0.28);
  color: #DAA520;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.ctrl-btn:hover {
  background: #DAA520;
  border-color: #DAA520;
  color: #000;
  transform: scale(1.1);
  box-shadow: 0 0 26px rgba(218,165,32,0.45);
}

.ctrl-counter {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.counter-cur {
  font-size: 1.65rem;
  font-weight: 800;
  color: #DAA520;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  min-width: 2ch;
  text-align: center;
}

.counter-sep {
  width: 26px;
  height: 1px;
  background: rgba(218,165,32,0.25);
  transform: rotate(-55deg);
  flex-shrink: 0;
}

.counter-tot {
  font-size: 0.9rem;
  color: rgba(218,165,32,0.30);
  font-variant-numeric: tabular-nums;
  min-width: 2ch;
  text-align: center;
}

/* ═══════════════════════════
   DOTS
═══════════════════════════ */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.4rem;
  position: relative;
  z-index: 200; /* idem controls */
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: rgba(218,165,32,0.18);
  cursor: pointer;
  transition: all 0.32s cubic-bezier(0.22,0.61,0.36,1);
}

.dot.active {
  background: #DAA520;
  width: 26px;
  border-radius: 3px;
  box-shadow: 0 0 9px rgba(218,165,32,0.55);
}

.dot:hover:not(.active) { background: rgba(218,165,32,0.42); transform: scale(1.3); }

/* ═══════════════════════════
   CTA
═══════════════════════════ */
.featured-cta {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2.5rem;
  background: transparent;
  border: 1.5px solid rgba(218,165,32,0.45);
  color: #DAA520;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  background: rgba(218,165,32,0.08);
  border-color: #DAA520;
  box-shadow: 0 0 30px rgba(218,165,32,0.2);
}

/* ═══════════════════════════
   RESPONSIVE
   Altura = ry*2 + card_h + 60
═══════════════════════════ */
/* 1024: ry=260, card=296 → 260*2+296+60=876 */
@media (max-width: 1024px) {
  .carousel-stage  { height: 876px; }
  .carousel-item   { width: 210px; height: 296px; }
  .orbit-ring--outer { width: 420px; height: 572px; }
  .orbit-ring--inner { width: 286px; height: 388px; }
}

/* 768: ry=205, card=246 → 205*2+246+60=716 */
@media (max-width: 768px) {
  .carousel-stage  { height: 716px; }
  .carousel-item   { width: 175px; height: 246px; }
  .orbit-ring--outer { width: 336px; height: 462px; }
  .orbit-ring--inner { width: 228px; height: 312px; }
  .ctrl-btn { width: 44px; height: 44px; }
  .counter-cur { font-size: 1.35rem; }
}

/* 640: ry=165, card=204 → 165*2+204+60=594 */
@media (max-width: 640px) {
  .carousel-stage  { height: 594px; }
  .carousel-item   { width: 145px; height: 204px; }
  .orbit-ring--outer { width: 270px; height: 372px; }
  .orbit-ring--inner { width: 184px; height: 252px; }
  .orbit-center { width: 52px; height: 52px; }
  .orbit-sym { font-size: 1.1rem; }
}

/* 480: ry=130, card=168 → 130*2+168+50=478 */
@media (max-width: 480px) {
  .carousel-stage  { height: 480px; }
  .carousel-item   { width: 120px; height: 168px; }
  .orbit-ring--outer { width: 212px; height: 298px; }
  .orbit-ring--inner { width: 144px; height: 202px; }
  .orbit-center { width: 44px; height: 44px; }
  .orbit-sym { font-size: 0.9rem; }
  .carousel-controls { gap: 1.8rem; margin-top: 1.8rem; }
  .ctrl-btn { width: 38px; height: 38px; }
  .counter-cur { font-size: 1.1rem; }
  .card-name { font-size: 0.78rem; }
  .card-cat  { font-size: 0.46rem; }
}
</style>