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
.product-quick-view {
  min-height: 500px;
}

.quick-view-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* ── Galería ── */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: #0a0a0a;
  border-radius: 12px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.image-badge,
.discount-badge {
  position: absolute;
  top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 20px;
}

.image-badge   { right: 1rem; background: #DAA520; color: #000; }
.discount-badge { left: 1rem; background: #e74c3c; color: #fff; }

.thumbnails {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(218,165,32,0.3) transparent;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 100px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #0a0a0a;
}

.thumbnail:hover,
.thumbnail.active { border-color: #DAA520; }

.thumbnail img { width: 100%; height: 100%; object-fit: cover; }

/* ── Detalles ── */
.product-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-category {
  color: #DAA520;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
}

.product-description {
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  margin: 0;
}

/* ── Precio + Stock ── */
.product-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(218,165,32,0.2);
  border-bottom: 1px solid rgba(218,165,32,0.2);
}

.price-wrapper { display: flex; align-items: center; gap: 1rem; }
.price-current { font-size: 2rem; font-weight: 700; color: #DAA520; }
.price-old     { font-size: 1.2rem; color: rgba(255,255,255,0.4); text-decoration: line-through; }

.stock-status {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid transparent;
}

.stock-status.in-stock    { color: #4ade80; background: rgba(74,222,128,0.1);  border-color: rgba(74,222,128,0.2);  }
.stock-status.low-stock   { color: #e67e22; background: rgba(230,126,34,0.1); border-color: rgba(230,126,34,0.2); }
.stock-status.out-of-stock{ color: #e74c3c; background: rgba(231,76,60,0.1);  border-color: rgba(231,76,60,0.2);  }

/* ── Opciones (color, talla, cantidad) ── */
.product-option {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-label {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}

.selected-value { color: #DAA520; margin-left: 0.5rem; }

.color-selector,
.size-selector { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-option:hover            { transform: scale(1.1); border-color: rgba(255,255,255,0.6); }
.color-option.selected         { border-color: #DAA520; border-width: 3px; box-shadow: 0 0 10px rgba(218,165,32,0.5); }
.check-icon                    { color: #fff; font-size: 1.2rem; text-shadow: 0 0 4px rgba(0,0,0,0.8); }

.size-option {
  min-width: 50px;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(218,165,32,0.3);
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.size-option:hover    { background: rgba(218,165,32,0.1); border-color: #DAA520; }
.size-option.selected { background: #DAA520; color: #000; border-color: #DAA520; }

/* ── Cantidad ── */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
}

.qty-btn {
  width: 40px;
  height: 40px;
  background: rgba(218,165,32,0.1);
  border: 2px solid rgba(218,165,32,0.3);
  border-radius: 8px;
  color: #DAA520;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  line-height: 1;
}

.qty-btn:hover:not(:disabled) { background: rgba(218,165,32,0.2); border-color: #DAA520; }
.qty-btn:disabled              { opacity: 0.3; cursor: not-allowed; }

.qty-input {
  width: 60px;
  height: 40px;
  text-align: center;
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(218,165,32,0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
}

.qty-input:focus { outline: none; border-color: #DAA520; }

/* ── Botones de acción ── */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-primary { background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%); color: #000; }
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(218,165,32,0.4); }
.btn-primary:disabled              { opacity: 0.45; cursor: not-allowed; filter: grayscale(0.4); }

.btn-secondary { background: transparent; color: #DAA520; border: 2px solid #DAA520; }
.btn-secondary:hover { background: rgba(218,165,32,0.1); }

.btn-icon { font-size: 1.2rem; }

/* ── Características ── */
.product-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(218,165,32,0.2);
}

.feature-item { display: flex; align-items: center; gap: 0.75rem; color: rgba(255,255,255,0.8); font-size: 0.9rem; }
.feature-icon { color: #DAA520; font-size: 0.8rem; }

/* ── Envío ── */
.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(218,165,32,0.05);
  border-radius: 12px;
  border: 1px solid rgba(218,165,32,0.15);
}

.info-item { display: flex; align-items: center; gap: 0.75rem; color: rgba(255,255,255,0.8); font-size: 0.875rem; }
.info-icon { font-size: 1.2rem; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .quick-view-grid { grid-template-columns: 1fr; gap: 2rem; }
  .product-name   { font-size: 1.5rem; }
  .price-current  { font-size: 1.5rem; }

  .action-buttons {
    position: sticky;
    bottom: 0;
    background: linear-gradient(to top, #0a0a0a 80%, transparent);
    padding: 1rem 1.5rem 1.5rem;
    margin: 0 -1.5rem -1.5rem;
  }
}
</style>