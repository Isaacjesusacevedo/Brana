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
};
const handleQuickView = (product: Product) => {
  emit('quickView', product);
};

// ── Formato de precio ARS ─────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v);
</script>

<style scoped>
@import '@/assets/css/components/category-section.css';
</style>
