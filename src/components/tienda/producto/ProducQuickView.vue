<template>
  <div class="product-quick-view" v-if="product">
    <div class="quick-view-grid">

      <!-- ── Galería de imágenes ── -->
      <div class="product-gallery">
        <div class="main-image">
          <img :src="selectedImage" :alt="productName" />
          <div class="image-badge" v-if="product.nuevo">NUEVO</div>
          <div class="discount-badge" v-if="hasDiscount(product.precio, product.precioAnterior)">
            {{ discountLabel(product.precio, product.precioAnterior) }}
          </div>
        </div>

        <!-- Thumbnails -->
        <div class="thumbnails" v-if="product.imagenes && product.imagenes.length > 1">
          <button
            v-for="(img, idx) in product.imagenes"
            :key="idx"
            class="thumbnail"
            :class="{ active: selectedImage === img }"
            @click="selectedImage = img"
            :aria-label="`Ver imagen ${idx + 1} de ${product.imagenes.length}`"
          >
            <img :src="img" :alt="`${productName} — vista ${idx + 1}`" />
          </button>
        </div>
      </div>

      <!-- ── Información del producto ── -->
      <div class="product-details">

        <!-- Categoría -->
        <span class="product-category" v-if="product.categoria">{{ product.categoria }}</span>

        <!-- Nombre -->
        <h1 class="product-name">{{ productName }}</h1>

        <!-- Descripción -->
        <p class="product-description" v-if="product.descripcion">
          {{ product.descripcion }}
        </p>

        <!-- Precio + Stock -->
        <div class="product-pricing" v-if="product.precio">
          <div class="price-wrapper">
            <span class="price-current">{{ fmt(product.precio) }}</span>
            <span class="price-old" v-if="product.precioAnterior">
              {{ fmt(product.precioAnterior) }}
            </span>
          </div>

          <!--
            Stock reactivo: in-stock / low-stock / out-of-stock
            según product.stock (undefined = sin dato → asume disponible)
          -->
          <div class="stock-status" :class="stockStatus.cls">
            {{ stockStatus.txt }}
          </div>
        </div>

        <!-- Selector de color -->
        <div class="product-option" v-if="product.colores && product.colores.length">
          <label class="option-label">
            Color: <span class="selected-value">{{ selectedColorName }}</span>
          </label>
          <div class="color-selector">
            <button
              v-for="(color, idx) in product.colores"
              :key="idx"
              class="color-option"
              :class="{ selected: selectedColor === color }"
              :style="{ background: color }"
              :title="getColorName(color)"
              :aria-label="getColorName(color)"
              :aria-pressed="selectedColor === color"
              @click="selectColor(color, idx)"
            >
              <span class="check-icon" v-if="selectedColor === color" aria-hidden="true">✓</span>
            </button>
          </div>
        </div>

        <!-- Selector de talla
             Usa product.tallas si el backend las provee; cae en XS-XXL si no. -->
        <div class="product-option">
          <label class="option-label">
            Talla: <span class="selected-value">{{ selectedSize }}</span>
          </label>
          <div class="size-selector">
            <button
              v-for="size in availableSizes"
              :key="size"
              class="size-option"
              :class="{ selected: selectedSize === size }"
              :aria-pressed="selectedSize === size"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Selector de cantidad -->
        <div class="product-option">
          <label class="option-label">Cantidad</label>
          <div class="quantity-selector">
            <button class="qty-btn" @click="decreaseQty" :disabled="quantity <= 1" aria-label="Reducir cantidad">−</button>
            <input
              type="number"
              v-model.number="quantity"
              min="1"
              max="10"
              class="qty-input"
              aria-label="Cantidad"
            />
            <button class="qty-btn" @click="increaseQty" :disabled="quantity >= 10" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <button
            class="btn btn-primary"
            @click="addToCart"
            :disabled="stockStatus.cls === 'out-of-stock'"
          >
            <span class="btn-icon" aria-hidden="true">🛒</span>
            {{ stockStatus.cls === 'out-of-stock' ? 'Sin stock' : 'Agregar al carrito' }}
          </button>
          <button class="btn btn-secondary" @click="goToProduct">
            Ver detalles completos
          </button>
        </div>

        <!-- Características adicionales -->
        <div class="product-features" v-if="product.caracteristicas?.length">
          <div
            class="feature-item"
            v-for="(feature, idx) in product.caracteristicas"
            :key="idx"
          >
            <span class="feature-icon" aria-hidden="true">✦</span>
            <span class="feature-text">{{ feature }}</span>
          </div>
        </div>

        <!-- Envío -->
        <div class="shipping-info">
          <div class="info-item">
            <span class="info-icon" aria-hidden="true">🚚</span>
            <span class="info-text">Envío gratis en compras mayores a $50.000</span>
          </div>
          <div class="info-item">
            <span class="info-icon" aria-hidden="true">↩️</span>
            <span class="info-text">Devoluciones gratis dentro de 30 días</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Product } from '@/types/producto.types';   // unificado — era @/types/Index
