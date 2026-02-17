<template>
  <div class="carrusel-container">
    <div class="carrusel-wrapper">
      <div class="carrusel-circle" ref="carruselCircle">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="carrusel-item"
          :class="{ active: activeIndex === index }"
          :style="getItemPosition(index)"
          @click="setActiveItem(index)"
        >
          <div class="item-card">
            <div class="card-inner">
              <img :src="item.imagen" :alt="item.titulo" class="item-image" />
              <div class="item-overlay">
                <div class="overlay-content">
                  <span class="item-categoria">{{ item.categoria }}</span>
                  <h3 class="item-titulo">{{ item.titulo }}</h3>
                  <div class="item-symbol">✦</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Centro del carrusel -->
      <div class="carrusel-center">
        <div class="center-circle">
          <div class="center-symbol">◈</div>
          <p class="center-text">Explora</p>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <div class="carrusel-controls">
      <button @click="rotate('left')" class="control-btn" aria-label="Anterior">
        <span>←</span>
      </button>
      <div class="control-info">
        <span class="current-index">{{ activeIndex + 1 }}</span>
        <span class="separator">/</span>
        <span class="total-items">{{ items.length }}</span>
      </div>
      <button @click="rotate('right')" class="control-btn" aria-label="Siguiente">
        <span>→</span>
      </button>
    </div>

    <!-- Indicadores -->
    <div class="carrusel-indicators">
      <button
        v-for="(item, index) in items"
        :key="`indicator-${index}`"
        class="indicator"
        :class="{ active: activeIndex === index }"
        @click="setActiveItem(index)"
        :aria-label="`Ir a ${item.titulo}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { CarouselItem } from '@/types/Index'

interface Props {
  items: CarouselItem[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoRotate: true,
  rotationInterval: 5000,
})

const activeIndex = ref(0)
const carruselCircle = ref<HTMLElement | null>(null)
const rotation = ref(0)
let autoRotateTimer: number | null = null

// Radius adaptativo según viewport
const getRadius = () => {
  if (typeof window === 'undefined') return 280
  const width = window.innerWidth
  if (width <= 640) return 160 // Móvil
  if (width <= 1024) return 220 // Tablet
  return 280 // Desktop
}

const getItemPosition = (index: number) => {
  const totalItems = props.items.length
  const angle = (index * 360) / totalItems - rotation.value
  const angleRad = (angle * Math.PI) / 180
  const radius = getRadius()
  
  const x = Math.cos(angleRad) * radius
  const y = Math.sin(angleRad) * radius
  
  const zIndex = Math.round(Math.cos(angleRad) * 100)
  const scale = 0.6 + (Math.cos(angleRad) * 0.4)
  const opacity = 0.4 + (Math.cos(angleRad) * 0.6)
  
  return {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    zIndex: zIndex + 100,
    opacity: opacity,
  }
}

const rotate = (direction: 'left' | 'right') => {
  const totalItems = props.items.length
  const step = 360 / totalItems
  
  if (direction === 'right') {
    rotation.value += step
    activeIndex.value = (activeIndex.value + 1) % totalItems
  } else {
    rotation.value -= step
    activeIndex.value = (activeIndex.value - 1 + totalItems) % totalItems
  }
  
  resetAutoRotate()
}

const setActiveItem = (index: number) => {
  const totalItems = props.items.length
  const diff = index - activeIndex.value
  const step = 360 / totalItems
  
  rotation.value += diff * step
  activeIndex.value = index
  
  resetAutoRotate()
}

const startAutoRotate = () => {
  if (props.autoRotate) {
    autoRotateTimer = window.setInterval(() => {
      rotate('right')
    }, props.rotationInterval)
  }
}

const stopAutoRotate = () => {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer)
    autoRotateTimer = null
  }
}

const resetAutoRotate = () => {
  stopAutoRotate()
  startAutoRotate()
}

onMounted(() => {
  startAutoRotate()
})

onUnmounted(() => {
  stopAutoRotate()
})
</script>

<style scoped>
.carrusel-container {
  position: relative;
  width: 100%;
  padding: 4rem 0;
}

