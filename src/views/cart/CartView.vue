<template>
  <div class="cart-container">
    <!-- Fondo de estrellas -->
    <StarsBackground :particleCount="60" />
    
    <!-- Decoraciones flotantes -->
    <div class="floating-decorations">
      <img 
        src="@/assets/images/logos/estatuaart1.png" 
        alt="Decoration" 
        class="decoration decoration-1"
      />
      <img 
        src="@/assets/images/logos/toquealoeterno.png" 
        alt="Decoration" 
        class="decoration decoration-2"
      />
    </div>

    <div class="cart-content">
      <!-- Header -->
      <header class="cart-header">
        <h1 class="cart-title">
          <span class="icon">✧</span>
          TU CARRITO
          <span class="icon">✧</span>
        </h1>
        <p class="cart-subtitle">{{ cartItems.length }} piezas sagradas esperando</p>
      </header>

      <!-- Empty Cart -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Tu bolsa está vacía</h2>
        <p>Ingresa para ver tu cesta y comenzar a comprar</p>
        <div class="empty-actions">
          <button @click="goToHome" class="btn-primary">
            EXPLORAR COLECCIÓN
          </button>
          <button @click="goToLogin" class="btn-secondary">
            REGISTRARSE/INICIAR SESIÓN
          </button>
        </div>
      </div>

      <!-- Cart with Items -->
      <div v-else class="cart-grid">
        <!-- Items List -->
        <div class="cart-items">
          <TransitionGroup name="cart-item">
            <div 
              v-for="item in cartItems" 
              :key="item.id"
              class="cart-item"
            >
              <!-- Image -->
              <div class="item-image-container">
                <img 
                  :src="item.imagen" 
                  :alt="item.nombre || 'Producto'"
                  class="item-image"
                />
              </div>

              <!-- Info -->
              <div class="item-info">
                <h3 class="item-name">{{ item.nombre || 'Producto' }}</h3>
                <p class="item-category">{{ item.categoria || 'Sin categoría' }}</p>
                
                <div class="item-details">
                  <div v-if="item.color" class="item-color">
                    <span class="label">Color:</span>
                    <div 
                      class="color-dot" 
                      :style="{ backgroundColor: item.color }"
                    ></div>
                  </div>
                  <div v-if="item.size" class="item-size">
                    <span class="label">Talle:</span>
                    <span class="value">{{ item.size }}</span>
                  </div>
                </div>

                <!-- Quantity Controls -->
                <div class="item-quantity">
                  <button 
                    @click="decreaseQuantity(item.id)"
                    class="qty-btn"
                    :disabled="item.quantity <= 1"
                  >
                    -
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button 
                    @click="increaseQuantity(item.id)"
                    class="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Price & Remove -->
              <div class="item-actions">
                <p class="item-price">${{ (item.precio || 0) * item.quantity }}</p>
                <button 
                  @click="removeItem(item.id)"
                  class="btn-remove"
                  aria-label="Eliminar producto"
                >
                  ✕
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Summary Sidebar -->
        <aside class="cart-summary">
          <div class="summary-card">
            <h2 class="summary-title">Resumen del Pedido</h2>
            
            <div class="summary-line">
              <span>Subtotal</span>
              <span>${{ subtotal }}</span>
            </div>
            
            <div class="summary-line">
              <span>Envío</span>
              <span v-if="shippingCost === 0" class="free">GRATIS</span>
              <span v-else>${{ shippingCost }}</span>
            </div>

            <div v-if="discount > 0" class="summary-line discount">
              <span>Descuento</span>
              <span>-${{ discount }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-total">
              <span>Total</span>
              <span class="total-amount">${{ total }}</span>
            </div>

            <!-- Promo Code -->
            <div class="promo-code">
              <input 
                v-model="promoCode"
                type="text"
                placeholder="Código de descuento"
                class="promo-input"
              />
              <button 
                @click="applyPromo"
                class="promo-btn"
              >
                APLICAR
              </button>
            </div>

            <!-- Shipping Info -->
            <div class="shipping-info">
              <div class="info-icon">📦</div>
              <p>Envío gratuito en compras superiores a $100</p>
            </div>

            <!-- Checkout Button -->
            <button 
              @click="goToCheckout"
              class="btn-checkout"
            >
              PROCEDER AL PAGO
            </button>

            <button 
              @click="goToHome"
              class="btn-continue"
            >
              Continuar Comprando
            </button>
          </div>
        </aside>
      </div>

      <!-- Recommendations Section -->
      <section v-if="cartItems.length > 0" class="recommendations">
        <h2 class="section-title">
          <span class="icon">◆</span>
          Te Podría Gustar
          <span class="icon">◆</span>
        </h2>
        <div class="recommendations-grid">
          <div 
            v-for="product in recommendations" 
            :key="product.id"
            class="recommendation-card"
            @click="handleProductClick(product)"
          >
            <div class="recommendation-image">
              <img :src="product.imagen" :alt="product.nombre || 'Producto'" />
            </div>
            <h3 class="recommendation-name">{{ product.nombre || 'Producto' }}</h3>
            <p class="recommendation-price">${{ product.precio || 0 }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import StarsBackground from '@/components/ui/StarBackground.vue';

interface CartItem {
  id: number | string;
  nombre?: string;
  imagen: string;
  precio?: number;
  categoria?: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface Product {
  id: number | string;
  nombre?: string;
  titulo?: string;
  imagen: string;
  imagenes?: string[];
  precio?: number;
  precioAnterior?: number;
  categoria?: string;
  nuevo?: boolean;
  colores?: string[];
  descripcion?: string;
  caracteristicas?: string[];
  stock?: number;
  tallas?: string[];
  ruta?: string;
  badge?: string;
  size?: 'normal' | 'featured' | 'wide' | 'tall';
}

const router = useRouter();

// Cart Items (ejemplo - esto vendría de un store como Pinia)
const cartItems = ref<CartItem[]>([
  {
    id: 'rem-1',
    nombre: 'Arcana Nº1',
    imagen: '/images/remera-1.jpg',
    precio: 45,
    categoria: 'Remera Premium',
    quantity: 2,
    color: '#000000',
    size: 'L',
  },
  {
    id: 'buz-1',
    nombre: 'Ethereal Hoodie',
    imagen: '/images/buzo-1.jpg',
    precio: 85,
    categoria: 'Buzo',
    quantity: 1,
    color: '#DAA520',
    size: 'M',
  },
]);

// Recommendations
const recommendations = ref<Product[]>([
  {
    id: 'rec-1',
    nombre: 'Mystic Circle',
    imagen: '/images/remera-2.jpg',
    precio: 42,
    categoria: 'Remera',
  },
  {
    id: 'rec-2',
    nombre: 'Cosmic Energy',
    imagen: '/images/buzo-2.jpg',
    precio: 90,
    categoria: 'Buzo',
  },
  {
    id: 'rec-3',
    nombre: 'Void Walker',
    imagen: '/images/pantalon-1.jpg',
    precio: 75,
    categoria: 'Pantalón',
  },
  {
    id: 'rec-4',
    nombre: 'Sacred Geometry',
    imagen: '/images/remera-4.jpg',
    precio: 50,
    categoria: 'Remera',
  },
]);

// Promo
const promoCode = ref('');
const discount = ref(0);

// Computed
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + ((item.precio || 0) * item.quantity), 0);
});