import { usePricing } from '@/composables/Usepricing';

// ── Props & Emits ─────────────────────────────────────────────────────────────
const props = defineProps<{ product: Product }>();

const emit = defineEmits<{
  // kebab-case en el template → HomeView escucha @add-to-cart
  'add-to-cart': [product: Product, quantity: number, color?: string, size?: string];
  close: [];
}>();

const router = useRouter();

// ── Utilidades de precio ──────────────────────────────────────────────────────
// fmt, hasDiscount, discountLabel vienen del composable compartido.
// Elimina el cálculo inline de descuento que había en el template.
const { fmt, hasDiscount, discountLabel } = usePricing();

// ── Estado local ──────────────────────────────────────────────────────────────
const selectedImage = ref(props.product.imagen || props.product.imagenes?.[0] || '');
const selectedColor = ref(props.product.colores?.[0] || '');
const selectedSize  = ref('M');
const quantity      = ref(1);

// ── Tallas ────────────────────────────────────────────────────────────────────
// Usa las tallas específicas del producto si el backend las provee.
// Cae en el set genérico solo cuando el producto no trae datos de tallas.
const DEFAULT_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
const availableSizes = computed<string[]>(() =>
  props.product.tallas?.length ? props.product.tallas : [...DEFAULT_SIZES]
);

// ── Stock ─────────────────────────────────────────────────────────────────────
// Reactivo al campo product.stock (number | undefined).
// undefined/null → asume disponible (caso sin dato del backend).
// ≤ 0 → Sin stock. 1–3 → Últimas unidades. > 3 → En stock.
const stockStatus = computed(() => {
  const s = props.product.stock;
  if (s === undefined || s === null) return { cls: 'in-stock',    txt: '✓ En stock' };
  if (s <= 0)                        return { cls: 'out-of-stock', txt: '✗ Sin stock' };
  if (s <= 3)                        return { cls: 'low-stock',    txt: `⚠ Últimas ${s} unidades` };
  return                                    { cls: 'in-stock',    txt: '✓ En stock' };
});

// ── Computeds de UI ───────────────────────────────────────────────────────────
const productName = computed(
  () => props.product.nombre || props.product.titulo || 'Producto'
);

const selectedColorName = computed(() => getColorName(selectedColor.value));

// ── Mapa de colores hex → nombre legible ──────────────────────────────────────
const COLOR_NAMES: Record<string, string> = {
  '#000000': 'Negro',
  '#FFFFFF': 'Blanco',
  '#DAA520': 'Dorado',
  '#FFD700': 'Oro',
  '#1a1a1a': 'Negro oscuro',
  '#2a2a2a': 'Carbón',
  '#3a3a3a': 'Gris oscuro',
  '#f0f0f0': 'Blanco humo',
  '#8B4513': 'Marrón',
};

const getColorName = (hex: string): string =>
  COLOR_NAMES[hex] ?? 'Color personalizado';

// ── Métodos ───────────────────────────────────────────────────────────────────
const selectColor = (color: string, index: number) => {
  selectedColor.value = color;
  // Activa la imagen del mismo índice si existe (convención: color[i] → imagen[i])
  const img = props.product.imagenes?.[index];
  if (img) selectedImage.value = img;
};

const increaseQty = () => { if (quantity.value < 10) quantity.value++; };
const decreaseQty = () => { if (quantity.value > 1)  quantity.value--; };

const addToCart = () => {
  if (stockStatus.value.cls === 'out-of-stock') return;
  emit('add-to-cart', props.product, quantity.value, selectedColor.value, selectedSize.value);
};

const goToProduct = () => {
  emit('close');
  // Prioriza ruta custom del producto; cae en /producto/:id como fallback
  router.push(props.product.ruta ?? `/producto/${props.product.id}`);
};
</script>

<style scoped>
@import '@/assets/css/components/produc-quick-view.css';
</style>
