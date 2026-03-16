<template>
  <div class="product-card" @click="handleClick">

    <!-- Imagen: ocupa todo el espacio libre arriba -->
    <div class="product-card__image-wrapper">
      <AdvancedImage
        v-if="cldImg"
        :cldImg="cldImg"
        :alt="product.nombre ?? product.titulo ?? ''"
        class="product-card__image"
        loading="lazy"
      />
      <img
        v-else
        :src="product.imagen"
        :alt="product.nombre ?? product.titulo ?? ''"
        class="product-card__image"
        loading="lazy"
      />
      <div v-if="product.badge || product.nuevo" class="product-badge">
        {{ product.badge ?? 'NUEVO' }}
      </div>
      <div class="product-card__overlay">
        <span class="view-details">Ver detalles →</span>
      </div>
    </div>

    <!-- Info: altura fija al fondo -->
    <div class="product-card__info">
      <span v-if="product.categoria" class="product-card__cat">{{ product.categoria }}</span>
      <h3 class="product-card__name">{{ product.nombre ?? product.titulo ?? 'Producto' }}</h3>
      <div class="product-card__price-row">
        <span v-if="product.precioAnterior" class="price-old">$ {{ fmt(product.precioAnterior) }}</span>
        <span v-if="product.precio" class="price-current">$ {{ fmt(product.precio) }}</span>
      </div>
      <div v-if="product.colores?.length" class="product-card__variants">
        <span
          v-for="(color, i) in product.colores.slice(0, 3)"
          :key="i"
          class="variant-dot"
          :style="{ background: color }"
        ></span>
        <span v-if="product.colores.length > 3" class="variant-more">+{{ product.colores.length - 3 }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { AdvancedImage } from '@cloudinary/vue';
import { buildCldImage } from '@/utils/cloudinary';
import type { Product } from '@/types/Index';

interface Props {
  product: Product;
  disableNav?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ click: [product: Product] }>();
const router = useRouter();

const cldImg = computed(() => buildCldImage(props.product.imagen));

const handleClick = () => {
  if (props.disableNav) { emit('click', props.product); return; }
  router.push(props.product.ruta ?? `/producto/${props.product.id}`);
};

const fmt = (v: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v);
</script>

<style scoped>
.product-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.9);
  border: 1px solid rgba(218, 165, 32, 0.12);
  transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  border-color: rgba(218, 165, 32, 0.55);
  box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 20px rgba(218,165,32,0.15);
  transform: translateY(-4px);
}

/* ── Imagen: flex:1 → crece para llenar el espacio sobre info ── */
.product-card__image-wrapper {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #111;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.55s ease;
}

.product-card:hover .product-card__image { transform: scale(1.06); }

.product-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #DAA520;
  color: #000;
  padding: 0.28rem 0.65rem;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 20px;
  z-index: 2;
}

.product-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

.product-card:hover .product-card__overlay { opacity: 1; }

.view-details {
  color: #DAA520;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  border-bottom: 1px solid rgba(218,165,32,0.4);
  padding-bottom: 2px;
}

/* ── Info: flex-shrink:0 → altura dictada por contenido, nunca crece ── */
.product-card__info {
  flex-shrink: 0;
  padding: 0.85rem 1rem 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  background: rgba(8, 8, 8, 0.95);
  border-top: 1px solid rgba(218, 165, 32, 0.07);
}

.product-card__cat {
  font-size: 0.58rem;
  font-weight: 700;
  color: #DAA520;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  opacity: 0.75;
}

.product-card__name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 0.04em;
  line-height: 1.25;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.price-old {
  color: rgba(255,255,255,0.3);
  text-decoration: line-through;
  font-size: 0.78rem;
}

.price-current {
  color: #DAA520;
  font-size: 1rem;
  font-weight: 700;
}

.product-card__variants {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.2rem;
}

.variant-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.2);
  flex-shrink: 0;
}

.variant-more {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.4);
}
</style>