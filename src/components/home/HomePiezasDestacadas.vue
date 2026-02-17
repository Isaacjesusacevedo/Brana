<template>
  <section class="piezas-destacadas-section">
    <div class="container">
      <!-- Header -->
      <div class="section-header">
        <h2 class="section-title glitch-text" :data-text="title">
          {{ title }}
        </h2>
        <div class="title-divider">
          <span class="divider-icon">◆</span>
          <span class="divider-line"></span>
          <span class="divider-icon">✦</span>
          <span class="divider-line"></span>
          <span class="divider-icon">◆</span>
        </div>
        <p class="section-subtitle" v-if="subtitle">{{ subtitle }}</p>
      </div>

      <!-- Grid de productos -->
      <div class="products-grid" :class="gridClass">
        <div
          v-for="(product, index) in displayProducts"
          :key="product.id"
          class="product-item"
          :class="[product.size || 'normal', { featured: product.badge }]"
          :style="{ animationDelay: `${0.1 * (index + 1)}s` }"
          @click="handleProductClick(product)"
        >
          <!-- Imagen del producto -->
          <div class="product-image-wrapper">
            <img 
              :src="product.imagen" 
              :alt="product.nombre || product.titulo" 
              class="product-image"
            />
            
            <!-- Badge -->
            <div v-if="product.badge" class="product-badge">
              {{ product.badge }}
            </div>
            
            <!-- Overlay con info -->
            <div class="product-overlay">
              <div class="overlay-content">
                <h3 class="product-name">{{ product.nombre || product.titulo }}</h3>
                <p class="product-price" v-if="product.precio">${{ product.precio }}</p>
                
                <!-- Colores disponibles -->
                <div class="product-colors" v-if="product.colores && product.colores.length">
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

                <!-- Botón de acción -->
                <button class="quick-action-btn" @click.stop="handleQuickView(product)">
                  <span class="btn-icon">✦</span>
                  Vista Rápida
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Footer -->
      <div class="section-footer" v-if="showCta">
        <a :href="ctaRoute" target="_blank" rel="noopener noreferrer" class="cta-button">
          <span>{{ ctaText }}</span>
          <span class="arrow">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Product } from '@/types/Index';

interface Props {
  products: Product[];
  title?: string;
  subtitle?: string;
  maxProducts?: number;
  columns?: 2 | 3 | 4;
  showCta?: boolean;
  ctaText?: string;
  ctaRoute?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'PIEZAS_DESTACADAS',
  subtitle: '',
  maxProducts: 6,
  columns: 3,
  showCta: true,
  ctaText: 'VER_CATÁLOGO_COMPLETO',
  ctaRoute: 'https://www.instagram.com/brana_eg/',
});

const emit = defineEmits<{
  productClick: [product: Product];
  quickView: [product: Product];
}>();

const router = useRouter();

// Computed
const displayProducts = computed(() => {
  return props.products.slice(0, props.maxProducts);
});

const gridClass = computed(() => {
  return `grid-cols-${props.columns}`;
});

// Handlers
const handleProductClick = (product: Product) => {
  emit('productClick', product);
  if (product.ruta) {
    router.push(product.ruta);
  } else {
    router.push(`/producto/${product.id}`);
  }
};

const handleQuickView = (product: Product) => {
  emit('quickView', product);
};
</script>

<style scoped>
/* Container */
.piezas-destacadas-section {
  position: relative;
  padding: 8rem 2rem;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(10, 10, 10, 0.3) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  overflow: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.section-header {
  text-align: center;
  margin-bottom: 5rem;
  position: relative;
}

.section-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: var(--gold);
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
}

/* Glitch effect */
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch-text::before {
  color: #ff00de;
  z-index: -1;
  animation: glitch1 2s infinite;
}

.glitch-text::after {
  color: #00ffff;
  z-index: -2;
  animation: glitch2 2s infinite;
}

@keyframes glitch1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@keyframes glitch2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(2px, -2px); }
  40% { transform: translate(2px, 2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(-2px, 2px); }
}

.title-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.divider-icon {
  color: var(--gold);
  font-size: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.divider-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 1rem 0 0;
  letter-spacing: 0.05em;
}

/* Grid */
.products-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 4rem;
}

.grid-cols-2 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