const shippingCost = computed(() => {
  return subtotal.value >= 100 ? 0 : 10;
});

const total = computed(() => {
  return subtotal.value + shippingCost.value - discount.value;
});

// Methods
const increaseQuantity = (itemId: number | string) => {
  const item = cartItems.value.find(i => i.id === itemId);
  if (item) item.quantity++;
};

const decreaseQuantity = (itemId: number | string) => {
  const item = cartItems.value.find(i => i.id === itemId);
  if (item && item.quantity > 1) item.quantity--;
};

const removeItem = (itemId: number | string) => {
  const index = cartItems.value.findIndex(i => i.id === itemId);
  if (index > -1) {
    if (confirm('¿Eliminar este producto del carrito?')) {
      cartItems.value.splice(index, 1);
    }
  }
};

const applyPromo = () => {
  // Ejemplo de códigos
  const codes: Record<string, number> = {
    'WELCOME10': 10,
    'ARCANA20': 20,
  };
  
  const promoUpper = promoCode.value.toUpperCase();
  if (codes[promoUpper]) {
    discount.value = codes[promoUpper];
    alert(`¡Código aplicado! Descuento de $${codes[promoUpper]}`);
  } else {
    alert('Código no válido');
  }
};

const goToCheckout = () => {
  router.push('/checkout');
};

const goToHome = () => {
  router.push('/');
};

const goToLogin = () => {
  router.push('/login');
};

const handleProductClick = (product: Product) => {
  router.push(`/producto/${product.id}`);
};
</script>

