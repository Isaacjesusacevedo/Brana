<template>
    <div class="carousel-container">
      <div class="carousel-wrapper" :class="`carousel-${mode}`">
        <!-- Modo Circular Mejorado -->
        <div v-if="mode === 'circular'" class="carousel-circle" ref="carouselCircle">
          <!-- Duplicar items para efecto infinito -->
          <div
            v-for="(item, index) in displayItems"
            :key="`item-${index}`"
            class="carousel-item"
            :class="{ active: activeIndex === (index % items.length) }"
            :style="getItemPosition(index)"
            @click="() => {
              const itemIndex = index % items.length;
              const clickedItem = items[itemIndex]!; // Non-null assertion porque el módulo garantiza índice válido
              handleItemClick(itemIndex, clickedItem);
            }"
          >
            <slot name="item" :item="item" :isActive="activeIndex === (index % items.length)">
              <!-- Default slot content -->
              <div class="item-card">
                <div class="card-inner">
                  <img :src="item.imagen" :alt="item.titulo || item.nombre" class="item-image" />
                  <div class="item-overlay">
                    <div class="overlay-content">
                      <span v-if="item.categoria" class="item-category">{{ item.categoria }}</span>
                      <h3 class="item-title">{{ item.titulo || item.nombre }}</h3>
                      <div v-if="item.precio" class="item-price">${{ item.precio }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </slot>
          </div>
          
          <!-- Centro del carrusel -->
          <div v-if="centerText" class="carousel-center">
            <div class="center-circle">
              <div class="center-symbol">◈</div>
              <p class="center-text">{{ centerText }}</p>
            </div>
          </div>
        </div>
  
        <!-- Modo Sliding Mejorado con efecto infinito -->
        <div v-else-if="mode === 'sliding'" class="carousel-sliding">
          <div class="carousel-track-wrapper">
            <div 
              class="carousel-track" 
              :style="{ 
                transform: `translateX(calc(-${currentSlide * slideWidthPercent}% + 50vw - ${itemWidth / 2}px))`,
                width: `${totalWidth}px`
              }"
            >
              <div
                v-for="(item, index) in infiniteItems"
                :key="`slide-${index}`"
                class="carousel-slide"
                :class="{ active: isSlideActive(index) }"
                :style="{ width: `${itemWidth}px` }"
                @click="handleSlideClick(index)"
              >
                <slot name="item" :item="item" :isActive="isSlideActive(index)">
                  <div class="item-card">
                    <img :src="item.imagen" :alt="item.titulo || item.nombre" class="item-image" />
                    <div class="item-info">
                      <span v-if="item.categoria" class="item-category">{{ item.categoria }}</span>
                      <h3 class="item-title">{{ item.titulo || item.nombre }}</h3>
                      <div v-if="item.precio" class="item-price">${{ item.precio }}</div>
                    </div>
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Controles -->
      <div v-if="showControls" class="carousel-controls">
        <button @click="navigate('prev')" class="control-btn" aria-label="Anterior">
          <span>←</span>
        </button>
        <div class="control-info">
          <span class="current-index">{{ (activeIndex % items.length) + 1 }}</span>
          <span class="separator">/</span>
          <span class="total-items">{{ items.length }}</span>
        </div>
        <button @click="navigate('next')" class="control-btn" aria-label="Siguiente">
          <span>→</span>
        </button>
      </div>
  
      <!-- Indicadores -->
      <div v-if="showIndicators" class="carousel-indicators">
        <button
          v-for="(item, index) in items"
          :key="`indicator-${index}`"
          class="indicator"
          :class="{ active: activeIndex === index }"
          @click="setActiveItem(index)"
          :aria-label="`Ir a item ${index + 1}`"
        ></button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import type { CarouselItem, CarouselMode, CarouselVariant } from '@/types/Index';
  
  interface Props {
    items: CarouselItem[];
    mode?: CarouselMode;
    variant?: CarouselVariant;
    autoRotate?: boolean;
    rotationInterval?: number;
    centerText?: string;
    showControls?: boolean;
    showIndicators?: boolean;
    itemWidth?: number;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    mode: 'circular',
    variant: 'default',
    autoRotate: true,
    rotationInterval: 5000,
    centerText: '',
    showControls: true,
    showIndicators: true,
    itemWidth: 300,
  });
  
  const emit = defineEmits<{
    itemClick: [index: number, item: CarouselItem];
  }>();
  
  const activeIndex = ref(0);
  const currentSlide = ref(0);
  const carouselCircle = ref<HTMLElement | null>(null);
  const rotation = ref(0);
  let autoRotateTimer: number | null = null;
  
  // Para carrusel circular: duplicar items para efecto más denso
  const displayItems = computed<CarouselItem[]>(() => {
    if (props.mode !== 'circular') return props.items;
    
    // Mostrar items duplicados para llenar el círculo
    const multiplier = Math.max(2, Math.ceil(12 / props.items.length));
    const result: CarouselItem[] = [];
    for (let i = 0; i < multiplier; i++) {
      result.push(...props.items);
    }
    return result;
  });
  
  // Para carrusel sliding: crear array infinito
  const infiniteItems = computed<CarouselItem[]>(() => {
    if (props.mode !== 'sliding') return props.items;
    
    // Triplicar los items para efecto infinito
    return [...props.items, ...props.items, ...props.items];
  });
  
  const slideWidthPercent = computed(() => {
    return 100 / infiniteItems.value.length;
  });
  
  const totalWidth = computed(() => {
    return props.itemWidth * infiniteItems.value.length;
  });
  
  const isSlideActive = (index: number) => {
    const normalizedIndex = index % props.items.length;
    return normalizedIndex === activeIndex.value;
  };
  
  // Calcular posición para modo circular
  const getItemPosition = (index: number) => {
    if (props.mode !== 'circular') return {};
    
    const totalDisplayItems = displayItems.value.length;
    const angle = (index * 360) / totalDisplayItems - rotation.value;
    const angleRad = (angle * Math.PI) / 180;
    
    // Radio ajustado según el número de items
    const baseRadius = 280;
    const radius = baseRadius + (totalDisplayItems > 12 ? 50 : 0);
    
    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;
    
    // Calcular profundidad (z-index) y escala
    const depth = Math.cos(angleRad);
    const zIndex = Math.round(depth * 100);
    
    // Escala más suave
    const minScale = 0.5;
    const maxScale = 1.0;
    const scale = minScale + ((depth + 1) / 2) * (maxScale - minScale);
    
    // Opacidad más suave
    const minOpacity = 0.3;
    const maxOpacity = 1.0;
    const opacity = minOpacity + ((depth + 1) / 2) * (maxOpacity - minOpacity);
    
    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      zIndex: zIndex + 100,
      opacity: opacity,
    };
  };
  
  // Navegación
  const navigate = (direction: 'prev' | 'next') => {
    const totalItems = props.items.length;
    
    if (props.mode === 'circular') {
      const step = 360 / displayItems.value.length;
      if (direction === 'next') {
        rotation.value += step;
        activeIndex.value = (activeIndex.value + 1) % totalItems;
      } else {
        rotation.value -= step;
        activeIndex.value = (activeIndex.value - 1 + totalItems) % totalItems;
      }
    } else if (props.mode === 'sliding') {
      if (direction === 'next') {
        currentSlide.value++;
        activeIndex.value = (activeIndex.value + 1) % totalItems;
        
        // Reset para efecto infinito
        if (currentSlide.value >= props.items.length * 2) {
          setTimeout(() => {
            currentSlide.value = props.items.length;
          }, 50);
        }
      } else {
        currentSlide.value--;
        activeIndex.value = (activeIndex.value - 1 + totalItems) % totalItems;
        
        // Reset para efecto infinito
        if (currentSlide.value < props.items.length) {
          setTimeout(() => {
            currentSlide.value = props.items.length * 2 - 1;
          }, 50);
        }
      }
    }
    
    resetAutoRotate();
  };
  
  // Establecer item activo
  const setActiveItem = (index: number) => {
    if (props.mode === 'circular') {
      const totalDisplayItems = displayItems.value.length;
      const diff = index - activeIndex.value;
      const step = 360 / totalDisplayItems;
      rotation.value += diff * step;
    } else if (props.mode === 'sliding') {
      const diff = index - activeIndex.value;
      currentSlide.value += diff;
    }
    
    activeIndex.value = index;
    resetAutoRotate();
  };
  
  // Handler de click
  const handleItemClick = (index: number, item: CarouselItem) => {
    setActiveItem(index);
    emit('itemClick', index, item);
  };
  
  const handleSlideClick = (index: number) => {
    const realIndex = index % props.items.length;
    const item = props.items[realIndex]!; // Non-null assertion porque el módulo garantiza índice válido
    handleItemClick(realIndex, item);
  };
  
  // Auto-rotación
  const startAutoRotate = () => {
    if (props.autoRotate) {
      autoRotateTimer = window.setInterval(() => {
        navigate('next');
      }, props.rotationInterval);
    }
  };
  
  const stopAutoRotate = () => {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  };
  
  const resetAutoRotate = () => {
    stopAutoRotate();
    startAutoRotate();
  };
  
  onMounted(() => {
    startAutoRotate();
    
    // Inicializar sliding en el medio
    if (props.mode === 'sliding') {
      currentSlide.value = props.items.length;
    }
  });
  
  onUnmounted(() => {
    stopAutoRotate();
  });
  </script>
  
  <style scoped>
  .carousel-container {
    position: relative;
    width: 100%;
    padding: 4rem 0;
  }
  
  .carousel-wrapper {
    position: relative;
    width: 100%;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  /* ========== MODO CIRCULAR ========== */
  .carousel-circular .carousel-circle {
    position: relative;
    width: 100%;
    height: 600px;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .carousel-circular .carousel-item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 220px;
    height: 300px;
    margin: -150px 0 0 -110px;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  
  .item-card {
    width: 100%;
    height: 100%;
    perspective: 1000px;
    background: rgba(10, 10, 10, 0.8);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(218, 165, 32, 0.2);
    transition: all 0.4s ease;
  }
  
  .carousel-item:hover .item-card,
  .carousel-item.active .item-card {
    border-color: #DAA520;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(218, 165, 32, 0.3);
    transform: translateY(-5px);
  }
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
    transform-style: preserve-3d;
  }
  
  .carousel-item:hover .card-inner {
    transform: rotateY(5deg) translateZ(10px);
  }
  
  .item-image {
    width: 100%;
    height: 70%;
    object-fit: cover;
  }
  
  .item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
    padding: 1rem;
  }
  
  .carousel-item:hover .item-overlay,
  .carousel-item.active .item-overlay {
    opacity: 1;
  }
  
  .overlay-content {
    width: 100%;
  }
  
  .item-category {
    display: block;
    font-size: 0.7rem;
    color: #DAA520;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.3rem;
    font-weight: 600;
  }
  
  .item-title {
    font-size: 0.95rem;
    color: #ffffff;
    margin: 0;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  
  .item-info {
    padding: 1rem;
    background: rgba(10, 10, 10, 0.95);
  }
  
  .item-info .item-category {
    font-size: 0.7rem;
    color: #DAA520;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.3rem;
    font-weight: 600;
  }
  
  .item-info .item-title {
    font-size: 1rem;
    color: #ffffff;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }
  
  .item-price {
    font-size: 1.1rem;
    color: #DAA520;
    font-weight: 700;
  }
  
  /* Centro del carrusel */
  .carousel-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    pointer-events: none;
  }
  
  .center-circle {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(10, 10, 10, 0.98) 0%, rgba(0, 0, 0, 0.9) 100%);
    border: 3px solid #DAA520;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 
      0 0 40px rgba(218, 165, 32, 0.4),
      inset 0 0 30px rgba(218, 165, 32, 0.1);
    animation: centerPulse 3s ease-in-out infinite;
  }
  
  @keyframes centerPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 40px rgba(218, 165, 32, 0.4);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 60px rgba(218, 165, 32, 0.6);
    }
  }
  
  .center-symbol {
    font-size: 3rem;
    color: #DAA520;
    margin-bottom: 0.5rem;
    animation: symbolFloat 2s ease-in-out infinite;
  }
  
  @keyframes symbolFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  .center-text {
    font-size: 1rem;
    color: #DAA520;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin: 0;
    font-weight: 700;
  }
  
  /* ========== MODO SLIDING ========== */
  .carousel-sliding {
    width: 100%;
    overflow: visible;
    position: relative;
  }
  
  .carousel-track-wrapper {
    width: 100%;
    overflow: hidden;
    padding: 2rem 0;
  }
  
  .carousel-track {
    display: flex;
    gap: 2rem;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }
  
  .carousel-slide {
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .carousel-slide:hover {
    transform: scale(1.05);
    z-index: 10;
  }
  
  .carousel-slide.active {
    transform: scale(1.1);
    z-index: 20;
  }
  
  .carousel-slide.active .item-card {
    border-color: #DAA520;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(218, 165, 32, 0.5);
  }
  
  /* ========== CONTROLES ========== */
  .carousel-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    margin-top: 3rem;
  }
  
  .control-btn {
    width: 60px;
    height: 60px;
    background: rgba(218, 165, 32, 0.1);
    border: 2px solid #DAA520;
    border-radius: 50%;
    color: #DAA520;
    font-size: 1.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .control-btn:hover {
    background: #DAA520;
    color: #000;
    transform: scale(1.1);
    box-shadow: 0 0 25px rgba(218, 165, 32, 0.6);
  }
  
  .control-info {
    font-size: 1.4rem;
    color: #DAA520;
    font-weight: 700;
    letter-spacing: 0.1em;
  }
  
  .separator {
    margin: 0 0.5rem;
    opacity: 0.5;
  }
  
  /* ========== INDICADORES ========== */
  .carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .indicator {
    width: 50px;
    height: 5px;
    background: rgba(218, 165, 32, 0.3);
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .indicator::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: #DAA520;
    transition: width 0.3s ease;
  }
  
  .indicator.active::before {
    width: 100%;
  }
  
  .indicator:hover {
    background: rgba(218, 165, 32, 0.5);
    transform: scaleX(1.1);
  }
  
  /* ========== RESPONSIVE ========== */
  @media (max-width: 1024px) {
    .carousel-wrapper {
      min-height: 500px;
    }
    
    .carousel-circular .carousel-circle {
      height: 500px;
    }
    
    .carousel-circular .carousel-item {
      width: 180px;
      height: 250px;
      margin: -125px 0 0 -90px;
    }
  }
  
  @media (max-width: 768px) {
    .carousel-wrapper {
      min-height: 450px;
    }
    
    .carousel-circular .carousel-circle {
      height: 450px;
    }
    
    .carousel-circular .carousel-item {
      width: 150px;
      height: 210px;
      margin: -105px 0 0 -75px;
    }
    
    .center-circle {
      width: 100px;
      height: 100px;
    }
    
    .center-symbol {
      font-size: 2rem;
    }
    
    .center-text {
      font-size: 0.8rem;
    }
    
    .control-btn {
      width: 50px;
      height: 50px;
      font-size: 1.5rem;
    }
  }
  </style>