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
@import '@/assets/css/components/product-card.css';
</style>
