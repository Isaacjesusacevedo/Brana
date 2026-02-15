<template>
    <header class="header">
      <!-- Banner promocional (opcional, se puede ocultar) -->
      <transition name="slide-down">
        <div v-if="showBanner" class="promo-banner">
          <div class="banner-content">
            <span class="banner-icon">✦</span>
            <p class="banner-text">{{ currentPromo.text }}</p>
            <button 
              class="banner-close" 
              @click="closeBanner"
              aria-label="Cerrar banner"
            >
              ✕
            </button>
          </div>
        </div>
      </transition>
  
      <!-- NavBar -->
      <NavBar />
  
      <!-- Overlay para mobile menu -->
      <transition name="fade">
        <div 
          v-if="mobileMenuOpen" 
          class="header-overlay"
          @click="closeMobileMenu"
        ></div>
      </transition>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import NavBar from '@/components/layout/NavBar.vue';
  
  // Banner promocional
  const showBanner = ref(true);
  const mobileMenuOpen = ref(false);
  
  interface Promo {
    id: number;
    text: string;
    active: boolean;
  }
  
  const promos: Promo[] = [
    {
      id: 1,
      text: '🎯 ENVÍO GRATIS EN COMPRAS SUPERIORES A $50.000',
      active: true,
    },
    {
      id: 2,
      text: '✨ NUEVA COLECCIÓN: COSMIC GOLD DISPONIBLE AHORA',
      active: false,
    },
    {
      id: 3,
      text: '🔥 20% OFF EN SEGUNDA UNIDAD - SOLO HOY',
      active: false,
    },
  ];
  
  const currentPromo = ref<Promo>(
    promos.find(p => p.active) ?? promos[0]!
  );
  
  const closeBanner = () => {
    showBanner.value = false;
    // Guardar en localStorage para no mostrar de nuevo en esta sesión
    localStorage.setItem('promo_banner_closed', 'true');
  };
  
  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };
  
  onMounted(() => {
    // Verificar si el usuario ya cerró el banner
    const bannerClosed = localStorage.getItem('promo_banner_closed');
    if (bannerClosed === 'true') {
      showBanner.value = false;
    }
  
    // Cambiar promo cada 5 segundos si hay múltiples
    if (promos.length > 1 && showBanner.value) {
      let currentIndex = 0;
      const promoInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % promos.length;
        currentPromo.value = promos[currentIndex]!;
      }, 5000);
  
      onUnmounted(() => {
        clearInterval(promoInterval);
      });
    }
  });
  </script>
  
  <style scoped>
  /* Header container */
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  /* Banner promocional */
  .promo-banner {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: #000;
    padding: 0.75rem 2rem;
    position: relative;
    overflow: hidden;
  }
  
  .promo-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  .banner-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    position: relative;
  }
  
  .banner-icon {
    font-size: 1.2rem;
    animation: iconPulse 2s ease-in-out infinite;
  }
  
  @keyframes iconPulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 1;
    }
    50% { 
      transform: scale(1.2);
      opacity: 0.8;
    }
  }
  
  .banner-text {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: center;
  }
  
  .banner-close {
    position: absolute;
    right: 0;
    background: transparent;
    border: none;
    color: #000;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
    transition: all 0.3s ease;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .banner-close:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
  }
  
  /* Overlay para mobile menu */
  .header-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 998;
    backdrop-filter: blur(5px);
  }
  
  /* Transiciones */
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s ease;
  }
  
  .slide-down-enter-from {
    transform: translateY(-100%);
    opacity: 0;
  }
  
  .slide-down-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .promo-banner {
      padding: 0.6rem 1rem;
    }
  
    .banner-text {
      font-size: 0.7rem;
      letter-spacing: 0.05em;
    }
  
    .banner-icon {
      font-size: 1rem;
    }
  
    .banner-close {
      position: relative;
      right: auto;
    }
  }
  
  @media (max-width: 480px) {
    .banner-content {
      gap: 0.5rem;
    }
  
    .banner-icon {
      display: none;
    }
  
    .banner-text {
      font-size: 0.65rem;
      padding-right: 2rem;
    }
  }
  </style>