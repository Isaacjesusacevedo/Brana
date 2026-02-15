<template>
    <section class="category-section" :data-category="category.id">
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
  
      <!-- Carrusel de productos de la categoría -->
      <div class="category-carousel-wrapper">
        <BaseCarousel
          :items="category.productos || []"
          mode="sliding"
          variant="category"
          :autoRotate="autoRotate"
          :rotationInterval="5000"
          :showControls="true"
          :showIndicators="false"
          @itemClick="handleProductClick"
        >
          <template #item="{ item, isActive }">
            <div class="product-card" :class="{ active: isActive }">
              <div class="product-image-wrapper">
                <img 
                  v-if="item.imagen" 
                  :src="item.imagen" 
                  :alt="item.nombre || item.titulo" 
                  class="product-image" 
                />
                <div class="product-badge" v-if="item.nuevo">NUEVO</div>
                <div class="product-overlay">
                  <button class="quick-view-btn" @click.stop="handleQuickView(item)">
                    Vista rápida
                  </button>
                </div>
              </div>
              <div class="product-info">
                <span v-if="item.categoria" class="product-category">{{ item.categoria }}</span>
                <h3 class="product-name">{{ item.nombre || item.titulo }}</h3>
                <div class="product-price">
                  <span v-if="item.precioAnterior" class="price-old">${{ item.precioAnterior }}</span>
                  <span class="price-current">${{ item.precio }}</span>
                </div>
                <div v-if="item.colores && item.colores.length" class="product-colors">
                  <span
                    v-for="(color, idx) in item.colores.slice(0, 4)"
                    :key="idx"
                    class="color-dot"
                    :style="{ background: color }"
                  ></span>
                  <span v-if="item.colores.length > 4" class="color-more">
                    +{{ item.colores.length - 4 }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </BaseCarousel>
      </div>
  
      <!-- Decoración de fondo -->
      <div class="category-decoration">
        <div class="decoration-symbol">{{ category.icono }}</div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import BaseCarousel from '@/components/ui/BaseCarrusel.vue';
  import type { Product, Category, CarouselItem } from '@/types/Index';
  
  interface Props {
    category: Category;
    autoRotate?: boolean;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    autoRotate: true,
  });
  
  const emit = defineEmits<{
    productClick: [product: Product];
    quickView: [product: Product];
  }>();
  
  const router = useRouter();
  
  const handleProductClick = (index: number, product: CarouselItem) => {
    // Emitir el producto como Product (es compatible ahora)
    emit('productClick', product as Product);
    // Navegar al detalle del producto si está disponible
    if (product.ruta) {
      router.push(product.ruta);
    }
  };
  
  const handleQuickView = (product: CarouselItem | Product) => {
    emit('quickView', product as Product);
  };
  </script>
  
  <style scoped>
  .category-section {
    position: relative;
    padding: 6rem 2rem;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(10, 10, 10, 0.5) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    overflow: hidden;
  }
  
  .category-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(218, 165, 32, 0.3) 50%,
      transparent
    );
  }
  
  /* Header */
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
    50% { transform: translateY(-10px) rotate(5deg); }
  }
  
  .category-info {
    flex: 1;
  }
  
  .category-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: #DAA520;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.05em;
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
    font-size: 1.1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    padding: 0.75rem 1.5rem;
    border: 2px solid rgba(218, 165, 32, 0.3);
    border-radius: 50px;
    background: rgba(218, 165, 32, 0.05);
  }
  
  .view-all-link:hover {
    background: rgba(218, 165, 32, 0.1);
    border-color: #DAA520;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(218, 165, 32, 0.2);
  }
  
  .view-all-link .arrow {
    transition: transform 0.3s ease;
  }
  
  .view-all-link:hover .arrow {
    transform: translateX(5px);
  }
  
  /* Carousel Wrapper */
  .category-carousel-wrapper {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  /* Product Card */
  .product-card {
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.8);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(218, 165, 32, 0.2);
    transition: all 0.4s ease;
    backdrop-filter: blur(10px);
  }
  
  .product-card:hover,
  .product-card.active {
    border-color: #DAA520;
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(218, 165, 32, 0.3);
    transform: translateY(-5px);
  }
  
  .product-image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: #000;
  }
  
  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  .product-card:hover .product-image {
    transform: scale(1.1);
  }
  
  .product-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #DAA520;
    color: #000;
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 20px;
    z-index: 2;
  }
  
  .product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .product-card:hover .product-overlay {
    opacity: 1;
  }
  
  .quick-view-btn {
    background: #DAA520;
    color: #000;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: translateY(10px);
  }
  
  .product-card:hover .quick-view-btn {
    transform: translateY(0);
  }
  
  .quick-view-btn:hover {
    background: #FFD700;
    box-shadow: 0 5px 15px rgba(218, 165, 32, 0.4);
  }
  
  /* Product Info */
  .product-info {
    padding: 1.5rem;
  }
  
  .product-category {
    display: block;
    font-size: 0.75rem;
    color: #DAA520;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .product-name {
    font-size: 1.1rem;
    color: #ffffff;
    margin: 0 0 1rem 0;
    font-weight: 700;
    letter-spacing: 0.05em;
    line-height: 1.4;
  }
  
  .product-price {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .price-old {
    color: rgba(255, 255, 255, 0.4);
    text-decoration: line-through;
    font-size: 0.9rem;
  }
  
  .price-current {
    color: #DAA520;
    font-size: 1.3rem;
    font-weight: 700;
  }
  
  /* Color Options */
  .product-colors {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .color-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .color-dot:hover {
    border-color: #DAA520;
    transform: scale(1.2);
  }
  
  .color-more {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    margin-left: 0.25rem;
  }
  
  /* Decoración */
  .category-decoration {
    position: absolute;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.05;
    z-index: 0;
  }
  
  .decoration-symbol {
    font-size: 20rem;
    color: #DAA520;
    animation: decorationRotate 30s linear infinite;
  }
  
  @keyframes decorationRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .category-header {
      flex-direction: column;
      gap: 2rem;
    }
    
    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .category-icon {
      font-size: 3rem;
    }
  }
  
  @media (max-width: 768px) {
    .category-section {
      padding: 4rem 1rem;
    }
    
    .category-header {
      margin-bottom: 2rem;
    }
    
    .product-info {
      padding: 1rem;
    }
    
    .decoration-symbol {
      font-size: 10rem;
    }
  }
  </style>