<style scoped>
.cart-container {
  position: relative;
  min-height: 100vh;
  background: #000;
  overflow-x: hidden;
}

/* Decoraciones flotantes */
.floating-decorations {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.1;
}

.decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: blur(2px);
}

.decoration-1 {
  top: 15%;
  right: -5%;
  animation: float1 25s ease-in-out infinite;
}

.decoration-2 {
  bottom: 10%;
  left: -5%;
  animation: float2 30s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, 20px) rotate(-8deg); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, -20px) rotate(8deg); }
}

/* Content */
.cart-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
}

/* Header */
.cart-header {
  text-align: center;
  margin-bottom: 4rem;
}

.cart-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  letter-spacing: 0.3em;
  color: #fff;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.cart-title .icon {
  color: #DAA520;
  margin: 0 1rem;
  font-size: 0.8em;
}

.cart-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  opacity: 0.3;
}

.empty-cart h2 {
  font-size: 2rem;
  color: #DAA520;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.empty-cart p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.empty-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.btn-primary {
  background: #DAA520;
  color: #000;
}

.btn-primary:hover {
  background: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(218, 165, 32, 0.3);
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  border-color: #DAA520;
  color: #DAA520;
  transform: translateY(-2px);
}

/* Cart Grid */
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(218, 165, 32, 0.3);
}

/* Item Image */
.item-image-container {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cart-item:hover .item-image {
  transform: scale(1.05);
}

/* Item Info */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-name {
  font-size: 1.3rem;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.item-category {
  color: #DAA520;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.item-details {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.item-color,
.item-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.label {
  color: rgba(255, 255, 255, 0.5);
}

.value {
  color: #fff;
  font-weight: 500;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Quantity Controls */
.item-quantity {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.qty-btn {
  width: 35px;
  height: 35px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.qty-btn:hover:not(:disabled) {
  border-color: #DAA520;
  color: #DAA520;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  min-width: 30px;
  text-align: center;
}

/* Item Actions */
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.item-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #DAA520;
}

.btn-remove {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 50%;
  margin-top: auto;
}

.btn-remove:hover {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
}

/* Summary Sidebar */
.cart-summary {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 4px;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: #DAA520;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-align: center;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.summary-line.discount {
  color: #4ade80;
}

.summary-line .free {
  color: #4ade80;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
}

.total-amount {
  color: #DAA520;
  font-size: 1.8rem;
}

/* Promo Code */
.promo-code {
  display: flex;
  gap: 0.5rem;
  margin: 2rem 0;
}

.promo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.9rem;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.promo-input:focus {
  outline: none;
  border-color: #DAA520;
}

.promo-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.promo-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #DAA520;
  color: #DAA520;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.promo-btn:hover {
  background: #DAA520;
  color: #000;
}

/* Shipping Info */
.shipping-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(218, 165, 32, 0.05);
  border: 1px solid rgba(218, 165, 32, 0.2);
  border-radius: 4px;
  margin-bottom: 2rem;
}

.info-icon {
  font-size: 1.5rem;
}

.shipping-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Checkout Buttons */
.btn-checkout,
.btn-continue {
  width: 100%;
  padding: 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.btn-checkout {
  background: #DAA520;
  color: #000;
  margin-bottom: 1rem;
}

.btn-checkout:hover {
  background: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(218, 165, 32, 0.4);
}

.btn-continue {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-continue:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

/* Recommendations */
.recommendations {
  margin-top: 6rem;
  padding-top: 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: #fff;
  margin-bottom: 3rem;
  text-transform: uppercase;
}

.section-title .icon {
  color: #DAA520;
  margin: 0 1rem;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.recommendation-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-8px);
}

.recommendation-image {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.recommendation-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommendation-card:hover .recommendation-image img {
  transform: scale(1.1);
}

.recommendation-name {
  font-size: 1rem;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.recommendation-price {
  color: #DAA520;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Animations */
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-content {
    padding: 6rem 1rem 2rem;
  }

  .cart-item {
    grid-template-columns: 100px 1fr;
    gap: 1rem;
    padding: 1.5rem;
  }

  .item-image-container {
    width: 100px;
    height: 100px;
  }

  .item-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .item-details {
    flex-direction: column;
    gap: 0.5rem;
  }

  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .decoration {
    display: none;
  }
}

@media (max-width: 480px) {
  .cart-title {
    font-size: 2rem;
  }

  .item-name {
    font-size: 1rem;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>