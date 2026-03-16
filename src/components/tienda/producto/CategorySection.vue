<template>
  <section class="category-section" :data-category="category.id">

    <!-- Header -->
    <div class="category-header">
      <div class="header-content">
        <div class="category-icon">{{ category.icono }}</div>
        <div class="category-info">
          <h2 class="category-title">{{ category.nombre }}</h2>
          <p class="category-description">{{ category.descripcion }}</p>
        </div>
      </div>
      <router-link v-if="category.ruta" :to="category.ruta" class="view-all-link">
        Ver todo <span class="arrow">→</span>
      </router-link>
    </div>

    <!-- Slider de productos -->
    <div class="slider-wrapper" @mouseenter="pause" @mouseleave="resume">

      <!-- Botón anterior -->
      <button
        class="slider-btn slider-btn--prev"
        :disabled="activeIndex === 0"
        @click="prev"
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 14L6 9L11 4" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Track -->
      <div class="slider-track" ref="trackRef">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="slider-item"
          :class="{ 'is-active': index === activeIndex }"
          :style="getItemStyle(index)"
          @click="handleProductClick(product)"
        >
          <!-- Imagen -->
          <div class="product-img-wrap">
            <img
              v-if="product.imagen"
              :src="product.imagen"
              :alt="product.nombre ?? product.titulo ?? ''"
              class="product-img"
              loading="lazy"
            />

            <!-- Badge NUEVO -->
            <span v-if="product.nuevo" class="product-badge">NUEVO</span>

            <!-- Overlay hover -->
            <div class="product-overlay">
              <button
                class="quick-view-btn"
                @click.stop="handleQuickView(product)"
              >
                Vista rápida
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="product-info">
            <span v-if="product.categoria" class="product-cat">
              {{ product.categoria }}
            </span>
            <h3 class="product-name">{{ product.nombre ?? product.titulo }}</h3>

            <div class="product-price">
              <span v-if="product.precioAnterior" class="price-old">
                $ {{ fmt(product.precioAnterior) }}
              </span>
              <span class="price-current">
                $ {{ fmt(product.precio ?? 0) }}
              </span>
            </div>

            <div v-if="product.colores?.length" class="product-colors">
              <span
                v-for="(color, idx) in product.colores.slice(0, 4)"
                :key="idx"
                class="color-dot"
                :style="{ background: color }"
              ></span>
              <span v-if="product.colores.length > 4" class="color-more">
                +{{ product.colores.length - 4 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón siguiente -->
      <button
        class="slider-btn slider-btn--next"
        :disabled="activeIndex >= maxIndex"
        @click="next"
        aria-label="Siguiente"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4L12 9L7 14" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Fades laterales -->
      <div class="fade fade--l" aria-hidden="true"></div>
      <div class="fade fade--r" aria-hidden="true"></div>
    </div>

    <!-- Dots -->
    <div class="slider-dots" role="tablist">
      <button
        v-for="(_, i) in products"
        :key="i"
        class="dot"
        :class="{ active: i === activeIndex }"
        role="tab"
        :aria-selected="i === activeIndex"
        :aria-label="`Producto ${i + 1}`"
        @click="goTo(i)"
      ></button>
    </div>

    <!-- Decoración de fondo -->
    <div class="category-decoration" aria-hidden="true">
      <div class="decoration-symbol">{{ category.icono }}</div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Product, Category } from '@/types/Index';

interface Props {
  category:    Category;
  autoRotate?: boolean;
  interval?:   number;
}

const props = withDefaults(defineProps<Props>(), {
  autoRotate: true,
  interval:   5000,
});

const emit = defineEmits<{
  productClick: [product: Product];
  quickView:    [product: Product];
}>();

const router     = useRouter();
const trackRef   = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const isPaused   = ref(false);

// ── Lista de productos de la categoría ────────────────────────────────────────
const products = computed<Product[]>(() => props.category.productos ?? []);

// Cuántos ítems se muestran visibles a la vez (se adapta al CSS)
const VISIBLE   = 3;
const maxIndex  = computed(() => Math.max(0, products.value.length - VISIBLE));

// ── Estilo de posición horizontal de cada ítem ────────────────────────────────
const ITEM_W    = 280;   // px — debe coincidir con el CSS
const GAP       = 24;    // px

const getItemStyle = (index: number) => {
  const offset = index - activeIndex.value;
  const x      = offset * (ITEM_W + GAP);
  const dist   = Math.abs(offset);
  const scale  = dist === 0 ? 1 : Math.max(0.88, 1 - dist * 0.04);
  const opacity = dist > VISIBLE + 1 ? 0 : Math.max(0.25, 1 - dist * 0.22);

  return {
    transform:     `translateX(${x}px) scale(${scale})`,
    opacity,
    zIndex:        100 - dist * 10,
    pointerEvents: dist > VISIBLE ? 'none' : 'auto',
  } as const;
};

// ── Navegación ────────────────────────────────────────────────────────────────
const goTo = (i: number) => {
  activeIndex.value = Math.max(0, Math.min(i, maxIndex.value));
  resetTimer();
};
const next = () => goTo(activeIndex.value + 1);
const prev = () => goTo(activeIndex.value - 1);

// ── Auto-rotación ─────────────────────────────────────────────────────────────
let timer: ReturnType<typeof setInterval> | null = null;

const startTimer = () => {
  if (!props.autoRotate || isPaused.value) return;
  timer = setInterval(() => {
    activeIndex.value < maxIndex.value
      ? activeIndex.value++
      : (activeIndex.value = 0);
  }, props.interval);
};

const stopTimer = () => {
  if (timer) { clearInterval(timer); timer = null; }
};

const resetTimer = () => { stopTimer(); startTimer(); };

const pause  = () => { isPaused.value = true;  stopTimer(); };
const resume = () => { isPaused.value = false; startTimer(); };

onMounted(startTimer);
onUnmounted(stopTimer);

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleProductClick = (product: Product) => {
  emit('productClick', product)
}
const handleQuickView = (product: Product) => {
  emit('quickView', product);
};

// ── Formato de precio ARS ─────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v);
</script>

<style scoped>
/* ══════════════════════════════════════
   SECCIÓN
══════════════════════════════════════ */
.category-section {
  position: relative;
  padding: 6rem 2rem;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(10, 10, 10, 0.5) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

/* Línea superior dorada */
.category-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3) 50%, transparent);
}

