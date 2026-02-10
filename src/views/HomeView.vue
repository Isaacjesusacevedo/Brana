<template>
  <div class="home-view">
    <!-- STARFIELD - Estrellas doradas -->
    <div class="starfield">
      <div
        v-for="i in 150"
        :key="i"
        class="star"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }"
      ></div>
    </div>

    <!-- Scan lines -->
    <div class="scan-lines"></div>

    <!-- Matrix Code Overlay -->
    <div class="matrix-overlay">
      <div class="code-rain"></div>
    </div>

    <!-- ========== HERO SECTION ========== -->
    <section class="luxury-hero">
      <div class="hero-content">
        <!-- Holographic Circle Effect -->
        <div class="holographic-circle">
          <div class="circle-ring"></div>
          <div class="circle-ring ring-2"></div>
          <div class="circle-ring ring-3"></div>
          <div class="circle-core"></div>
        </div>

        <!-- Símbolo de lujo con overlay digital -->
        <div class="luxury-symbol">
          <svg viewBox="0 0 200 200" class="mx-auto mb-8 luxury-emblem">
            <!-- Diamante central -->
            <path
              d="M 100 60 L 130 100 L 100 140 L 70 100 Z"
              fill="none"
              stroke="url(#goldGrad)"
              stroke-width="2"
            />
            <circle cx="100" cy="100" r="45" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.6" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.3" />

            <!-- Detalles art deco -->
            <line x1="100" y1="40" x2="100" y2="55" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
            <line x1="100" y1="145" x2="100" y2="160" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
            <line x1="40" y1="100" x2="55" y2="100" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
            <line x1="145" y1="100" x2="160" y2="100" stroke="#D4AF37" stroke-width="1" opacity="0.5" />

            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #d4af37; stop-opacity: 1" />
                <stop offset="50%" style="stop-color: #ffd700; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #b8860b; stop-opacity: 1" />
              </linearGradient>
            </defs>
          </svg>
          
          <!-- Digital code overlay on symbol -->
          <div class="digital-overlay">
            <span class="code-line">{{ codeLines[0] }}</span>
            <span class="code-line">{{ codeLines[1] }}</span>
            <span class="code-line">{{ codeLines[2] }}</span>
          </div>
        </div>

        <h1 class="luxury-title glitch-gold" data-text="BRANA">BRANA</h1>

        <div class="luxury-divider">
          <span class="luxury-diamond">◆</span>
          <div class="gold-line"></div>
          <span class="luxury-star rotating">✦</span>
          <div class="gold-line"></div>
          <span class="luxury-diamond">◆</span>
        </div>

        <p class="luxury-subtitle">
          HIPERSTICIÓN <span class="gold-glow">VESTIBLE</span><br />
          PARA LA <span class="amber-glow">GENERACIÓN</span> ETERNA
        </p>

        <!-- Instagram CTA -->
        <a href="https://www.instagram.com/brana.ok/" target="_blank" rel="noopener noreferrer" class="luxury-btn">
          <span class="btn-text">EXPLORAR_COLECCIÓN</span>
          <span class="btn-icon">→</span>
        </a>

        <!-- Símbolo inferior con efecto holográfico -->
        <div class="luxury-ornament">
          <div class="pulse-diamond">
            <div class="diamond-glow"></div>
          </div>
        </div>
      </div>

      <!-- Floating particles -->
      <div class="particle-system">
        <div v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></div>
      </div>
    </section>

    <!-- ========== PHILOSOPHY SECTION (ESTATUAS) ========== -->
    <section class="philosophy-section">
      <div class="philosophy-content">
        <div class="section-header">
          <h2 class="section-title glitch-subtle" data-text="FILOSOFÍA_DIGITAL">FILOSOFÍA_DIGITAL</h2>
          <div class="title-underline"></div>
        </div>

        <div class="philosophy-grid">
          <!-- Card 1 -->
          <div class="philosophy-card" :style="{ animationDelay: '0.1s' }">
            <div class="card-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=1000&fit=crop"
                alt="Classical statue"
                class="philosophy-image"
              />
              <div class="image-code-overlay">
                <div class="code-stream">
                  <span>0x1A4F</span>
                  <span>{{ getRandomCode() }}</span>
                  <span>{{ getRandomCode() }}</span>
                </div>
              </div>
              <div class="golden-fracture"></div>
            </div>
            <div class="card-content">
              <h3 class="card-title">IDENTIDAD_DIGITAL</h3>
              <p class="card-text">
                La intersección entre lo clásico y lo digital. Cada pieza es un fragmento de eternidad codificado en el presente.
              </p>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="philosophy-card" :style="{ animationDelay: '0.2s' }">
            <div class="card-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1577720643272-265f49bec990?w=800&h=1000&fit=crop"
                alt="Golden details"
                class="philosophy-image"
              />
              <div class="image-code-overlay">
                <div class="code-stream">
                  <span>{{ getRandomCode() }}</span>
                  <span>0xGOLD</span>
                  <span>{{ getRandomCode() }}</span>
                </div>
              </div>
              <div class="golden-fracture"></div>
            </div>
            <div class="card-content">
              <h3 class="card-title">ALQUIMIA_MODERNA</h3>
              <p class="card-text">
                Transformación perpetua. El oro no solo como material, sino como símbolo de la evolución constante.
              </p>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="philosophy-card" :style="{ animationDelay: '0.3s' }">
            <div class="card-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=1000&fit=crop"
                alt="Mystical statue"
                class="philosophy-image"
              />
              <div class="image-code-overlay">
                <div class="code-stream">
                  <span>{{ getRandomCode() }}</span>
                  <span>{{ getRandomCode() }}</span>
                  <span>0xETERNAL</span>
                </div>
              </div>
              <div class="golden-fracture"></div>
            </div>
            <div class="card-content">
              <h3 class="card-title">TRASCENDENCIA_TEMPORAL</h3>
              <p class="card-text">
                Más allá del tiempo lineal. Cada prenda es un portal hacia dimensiones paralelas de expresión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== CATEGORIES HUB ========== -->
    <section class="categories-hub">
      <div class="hub-header">
        <h2 class="hub-title">CATEGORÍAS_ARCANAS</h2>
        <p class="hub-subtitle">[ EXPLORA_NUESTRA_DIMENSIÓN_VESTIBLE ]</p>
        <div class="hub-divider"></div>
      </div>

      <div class="category-grid">
        <!-- REMERAS -->
        <div
          class="category-card"
          :style="{ animationDelay: '0.1s' }"
          @click="navigateToCategory('remeras')"
        >
          <div class="category-image-container">
            <img
              src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop"
              alt="Remeras"
              class="category-image"
            />
            <div class="image-overlay"></div>
            <div class="cyber-grid-overlay"></div>
          </div>
          <div class="category-info">
            <span class="category-badge">ESENCIAL</span>
            <h3 class="category-name">REMERAS</h3>
            <p class="category-count">12 DISEÑOS ÚNICOS</p>
            <p class="category-description">
              Piezas fundamentales que fusionan comfort esotérico con estética cyberpunk. Cada diseño es un portal.
            </p>
            <button class="category-btn">
              <span>EXPLORAR</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- PANTALONES -->
        <div
          class="category-card"
          :style="{ animationDelay: '0.2s' }"
          @click="navigateToCategory('pantalones')"
        >
          <div class="category-image-container">
            <img
              src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop"
              alt="Pantalones"
              class="category-image"
            />
            <div class="image-overlay"></div>
            <div class="cyber-grid-overlay"></div>
          </div>
          <div class="category-info">
            <span class="category-badge">ESTRUCTURA</span>
            <h3 class="category-name">PANTALONES</h3>
            <p class="category-count">8 MODELOS EXCLUSIVOS</p>
            <p class="category-description">
              Fundamentos de tu identidad dimensional. Diseños que definen territorio entre lo real y lo digital.
            </p>
            <button class="category-btn">
              <span>EXPLORAR</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- ACCESORIOS -->
        <div
          class="category-card"
          :style="{ animationDelay: '0.3s' }"
          @click="navigateToCategory('accesorios')"
        >
          <div class="category-image-container">
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop"
              alt="Accesorios"
              class="category-image"
            />
            <div class="image-overlay"></div>
            <div class="cyber-grid-overlay"></div>
          </div>
          <div class="category-info">
            <span class="category-badge">RITUAL</span>
            <h3 class="category-name">ACCESORIOS</h3>
            <p class="category-count">15 ARTEFACTOS MÍSTICOS</p>
            <p class="category-description">
              Elementos que completan tu transformación. Cada accesorio amplifica tu presencia interdimensional.
            </p>
            <button class="category-btn">
              <span>EXPLORAR</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== PRODUCTOS DESTACADOS CON VARIANTES DE COLOR ========== -->
    <section class="jewelry-collection">
      <div class="collection-header">
        <h2 class="collection-title glitch-subtle" data-text="PIEZAS_DESTACADAS">PIEZAS_DESTACADAS</h2>
        <div class="gold-separator"></div>
      </div>

      <div class="jewelry-grid">
        <!-- Producto con variantes de color -->
        <div
          v-for="(product, index) in featuredProducts"
          :key="product.id"
          class="jewelry-item"
          :class="product.size"
          :style="{ animationDelay: `${0.1 * (index + 1)}s` }"
          @mouseenter="handleProductHover(product.id)"
          @mouseleave="handleProductLeave(product.id)"
        >
          <div class="item-frame luxury-frame">
            <div class="frame-corner tl"></div>
            <div class="frame-corner tr"></div>
            <div class="frame-corner bl"></div>
            <div class="frame-corner br"></div>
          </div>

          <!-- Holographic overlay on hover -->
          <div class="holo-overlay" :class="{ active: hoveredProduct === product.id }"></div>

          <!-- Imagen del producto (cambia según color seleccionado) -->
          <img
            :src="getProductImage(product)"
            :alt="product.name"
            class="jewelry-img"
          />

          <div class="item-overlay">
            <span v-if="product.featured" class="item-badge">EXCLUSIVO</span>
            <h3 class="item-name">{{ product.name }}</h3>
            <p class="item-price">{{ product.price }}</p>

            <!-- Selector de colores (aparece en hover) -->
            <div v-if="hoveredProduct === product.id" class="color-selector">
              <div class="color-label">VARIANTES:</div>
              <div class="color-options">
                <button
                  v-for="variant in product.variants"
                  :key="variant.color"
                  class="color-btn"
                  :class="{ active: selectedVariants[product.id] === variant.color }"
                  :style="{ 
                    background: variant.colorHex,
                    boxShadow: selectedVariants[product.id] === variant.color 
                      ? `0 0 15px ${variant.colorHex}` 
                      : 'none'
                  }"
                  :title="variant.color"
                  @click.stop="selectVariant(product.id, variant.color)"
                ></button>
              </div>
            </div>
          </div>

          <div class="gold-shimmer"></div>
        </div>
      </div>

      <!-- CTA -->
      <div class="collection-cta">
        <a
          href="https://www.instagram.com/brana.ok/"
          target="_blank"
          rel="noopener noreferrer"
          class="luxury-btn-outline"
        >
          <span>VER_CATÁLOGO_COMPLETO</span>
          <span class="arrow-luxury">→</span>
        </a>
      </div>
    </section>

    <!-- ========== MANIFESTO MEJORADO ========== -->
    <section class="luxury-manifesto">
      <div class="manifesto-content">
        <div class="art-deco-frame">
          <!-- Floating holographic elements -->
          <div class="holo-particles">
            <div v-for="n in 15" :key="n" class="holo-particle" :style="getHoloParticleStyle(n)"></div>
          </div>

          <h2 class="manifesto-title">EL_MANIFIESTO</h2>

          <div class="gold-bar"></div>

          <p class="manifesto-text">
            No vendemos ropa. <span class="gold-highlight">Forjamos identidades</span>.
          </p>

          <p class="manifesto-text">
            Cada prenda es un <span class="amber-highlight">portal dimensional</span>, un ancla entre el ahora y lo
            que viene.
          </p>

          <p class="manifesto-text">
            BRANA es <span class="gold-highlight">hiperstición</span> materializada. El futuro que tejemos
            <span class="amber-highlight">usando el presente</span>.
          </p>

          <!-- Código místico -->
          <div class="mystic-code">
            <span class="code-fragment">{{ mysticCode[0] }}</span>
            <span class="code-divider">◆</span>
            <span class="code-fragment">{{ mysticCode[1] }}</span>
            <span class="code-divider">◆</span>
            <span class="code-fragment">{{ mysticCode[2] }}</span>
          </div>

          <!-- Iconos -->
          <div class="luxury-icons">
            <div class="luxury-icon">
              <div class="icon-diamond">◆</div>
              <span>LUXURY</span>
            </div>
            <div class="luxury-icon">
              <div class="icon-star">✦</div>
              <span>ETERNAL</span>
            </div>
            <div class="luxury-icon">
              <div class="icon-diamond">◆</div>
              <span>ARCANE</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== FOOTER ========== -->
    <footer class="luxury-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <h3 class="footer-title">BRANA</h3>
          <p class="footer-tagline">Hiperstición_Vestible_Eternamente</p>
        </div>

        <div class="footer-links">
          <a href="https://www.instagram.com/brana.ok/" target="_blank" rel="noopener noreferrer" class="footer-link">
            <span>Instagram</span>
            <span class="link-arrow">→</span>
          </a>
        </div>

        <div class="footer-bottom">
          <p class="copyright">© 2026 BRANA — <span class="gold-pulse">TRANSCENDING_REALITY</span></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