.carrusel-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carrusel-circle {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carrusel-item {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 280px;
  margin: -140px 0 0 -100px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.item-card {
  width: 100%;
  height: 100%;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}

.carrusel-item:hover .card-inner {
  transform: rotateY(5deg) translateZ(20px);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid rgba(218, 165, 32, 0.3);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 0 20px rgba(218, 165, 32, 0.1);
}

.item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
}

.carrusel-item:hover .item-overlay,
.carrusel-item.active .item-overlay {
  opacity: 1;
}

.overlay-content {
  width: 100%;
}

.item-categoria {
  display: block;
  font-size: 0.75rem;
  color: #DAA520;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.item-titulo {
  font-size: 1.1rem;
  color: #ffffff;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.item-symbol {
  margin-top: 0.5rem;
  color: #DAA520;
  font-size: 1.2rem;
  animation: symbolRotate 4s linear infinite;
}

@keyframes symbolRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.carrusel-item.active .item-card {
  filter: drop-shadow(0 0 20px rgba(218, 165, 32, 0.6));
}

.carrusel-item.active .item-image {
  border-color: #DAA520;
}

.carrusel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.center-circle {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(10, 10, 10, 0.95) 0%, rgba(0, 0, 0, 0.8) 100%);
  border: 2px solid #DAA520;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 30px rgba(218, 165, 32, 0.3),
    inset 0 0 20px rgba(218, 165, 32, 0.1);
  animation: centerPulse 3s ease-in-out infinite;
}

@keyframes centerPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 30px rgba(218, 165, 32, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(218, 165, 32, 0.5);
  }
}

.center-symbol {
  font-size: 2.5rem;
  color: #DAA520;
  margin-bottom: 0.5rem;
  animation: symbolFloat 2s ease-in-out infinite;
}

@keyframes symbolFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.center-text {
  font-size: 0.9rem;
  color: #DAA520;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin: 0;
}

.carrusel-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  margin-top: 3rem;
}

.control-btn {
  width: 50px;
  height: 50px;
  background: rgba(218, 165, 32, 0.1);
  border: 2px solid #DAA520;
  border-radius: 50%;
  color: #DAA520;
  font-size: 1.5rem;
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
  box-shadow: 0 0 20px rgba(218, 165, 32, 0.5);
}

.control-info {
  font-size: 1.2rem;
  color: #DAA520;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.separator {
  margin: 0 0.5rem;
  opacity: 0.5;
}

.carrusel-indicators {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.indicator {
  width: 40px;
  height: 4px;
  background: rgba(218, 165, 32, 0.3);
  border: none;
  border-radius: 2px;
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
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .carrusel-container {
    padding: 3rem 0;
  }

  .carrusel-wrapper {
    height: 480px;
  }
  
  .carrusel-item {
    width: 160px;
    height: 224px;
    margin: -112px 0 0 -80px;
  }

  .item-overlay {
    padding: 1.2rem;
  }

  .item-categoria {
    font-size: 0.7rem;
  }

  .item-titulo {
    font-size: 1rem;
  }

  .item-symbol {
    font-size: 1.1rem;
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

  .carrusel-controls {
    gap: 2.5rem;
    margin-top: 2.5rem;
  }
  
  .control-btn {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }

  .control-info {
    font-size: 1.1rem;
  }

  .carrusel-indicators {
    gap: 0.8rem;
    margin-top: 1.8rem;
  }

  .indicator {
    width: 35px;
  }
}

/* Móvil (<= 640px) */
@media (max-width: 640px) {
  .carrusel-container {
    padding: 2.5rem 0;
  }

  .carrusel-wrapper {
    height: 380px;
  }
  
  .carrusel-item {
    width: 120px;
    height: 168px;
    margin: -84px 0 0 -60px;
  }

  .item-overlay {
    padding: 1rem;
    opacity: 1;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.92) 0%,
      rgba(0, 0, 0, 0.5) 60%,
      transparent 100%
    );
  }

  .item-card {
    border-radius: 10px;
  }

  .item-image {
    border-radius: 10px;
  }

  .item-categoria {
    font-size: 0.65rem;
    margin-bottom: 0.3rem;
  }

  .item-titulo {
    font-size: 0.85rem;
    line-height: 1.2;
  }

  .item-symbol {
    font-size: 0.9rem;
    margin-top: 0.3rem;
  }
  
  .center-circle {
    width: 70px;
    height: 70px;
  }
  
  .center-symbol {
    font-size: 1.5rem;
    margin-bottom: 0.2rem;
  }
  
  .center-text {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
  }

  .carrusel-controls {
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .control-info {
    font-size: 1rem;
  }

  .separator {
    margin: 0 0.3rem;
  }

  .carrusel-indicators {
    gap: 0.6rem;
    margin-top: 1.5rem;
  }

  .indicator {
    width: 28px;
    height: 3px;
  }
}

/* Móvil Pequeño (<= 375px) */
@media (max-width: 375px) {
  .carrusel-wrapper {
    height: 350px;
  }

  .carrusel-item {
    width: 100px;
    height: 140px;
    margin: -70px 0 0 -50px;
  }

  .item-overlay {
    padding: 0.8rem;
  }

  .item-titulo {
    font-size: 0.75rem;
  }

  .center-circle {
    width: 60px;
    height: 60px;
  }

  .center-symbol {
    font-size: 1.2rem;
  }

  .center-text {
    font-size: 0.6rem;
  }

  .control-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .control-info {
    font-size: 0.9rem;
  }

  .indicator {
    width: 24px;
  }
}
</style>