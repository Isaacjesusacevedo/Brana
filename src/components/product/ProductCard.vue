<template>
    <div 
      class="product-card"
      :class="[sizeClass, { 'product-card--hovered': isHovered }]"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Frame -->
      <div class="product-card__frame">
        <div class="frame-corner frame-corner--tl"></div>
        <div class="frame-corner frame-corner--tr"></div>
        <div class="frame-corner frame-corner--bl"></div>
        <div class="frame-corner frame-corner--br"></div>
      </div>
  
      <!-- Holographic Overlay -->
      <div v-if="isHovered" class="product-card__holo"></div>
  
      <!-- Image -->
      <div class="product-card__image-wrapper">
        <img :src="currentImage" :alt="product.name" class="product-card__image" />
        <div class="product-card__overlay"></div>
      </div>
  
      <!-- Info -->
      <div class="product-card__info">
        <span v-if="product.badge" class="product-card__badge">
          {{ product.badge }}
        </span>
        
        <h3 class="product-card__name">{{ product.name }}</h3>
        <p class="product-card__price">{{ product.price }}</p>
  
        <!-- Color Selector (if variants exist) -->
        <div v-if="product.variants && product.variants.length > 0 && isHovered" class="product-card__colors">
          <div class="colors__label">VARIANTES:</div>
          <div class="colors__options">
            <button
              v-for="variant in product.variants"
              :key="variant.color"
              class="color-option"
              :class="{ 'color-option--active': selectedColor === variant.color }"
              :style="{ 
                background: variant.colorHex,
                boxShadow: selectedColor === variant.color ? `0 0 15px ${variant.colorHex}` : 'none'
              }"
              :title="variant.color"
              @click.stop="selectColor(variant)"
            ></button>
          </div>
        </div>
      </div>
  
      <!-- Shimmer Effect -->
      <div class="product-card__shimmer"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  interface ProductVariant {
    color: string;
    colorHex: string;
    image: string;
  }
  
  interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    badge?: string;
    size?: 'normal' | 'featured' | 'wide' | 'tall';
    variants?: ProductVariant[];
  }
  
  interface Props {
    product: Product;
  }
  
  const props = defineProps<Props>();
  
  const isHovered = ref(false);
  const selectedColor = ref<string | null>(null);
  
  const sizeClass = computed(() => {
    if (!props.product.size || props.product.size === 'normal') return '';
    return `product-card--${props.product.size}`;
  });
  
  const currentImage = computed(() => {
    if (selectedColor.value && props.product.variants) {
      const variant = props.product.variants.find(v => v.color === selectedColor.value);
      return variant?.image || props.product.image;
    }
    return props.product.image;
  });
  
  const selectColor = (variant: ProductVariant) => {
    selectedColor.value = variant.color;
  };
  </script>
  
  <style scoped>
  /* ========== PRODUCT CARD ========== */
  .product-card {
    position: relative;
    background: var(--bg-card);
    border: var(--border-gold);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-slow) var(--ease-smooth);
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
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
  
  .product-card:hover {
    transform: translateY(-12px);
    border-color: rgba(212, 175, 55, 0.7);
    box-shadow: 
      0 25px 65px rgba(212, 175, 55, 0.4),
      0 0 35px rgba(212, 175, 55, 0.3);
  }
  
  /* ========== SIZES ========== */
  @media (min-width: 1024px) {
    .product-card--featured {
      grid-column: span 2;
      grid-row: span 2;
    }
  
    .product-card--wide {
      grid-column: span 2;
    }
  
    .product-card--tall {
      grid-row: span 2;
    }
  }
  
  /* ========== FRAME ========== */
  .product-card__frame {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
  }
  
  .frame-corner {
    position: absolute;
    width: 22px;
    height: 22px;
    border: 2px solid var(--color-gold-primary);
    opacity: 0.4;
    transition: all var(--transition-base) ease;
    box-shadow: var(--shadow-gold-sm);
  }
  
  .product-card:hover .frame-corner {
    opacity: 1;
    box-shadow: var(--shadow-gold-md);
    border-color: var(--color-gold-light);
  }
  
  .frame-corner--tl {
    top: 10px;
    left: 10px;
    border-right: none;
    border-bottom: none;
  }
  
  .frame-corner--tr {
    top: 10px;
    right: 10px;
    border-left: none;
    border-bottom: none;
  }
  
  .frame-corner--bl {
    bottom: 10px;
    left: 10px;
    border-right: none;
    border-top: none;
  }
  
  .frame-corner--br {
    bottom: 10px;
    right: 10px;
    border-left: none;
    border-top: none;
  }
  
  /* ========== HOLOGRAPHIC OVERLAY ========== */
  .product-card__holo {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(0, 255, 240, 0.1) 25%,
      rgba(255, 0, 255, 0.1) 50%,
      rgba(255, 215, 0, 0.1) 75%,
      transparent 100%
    );
    opacity: 1;
    pointer-events: none;
    z-index: 7;
    mix-blend-mode: screen;
    animation: holoShift 3s ease-in-out infinite;
  }
  
  @keyframes holoShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  /* ========== IMAGE ========== */
  .product-card__image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
  }
  
  .product-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s var(--ease-smooth), filter 0.3s ease;
    filter: grayscale(0.2) contrast(1.1);
  }
  
  .product-card:hover .product-card__image {
    transform: scale(1.12);
    filter: grayscale(0) contrast(1.2) brightness(1.1);
  }
  
  .product-card__overlay {
    position: absolute;
    inset: 0;
    background: var(--gradient-overlay);
    opacity: 0.7;
    transition: opacity var(--transition-base) ease;
  }
  
  .product-card:hover .product-card__overlay {
    opacity: 0.5;
  }
  
  /* ========== INFO ========== */
  .product-card__info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--spacing-2xl);
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.7), transparent);
    z-index: 6;
  }
  
  .product-card__badge {
    display: inline-block;
    padding: 0.4rem 1rem;
    background: rgba(212, 175, 55, 0.2);
    border: 1px solid var(--color-gold-primary);
    color: var(--color-gold-primary);
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-widest);
    margin-bottom: var(--spacing-md);
    text-transform: uppercase;
    text-shadow: var(--text-shadow-gold);
  }
  
  .product-card__name {
    font-family: var(--font-heading);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-wide);
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
    text-shadow: var(--text-shadow-gold);
    transition: all var(--transition-base) ease;
  }
  
  .product-card:hover .product-card__name {
    color: var(--color-gold-primary);
    text-shadow: var(--text-shadow-gold-strong);
  }
  
  .product-card__price {
    font-family: var(--font-display);
    font-size: var(--font-size-3xl);
    color: var(--color-gold-primary);
    text-shadow: var(--text-shadow-gold);
    letter-spacing: var(--letter-spacing-wide);
  }
  
  /* ========== COLOR SELECTOR ========== */
  .product-card__colors {
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-lg);
    border-top: 1px solid rgba(212, 175, 55, 0.2);
    animation: fadeIn var(--transition-base) ease-out;
  }
  
  .colors__label {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-widest);
    color: rgba(212, 175, 55, 0.7);
    margin-bottom: var(--spacing-sm);
    text-transform: uppercase;
    text-shadow: var(--text-shadow-gold);
  }
  
  .colors__options {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }
  
  .color-option {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(212, 175, 55, 0.3);
    cursor: pointer;
    transition: all var(--transition-base) var(--ease-smooth);
    position: relative;
  }
  
  .color-option:hover {
    transform: scale(1.15);
    border-color: rgba(212, 175, 55, 0.6);
    box-shadow: var(--shadow-gold-sm);
  }
  
  .color-option--active {
    border-color: var(--color-gold-primary);
    transform: scale(1.2);
  }
  
  /* ========== SHIMMER ========== */
  .product-card__shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
    z-index: 8;
    pointer-events: none;
  }
  
  .product-card:hover .product-card__shimmer {
    animation: shimmerMove 0.8s ease-out;
  }
  
  @keyframes shimmerMove {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  /* ========== RESPONSIVE ========== */
  @media (max-width: 768px) {
    .product-card__info {
      padding: var(--spacing-lg);
    }
  
    .product-card__name {
      font-size: var(--font-size-xl);
    }
  
    .product-card__price {
      font-size: var(--font-size-2xl);
    }
  }
  </style>