/* ══════════════════════════════════════
   HEADER
══════════════════════════════════════ */
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.category-icon {
  font-size: 4rem;
  color: #DAA520;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%       { transform: translateY(-10px) rotate(5deg); }
}

.category-info { flex: 1; }

.category-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #DAA520;
  margin: 0 0 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.category-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.6;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #DAA520;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 1.5px solid rgba(218, 165, 32, 0.35);
  border-radius: 50px;
  background: rgba(218, 165, 32, 0.04);
  transition: all 0.25s ease;
  white-space: nowrap;
}

.view-all-link:hover {
  background: rgba(218, 165, 32, 0.1);
  border-color: #DAA520;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(218, 165, 32, 0.2);
}

.view-all-link .arrow { transition: transform 0.25s ease; }
.view-all-link:hover .arrow { transform: translateX(5px); }

/* ══════════════════════════════════════
   SLIDER WRAPPER
══════════════════════════════════════ */
.slider-wrapper {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  height: 460px;          /* altura de tarjeta + info */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Fades laterales */
.fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 160px;
  z-index: 50;
  pointer-events: none;
}

.fade--l { left: 0;  background: linear-gradient(to right, #000 10%, transparent 100%); }
.fade--r { right: 0; background: linear-gradient(to left,  #000 10%, transparent 100%); }

/* ══════════════════════════════════════
   TRACK
══════════════════════════════════════ */
.slider-track {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ══════════════════════════════════════
   ÍTEM
══════════════════════════════════════ */
.slider-item {
  position: absolute;
  width: 280px;
  cursor: pointer;
  transition:
    transform  0.55s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity    0.55s ease;
  will-change: transform, opacity;
}

/* ── Imagen ── */
.product-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid rgba(218, 165, 32, 0.15);
  transition: border-color 0.35s ease, box-shadow 0.35s ease;
}

.slider-item.is-active .product-img-wrap {
  border-color: rgba(218, 165, 32, 0.6);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(218, 165, 32, 0.18);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.55s ease;
}

.slider-item.is-active .product-img { transform: scale(1.04); }

/* Badge */
.product-badge {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  background: #DAA520;
  color: #000;
  padding: 0.35rem 0.75rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 20px;
  z-index: 2;
}

/* Overlay */
.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

.slider-item:hover .product-overlay { opacity: 1; }

.quick-view-btn {
  background: #DAA520;
  color: #000;
  border: none;
  padding: 0.7rem 1.8rem;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.25s ease;
  transform: translateY(8px);
}

.slider-item:hover .quick-view-btn { transform: translateY(0); }
.quick-view-btn:hover { background: #FFD700; box-shadow: 0 4px 14px rgba(218, 165, 32, 0.4); }

/* ── Info ── */
.product-info { padding: 1.1rem 0.4rem 0; }

.product-cat {
  display: block;
  font-size: 0.68rem;
  color: #DAA520;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.product-name {
  font-size: 1rem;
  color: #fff;
  margin: 0 0 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.price-old {
  color: rgba(255, 255, 255, 0.35);
  text-decoration: line-through;
  font-size: 0.85rem;
}

.price-current {
  color: #DAA520;
  font-size: 1.15rem;
  font-weight: 700;
}

.product-colors { display: flex; align-items: center; gap: 0.4rem; }

.color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  cursor: default;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.color-dot:hover { border-color: #DAA520; transform: scale(1.2); }

.color-more {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.45);
}

/* ══════════════════════════════════════
   BOTONES DE NAVEGACIÓN
══════════════════════════════════════ */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 60;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(218, 165, 32, 0.05);
  border: 1.5px solid rgba(218, 165, 32, 0.3);
  color: #DAA520;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.22s ease;
}

.slider-btn:hover:not(:disabled) {
  background: #DAA520;
  border-color: #DAA520;
  color: #000;
  box-shadow: 0 0 18px rgba(218, 165, 32, 0.4);
}

.slider-btn:disabled { opacity: 0.2; cursor: not-allowed; }
.slider-btn--prev { left:  1rem; }
.slider-btn--next { right: 1rem; }

/* ══════════════════════════════════════
   DOTS
══════════════════════════════════════ */
.slider-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.45rem;
  margin-top: 2rem;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: rgba(218, 165, 32, 0.2);
  cursor: pointer;
  transition: all 0.32s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.dot.active {
  background: #DAA520;
  width: 22px;
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(218, 165, 32, 0.5);
}

.dot:hover:not(.active) { background: rgba(218, 165, 32, 0.45); }

/* ══════════════════════════════════════
   DECORACIÓN
══════════════════════════════════════ */
.category-decoration {
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.04;
  z-index: 0;
}

.decoration-symbol {
  font-size: 20rem;
  color: #DAA520;
  animation: decorationRotate 30s linear infinite;
  line-height: 1;
}

@keyframes decorationRotate {
  from { transform: rotate(0deg);   }
  to   { transform: rotate(360deg); }
}

/* ══════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════ */
@media (max-width: 1024px) {
  .category-header { flex-direction: column; gap: 1.5rem; margin-bottom: 2.5rem; }
  .header-content  { align-items: flex-start; }
  .category-icon   { font-size: 3rem; }
  .slider-wrapper  { height: 420px; }
  .slider-item     { width: 240px; }
}

@media (max-width: 768px) {
  .category-section { padding: 4rem 1rem; }
  .slider-wrapper   { height: 380px; }
  .slider-item      { width: 200px; }
  .fade             { width: 80px; }
  .decoration-symbol { font-size: 10rem; }
}

@media (max-width: 480px) {
  .slider-wrapper  { height: 340px; }
  .slider-item     { width: 172px; }
  .slider-btn      { width: 36px; height: 36px; }
  .fade            { width: 48px; }
  .category-description { font-size: 0.9rem; }
}
</style>