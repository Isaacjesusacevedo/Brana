<template>
  <div class="product-card" @click="handleClick">
    <div class="product-card__image-wrapper">
      <img
        :src="product.image"
        :alt="product.name"
        class="product-card__image"
      />
      <div v-if="product.badge" class="product-badge">{{ product.badge }}</div>
      <div class="product-card__overlay">
        <span class="view-details">Ver detalles</span>
      </div>
    </div>
    <div class="product-card__info">
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__price">{{ product.price }}</p>
      <div v-if="product.variants" class="product-card__variants">
        <span
          v-for="(variant, index) in product.variants.slice(0, 3)"
          :key="index"
          class="variant-dot"
          :style="{ background: variant.colorHex }"
        ></span>
        <span v-if="product.variants.length > 3" class="variant-more">
          +{{ product.variants.length - 3 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface ProductVariant {
  color: string
  colorHex: string
  image: string
}

interface Product {
  id: number
  name: string
  price: string
  image: string
  badge?: string
  size?: 'normal' | 'featured' | 'wide' | 'tall'
  variants?: ProductVariant[]
}

interface Props {
  product: Product
}

const props = defineProps<Props>()
const router = useRouter()

const handleClick = () => {
  router.push(`/producto/${props.product.id}`)
}
</script>

<style scoped>
.product-card {
  position: relative;
  background: rgba(10, 10, 10, 0.8);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(218, 165, 32, 0.2);
  transition: all 0.4s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.product-card:hover {
  border-color: #DAA520;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(218, 165, 32, 0.3);
  transform: translateY(-5px);
}

.product-card__image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: #000;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .product-card__image {
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

.product-card__overlay {
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

.product-card:hover .product-card__overlay {
  opacity: 1;
}

.view-details {
  color: #DAA520;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.product-card__info {
  padding: 1.5rem;
}

.product-card__name {
  font-size: 1.1rem;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.product-card__price {
  font-size: 1.3rem;
  color: #DAA520;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.product-card__variants {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.variant-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.variant-dot:hover {
  border-color: #DAA520;
  transform: scale(1.2);
}

.variant-more {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 0.25rem;
}
</style>