// ========== INTERFACES ==========
interface ProductVariant {
  color: string;
  colorHex: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  featured?: boolean;
  size?: string;
  defaultImage: string;
  variants: ProductVariant[];
}

// ========== ESTADO REACTIVO ==========
const hoveredProduct = ref<number | null>(null);
const selectedVariants = reactive<Record<number, string>>({});

// Código digital animado
const codeLines = ref([
  'const reality = new Dimension()',
  'hyperstition.manifest()',
  'identity.transcend()'
]);

const mysticCode = ref([
  '0xBRANA',
  '0xETERNAL',
  '0xFUTURE'
]);

// ========== PRODUCTOS DESTACADOS ==========
const featuredProducts = ref<Product[]>([
  {
    id: 1,
    name: 'OBSIDIAN_ESSENCE',
    price: '$89.000',
    featured: true,
    size: 'featured',
    defaultImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop',
    variants: [
      {
        color: 'Negro',
        colorHex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop',
      },
      {
        color: 'Dorado',
        colorHex: '#D4AF37',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop',
      },
      {
        color: 'Blanco',
        colorHex: '#f5f5f5',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
      },
    ],
  },
  {
    id: 2,
    name: 'GOLDEN_VOID',
    price: '$85.000',
    defaultImage: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
    variants: [
      {
        color: 'Negro',
        colorHex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
      },
      {
        color: 'Gris',
        colorHex: '#6b7280',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop',
      },
      {
        color: 'Azul Oscuro',
        colorHex: '#1e3a8a',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
      },
    ],
  },
  {
    id: 3,
    name: 'AMBER_RITUAL',
    price: '$92.000',
    defaultImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
    variants: [
      {
        color: 'Dorado',
        colorHex: '#D4AF37',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
      },
      {
        color: 'Negro',
        colorHex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
      },
      {
        color: 'Café',
        colorHex: '#854d0e',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
      },
    ],
  },
  {
    id: 4,
    name: 'ELDRITCH_LUXURY',
    price: '$88.000',
    size: 'wide',
    defaultImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=600&fit=crop',
    variants: [
      {
        color: 'Blanco',
        colorHex: '#f5f5f5',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=600&fit=crop',
      },
      {
        color: 'Negro',
        colorHex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&h=600&fit=crop',
      },
      {
        color: 'Gris Claro',
        colorHex: '#d1d5db',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&h=600&fit=crop',
      },
    ],
  },
  {
    id: 5,
    name: 'SOLAR_GOLD',
    price: '$90.000',
    defaultImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop',
    variants: [
      {
        color: 'Blanco',
        colorHex: '#f5f5f5',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop',
      },
      {
        color: 'Dorado',
        colorHex: '#D4AF37',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
      },
      {
        color: 'Negro',
        colorHex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
      },
    ],
  },
  {
    id: 6,
    name: 'COSMIC_GOLD',
    price: '$95.000',
    size: 'tall',
    defaultImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=900&fit=crop',
    variants: [
      {
        color: 'Azul Oscuro',
        colorHex: '#1e3a8a',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=900&fit=crop',
      },
      {
        color: 'Negro',
        colorHex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=900&fit=crop',
      },
      {
        color: 'Dorado',
        colorHex: '#D4AF37',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=900&fit=crop',
      },
    ],
  },
]);

