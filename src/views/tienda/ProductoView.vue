<template>
  <div class="detail-container">
    <StarsBackground :particleCount="40" />

    <!-- ── Loading ──────────────────────────────────────────────────── -->
    <div v-if="loading" class="state-overlay">
      <span class="state-sym">◈</span>
      <p class="state-text">CARGANDO...</p>
    </div>

    <!-- ── Error ────────────────────────────────────────────────────── -->
    <div v-else-if="error || !product" class="state-overlay">
      <span class="state-sym error">✕</span>
      <p class="state-text">Producto no encontrado</p>
      <router-link to="/catalogo" class="state-link">← Volver al catálogo</router-link>
    </div>

    <!-- ── Producto ──────────────────────────────────────────────────── -->
    <div v-else class="detail-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/" class="bc-link">INICIO</router-link>
        <span class="bc-sep">◆</span>
        <router-link to="/catalogo" class="bc-link">CATÁLOGO</router-link>
        <span class="bc-sep">◆</span>
        <span class="bc-current">{{ product.nombre ?? product.titulo }}</span>
      </nav>

      <div class="product-layout">
        <!-- ── Galería ────────────────────────────────────────── -->
        <div class="gallery-col">
          <!-- Imagen principal -->
          <div class="gallery-main">
            <AdvancedImage
              v-if="cldActiveImage"
              :cldImg="cldActiveImage"
              :alt="product.nombre ?? product.titulo"
              class="gallery-main-img"
            />
            <img
              v-else
              :src="activeImage"
              :alt="product.nombre ?? product.titulo"
              class="gallery-main-img"
            />

            <!-- Badges -->
            <div class="gallery-badges">
              <span v-if="product.nuevo" class="badge new">NUEVO</span>
              <span v-if="product.precioAnterior" class="badge sale">
                − {{ discountPercent }}%
              </span>
            </div>
          </div>

          <!-- Miniaturas -->
          <div v-if="allImages.length > 1" class="gallery-thumbs">
            <button
              v-for="(img, i) in allImages"
              :key="i"
              class="thumb-btn"
              :class="{ active: activeImage === img }"
              @click="activeImage = img"
            >
              <AdvancedImage
                v-if="cldAllImages[i]"
                :cldImg="cldAllImages[i]!"
                :alt="`Vista ${i + 1}`"
              />
              <img v-else :src="img" :alt="`Vista ${i + 1}`" />
            </button>
          </div>
        </div>

        <!-- ── Info del producto ──────────────────────────────── -->
        <div class="info-col">
          <!-- Categoría + nombre -->
          <p class="product-category">{{ product.categoria }}</p>
          <h1 class="product-name">{{ product.nombre ?? product.titulo }}</h1>

          <!-- Divider -->
          <div class="info-divider">
            <span class="div-sym">◈</span>
          </div>

          <!-- Precio -->
          <div class="price-block">
            <span v-if="product.precioAnterior" class="price-old">
              $ {{ formatPrice(product.precioAnterior) }}
            </span>
            <span class="price-current">$ {{ formatPrice(product.precio ?? 0) }}</span>
          </div>

          <!-- Descripción -->
          <p v-if="product.descripcion" class="product-description">
            {{ product.descripcion }}
          </p>

          <!-- Selector de color -->
          <div v-if="product.colores?.length" class="selector-block">
            <p class="selector-label">
              COLOR
              <span v-if="selectedColor" class="selector-value">
                — {{ selectedColor }}
              </span>
            </p>
            <div class="color-grid">
              <button
                v-for="color in product.colores"
                :key="color"
                class="color-btn"
                :class="{ active: selectedColor === color }"
                :style="{ backgroundColor: color }"
                :title="color"
                @click="selectedColor = color"
                :aria-pressed="selectedColor === color"
              ></button>
            </div>
          </div>

          <!-- Selector de talla -->
          <div v-if="product.tallas?.length" class="selector-block">
            <div class="selector-header">
              <p class="selector-label">
                TALLA
                <span v-if="selectedTalla" class="selector-value">— {{ selectedTalla }}</span>
              </p>
              <button class="size-guide-btn" @click="showSizeGuide = true">
                Guía de talles →
              </button>
            </div>
            <div class="talla-grid">
              <button
                v-for="talla in product.tallas"
                :key="talla"
                class="talla-btn"
                :class="{ active: selectedTalla === talla }"
                @click="selectedTalla = talla"
              >
                {{ talla }}
              </button>
            </div>
          </div>

          <!-- Cantidad -->
          <div class="selector-block">
            <p class="selector-label">CANTIDAD</p>
            <div class="qty-control">
              <button class="qty-btn" :disabled="quantity <= 1" @click="quantity--">−</button>
              <span class="qty-value">{{ quantity }}</span>
              <button class="qty-btn" @click="quantity++">+</button>
            </div>
          </div>

          <!-- Error validación -->
          <p v-if="addError" class="add-error">{{ addError }}</p>

          <!-- CTA -->
          <div class="cta-group">
            <button class="btn-add-cart" @click="handleAddToCart">
              <span>AGREGAR AL CARRITO</span>
              <span class="btn-sym">→</span>
            </button>
            <button class="btn-wishlist" title="Guardar">◇</button>
          </div>

          <!-- Características -->
          <ul v-if="product.caracteristicas?.length" class="features-list">
            <li
              v-for="feat in product.caracteristicas"
              :key="feat"
              class="feature-item"
            >
              <span class="feat-sym">◆</span>
              <span>{{ feat }}</span>
            </li>
          </ul>

          <!-- Info de entrega -->
          <div class="delivery-info">
            <div class="delivery-row">
              <span class="del-icon">◈</span>
              <span>Envío gratis en compras mayores a $100.000</span>
            </div>
            <div class="delivery-row">
              <span class="del-icon">✦</span>
              <span>Producción en lote limitado — una vez agotado, no se repite</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Modal guía de talles ──────────────────────────────────────── -->
    <BaseModal v-model="showSizeGuide" title="GUÍA DE TALLES" size="small">
      <div class="size-guide">
        <table class="size-table">
          <thead>
            <tr>
              <th>TALLE</th>
              <th>PECHO (cm)</th>
              <th>LARGO (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sizeGuideData" :key="row.talle">
              <td>{{ row.talle }}</td>
              <td>{{ row.pecho }}</td>
              <td>{{ row.largo }}</td>
            </tr>
          </tbody>
        </table>
        <p class="size-note">Medidas tomadas en plano. Tolerancia ±1 cm.</p>
      </div>
    </BaseModal>

    <!-- ── Toast confirmación ────────────────────────────────────────── -->
    <Transition name="toast">
      <div v-if="showToast" class="cart-toast">
        <span class="toast-sym">◈</span>
        <p>{{ toastMessage }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import StarsBackground from '@/components/tienda/common/StarBackground.vue';
import BaseModal       from '@/components/tienda/common/BaseModal.vue';
import { AdvancedImage } from '@cloudinary/vue';
import { buildCldImage } from '@/utils/cloudinary';

import type { Product }   from '@/types/producto.types';
import { productosApi }   from '@/services/tienda/api';
import { useCartStore }   from '@/stores/useCartStore';

const route  = useRoute();
const router = useRouter();
const cart   = useCartStore();

// ── Estado ────────────────────────────────────────────────────────────────────
const loading  = ref(true);
const error    = ref(false);
const product  = ref<Product | null>(null);

const activeImage    = ref('');
const selectedColor  = ref<string | undefined>();
const selectedTalla  = ref<string | undefined>();
const quantity       = ref(1);
const addError       = ref('');
const showSizeGuide  = ref(false);
const showToast      = ref(false);
const toastMessage   = ref('');

// ── Galería ───────────────────────────────────────────────────────────────────
const allImages = computed<string[]>(() => {
  if (!product.value) return [];
  const imgs = product.value.imagenes ?? [];
  return imgs.length ? imgs : [product.value.imagen];
});

// ── Cloudinary ────────────────────────────────────────────────────────────────
// cldActiveImage: versión optimizada (f_auto, q_auto) de la imagen principal activa.
// cldAllImages: ídem para todas las URLs de la galería (usado por las miniaturas).
// Ambos devuelven null para URLs que no son de Cloudinary → el template usa <img> estándar.
const cldActiveImage = computed(() => buildCldImage(activeImage.value));
const cldAllImages   = computed(() => allImages.value.map(url => buildCldImage(url)));

// ── Descuento ─────────────────────────────────────────────────────────────────
const discountPercent = computed(() => {
  if (!product.value?.precioAnterior || !product.value?.precio) return 0;
  return Math.round(
    ((product.value.precioAnterior - product.value.precio) / product.value.precioAnterior) * 100,
  );
});

// ── Formato precios ────────────────────────────────────────────────────────────
const formatPrice = (v: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v);

// ── Carga de datos ────────────────────────────────────────────────────────────
const fetchProduct = async () => {
  const id = route.params.id as string;
  if (!id) { error.value = true; return; }

  loading.value = true;
  error.value   = false;

  try {
    product.value = await productosApi.getById(id);
    activeImage.value = allImages.value[0] ?? '';
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProduct);
watch(() => route.params.id, fetchProduct);

// ── Agregar al carrito ─────────────────────────────────────────────────────────
const handleAddToCart = () => {
  addError.value = '';

  if (product.value?.tallas?.length && !selectedTalla.value) {
    addError.value = 'Por favor seleccioná un talle antes de continuar.';
    return;
  }

  cart.addItem(product.value!, quantity.value, selectedTalla.value, selectedColor.value);
  showCartToast(`${product.value?.nombre ?? 'Producto'} agregado al carrito.`);
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const showCartToast = (msg: string) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => { showToast.value = false; }, 3200);
};

// ── Guía de talles ────────────────────────────────────────────────────────────
const sizeGuideData = [
  { talle: 'XS', pecho: '88–92',  largo: '68' },
  { talle: 'S',  pecho: '92–96',  largo: '70' },
  { talle: 'M',  pecho: '96–100', largo: '72' },
  { talle: 'L',  pecho: '100–104',largo: '74' },
  { talle: 'XL', pecho: '104–110',largo: '76' },
  { talle: 'XXL',pecho: '110–118',largo: '78' },
];
</script>

<style scoped>
@import '@/assets/css/views/producto.css';
</style>
