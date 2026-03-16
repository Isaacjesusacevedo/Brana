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

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import NavBar from '@/components/tienda/common/NavBar.vue';

// Banner promocional
const showBanner = ref(true);

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
// Declarado en el scope de setup() para que onUnmounted pueda acceder
let promoInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  // Verificar si el usuario ya cerró el banner
  const bannerClosed = localStorage.getItem('promo_banner_closed');
  if (bannerClosed === 'true') {
    showBanner.value = false;
  }

  // Cambiar promo cada 5 segundos si hay múltiples
  if (promos.length > 1 && showBanner.value) {
    let currentIndex = 0;
    promoInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % promos.length;
      currentPromo.value = promos[currentIndex]!;
    }, 5000);
  }
});

// Al mismo nivel que onMounted — Vue puede registrar el hook correctamente
onUnmounted(() => {
  if (promoInterval) clearInterval(promoInterval);
});
</script>

<style scoped>
@import '@/assets/css/components/header.css';
</style>
