<template>
    <div class="product-quick-view" v-if="product">
      <div class="quick-view-grid">
        <!-- Galería de imágenes -->
        <div class="product-gallery">
          <div class="main-image">
            <img :src="selectedImage" :alt="productName" />
            <div class="image-badge" v-if="product.nuevo">NUEVO</div>
            <div class="discount-badge" v-if="product.precioAnterior && product.precio">
              -{{ Math.round(((product.precioAnterior - product.precio) / product.precioAnterior) * 100) }}%
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
            >
              <img :src="img" :alt="`${productName} ${idx + 1}`" />
            </button>
          </div>
        </div>
  
        <!-- Información del producto -->
        <div class="product-details">
          <!-- Categoría -->
          <span class="product-category" v-if="product.categoria">{{ product.categoria }}</span>
          
          <!-- Nombre -->
          <h1 class="product-name">{{ productName }}</h1>
          
          <!-- Descripción -->
          <p class="product-description" v-if="product.descripcion">
            {{ product.descripcion }}
          </p>
  
          <!-- Precio -->
          <div class="product-pricing" v-if="product.precio">
            <div class="price-wrapper">
              <span class="price-current">${{ product.precio }}</span>
              <span class="price-old" v-if="product.precioAnterior">
                ${{ product.precioAnterior }}
              </span>
            </div>
            <div class="stock-status" :class="stockClass">
              {{ stockText }}
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
                @click="selectColor(color, idx)"
                :title="getColorName(color)"
              >
                <span class="check-icon" v-if="selectedColor === color">✓</span>
              </button>
            </div>
          </div>
  
          <!-- Selector de talla -->
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
              <button class="qty-btn" @click="decreaseQty" :disabled="quantity <= 1">-</button>
              <input type="number" v-model.number="quantity" min="1" max="10" class="qty-input" />
              <button class="qty-btn" @click="increaseQty" :disabled="quantity >= 10">+</button>
            </div>
          </div>
  
          <!-- Botones de acción -->
          <div class="action-buttons">
            <button class="btn btn-primary" @click="addToCart">
              <span class="btn-icon">🛒</span>
              Agregar al carrito
            </button>
            <button class="btn btn-secondary" @click="goToProduct">
              Ver detalles completos
            </button>
          </div>
  
          <!-- Características adicionales -->
          <div class="product-features" v-if="product.caracteristicas">
            <div class="feature-item" v-for="(feature, idx) in product.caracteristicas" :key="idx">
              <span class="feature-icon">✦</span>
              <span class="feature-text">{{ feature }}</span>
            </div>
          </div>
  
          <!-- Envío -->
          <div class="shipping-info">
            <div class="info-item">
              <span class="info-icon">🚚</span>
              <span class="info-text">Envío gratis en compras mayores a $100</span>
            </div>
            <div class="info-item">
              <span class="info-icon">↩️</span>
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
  import type { Product } from '@/types/Index';
  
  interface Props {
    product: Product;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits<{
    addToCart: [product: Product, quantity: number, color?: string, size?: string];
    close: [];
  }>();
  
  const router = useRouter();
  
  // Estado local
  const selectedImage = ref(props.product.imagen || props.product.imagenes?.[0] || '');
  const selectedColor = ref(props.product.colores?.[0] || '');
  const selectedSize = ref('M');
  const quantity = ref(1);
  
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Computed
  const productName = computed(() => {
    return props.product.nombre || props.product.titulo || 'Producto';
  });
  
  const selectedColorName = computed(() => {
    const colorIndex = props.product.colores?.indexOf(selectedColor.value) || 0;
    return getColorName(selectedColor.value);
  });
  
  const stockClass = computed(() => {
    // Simulación de stock
    return 'in-stock';
  });
  
  const stockText = computed(() => {
    return '✓ En stock';
  });
  
  // Métodos
  const selectColor = (color: string, index: number) => {
    selectedColor.value = color;
    // Si hay múltiples imágenes, cambiar la imagen según el color
    if (props.product.imagenes && props.product.imagenes.length > index) {
      const newImage = props.product.imagenes[index];
      if (newImage) {
        selectedImage.value = newImage;
      }
    }
  };
  
  const getColorName = (colorHex: string): string => {
    const colorNames: { [key: string]: string } = {
      '#000000': 'Negro',
      '#FFFFFF': 'Blanco',
      '#DAA520': 'Dorado',
      '#8B4513': 'Marrón',
      '#1a1a1a': 'Negro oscuro',
      '#2a2a2a': 'Carbón',
      '#3a3a3a': 'Gris oscuro',
      '#f0f0f0': 'Blanco humo',
      '#FFD700': 'Oro',
    };
    return colorNames[colorHex] || 'Color personalizado';
  };
  
  const increaseQty = () => {
    if (quantity.value < 10) quantity.value++;
  };
  
  const decreaseQty = () => {
    if (quantity.value > 1) quantity.value--;
  };
  
  const addToCart = () => {
    emit('addToCart', props.product, quantity.value, selectedColor.value, selectedSize.value);
  };
  
  const goToProduct = () => {
    emit('close');
    router.push(`/producto/${props.product.id}`);
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
  
  /* Galería */
  .product-gallery {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-image {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .main-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  
  .image-badge {
    right: 1rem;
    background: #DAA520;
    color: #000;
  }
  
  .discount-badge {
    left: 1rem;
    background: #ff4444;
    color: #fff;
  }
  
  .thumbnails {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .thumbnail {
    flex-shrink: 0;
    width: 80px;
    height: 100px;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #000;
  }
  
  .thumbnail:hover,
  .thumbnail.active {
    border-color: #DAA520;
  }
  
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Detalles del producto */
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
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin: 0;
  }
  
  .product-pricing {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(218, 165, 32, 0.2);
    border-bottom: 1px solid rgba(218, 165, 32, 0.2);
  }
  
  .price-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .price-current {
    font-size: 2rem;
    font-weight: 700;
    color: #DAA520;
  }
  
  .price-old {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: line-through;
  }
  
  .stock-status {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 20px;
  }
  
  .stock-status.in-stock {
    color: #4ade80;
    background: rgba(74, 222, 128, 0.1);
  }
  
  /* Opciones */
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
  
  .selected-value {
    color: #DAA520;
    margin-left: 0.5rem;
  }
  
  .color-selector,
  .size-selector {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .color-option {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-option:hover {
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.6);
  }
  
  .color-option.selected {
    border-color: #DAA520;
    border-width: 3px;
    box-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
  }
  
  .check-icon {
    color: #fff;
    font-size: 1.2rem;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  }
  
  .size-option {
    min-width: 50px;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(218, 165, 32, 0.3);
    border-radius: 8px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .size-option:hover {
    background: rgba(218, 165, 32, 0.1);
    border-color: #DAA520;
  }
  
  .size-option.selected {
    background: #DAA520;
    color: #000;
    border-color: #DAA520;
  }
  
  /* Cantidad */
  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: fit-content;
  }
  
  .qty-btn {
    width: 40px;
    height: 40px;
    background: rgba(218, 165, 32, 0.1);
    border: 2px solid rgba(218, 165, 32, 0.3);
    border-radius: 8px;
    color: #DAA520;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .qty-btn:hover:not(:disabled) {
    background: rgba(218, 165, 32, 0.2);
    border-color: #DAA520;
  }
  
  .qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .qty-input {
    width: 60px;
    height: 40px;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(218, 165, 32, 0.3);
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .qty-input:focus {
    outline: none;
    border-color: #DAA520;
  }
  
  /* Botones de acción */
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
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: #000;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(218, 165, 32, 0.4);
  }
  
  .btn-secondary {
    background: transparent;
    color: #DAA520;
    border: 2px solid #DAA520;
  }
  
  .btn-secondary:hover {
    background: rgba(218, 165, 32, 0.1);
  }
  
  .btn-icon {
    font-size: 1.2rem;
  }
  
  /* Características */
  .product-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(218, 165, 32, 0.2);
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }
  
  .feature-icon {
    color: #DAA520;
    font-size: 0.8rem;
  }
  
  /* Info de envío */
  .shipping-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem;
    background: rgba(218, 165, 32, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(218, 165, 32, 0.2);
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
  }
  
  .info-icon {
    font-size: 1.2rem;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .quick-view-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  
    .product-name {
      font-size: 1.5rem;
    }
  
    .price-current {
      font-size: 1.5rem;
    }
  
    .action-buttons {
      position: sticky;
      bottom: 0;
      background: linear-gradient(to top, #0a0a0a 80%, transparent);
      padding-top: 1rem;
      margin: 0 -1.5rem -1.5rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      padding-bottom: 1.5rem;
    }
  }
  </style>