/* Product Item */
.product-item {
  position: relative;
  background: rgba(10, 10, 10, 0.8);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(218, 165, 32, 0.2);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tamaños especiales */
.product-item.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.product-item.wide {
  grid-column: span 2;
}

.product-item.tall {
  grid-row: span 2;
}

.product-item:hover {
  border-color: var(--gold);
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(218, 165, 32, 0.3);
}

/* Image Wrapper */
.product-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.product-item.wide .product-image-wrapper {
  aspect-ratio: 16/9;
}

.product-item.featured .product-image-wrapper {
  aspect-ratio: 1;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-item:hover .product-image {
  transform: scale(1.1);
}

/* Badge */
.product-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  color: #000;
  padding: 0.5rem 1.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Overlay */
.product-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-item:hover .product-overlay {
  opacity: 1;
}

.overlay-content {
  width: 100%;
  transform: translateY(20px);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-item:hover .overlay-content {
  transform: translateY(0);
}

.product-name {
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--gold);
  margin: 0 0 1rem 0;
}

/* Colors */
.product-colors {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-dot:hover {
  border-color: var(--gold);
  transform: scale(1.2);
}

.color-more {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 0.25rem;
}

/* Quick Action Button */
.quick-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  border: none;
  border-radius: 50px;
  color: #000;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(218, 165, 32, 0.5);
}

.btn-icon {
  font-size: 1rem;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Section Footer */
.section-footer {
  text-align: center;
  margin-top: 4rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 3rem;
  background: transparent;
  border: 2px solid var(--gold);
  border-radius: 50px;
  color: var(--gold);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), transparent);
  transition: left 0.5s ease;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  background: rgba(218, 165, 32, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(218, 165, 32, 0.3);
}

.cta-button .arrow {
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow {
  transform: translateX(5px);
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .piezas-destacadas-section {
    padding: 5rem 1.5rem;
  }

  .section-header {
    margin-bottom: 3.5rem;
  }

  .section-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }

  .products-grid {
    gap: 1.5rem;
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .product-item.featured {
    grid-column: span 2;
    grid-row: span 1;
  }

  .product-item.wide {
    grid-column: span 2;
  }

  .product-item.tall {
    grid-row: span 1;
  }

  .product-overlay {
    padding: 1.5rem;
  }

  .cta-button {
    padding: 1rem 2.5rem;
    font-size: 0.95rem;
  }
}

/* Móvil (<= 640px) */
@media (max-width: 640px) {
  .piezas-destacadas-section {
    padding: 4rem 1.5rem;
  }

  .section-header {
    margin-bottom: 2.5rem;
  }

  .section-title {
    font-size: clamp(1.6rem, 7vw, 2rem);
    letter-spacing: 0.08em;
    margin-bottom: 1rem;
  }

  .title-divider {
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .divider-icon {
    font-size: 1rem;
  }

  .divider-line {
    width: 30px;
  }

  .section-subtitle {
    font-size: 0.95rem;
    padding: 0 0.5rem;
  }

  .products-grid {
    grid-template-columns: 1fr !important;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .product-item {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
    border-radius: 12px;
  }

  .product-image-wrapper {
    aspect-ratio: 3/4;
  }

  .product-item.wide .product-image-wrapper,
  .product-item.featured .product-image-wrapper {
    aspect-ratio: 3/4;
  }

  .product-badge {
    top: 1rem;
    right: 1rem;
    padding: 0.4rem 1rem;
    font-size: 0.65rem;
  }

  .product-overlay {
    opacity: 1;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.92) 0%,
      rgba(0, 0, 0, 0.5) 60%,
      transparent 100%
    );
    padding: 1.5rem;
  }

  .overlay-content {
    transform: translateY(0);
  }

  .product-name {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .product-price {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .product-colors {
    margin-bottom: 1rem;
  }

  .color-dot {
    width: 18px;
    height: 18px;
  }

  .quick-action-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.75rem;
    gap: 0.5rem;
  }

  .section-footer {
    margin-top: 3rem;
  }

  .cta-button {
    width: 100%;
    max-width: 350px;
    padding: 1rem 2rem;
    font-size: 0.9rem;
  }
}

/* Móvil pequeño (<= 375px) */
@media (max-width: 375px) {
  .piezas-destacadas-section {
    padding: 2.5rem 0.75rem;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .products-grid {
    gap: 1rem;
  }

  .product-overlay {
    padding: 1.2rem;
  }

  .product-name {
    font-size: 1rem;
  }

  .quick-action-btn {
    padding: 0.6rem 1rem;
    font-size: 0.75rem;
  }
}
</style>