// ========== INICIALIZAR VARIANTES SELECCIONADAS ==========
featuredProducts.value.forEach((product) => {
  const firstVariant = product.variants[0];
  if (firstVariant) {
    selectedVariants[product.id] = firstVariant.color;
  }
});

// ========== FUNCIONES ==========
const handleProductHover = (productId: number): void => {
  hoveredProduct.value = productId;
};

const handleProductLeave = (productId: number): void => {
  hoveredProduct.value = null;
};

const selectVariant = (productId: number, color: string): void => {
  selectedVariants[productId] = color;
};

const getProductImage = (product: Product): string => {
  const selectedColor = selectedVariants[product.id];
  
  if (!selectedColor) {
    return product.defaultImage;
  }
  
  const variant = product.variants.find((v) => v.color === selectedColor);
  
  return variant ? variant.image : product.defaultImage;
};

const navigateToCategory = (category: string): void => {
  window.open('https://www.instagram.com/brana.ok/', '_blank');
};

// Generar código aleatorio
const getRandomCode = (): string => {
  const codes = [
    '0x1A2B',
    '0xDEAD',
    '0xC0DE',
    '0xF00D',
    '0xBEEF',
    '0xCAFE',
    '0xBABE'
  ];

  return codes[Math.floor(Math.random() * codes.length)] ?? '0x0000';
};

// Estilos para partículas
const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${3 + Math.random() * 4}s`
  };
};

const getHoloParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`
  };
};

// Animar código en montaje
onMounted(() => {
  setInterval(() => {
    codeLines.value = [
      getRandomCode(),
      getRandomCode(),
      getRandomCode()
    ];
  }, 3000);
});
</script>