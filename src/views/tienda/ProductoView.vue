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
/* ========================
   BASE
======================== */
.detail-container {
  position: relative;
  min-height: 100vh;
  background: #000;
  overflow-x: hidden;
}

/* ========================
   STATE OVERLAYS
======================== */
.state-overlay {
  position: relative;
  z-index: 1;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 4rem 2rem;
}

.state-sym {
  font-size: 3rem;
  color: var(--gold, #daa520);
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
}

.state-sym.error { color: #dc2626; }

@keyframes pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}

.state-text {
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

.state-link {
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: var(--gold, #daa520);
  text-decoration: none;
  text-transform: uppercase;
}

.state-link:hover { text-decoration: underline; }

/* ========================
   CONTENT
======================== */
.detail-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem;
}

/* ========================
   BREADCRUMB
======================== */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 3rem;
}

.bc-link {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.bc-link:hover { color: var(--gold, #daa520); }

.bc-sep {
  font-size: 0.4rem;
  color: rgba(218, 165, 32, 0.3);
}

.bc-current {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

/* ========================
   LAYOUT
======================== */
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}

/* ========================
   GALERÍA
======================== */
.gallery-col { position: sticky; top: 100px; }

.gallery-main {
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 1rem;
}

.gallery-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-main:hover .gallery-main-img { transform: scale(1.04); }

.gallery-badges {
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 2;
}

.badge {
  padding: 0.3rem 0.8rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  border-radius: 2px;
}

.badge.new  { background: #4ade80; color: #000; }
.badge.sale { background: #dc2626; color: #fff; }

.gallery-thumbs {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.thumb-btn {
  width: 72px;
  height: 72px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.2s ease;
}

.thumb-btn img { width: 100%; height: 100%; object-fit: cover; }
.thumb-btn.active { border-color: var(--gold, #daa520); }
.thumb-btn:hover  { border-color: rgba(218, 165, 32, 0.5); }

/* ========================
   INFO COL
======================== */
.info-col { display: flex; flex-direction: column; gap: 1.5rem; }

.product-category {
  font-size: 0.68rem;
  letter-spacing: 0.3em;
  color: var(--gold, #daa520);
  text-transform: uppercase;
}

.product-name {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.1;
  margin: 0;
}

.info-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.div-sym { color: var(--gold, #daa520); opacity: 0.4; font-size: 1rem; }

/* Price */
.price-block { display: flex; align-items: baseline; gap: 1rem; }

.price-old {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: line-through;
}

.price-current {
  font-size: 2rem;
  font-weight: 900;
  color: var(--gold, #daa520);
}

/* Description */
.product-description {
  font-size: 0.95rem;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}

/* Selectors */
.selector-block { display: flex; flex-direction: column; gap: 0.8rem; }

.selector-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

.selector-value { color: var(--gold, #daa520); }

/* Color */
.color-grid { display: flex; gap: 0.7rem; flex-wrap: wrap; }

.color-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.color-btn:hover   { transform: scale(1.15); border-color: rgba(255, 255, 255, 0.4); }
.color-btn.active  { border-color: var(--gold, #daa520); box-shadow: 0 0 0 3px rgba(218,165,32,0.3); }

/* Talla */
.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.size-guide-btn {
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  transition: color 0.2s ease;
}

.size-guide-btn:hover { color: var(--gold, #daa520); }

.talla-grid { display: flex; gap: 0.6rem; flex-wrap: wrap; }

.talla-btn {
  min-width: 48px;
  height: 48px;
  padding: 0 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.talla-btn:hover  { border-color: rgba(218, 165, 32, 0.5); color: #fff; }
.talla-btn.active { background: var(--gold, #daa520); border-color: var(--gold, #daa520); color: #000; }

/* Qty */
.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.qty-btn:hover:not(:disabled) { background: rgba(218, 165, 32, 0.1); color: var(--gold, #daa520); }
.qty-btn:disabled { opacity: 0.25; cursor: not-allowed; }

.qty-value {
  min-width: 48px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  border-left: 1px solid rgba(255,255,255,0.08);
  border-right: 1px solid rgba(255,255,255,0.08);
  padding: 0 0.8rem;
}

/* Error validación */
.add-error {
  font-size: 0.78rem;
  color: #dc2626;
  letter-spacing: 0.05em;
  margin: 0;
}

/* CTA */
.cta-group { display: flex; gap: 0.8rem; }

.btn-add-cart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.2rem 2rem;
  background: linear-gradient(135deg, var(--gold, #daa520), #f5c842);
  border: none;
  color: #000;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.btn-add-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(218, 165, 32, 0.35);
}

.btn-sym { transition: transform 0.2s ease; }
.btn-add-cart:hover .btn-sym { transform: translateX(4px); }

.btn-wishlist {
  width: 54px;
  height: 54px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-wishlist:hover { border-color: rgba(218, 165, 32, 0.4); color: var(--gold, #daa520); }

/* Features */
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

.feat-sym { color: var(--gold, #daa520); font-size: 0.5rem; margin-top: 0.35rem; flex-shrink: 0; }

/* Delivery info */
.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.2rem;
  background: rgba(218, 165, 32, 0.04);
  border: 1px solid rgba(218, 165, 32, 0.12);
  border-radius: 4px;
}

.delivery-row {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.5);
}

.del-icon { color: var(--gold, #daa520); flex-shrink: 0; font-size: 0.8rem; }

/* ========================
   SIZE GUIDE MODAL
======================== */
.size-guide { padding: 1rem 0; }

.size-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.size-table th {
  padding: 0.8rem;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  color: var(--gold, #daa520);
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.size-table td {
  padding: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.size-note {
  margin-top: 1rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.05em;
}

/* ========================
   TOAST
======================== */
.cart-toast {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  background: rgba(10, 10, 10, 0.95);
  border: 1px solid rgba(218, 165, 32, 0.4);
  border-radius: 4px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  max-width: 340px;
}

.toast-sym { color: var(--gold, #daa520); font-size: 1rem; flex-shrink: 0; }

.cart-toast p {
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.toast-enter-active,
.toast-leave-active { transition: all 0.35s ease; }

.toast-enter-from,
.toast-leave-to { opacity: 0; transform: translateY(12px) scale(0.96); }

/* ========================
   RESPONSIVE
======================== */
@media (max-width: 1024px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .gallery-col { position: static; }
}

@media (max-width: 640px) {
  .detail-content { padding: 6rem 1.2rem 4rem; }

  .product-name { font-size: 1.8rem; }

  .price-current { font-size: 1.6rem; }

  .cta-group { flex-direction: column; }
  .btn-wishlist { width: 100%; }

  .cart-toast { bottom: 1rem; right: 1rem; left: 1rem; max-width: none; }
}
</style>